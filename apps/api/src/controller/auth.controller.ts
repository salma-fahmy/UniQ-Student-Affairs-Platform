import type { NextFunction, Request, Response } from "express";
import { isStudent } from "../utils/tokenExpiration";
import { hashToken } from "../utils/generateToken.js";
import { createNotification } from "../services/notification.service.js";
import { safeEmailJob } from "../utils/safeEmailJob.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { emailTemplate } from "../templates/email/template.js";
import { EmailTemplateType } from "../templates/email/EmailTemplateEnum.js";
import type IResponseOutput from "../dto/response.dto.js";
import BadRequestError from "../error/BadRequestError.js";
import AuthenticationError from "../error/AuthenticationError.js";
import * as authServices from "../services/auth.services";
import httpStatus from "../utils/httpStatus";
import PayloadType from "../dto/payload.js";
import logger from "../utils/logger.js";
import geoip from "geoip-lite";
import { sendEmailSchema } from "../validator/sendEmail.schema";
import NotFoundError from "../error/NotFound.Error";
import { inquirySchema } from "../validator/inquiery.schema";
import { emailQueue } from "../queues/email.queue";
import { addEmailJob, sendingToSupport } from "../jobs/email.job";

/* -----------------------------
   Types & Helpers
------------------------------ */

const getAuth = (req: Request): PayloadType => {
	const auth = req.auth?.payload as PayloadType | undefined;

	if (!auth?.userId) {
		throw new AuthenticationError({
			message: "Unauthorized",
			code: "ERR_AUTH",
			statusCode: 401,
		});
	}

	return auth;
};

const validatePassword = (password: unknown) =>
	typeof password === "string" && password.length >= 8 && password.length <= 64;

const validateEmail = (email: unknown) =>
	typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/* -----------------------------
   LOGIN
------------------------------ */

export const login = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>) => {
		const userId = req.body.userId;
		const password = req.body.password;

		logger.info("Login attempt", { userId, ip: req.ip });

		if (!userId || !/^[a-zA-Z0-9\-]+$/.test(userId)) {
			throw new BadRequestError({
				message: "Invalid userId",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}

		if (!validatePassword(password)) {
			throw new BadRequestError({
				message: "Invalid password",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}

		const result = await authServices.login(userId, password);

		const time = new Date().toISOString();
		const device = req.headers["user-agent"] || "Unknown device";

		const html = emailTemplate(EmailTemplateType.LOGIN_ALERT, {
			email: result.userData.email,
			time,
			device,
			location: geoip.lookup(req.ip as string)?.city || "Unknown location",
		});

	
		res.cookie("refreshToken", result.refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: isStudent(result.userData.role)
				? 6 * 60 * 60 * 1000
				: 7 * 24 * 60 * 60 * 1000,
		});

		logger.info("Login successful", {
			userId,
			role: result.userData.role,
		});

		return res.status(200).json({
			code: httpStatus.SUCCESS,
			message: "Login successful",
			statusCode: 200,
			data: {
				accessToken: result.accessToken,
				role: result.userData.role,
			},
		});
	},
);

/* -----------------------------
   LOGOUT
------------------------------ */

export const logOut = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>) => {
		const refreshToken = req.cookies?.refreshToken;

		logger.info("Logout attempt", { ip: req.ip });

		if (!refreshToken) {
			throw new AuthenticationError({
				message: "Refresh token missing",
				code: "ERR_AUTH",
				statusCode: 401,
			});
		}

		await authServices.logOut(hashToken(refreshToken));

		res.clearCookie("refreshToken", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
		});

		logger.info("Logout successful", { ip: req.ip });

		return res.status(200).json({
			code: httpStatus.SUCCESS,
			message: "Logged out successfully",
			statusCode: 200,
			data: null,
		});
	},
);

/* -----------------------------
   FORGET PASSWORD
------------------------------ */

export const forgetPassword = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>) => {
		const { email } = req.body;

		logger.info("Forget password attempt", { email, ip: req.ip });

		if (!validateEmail(email)) {
			throw new BadRequestError({
				message: "Invalid email",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}

		await authServices.forgetPassword(email);

		return res.status(200).json({
			message: "Reset link sent to email",
			code: httpStatus.SUCCESS,
			statusCode: 200,
			data: null,
		});
	},
);


//    RESET PASSWORD


export const resetPassword = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>) => {
		logger.info("Reset password attempt", { ip: req.ip });

		const { token, newPassword } = req.body;

		if (typeof token !== "string" || !validatePassword(newPassword)) {
			throw new BadRequestError({
				message: "Invalid reset data",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}

		const result = await authServices.resetPassword(token, newPassword);

		safeEmailJob({
			to: result.email,
			subject: "Password Reset Successful",
			type:"BUSINESS_EMAIL",
			html: `<p>Your password has been reset successfully.</p>`,
		});

		logger.info("Reset password successful", { email: result.email });

		return res.status(200).json({
			message: "Password reset successful",
			code: httpStatus.SUCCESS,
			statusCode: 200,
			data: null,
		});
	},
);


//    CHANGE PASSWORD


export const changePassword = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>) => {
		const { userId } = getAuth(req);
		const { password } = req.body;

		if (!validatePassword(password)) {
			throw new BadRequestError({
				message: "Invalid password",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}

		await authServices.changePassword(userId, password);

		return res.status(200).json({
			message: "Password updated successfully",
			code: httpStatus.SUCCESS,
			statusCode: 200,
			data: null,
		});
	},
);


//    CHECK PASSWORD


export const checkPassword = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>) => {
		const { userId } = getAuth(req);
		const { password } = req.body;

		if (!validatePassword(password)) {
			throw new BadRequestError({
				message: "Invalid password",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}

		await authServices.checkPassword(userId, password);

		return res.status(200).json({
			message: "Password matched",
			code: httpStatus.SUCCESS,
			statusCode: 200,
			data: null,
		});
	},
);

//    REFRESH TOKEN


export const refreshToken = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>) => {
		const token = req.cookies?.refreshToken;

		logger.info("Refresh token attempt", { ip: req.ip });

		if (!token) {
			throw new AuthenticationError({
				message: "Refresh token missing",
				code: "ERR_AUTH",
				statusCode: 401,
			});
		}

		const result = await authServices.refreshToken(token);

		res.cookie("refreshToken", result.newRefreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: isStudent(result.role) ? 6 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
		});

		return res.status(200).json({
			message: "Token refreshed",
			code: httpStatus.SUCCESS,
			statusCode: 200,
			data: {
				accessToken: result.accessToken,
			},
		});
	},
);

export const sendToSupport = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const parse = inquirySchema.safeParse(req.body);

		if (!parse.success) {
			const errors = parse.error.flatten((issue) => issue.message);
			console.log(errors);
			throw new BadRequestError({
				message: `Invalid inquiry payload`,
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
				errors: errors,
			});
		}

		const contactForm = parse.data;

		if (!validateEmail(contactForm.email)) {
			throw new BadRequestError({
				message: "Invalid email",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}

		await sendingToSupport({ ...contactForm, type: "CONTACT_SUPPORT" });

		res.status(200).json({
			message: "Your inquiry is send successfully !",
			code: httpStatus.SUCCESS,
			statusCode: 200,
			data: null,
		});
	},
);
