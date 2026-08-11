import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as paymentService from "../services/payment.service";
import IResponseOutput from "../dto/response.dto";
import httpStatus from "../utils/httpStatus";
import BadRequestError from "../error/BadRequestError";
import requestSchema from "../validator/request.schema";

// ── POST /api/v1/payments/initiate ────────────────────────────────────────────
// NO DB WRITES — validates and returns a temp payment_number + amount for the gateway.
// Body: { studentId, requestTypeId, price, body, description? }
export const initiatePayment = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>, next: NextFunction) => {
		const studentId = req.auth?.payload.userId as string;

		const parse = requestSchema.safeParse(req.body);
		if (!parse.success) {
			throw new BadRequestError({
				message: "Invalid request data",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}

		const result = await paymentService.initiatePayment(parse.data, studentId);

		return res.status(201).json({
			message: "Payment initiated successfully",
			code: httpStatus.SUCCESS,
			statusCode: 201,
			data: result,
		});
	},
);

// ── POST /api/v1/payments/:paymentNumber/confirm ──────────────────────────────
// Called after gateway returns SUCCESS.
// THE ONLY endpoint that writes to DB (Request + Payment in one transaction).
// Body: { transactionId, studentId, requestTypeId, price, body, description? }
//        ↑ same fields as initiate PLUS transactionId
export const confirmPayment = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>, next: NextFunction) => {
		const studentId = req.auth?.payload.userId as string;
		const { paymentNumber } = req.params;
		const { transactionId, ...requestBody } = req.body;

		if (!paymentNumber) {
			throw new BadRequestError({
				message: "Missing payment number",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}

		if (!transactionId || typeof transactionId !== "string") {
			throw new BadRequestError({
				message: "transactionId is required",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}

		// Inject studentId from JWT (schema requires it)
		const parse = requestSchema.safeParse({
			...requestBody,
			studentId,
		});
		if (!parse.success) {
			throw new BadRequestError({
				message: "Invalid request data",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}

		const result = await paymentService.confirmPayment(
			paymentNumber,
			transactionId.trim(),
			studentId,
			parse.data,
		);

		return res.status(200).json({
			message: "Payment confirmed successfully",
			code: httpStatus.SUCCESS,
			statusCode: 200,
			data: result,
		});
	},
);

// ── POST /api/v1/payments/:paymentNumber/fail ─────────────────────────────────
// Called after gateway returns FAILURE.
// Nothing was saved in DB — just acknowledges the failure.
export const failPayment = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>, next: NextFunction) => {
		const studentId = req.auth?.payload.userId as string;
		const { paymentNumber } = req.params;

		if (!paymentNumber) {
			throw new BadRequestError({
				message: "Missing payment number",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}

		const result = await paymentService.failPayment(studentId);

		return res.status(200).json({
			message: result.message,
			code: httpStatus.SUCCESS,
			statusCode: 200,
			data: null,
		});
	},
);

// ── GET /api/v1/payments/:paymentNumber ───────────────────────────────────────
export const getPayment = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>, next: NextFunction) => {
		const userId = req.auth?.payload.userId as string;
		const role = req.auth?.payload.role as string;
		const { paymentNumber } = req.params;

		if (!paymentNumber) {
			throw new BadRequestError({
				message: "Missing payment number",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}

		const payment = await paymentService.getPayment(paymentNumber, userId, role);

		return res.status(200).json({
			message: "Payment fetched successfully",
			code: httpStatus.SUCCESS,
			statusCode: 200,
			data: payment,
		});
	},
);

// ── GET /api/v1/payments ──────────────────────────────────────────────────────
export const listPayments = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>, next: NextFunction) => {
		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.limit as string) || 10;

		if (page < 1 || limit < 1) {
			throw new BadRequestError({
				message: "Invalid pagination parameters",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}

		const result = await paymentService.listPayments(page, limit);

		return res.status(200).json({
			message: "Payments fetched successfully",
			code: httpStatus.SUCCESS,
			statusCode: 200,
			data: result.data,
			meta: result.meta,
		});
	},
);