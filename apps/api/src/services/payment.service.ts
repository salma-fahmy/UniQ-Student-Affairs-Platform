import { prisma } from "@repo/db";
import NotFoundError from "../error/NotFound.Error";
import BadRequestError from "../error/BadRequestError";
import CustomError from "../error/CustomError";
import requestSchema from "../validator/request.schema";
import { z } from "zod";

// ── Initiate Payment ──────────────────────────────────────────────────────────
// Called BEFORE redirecting the student to the payment gateway.
// NO DB WRITES — validates and returns a temporary payment_number (in-memory only)
//    + amount so the frontend can call the gateway.
// The Request and Payment rows are created ONLY in confirmPayment (on success).
export const initiatePayment = async (
	requestData: z.infer<typeof requestSchema>,
	studentId: string,
) => {
	const requestType = await prisma.requestType.findUnique({
		where: { request_type_id: requestData.requestTypeId || 8 },
		select: {
			code: true,
			name: true,
			name_ar: true,
			price: true,
			is_active: true,
		},
	});

	if (!requestType) {
		throw new NotFoundError({
			message: "Request type not found",
			code: "ERR_NF",
			statusCode: 404,
		});
	}

	if (!requestType.is_active) {
		throw new CustomError({
			message: "This request type is not available now",
			statusCode: 503,
			code: "REQUEST_TYPE_DISABLED",
		});
	}

	const amount = Number(requestType.price ?? 0);

	if (requestData.price !== undefined && Number(requestData.price) !== amount) {
		throw new BadRequestError({
			message: "Price mismatch — please use the correct service price",
			code: "ERR_PRICE_MISMATCH",
			statusCode: 400,
		});
	}

	if (amount === 0) {
		throw new BadRequestError({
			message: "This service is free — use the free request endpoint instead",
			code: "ERR_FREE_SERVICE",
			statusCode: 400,
		});
	}

	// Generate a temporary payment_number in memory (NOT saved to DB).
	// The real sequential number is generated in confirmPayment.
	// We use a UUID-based temp token so the frontend has a stable reference
	// to pass back in the confirm/fail URL.
	const year = new Date().getFullYear();
	const tempToken = `${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
	const tempPaymentNumber = `PAY-${year}-TEMP-${tempToken}`;

	return {
		payment_number: tempPaymentNumber,
		amount,
		status: "pending",
		service_name: requestType.name,
		service_name_ar: requestType.name_ar,
	};
};

// ── Confirm Payment ───────────────────────────────────────────────────────────
// Called by the API after receiving a SUCCESS callback from the payment gateway.
// THE ONLY place that writes Request + Payment to the DB.
//    Payment is created immediately as "paid" — no pending row ever exists.
export const confirmPayment = async (
	tempPaymentNumber: string,
	transactionId: string,
	studentId: string,
	requestData: z.infer<typeof requestSchema>,
) => {
	return prisma.$transaction(async (tx) => {
		await tx.$executeRaw`SELECT set_config('app.role', ${"student"}, true)`;

		// Re-validate request type (source of truth from DB)
		const requestType = await tx.requestType.findUnique({
			where: { request_type_id: requestData.requestTypeId || 8 },
			select: {
				code: true,
				name: true,
				name_ar: true,
				price: true,
				is_active: true,
			},
		});

		if (!requestType) {
			throw new NotFoundError({
				message: "Request type not found",
				code: "ERR_NF",
				statusCode: 404,
			});
		}

		if (!requestType.is_active) {
			throw new CustomError({
				message: "This request type is not available now",
				statusCode: 503,
				code: "REQUEST_TYPE_DISABLED",
			});
		}

		const amount = Number(requestType.price ?? 0);
		const year = new Date().getFullYear();

		// Generate real request number
		const reqCounter = await tx.requestCounter.upsert({
			where: { year },
			update: { sequence: { increment: 1 } },
			create: { year, sequence: 1 },
		});
		const requestNumber = `REQ-${year}-${String(reqCounter.sequence).padStart(3, "0")}`;

		const doctorApprovalCodes = ["CRS_REG", "CRS_WTH"];
		const initialStatus = "pending";

		// Create Request — ONLY after payment succeeded
		const newRequest = await tx.request.create({
			data: {
				request_number: requestNumber,
				student_id: studentId,
				created_at: new Date(),
				description: requestData.description,
				attachment_links: requestData.attachment_links,
				request_body: requestData.body,
				price_at_request: amount,
				request_type_id: requestData.requestTypeId || 8,
				status: initialStatus,
			},
			select: { request_id: true, request_number: true },
		});

		// Generate real payment number
		const payCounter = await tx.paymentCounter.upsert({
			where: { year },
			update: { sequence: { increment: 1 } },
			create: { year, sequence: 1 },
		});
		const paymentNumber = `PAY-${year}-${String(payCounter.sequence).padStart(5, "0")}`;

		// Create Payment as "paid" immediately — no pending row ever
		const payment = await tx.payment.create({
			data: {
				payment_number: paymentNumber,
				student_id: studentId,
				request_id: newRequest.request_id,
				amount: Number(amount),
				status: "paid",
				transaction_id: transactionId,
				payment_date: new Date(),
			},
			select: {
				payment_number: true,
				amount: true,
				status: true,
				transaction_id: true,
				payment_date: true,
			},
		});

		return {
			payment,
			request_number: newRequest.request_number,
		};
	});
};

// ── Fail Payment ──────────────────────────────────────────────────────────────
// Called when the gateway returns a FAILURE response.
// Nothing was written to DB in initiatePayment — nothing to clean up.
export const failPayment = async (_studentId: string) => {
	return {
		message: "Payment failed — no data was saved. You may try again.",
	};
};

// ── Get Payment ───────────────────────────────────────────────────────────────
export const getPayment = async (
	paymentNumber: string,
	userId: string,
	role: string,
) => {
	const payment = await prisma.payment.findUnique({
		where: { payment_number: paymentNumber },
		select: {
			payment_number: true,
			amount: true,
			status: true,
			transaction_id: true,
			payment_date: true,
			created_at: true,
			student: {
				select: {
					student_id: true,
					user: {
						select: { first_name: true, second_name: true, email: true },
					},
				},
			},
			request: {
				select: {
					request_number: true,
					status: true,
					request_type: { select: { name: true, name_ar: true } },
				}
			},
		},
	});

	if (!payment) {
		throw new NotFoundError({
			message: "Payment not found",
			code: "ERR_NF",
			statusCode: 404,
		});
	}

	if (role === "student" && payment.student.student_id !== userId) {
		throw new CustomError({
			message: "Forbidden",
			statusCode: 403,
			code: "ERR_FORBIDDEN",
		});
	}

	return payment;
};

// ── List Payments (staff / admin) ─────────────────────────────────────────────
export const listPayments = async (page: number, limit: number) => {
	const skip = (page - 1) * limit;
	const [payments, total] = await Promise.all([
		prisma.payment.findMany({
			skip,
			take: limit,
			orderBy: { created_at: "desc" },
			select: {
				payment_number: true,
				amount: true,
				status: true,
				transaction_id: true,
				payment_date: true,
				student: {
					select: {
						student_id: true,
						user: { select: { first_name: true, second_name: true } },
					},
				},
				request: {
					select: {
						request_number: true,
						request_type: { select: { name: true } },
					},
				},
			},
		}),
		prisma.payment.count(),
	]);

	return {
		data: payments,
		meta: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	};
};
