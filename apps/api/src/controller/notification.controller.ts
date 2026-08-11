import { Request, Response } from "express";
import * as notificationService from "../services/notification.service";
import IResponseOutput from "../dto/response.dto";
import httpStatus from "../utils/httpStatus";
import { asyncHandler } from "../utils/asyncHandler";

const parseId = (value: string, name: string) => {
	const id = parseInt(value);
	if (isNaN(id)) {
		throw new Error(`Invalid ${name}`);
	}
	return id;
};

const getUserId = (req: Request) => {
	const userId = req.auth?.payload.userId;
	if (!userId) {
		throw new Error("Unauthorized");
	}
	return userId;
};

// Mark as read
export const updateStatus = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>) => {
		const notificationId = parseId(
			req.params.notificationId as string,
			"notificationId",
		);
		const userId = getUserId(req);

		const updatedNotification = await notificationService.updateStatus(
			userId,
			notificationId,
		);

		return res.status(200).json({
			message: "Notification marked as read.",
			statusCode: 200,
			code: httpStatus.SUCCESS,
			data: updatedNotification,
		});
	},
);

// Delete one
export const deleteNotificationById = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>) => {
		const notificationId = parseId(
			req.params.notificationId as string,
			"notificationId",
		);
		const userId = getUserId(req);

		await notificationService.deleteNotificationById(userId, notificationId);

		return res.status(200).json({
			message: "Notification deleted.",
			statusCode: 200,
			code: httpStatus.SUCCESS,
			data: null,
		});
	},
);

// Delete all
export const deleteAllNotifications = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>) => {
		const userId = getUserId(req);

		await notificationService.deleteAllNotifications(userId);

		return res.status(200).json({
			message: "All notifications deleted.",
			statusCode: 200,
			code: httpStatus.SUCCESS,
			data: null,
		});
	},
);

