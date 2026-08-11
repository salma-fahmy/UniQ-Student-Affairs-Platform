import bcrypt from "bcrypt";
import crypto from "node:crypto";
import AuthenticationError from "../error/AuthenticationError";
import EntityNotFoundError from "../error/EntityNotFoundError";
import {
	generateAccessToken,
	generateRefreshToken,
	hashToken,
} from "../utils/generateToken";
import { prisma } from "@repo/db";
import { isStudent, refreshTokenExpiration } from "../utils/tokenExpiration";
import ForbiddenError from "../error/ForbiddenError";
import config from "../lib/config";
import logger from "../utils/logger";
import { emailTemplate } from "../templates/email/template";
import { EmailTemplateType } from "../templates/email/EmailTemplateEnum";
import { safeEmailJob } from "../utils/safeEmailJob";
import PayloadType from "../dto/payload";

export async function login(userId: string, password: string) {
	// find user .
	const user = await prisma.user.findUnique({
		where: { user_id: userId.trim() },
		include: {
			role: {
				select: {
					role_name: true,
				},
			},
		},
	});

	if (!user) {
		logger.warn("Login failed - user not found", { userId });

		throw new AuthenticationError({
			message: "Invalid credentials",
			statusCode: 401,
			code: "ERR_AUTH",
		});
	}

	const match = await bcrypt.compare(password, user.password);

	if (!match) {
		logger.warn("Login failed - wrong password", { userId });

		throw new AuthenticationError({
			message: "Invalid credentials",
			statusCode: 401,
			code: "ERR_AUTH",
		});
	}
	if (!user.is_active) {
		throw new ForbiddenError({
			message: "Your account is blocked!",
			statusCode: 403,
			code: "ERR_BLOCKED",
		});
	}

	const payload: PayloadType = {
		userId: user.user_id,
		role: user.role.role_name,
	};

	// -------------------------
	// 8. Tokens
	// -------------------------
	const accessToken = generateAccessToken(payload);
	const refreshToken = generateRefreshToken();
	const hashedToken = hashToken(refreshToken);
	const expiresAt = refreshTokenExpiration(isStudent(user.role.role_name));

	// -------------------------
	// 9. Transaction
	// -------------------------
	await prisma.$transaction([
		prisma.user.update({
			where: { user_id: user.user_id },
			data: { last_login: new Date() },
		}),

		prisma.refreshToken.upsert({
			where: { user_id: user.user_id },
			update: {
				token: hashedToken,
				expires_at: expiresAt,
				session_expires_at: expiresAt,
			},
			create: {
				user_id: user.user_id,
				token: hashedToken,
				expires_at: expiresAt,
				session_expires_at: expiresAt,
			},
		}),

		prisma.notification.create({
			data: {
				user: {
					connect: {
						user_id: user.user_id,
					},
				},
				notification_type: "system",
				message: "successful login",
				is_read: false,
				created_at: new Date(),
				expires_at: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
				title: "Login",
			},
		}),
	]);

	console.log(payload);

	return {
		accessToken,
		refreshToken,
		userData: {
			userId: user.user_id,
			email: user.email,
			role: user.role.role_name,
		},
	};
}

export async function forgetPassword(email: string) {
	const user = await prisma.user.findUnique({ where: { email } });

	if (!user) {
		logger.warn("Not found user", { email });
		throw new EntityNotFoundError({
			message: "User not found",
			statusCode: 404,
			code: "ERR_NF",
		});
	}

	const token = crypto.randomBytes(32).toString("hex");
	const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

	// Save token in PasswordReset table
	await prisma.passwordReset.create({
		data: {
			token,
			expires_at: expiresAt,
			user_id: user.user_id,
		},
	});

	const clientUrl = config.clientUrl;

	const resetLink = `${clientUrl}/reset-password?token=${token}`;

	const html = emailTemplate(EmailTemplateType.PASSWORD_RESET, {
		resetLink,
		email,
	});

	safeEmailJob({
		to: user.email,
		type: "BUSINESS_EMAIL",
		subject: "reset password",
		html,
	});
}

export async function resetPassword(token: string, newPassword: string) {
	const resetEntry = await prisma.passwordReset.findFirst({
		where: { token, expires_at: { gt: new Date() } },
		include: { user: true },
	});

	if (!resetEntry) {
		throw new AuthenticationError({
			message: "Invalid or expired token",
			statusCode: 401,
			code: "ERR_AUTH",
		});
	}

	const hashedPassword = await bcrypt.hash(newPassword, 10);

	await prisma.$transaction([
		prisma.user.update({
			where: { user_id: resetEntry.user_id },
			data: { password: hashedPassword },
		}),
		prisma.passwordReset.deleteMany({
			where: { user_id: resetEntry.user_id },
		}),
	]);

	return {
		email: resetEntry.user.email,
		userId: resetEntry.user_id,
	};
}

export async function checkPassword(userId: string, oldPassword: string) {
	const user = await prisma.user.findUnique({
		where: { user_id: userId },
		select: { password: true },
	});

	if (!user) {
		throw new AuthenticationError({
			message: "Invalid credentials",
			statusCode: 401,
			code: "ERR_AUTH",
		});
	}

	const match = await bcrypt.compare(oldPassword, user.password);

	if (!match) {
		throw new AuthenticationError({
			message: "Invalid password",
			statusCode: 401,
			code: "ERR_AUTH",
		});
	}

	return true;
}

export async function changePassword(userId: string, newPassword: string) {
	const user = await prisma.user.findUnique({
		where: {
			user_id: userId,
		},
	});
	if (!user) {
		logger.warn("In valid credentials", { userId });
		throw new EntityNotFoundError({
			message: "invalid credentials",
			statusCode: 404,
			code: "ERR_NF",
		});
	}

	const newHashedPassword = await bcrypt.hash(newPassword, 10);

	await prisma.user.update({
		where: {
			user_id: user.user_id,
		},
		data: {
			password: newHashedPassword,
		},
	});

	const html = emailTemplate(EmailTemplateType.OTHERS, {
		email: user.email,
		message: "password is Changed Successfully",
	});

	safeEmailJob({
		to: user.email,
		type:"BUSINESS_EMAIL",
		subject: "password changed",
		html,
	});
}

export async function logOut(hashedToken: string) {
	await prisma.refreshToken.deleteMany({
		where: {
			token: hashedToken,
		},
	});
}

export async function refreshToken(refreshToken: string) {
	const hashedToken = hashToken(refreshToken);

	// get the stored hashed token
	const storedToken = await prisma.refreshToken.findFirst({
		where: {
			token: hashedToken,
		},
	});

	if (!storedToken) {
		logger.warn("Invalid refresh Token");
		throw new AuthenticationError({
			message: "Invalid refresh token",
			code: "ERR_VALID",
			statusCode: 403,
		});
	}

	const now = new Date();

	if (storedToken.session_expires_at < now || storedToken.expires_at < now) {
		throw new AuthenticationError({
			message: "Session expired",
			statusCode: 403,
			code: "ERR_AUTH",
		});
	}
	const user = await prisma.user.findUnique({
		where: { user_id: storedToken.user_id },
		include: {
			role: true,
		},
	});

	if (!user) {
		logger.warn("Not found user for this refresh token !");
		throw new AuthenticationError({
			message: "there is not a user",
			code: "ERR_NF",
			statusCode: 404,
		});
	}
	//  Rotate refresh token
	const newRefreshToken = generateRefreshToken();
	const newHashedToken = hashToken(newRefreshToken);

	const newExpiresAt = refreshTokenExpiration(
		isStudent(user?.role.role_name as string),
	);

	await prisma.refreshToken.update({
		where: { user_id: user?.user_id },
		data: {
			token: newHashedToken,
			expires_at: newExpiresAt,
		},
	});

	const payload = {
		userId: user.user_id,
		role: user.role.role_name,
	};

	// access token.
	const accessToken = generateAccessToken(payload);
	return { accessToken, role: user.role.role_name, newRefreshToken };
}
