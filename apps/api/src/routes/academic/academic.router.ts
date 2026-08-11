// apps/api/src/routes/academic/academic.router.ts

import { Router } from "express";
import * as academicController from "../../controller/academic.controller";
import { verifyRoles } from "../../middlewares/verify-role";
import { authorizePermission } from "../../middlewares/authorize-permission";

const academicRouter = Router();

// All academic routes require academic_staff role
// Doctors can ONLY see Add Course (CRS_REG) and Drop Course (CRS_WTH) requests
// Doctors CANNOT see complaints at all

// Dashboard
academicRouter.get(
  "/dashboard",
  verifyRoles("academic_staff"),
  academicController.getAcademicDashboard
);

// Assigned Students
academicRouter.get(
  "/students",
  verifyRoles("academic_staff"),
  authorizePermission("read:student"),
  academicController.getAssignedStudents
);

// Requests List (filtered to CRS_REG and CRS_WTH only in service)
academicRouter.get(
  "/requests",
  verifyRoles("academic_staff"),
  authorizePermission("read:request"),
  academicController.getAcademicRequests
);

// Request Detail (enforces CRS_REG/CRS_WTH filter in service)
academicRouter.get(
  "/requests/:requestNumber",
  verifyRoles("academic_staff"),
  authorizePermission("read:request"),
  academicController.getAcademicRequestDetail
);

// Approve / Reject Request (only for CRS_REG/CRS_WTH)
academicRouter.patch(
  "/requests/:requestNumber/status",
  verifyRoles("academic_staff"),
  authorizePermission("update:request"),
  academicController.updateRequestStatus
);

// NOTE: Complaint routes are intentionally omitted.
// Doctors (academic_staff) have NO access to complaints.

export default academicRouter;
