import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as requestServices from "../services/request.services";
import NotFoundError from "../error/NotFound.Error";
import IResponseOutput from "../dto/response.dto";
import httpStatus from "../utils/httpStatus";
import BadRequestError from "../error/BadRequestError";
import requestSchema from "../validator/request.schema";

export const getRequestTypes = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>, next: NextFunction) => {
		const requests = await requestServices.getRequestsTypes();

		if (!requests || requests.length === 0) {
			throw new NotFoundError({
				message: "No request services available at this time.",
				code: "ERR_NF",
				statusCode: 404,
			});
		}

		return res.status(200).json({
			message: "Request services fetched successfully",
			statusCode: 200,
			code: httpStatus.SUCCESS,
			data: requests,
		});
	},
);

// get specific request Type .
export const getRequestType = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>, next: NextFunction) => {
		const reqCode = req.params.reqCode;

		if (!reqCode)
			throw new BadRequestError({
				message: "Missing RegCode !",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});

		const request = await requestServices.getRequestType(reqCode as string);

		if (!request) {
			throw new NotFoundError({
				message: "No request service available at this time.",
				code: "ERR_NF",
				statusCode: 404,
			});
		}

		return res.status(200).json({
			message: "Request service fetched successfully",
			statusCode: 200,
			code: httpStatus.SUCCESS,
			data: request,
		});
	},
);

export const getAllRequest = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>, next: NextFunction) => {
		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.limit as string) || 10;

		const role = req.auth?.payload.role;
		const userId = req.auth?.payload.userId;

		if (!role || !userId) {
			throw new BadRequestError({
				message: "Missing token parameters.",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}

		//  validation
		if (page < 1 || limit < 1) {
			throw new BadRequestError({
				message: "Missing page and limit parameters",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}
		const result = await requestServices.getRequests(page, limit, {
			userId,
			role,
		});

		if (!result) {
			throw new NotFoundError({
				message: "Not found Message",
				code: "ERR_NF",
				statusCode: 404,
			});
		}

		return res.status(200).json({
			message: "Requests fetched successfully ",
			code: httpStatus.SUCCESS,
			data: result.data,
			statusCode: 200,
			meta: result.meta,
		});
	},
);

// ── Preview Request (NO DB write) ─────────────────────────────────────────────
// Frontend calls this to show the review screen.
// Returns request details + price. Nothing is saved.
export const previewRequest = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>, next: NextFunction) => {
		const parse = requestSchema.safeParse(req.body);

		if (!parse.success) {
			throw new BadRequestError({
				message: "Invalid request data",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}

		const preview = await requestServices.previewRequest(parse.data);

		return res.status(200).json({
			message: "Request preview ready",
			code: httpStatus.SUCCESS,
			statusCode: 200,
			data: preview,
		});
	},
);

// ── Create Free Request ───────────────────────────────────────────────────────
// Only for services with price = 0. Paid services go through POST /payments/initiate.
export const createFreeRequest = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>, next: NextFunction) => {
		const parse = requestSchema.safeParse(req.body);
		console.log(parse);

		if (!parse.success) {
			throw new BadRequestError({
				message: "Invalid request data",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}

		const request = await requestServices.createFreeRequest(parse.data);

		if (!request) {
			throw new Error("The request Can't performed");
		}

		return res.status(201).json({
			message: "Free request created successfully.",
			code: httpStatus.SUCCESS,
			statusCode: 201,
			data: request,
		});
	},
);

export const getRequest = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>, next: NextFunction) => {
		const userId = req.auth?.payload.userId;
		const reqNumber = req.params.reqNumber;

		console.log(reqNumber, userId);

		if (!reqNumber || !userId) {
			throw new BadRequestError({
				message: "Missing Query Parameter !",
				statusCode: 400,
				code: "ERR_BAD_REQUEST",
			});
		}

		const request = await requestServices.getRequest(
			userId,
			reqNumber as string,
		);

		return res.status(200).json({
			message: "get Specific request",
			code: httpStatus.SUCCESS,
			statusCode: 200,
			data: request,
		});
	},
);

// ── Approve Request ───────────────────────────────────────────────────────────
export const approveRequest = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>, next: NextFunction) => {
		const { reqNumber } = req.params;
		const staffId = req.auth?.payload.userId as string;

		if (!reqNumber) {
			throw new BadRequestError({
				message: "Missing request number",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}

		const updated = await requestServices.approveRequest(reqNumber as string, staffId);

		return res.status(200).json({
			message: "Request approved successfully",
			code: httpStatus.SUCCESS,
			statusCode: 200,
			data: updated,
		});
	},
);

// ── Reject Request ────────────────────────────────────────────────────────────
export const rejectRequest = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>, next: NextFunction) => {
		const { reqNumber } = req.params;
		const staffId = req.auth?.payload.userId as string;
		const { comment } = req.body;

		if (!reqNumber) {
			throw new BadRequestError({
				message: "Missing request number",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}

		if (!comment || typeof comment !== "string" || !comment.trim()) {
			throw new BadRequestError({
				message: "comment is required",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}

		const updated = await requestServices.rejectRequest(reqNumber as string, staffId, comment.trim());

		return res.status(200).json({
			message: "Request rejected successfully",
			code: httpStatus.SUCCESS,
			statusCode: 200,
			data: updated,
		});
	},
);

// ── Resubmit Request ──────────────────────────────────────────────────────────
export const resubmitRequest = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>, next: NextFunction) => {
		const { reqNumber } = req.params;
		const staffId = req.auth?.payload.userId as string;
		const { comment } = req.body;

		if (!reqNumber) {
			throw new BadRequestError({
				message: "Missing request number",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}

		if (!comment || typeof comment !== "string" || !comment.trim()) {
			throw new BadRequestError({
				message: "comment is required",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}

		const updated = await requestServices.resubmitRequest(reqNumber as string, staffId, comment.trim());

		return res.status(200).json({
			message: "Resubmission requested successfully",
			code: httpStatus.SUCCESS,
			statusCode: 200,
			data: updated,
		});
	},
);
