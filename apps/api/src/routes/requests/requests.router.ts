import { Router } from "express";
import * as requestController from "../../controller/request.controller";
import { verifyRoles } from "../../middlewares/verify-role";

const requestRouter = Router();

// ── Request Types ─────────────────────────────────────────────────────────────
requestRouter.get("/types", requestController.getRequestTypes);

requestRouter.get("/types/:reqCode", requestController.getRequestType);

// ── List requests ─────────────────────────────────────────────────────────────
// affairs_staff / admin → all types
// academic_staff (doctor) → only CRS_REG and CRS_WTH (enforced in service)
// student → own requests only (enforced in service)
requestRouter.get(
	"/all",
	verifyRoles("admin", "affairs_staff", "academic_staff", "student"),
	requestController.getAllRequest,
);

// ── Preview request (NO DB write) ─────────────────────────────────────────────
// Student calls this to see the review screen before going to the gateway.
// Returns price + details. Nothing is saved.
requestRouter.post(
	"/preview",
	verifyRoles("student"),
	requestController.previewRequest,
);

// ── Create FREE request (DB write — free services only) ───────────────────────
// For paid services the student goes through POST /payments/initiate instead.
requestRouter.post(
	"/create-free",
	verifyRoles("student"),
	requestController.createFreeRequest,
);

// ── Approve request → status: accepted ───────────────────────────────────────
// affairs_staff / admin only via this route
// academic_staff approve via their own route: PATCH /academic/requests/:requestNumber/status
requestRouter.patch(
	"/:reqNumber/approve",
	verifyRoles("affairs_staff", "admin"),
	requestController.approveRequest,
);

// ── Reject request → status: rejected ────────────────────────────────────────
requestRouter.patch(
	"/:reqNumber/reject",
	verifyRoles("affairs_staff", "admin"),
	requestController.rejectRequest,
);

// ── Resubmit request → status: resubmit ──────────────────────────────────────
// affairs_staff / admin only — asks student to re-upload docs / fix data
requestRouter.patch(
	"/:reqNumber/resubmit",
	verifyRoles("affairs_staff", "admin"),
	requestController.resubmitRequest,
);

// ── Get single request ────────────────────────────────────────────────────────
// academic_staff → only CRS_REG / CRS_WTH (enforced in service)
requestRouter.get(
	"/:reqNumber",
	verifyRoles("admin", "affairs_staff", "academic_staff"),
	requestController.getRequest,
);

export default requestRouter;
