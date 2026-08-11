import { cloudinary } from "@repo/config";
import { NextFunction, Request, Response } from "express";
import config from "../lib/config";
import { allowedFolders } from "../utils/getAllowedFolder";
import * as userService from "../services/user.services";
import IResponseOutput from "../dto/response.dto";
import httpStatus from "../utils/httpStatus";
import AuthenticationError from "../error/AuthenticationError";
import BadRequestError from "../error/BadRequestError";
import NotFoundError from "../error/NotFound.Error";
import { asyncHandler } from "../utils/asyncHandler";
import { userSchema } from "../validator/user.schema";
import logger from "../utils/logger";

const getUserId = (req: Request) => {
	const userId = req.auth?.payload.userId;
	if (!userId) {
		throw new AuthenticationError({
			message: "Unauthorized",
			code: "ERR_AUTH",
			statusCode: 401,
		});
	}
	return userId;
};

export const userProfilePhotoSignature = asyncHandler(
	async (req: Request, res: Response) => {
		const folderName = req.query.folderName as string;

		if (!folderName) {
			throw new BadRequestError({
				message: "Missing folder name",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}

		if (!allowedFolders.includes(folderName)) {
			throw new BadRequestError({
				message: "Invalid folder name",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}

		const timestamp = Math.round(Date.now() / 1000);

		const signature = cloudinary.utils.api_sign_request(
			{ folder: folderName, timestamp },
			config.cloudinary_api_secret!,
		);

		return res.status(200).json({
			signature,
			timestamp,
			cloudName: config.cloudinary_cloud_name,
			apiKey: config.cloudinary_api_key,
			folder: folderName,
		});
	},
);

export const updateUserProfilePhotoUrl = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>) => {
		const userId = getUserId(req);
		const { profilePhoto, publicId } = req.body;

		if (!profilePhoto || !publicId) {
			throw new BadRequestError({
				message: "profilePhoto and publicId are required",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}

		if (!profilePhoto.includes("res.cloudinary.com")) {
			throw new BadRequestError({
				message: "Invalid image resource",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}

		const user = await userService.getUserById(userId);

		if (!user) {
			throw new NotFoundError({
				message: "User not found",
				code: "ERR_NF",
				statusCode: 404,
			});
		}

		// delete old image (non-blocking failure is better)
		if (user.public_photo_cloud_id) {
			try {
				await cloudinary.uploader.destroy(user.public_photo_cloud_id);
			} catch {
				// don't break the flow — just log in real app
			}
		}

		await userService.updateUserProfilePhotoUrl(userId, profilePhoto, publicId);

		return res.status(200).json({
			message: "Profile photo updated",
			code: httpStatus.SUCCESS,
			statusCode: 200,
			data: null,
		});
	},
);

export const getUserProfile = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>) => {
		const userId = getUserId(req);
		const role = req.auth?.payload.role;

		if (!role) {
			throw new AuthenticationError({
				message: "Role not found in token",
				code: "ERR_AUTH",
				statusCode: 401,
			});
		}

		const data = await userService.getUserDataById(userId, role);

		if (!data) {
			throw new NotFoundError({
				message: "User not found",
				code: "ERR_NF",
				statusCode: 404,
			});
		}

		return res.status(200).json({
			message: "User profile data",
			statusCode: 200,
			data,
			code: httpStatus.SUCCESS,
		});
	},
);

export const getUserNotifications = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>) => {
		const userId = getUserId(req);

		const notifications = await userService.getUserNotifications(userId);

		return res.status(200).json({
			message: "User notifications",
			data: notifications,
			code: httpStatus.SUCCESS,
			statusCode: 200,
		});
	},
);

export const createUser = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const parse = userSchema.safeParse(req.body);

		logger.info("Attempt: Create a new user .", {
			userId: req.auth?.payload.userId,
			role: req.auth?.payload.role,
		});

		if (!parse.success) {
			console.log("error");
			throw new BadRequestError({
				message: "Invalid user Data !",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
				errors: parse.error.flatten((e) => e.message),
			});
		}

		const user = await userService.createUser(parse.data);

		return res.json({
			user,
		});
	},
);

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — GET /v1/users/admin/all
// Lists all users with optional ?role= and ?page= ?limit= query params
// ─────────────────────────────────────────────────────────────────────────────
export const adminGetAllUsers = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>) => {
		const page = Math.max(1, parseInt(req.query.page as string) || 1);
		const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
		const roleParam = req.query.role as string | undefined;

		// Map role string → role_id number
		const roleMap: Record<string, number> = {
			student: 1,
			academic_staff: 2,
			affairs_staff: 3,
			admin: 4,
		};

		let roleFilter: number | undefined;
		if (roleParam) {
			roleFilter = roleMap[roleParam];
			if (!roleFilter) {
				throw new BadRequestError({
					message: "Invalid role filter. Use: student | academic_staff | affairs_staff | admin",
					code: "ERR_BAD_REQUEST",
					statusCode: 400,
				});
			}
		}

		const result = await userService.getAllUsers(page, limit, roleFilter);

		return res.status(200).json({
			message: "Users fetched successfully",
			code: httpStatus.SUCCESS,
			statusCode: 200,
			data: result.data,
			meta: result.meta,
		});
	},
);

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — GET /v1/users/admin/:userId
// Get full detail of a single user
// ─────────────────────────────────────────────────────────────────────────────
export const adminGetUserById = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>) => {
		const { userId } = req.params;

		if (!userId) {
			throw new BadRequestError({
				message: "userId is required",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}

		const user = await userService.getUserDetailById(userId as string );

		if (!user) {
			throw new NotFoundError({
				message: "User not found",
				code: "ERR_NF",
				statusCode: 404,
			});
		}

		return res.status(200).json({
			message: "User fetched successfully",
			code: httpStatus.SUCCESS,
			statusCode: 200,
			data: user,
		});
	},
);

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — PATCH /v1/users/admin/:userId
// Update editable user fields (no password, no role change)
// ─────────────────────────────────────────────────────────────────────────────
export const adminUpdateUser = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>) => {
		const { userId } = req.params;

		if (!userId) {
			throw new BadRequestError({
				message: "userId is required",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}

		// Only allow safe editable fields — strip everything else
		const {
			first_name,
			second_name,
			third_name,
			fourth_name,
			email,
			phone,
			address,
			birth,
			is_active,
			photo_url,
			publicId,
		} = req.body;

		// Build only the fields that were actually sent
		const updateData: Record<string, any> = {};
		if (first_name !== undefined) updateData.first_name = first_name;
		if (second_name !== undefined) updateData.second_name = second_name;
		if (third_name !== undefined) updateData.third_name = third_name;
		if (fourth_name !== undefined) updateData.fourth_name = fourth_name;
		if (email !== undefined) updateData.email = email;
		if (phone !== undefined) updateData.phone = phone;
		if (address !== undefined) updateData.address = address;
		if (birth !== undefined) updateData.birth = new Date(birth);
		if (is_active !== undefined) updateData.is_active = Boolean(is_active);
		if (photo_url !== undefined) updateData.photo_url = photo_url;
		if (publicId !== undefined) updateData.public_photo_cloud_id = publicId;

		if (Object.keys(updateData).length === 0) {
			throw new BadRequestError({
				message: "No updatable fields provided",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}

		// Make sure user exists first
		const existing = await userService.getUserById(userId as string);
		if (!existing) {
			throw new NotFoundError({
				message: "User not found",
				code: "ERR_NF",
				statusCode: 404,
			});
		}

		const updated = await userService.adminUpdateUser(userId as string, updateData);

		return res.status(200).json({
			message: "User updated successfully",
			code: httpStatus.SUCCESS,
			statusCode: 200,
			data: updated,
		});
	},
);