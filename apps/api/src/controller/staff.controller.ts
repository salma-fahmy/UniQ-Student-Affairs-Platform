// apps/api/src/controller/staff.controller.ts

import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as staffService from "../services/staff.services";
import IResponseOutput from "../dto/response.dto";
import httpStatus from "../utils/httpStatus";

/**
 * GET /v1/staff/dashboard
 * Affairs staff dashboard: stats + recent requests + recent complaints
 * Doctor complaints are excluded from this view.
 */
export const getDashboard = asyncHandler(
  async (req: Request, res: Response<IResponseOutput>, next: NextFunction) => {
    const dashboard = await staffService.getStaffDashboard();

    return res.status(200).json({
      message: "Staff dashboard fetched successfully",
      code: httpStatus.SUCCESS,
      statusCode: 200,
      data: dashboard,
    });
  }
);

/**
 * GET /v1/staff/admin-dashboard
 * Admin dashboard: stats + recent requests + ALL complaints (including doctor complaints)
 */
export const getAdminDashboard = asyncHandler(
  async (req: Request, res: Response<IResponseOutput>, next: NextFunction) => {
    const dashboard = await staffService.getAdminDashboard();

    return res.status(200).json({
      message: "Admin dashboard fetched successfully",
      code: httpStatus.SUCCESS,
      statusCode: 200,
      data: dashboard,
    });
  }
);
