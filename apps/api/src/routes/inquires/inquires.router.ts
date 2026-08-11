import { Router } from "express";
import { authenticateUser } from "../../middlewares/authenticate-user";
import { verifyRoles } from "../../middlewares/verify-role";
import { ipRateLimiter } from "../../middlewares/ip-rate-limiter";
import * as inquiriesController from "../../controller/inquires.controller";

const contactRouter = Router();

contactRouter.post("/create", ipRateLimiter, inquiriesController.createInquiry);

contactRouter.get(
	"/get-all-inquiries",
	authenticateUser,
	verifyRoles("admin", "academic_staff", "affairs_staff"),
	inquiriesController.getAllInquiries,
);

contactRouter.delete(
	"/delete-all-inquiries",
	authenticateUser,
	verifyRoles("admin", "academic_staff", "affairs_staff"),
	inquiriesController.deleteInquires,
);

contactRouter
	.route("/:id")
	.get(
		authenticateUser,
		verifyRoles("admin", "academic_staff", "affairs_staff"),
		inquiriesController.getInquiry,
	)
	.delete(
		authenticateUser,
		verifyRoles("admin", "academic_staff", "affairs_staff"),
		inquiriesController.deleteInquiry,
	);

export default contactRouter;
