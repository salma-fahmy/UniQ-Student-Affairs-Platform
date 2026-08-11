import { Router } from "express";
import * as complaintController from "../../controller/complaint.controller";
import { verifyRoles } from "../../middlewares/verify-role";
import { authorizePermission } from "../../middlewares/authorize-permission";

const complaintRouter = Router();

// ── List all complaints ───────────────────────────────────────────────────────
// student → own only | affairs_staff → no doctor_complaint | admin → all
// academic_staff (doctor) → NO ACCESS
complaintRouter.get(
	"/all-complaints",
	verifyRoles("student", "affairs_staff", "admin"),
	authorizePermission("read:complaint"),
	complaintController.getAllComplaints,
);

// ── Get single complaint ──────────────────────────────────────────────────────
// affairs_staff → no doctor_complaint (enforced in service) | admin → all | student → own only
// academic_staff (doctor) → NO ACCESS
complaintRouter.get(
	"/:complaintNumber",
	verifyRoles("affairs_staff", "admin", "student"),
	authorizePermission("read:complaint"),
	complaintController.getComplaint,
);

// ── Get student info for a complaint ─────────────────────────────────────────
// academic_staff (doctor) → NO ACCESS
complaintRouter.get(
	"/:complaintNumber/student",
	verifyRoles("affairs_staff", "admin"),
	authorizePermission("read:complaint"),
	complaintController.getStudentComplaint,
);

// ── Create complaint ──────────────────────────────────────────────────────────
complaintRouter.post(
	"/create",
	verifyRoles("student"),
	authorizePermission("create:complaint"),
	complaintController.createComplaint,
);

// ── Approve complaint → status: accepted ─────────────────────────────────────
// affairs_staff → non-doctor complaints only (enforced in service)
// admin → all complaints
// academic_staff (doctor) → NO ACCESS
complaintRouter.patch(
	"/:complaintNumber/approve",
	verifyRoles("affairs_staff", "admin"),
	authorizePermission("update:complaint"),
	complaintController.approveComplaint,
);

// ── Reject complaint → status: rejected ──────────────────────────────────────
// affairs_staff → non-doctor complaints only (enforced in service)
// admin → all complaints
// academic_staff (doctor) → NO ACCESS
complaintRouter.patch(
	"/:complaintNumber/reject",
	verifyRoles("affairs_staff", "admin"),
	authorizePermission("update:complaint"),
	complaintController.rejectComplaint,
);

export default complaintRouter;