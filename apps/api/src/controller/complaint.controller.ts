import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler";
import { complaintSchema } from "../validator/complaint.schema";
import IResponseOutput from "../dto/response.dto";
import * as complaintService from "../services/complaint.service";
import BadRequestError from "../error/BadRequestError";
import httpStatus from "../utils/httpStatus";
import NotFoundError from "../error/NotFound.Error";

// RLS-aware: student → own only | affairs_staff → no doctor_complaint | admin → all
export const getAllComplaints = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>, next: NextFunction) => {
		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.limit as string) || 10;

		if (page < 1 || limit < 1) {
			throw new BadRequestError({
				message: "Missing page and limit parameters",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}

		const role = req.auth?.payload.role as string;
		const userId = req.auth?.payload.userId as string;

		const result = await complaintService.getAllComplaints(page, limit, role, userId);

		return res.status(200).json({
			message: "Complaints fetched successfully",
			data: result.data,
			statusCode: 200,
			code: httpStatus.SUCCESS,
			meta: result.meta,
		});
	},
);

// for affair staff, admin, and student (own only)
export const getComplaint = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>, next: NextFunction) => {
		const complaintNumber = req.params.complaintNumber;

		if (!complaintNumber) {
			throw new BadRequestError({
				message: "Missing Complaint Number !",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}

		const role   = req.auth?.payload.role   as string;
		const userId = req.auth?.payload.userId as string;

		const complaint = await complaintService.getComplaint(
			complaintNumber as string,
			userId,
			role,
		);


		if (!complaint) {
			throw new NotFoundError({
				message: "Not found Complaints",
				statusCode: 404,
				code: "ERR_NF",
			});
		}

		return res.status(200).json({
			message: "Complaint fetched successfully .",
			code: httpStatus.SUCCESS,
			data: complaint,
			statusCode: 200,
		});
	},
);

// for affair staff
// get student data for a specific  complaint by complaint number
export const getStudentComplaint = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>, next: NextFunction) => {
		const complaintNumber = req.params.complaintNumber;

		if (!complaintNumber) {
			throw new BadRequestError({
				message: "Missing Complaint Number !",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}

		const student = await complaintService.getStudentComplaint(
			complaintNumber as string,
		);

		return res.status(200).json({
			message: "student fetched successfully .",
			code: httpStatus.SUCCESS,
			data: student,
			statusCode: 200,
		});
	},
);

// for student
export const createComplaint = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>, next: NextFunction) => {
		const parsed = complaintSchema.safeParse(req.body);

		if (!parsed.success) {
			throw new BadRequestError({
				message: "Invalid complaint data",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}
		const complaintData: z.infer<typeof complaintSchema> = parsed.data;

		const complaint = await complaintService.createComplaint(complaintData);

		if (!complaint) {
			throw new Error("Failed complaint creation ! ");
		}

		return res.status(200).json({
			message: "Complain is created Successfully ",
			code: httpStatus.SUCCESS,
			data: complaint,
			statusCode: 200,
		});
	},
);

// ── Approve Complaint ─────────────────────────────────────────────────────────
// affairs_staff → non-doctor complaints | admin → all complaints
export const approveComplaint = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>, next: NextFunction) => {
		const { complaintNumber } = req.params;
		const { resolutionText } = req.body;
		const staffId = req.auth?.payload.userId as string;
		const role = req.auth?.payload.role as string;

		if (!complaintNumber) {
			throw new BadRequestError({
				message: "Missing complaint number",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}

		if (!resolutionText || typeof resolutionText !== "string" || !resolutionText.trim()) {
			throw new BadRequestError({
				message: "resolutionText is required",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}

		const updated = await complaintService.approveComplaint(
			complaintNumber,
			staffId,
			resolutionText.trim(),
			role,
		);

		return res.status(200).json({
			message: "Complaint approved successfully",
			code: httpStatus.SUCCESS,
			statusCode: 200,
			data: updated,
		});
	},
);

// ── Reject Complaint ──────────────────────────────────────────────────────────
// affairs_staff → non-doctor complaints | admin → all complaints
export const rejectComplaint = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>, next: NextFunction) => {
		const { complaintNumber } = req.params;
		const { resolutionText } = req.body;
		const staffId = req.auth?.payload.userId as string;
		const role = req.auth?.payload.role as string;

		if (!complaintNumber) {
			throw new BadRequestError({
				message: "Missing complaint number",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}

		if (!resolutionText || typeof resolutionText !== "string" || !resolutionText.trim()) {
			throw new BadRequestError({
				message: "resolutionText is required",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}

		const updated = await complaintService.rejectComplaint(
			complaintNumber,
			staffId,
			resolutionText.trim(),
			role,
		);

		return res.status(200).json({
			message: "Complaint rejected successfully",
			code: httpStatus.SUCCESS,
			statusCode: 200,
			data: updated,
		});
	},
);