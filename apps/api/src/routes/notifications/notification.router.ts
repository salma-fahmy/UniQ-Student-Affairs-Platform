import { Router } from "express";
import * as notificationController from "../../controller/notification.controller";

const notificationRouter = Router();
notificationRouter.patch(
	"/:notificationId/read",
	notificationController.updateStatus,
);
notificationRouter.delete(
	"/:notificationId/delete",
	notificationController.deleteNotificationById,
);
notificationRouter.delete(
	"/delete",
	notificationController.deleteAllNotifications,
);



export default notificationRouter;
