// apps/api/src/controller/academic.controller.ts

import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as academicService from "../services/academic.service";
import IResponseOutput from "../dto/response.dto";
import httpStatus from "../utils/httpStatus";
import BadRequestError from "../error/BadRequestError";

// ============================================================
// 1. Dashboard
// ============================================================
export const getAcademicDashboard = asyncHandler(
  async (req: Request, res: Response<IResponseOutput>, next: NextFunction) => {
    const staffId = req.auth!.payload.userId as string;

    const dashboard = await academicService.getAcademicDashboard(staffId);

    return res.status(200).json({
      message: "Academic dashboard fetched successfully",
      code: httpStatus.SUCCESS,
      statusCode: 200,
      data: dashboard,
    });
  }
);

// ============================================================
// 2. Assigned Students List
// ============================================================
export const getAssignedStudents = asyncHandler(
  async (req: Request, res: Response<IResponseOutput>, next: NextFunction) => {
    const staffId = req.auth!.payload.userId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (page < 1 || limit < 1) {
      throw new BadRequestError({
        message: "Invalid page or limit parameters",
        code: "ERR_BAD_REQUEST",
        statusCode: 400,
      });
    }

    const result = await academicService.getAssignedStudents(
      staffId,
      page,
      limit
    );

    return res.status(200).json({
      message: "Assigned students fetched successfully",
      code: httpStatus.SUCCESS,
      statusCode: 200,
      data: result.data,
      meta: result.meta,
    });
  }
);

// ============================================================
// 3. Academic Requests List (Add Course / Drop Course only)
// ============================================================
export const getAcademicRequests = asyncHandler(
  async (req: Request, res: Response<IResponseOutput>, next: NextFunction) => {
    const staffId = req.auth!.payload.userId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (page < 1 || limit < 1) {
      throw new BadRequestError({
        message: "Invalid page or limit parameters",
        code: "ERR_BAD_REQUEST",
        statusCode: 400,
      });
    }

    const result = await academicService.getAcademicRequests(
      staffId,
      page,
      limit
    );

    return res.status(200).json({
      message: "Academic requests fetched successfully",
      code: httpStatus.SUCCESS,
      statusCode: 200,
      data: result.data,
      meta: result.meta,
    });
  }
);

// ============================================================
// 4. Request Detail
// ============================================================
export const getAcademicRequestDetail = asyncHandler(
  async (req: Request, res: Response<IResponseOutput>, next: NextFunction) => {
    const staffId = req.auth!.payload.userId as string;
    const requestNumber = req.params.requestNumber as string;

    if (!requestNumber) {
      throw new BadRequestError({
        message: "Missing request number",
        code: "ERR_BAD_REQUEST",
        statusCode: 400,
      });
    }

    const request = await academicService.getAcademicRequestDetail(
      staffId,
      requestNumber
    );

    return res.status(200).json({
      message: "Request detail fetched successfully",
      code: httpStatus.SUCCESS,
      statusCode: 200,
      data: request,
    });
  }
);

// ============================================================
// 5. Update Request Status (Approve / Reject)
// ============================================================
export const updateRequestStatus = asyncHandler(
  async (req: Request, res: Response<IResponseOutput>, next: NextFunction) => {
    const staffId = req.auth!.payload.userId as string;
    const requestNumber = req.params.requestNumber as string;
    const { status, comments }: { status: string; comments?: string } =
      req.body;

    if (!requestNumber) {
      throw new BadRequestError({
        message: "Missing request number",
        code: "ERR_BAD_REQUEST",
        statusCode: 400,
      });
    }

    if (!status || !["accepted", "rejected"].includes(status)) {
      throw new BadRequestError({
        message: "Status must be 'accepted' or 'rejected'",
        code: "ERR_BAD_REQUEST",
        statusCode: 400,
      });
    }

    const updated = await academicService.updateRequestStatus(
      staffId,
      requestNumber,
      status as "accepted" | "rejected",
      comments
    );

    return res.status(200).json({
      message: `Request ${status} successfully`,
      code: httpStatus.SUCCESS,
      statusCode: 200,
      data: updated,
    });
  }
);