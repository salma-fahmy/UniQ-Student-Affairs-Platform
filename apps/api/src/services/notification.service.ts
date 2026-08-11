import { prisma } from "@repo/db";
import { INotification } from "../dto/INotification";
import NotFoundError from "../error/NotFound.Error";
import config from "../lib/config";

export const updateStatus = async (userId: string, notificationId: number) => {
	const isExisted = await prisma.notification.findFirst({
		where: {
			user_id: userId,
			notification_id: notificationId,
		},
	});

	if (!isExisted)
		throw new NotFoundError({
			message: "Not found Notification",
			code: "ERR_NF",
			statusCode: 404,
		});

	const notification = await prisma.notification.update({
		where: {
			notification_id: notificationId,
			user_id: userId,
		},
		data: {
			is_read: true,
			read_at: new Date(),
		},
		select: {
			notification_id: true,
			created_at: true,
			is_read: true,
			title: true,
			notification_type: true,
			action_url: true,
			message: true,
		},
	});

	return notification;
};

export const deleteNotificationById = async (
	userId: string,
	notificationId: number,
) => {
	const isExisted = await prisma.notification.findFirst({
		where: {
			user_id: userId,
			notification_id: notificationId,
		},
	});

	if (!isExisted)
		throw new NotFoundError({
			message: "Not found Notification",
			code: "ERR_NF",
			statusCode: 404,
		});

	await prisma.notification.delete({
		where: {
			user_id: userId,
			notification_id: notificationId,
		},
	});
};

export const deleteAllNotifications = async (userId: string) => {
	await prisma.notification.deleteMany({
		where: {
			user_id: userId,
		},
	});
};

export const createNotification = async (notificationData: INotification) => {
	
	await prisma.notification.create({
		data: {
			user: {
				connect: {
					user_id: notificationData.userId,
				},
			},
			notification_type: notificationData.notificationType,
			message: notificationData.message,
			title: notificationData.title,
			is_read: false,
			read_at: null,
			action_url: `${config.clientUrl}${notificationData.actionUrl}`,
			created_at: new Date(),
			expires_at: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
		},
	});
};
