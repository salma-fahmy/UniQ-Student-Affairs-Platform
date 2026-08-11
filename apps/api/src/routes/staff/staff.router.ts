// apps/api/src/routes/staff/staff.router.ts

import { Router } from "express";
import * as staffController from "../../controller/staff.controller";
import { verifyRoles } from "../../middlewares/verify-role";

const staffRouter = Router();

/**
 * GET /v1/staff/dashboard
 * Affairs staff dashboard — excludes doctor complaints
 */
staffRouter.get(
  "/dashboard",
  verifyRoles("affairs_staff"),
  staffController.getDashboard
);

/**
 * GET /v1/staff/admin-dashboard
 * Admin dashboard — includes ALL complaints (including doctor complaints)
 */
staffRouter.get(
  "/admin-dashboard",
  verifyRoles("admin"),
  staffController.getAdminDashboard
);

export default staffRouter;
