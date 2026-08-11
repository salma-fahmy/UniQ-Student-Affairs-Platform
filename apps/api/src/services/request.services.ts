import { prisma } from "@repo/db";
import requestSchema from "../validator/request.schema";
import { z } from "zod";
import NotFoundError from "../error/NotFound.Error";
import CustomError from "../error/CustomError";
import { createNotification } from "./notification.service";
export const getRequestsTypes = async () => {
	return await prisma.requestType.findMany({
		select: {
			name_ar: true,
			is_active: true,
			name: true,
			request_type_id: true,
			processing_days: true,
			price: true,
			code: true,
		},
		where: {
			is_active: true,
		},
	});
};

// get specific request to make the  form of the request.
export const getRequestType = async (reqCode: string) => {
	try {
		const request = await prisma.requestType.findUnique({
			where: {
				code: reqCode,
			},
		});

		if (!request) {
			throw new NotFoundError({
				message: "Request type not found",
				statusCode: 404,
				code: "ERR_NF",
			});
		}

		if (!request.is_active) {
			throw new CustomError({
				message: "This request is not available now",
				statusCode: 503,
				code: "REQUEST_TYPE_DISABLED",
			});
		}

		return request;
	} catch (error) {
		// IMPORTANT: do not swallow errors
		if (error instanceof CustomError) throw error;
		throw new Error("An error happen in get specific Request type . ");
	}
};

export const getRequests = async (
	page: number,
	limit: number,
	user: { userId: string; role: string },
) => {
	try {
		// Check if user exists
		const isExisted = await prisma.user.findUnique({
			where: {
				user_id: user.userId,
			},
		});

		if (!isExisted) {
			throw new NotFoundError({
				message: "user not found",
				statusCode: 400,
				code: "ERR_NF",
			});
		}
		const skip = (page - 1) * limit;

		// Use transaction to ensure RLS setting applies to the query
		const result = await prisma.$transaction(async (tx) => {
			// Set role in the current transaction
			await tx.$executeRaw`
				SELECT set_config('app.role', ${user.role}, true);
			`;

			let typeFilter: Parameters<typeof tx.request.findMany>[0]["where"] =
				user.role === "academic_staff"
					? { request_type: { code: { in: ["CRS_REG", "CRS_WTH"] } } }
					: user.role === "student"
						? { student_id: user.userId }
						: {};

			const [requests, total] = await Promise.all([
				tx.request.findMany({
					where: typeFilter,
					select: {
						request_number: true,
						status: true,
						comments: true,
						description: true,
						created_at: true,
						request_type: {
							select: {
								name: true,
								price: true,
								code: true,
							},
						},
						student: {
							select: {
								student_id: true,
								fees_due: true,
								user: {
									select: {
										first_name: true,
										second_name: true,
									},
								},
							},
						},
					},
					skip,
					take: limit,
					orderBy: {
						created_at: "asc",
					},
				}),
				tx.request.count({ where: typeFilter }),
			]);

			return { requests, total };
		});

		const meta = {
			page,
			limit,
			total: result.total,
			totalPages: Math.ceil(result.total / limit),
		};

		return { data: result.requests, meta };
	} catch (error: any) {
		if (error instanceof CustomError) {
			throw error;
		}
		throw new Error(error.message);
	}
};

// ── Preview Request (NO DB write) ────────────────────────────────────────────
// Returns a preview of the request data so the frontend can show the review
// screen before the student goes to the payment gateway.
// Nothing is saved to the database at this stage.
export const previewRequest = async (data: z.infer<typeof requestSchema>) => {
	// Validate request type exists and is active
	const requestType = await prisma.requestType.findUnique({
		where: { request_type_id: data.requestTypeId || 8 },
		select: {
			code: true,
			name: true,
			name_ar: true,
			price: true,
			processing_days: true,
			is_active: true,
		},
	});

	if (!requestType) {
		throw new NotFoundError({
			message: "Request type not found",
			statusCode: 404,
			code: "ERR_NF",
		});
	}

	if (!requestType.is_active) {
		throw new CustomError({
			message: "This request type is not available now",
			statusCode: 503,
			code: "REQUEST_TYPE_DISABLED",
		});
	}

	const effectivePrice = data.price ?? Number(requestType.price ?? 0);

	// Return preview data — nothing written to DB
	return {
		preview: true,
		student_id: data.studentId,
		request_type: {
			code: requestType.code,
			name: requestType.name,
			name_ar: requestType.name_ar,
			price: effectivePrice,
			processing_days: requestType.processing_days,
		},
		price_at_request: effectivePrice,
		description: data.description,
		body: data.body,
		is_free: effectivePrice === 0,
	};
};

// ── Create Free Request (DB write — free services only) ───────────────────────
// Called ONLY when the service is free (price = 0).
// For paid services, use initiatePayment in payment.service.ts instead.
export const createFreeRequest = async (
	data: z.infer<typeof requestSchema>,
) => {
	return prisma.$transaction(async (tx) => {
		await tx.$executeRaw`
				SELECT set_config('app.role', ${"student"}, true);
			`;

		// Validate request type
		const requestType = await tx.requestType.findUnique({
			where: { request_type_id: data.requestTypeId || 8 },
			select: { code: true, price: true, is_active: true },
		});

		if (!requestType) {
			throw new NotFoundError({
				message: "Request type not found",
				statusCode: 404,
				code: "ERR_NF",
			});
		}

		if (!requestType.is_active) {
			throw new CustomError({
				message: "This request type is not available now",
				statusCode: 503,
				code: "REQUEST_TYPE_DISABLED",
			});
		}

		const effectivePrice = data.price ?? Number(requestType.price ?? 0);

		// Guard: only free services allowed here
		if (effectivePrice > 0) {
			throw new CustomError({
				message: "This service requires payment. Use the payment flow instead.",
				statusCode: 400,
				code: "ERR_PAYMENT_REQUIRED",
			});
		}

		const year = new Date().getFullYear();

		const counter = await tx.requestCounter.upsert({
			where: { year },
			update: { sequence: { increment: 1 } },
			create: { year, sequence: 1 },
		});
		const requestNumber = `REQ-${year}-${String(counter.sequence).padStart(3, "0")}`;

		const doctorApprovalCodes = ["CRS_REG", "CRS_WTH"];
		const initialStatus = "pending";

		return await tx.request.create({
			data: {
				request_number: requestNumber,
				student_id: data.studentId,
				created_at: new Date(),
				description: data.description,
				request_body: data.body,
				attachment_links: data.attachment_links,
				price_at_request: 0,
				request_type_id: data.requestTypeId || 8,
				status: initialStatus,
			},
		});
	});
};

export async function getRequest(userId: string, reqNumber: string) {
	try {
		const user = await prisma.user.findUnique({
			where: {
				user_id: userId,
			},
			select: {
				role: {
					select: {
						role_name: true,
					},
				},
			},
		});

		if (!user) {
			throw new NotFoundError({
				message: "Not found user ",
				code: "ERR_NF",
				statusCode: 404,
			});
		}

		const reqIsExisted = await prisma.request.findUnique({
			where: {
				request_number: reqNumber,
			},
			include: {
				request_type: { select: { code: true } },
			},
		});

		if (!reqIsExisted) {
			throw new NotFoundError({
				message: "Not found Request",
				code: "ERR_NF",
				statusCode: 404,
			});
		}

		if (user.role.role_name === "academic_staff") {
			const allowedCodes = ["CRS_REG", "CRS_WTH"];
			if (!allowedCodes.includes(reqIsExisted.request_type.code)) {
				throw new NotFoundError({
					message: "Not found Request",
					code: "ERR_NF",
					statusCode: 404,
				});
			}
		}

		const request = await prisma.$transaction(async (tx) => {
			await tx.$executeRaw`
				SELECT set_config('app.role', ${user.role.role_name}, true);
			`;

			return await tx.request.findUnique({
				where: {
					request_number: reqNumber,
				},
				select: {
					request_number: true,
					status: true,
					comments: true,
					description: true,
					request_body: true,
					attachment_links: true,
					price_at_request: true,
					created_at: true,
					updated_at: true,
					processed_at: true,
					request_type: {
						select: {
							name: true,
							name_ar: true,
							code: true,
							price: true,
							processing_days: true,
						},
					},
					student: {
						select: {
							student_id: true,
							fees_due: true,
							user: {
								select: {
									first_name: true,
									second_name: true,
									email: true,
									phone: true,
								},
							},
						},
					},
					staff: {
						select: {
							job_title: true,
							user: {
								select: {
									first_name: true,
									second_name: true,
								},
							},
						},
					},
				},
			});
		});

		return request;
	} catch (error: any) {
		if (error instanceof CustomError) {
			throw error;
		}
		throw error.message;
	}
}

// ── Approve Request ───────────────────────────────────────────────────────────
export const approveRequest = async (reqNumber: string, staffId: string) => {
	return prisma.$transaction(async (tx) => {
		await tx.$executeRaw`SET LOCAL "app.role" = 'affairs_staff'`;

		const existing = await tx.request.findUnique({
			where: { request_number: reqNumber },
			include: { request_type: { select: { name: true } } },
		});

		if (!existing) {
			throw new NotFoundError({
				message: "Request not found",
				code: "ERR_NF",
				statusCode: 404,
			});
		}

		const updated = await tx.request.update({
			where: { request_number: reqNumber },
			data: {
				status: "accepted",
				updated_by: staffId,
				updated_at: new Date(),
				processed_at: new Date(),
			},
			select: {
				request_number: true,
				status: true,
				updated_at: true,
				processed_at: true,
				updated_by: true,
				student_id: true,
			},
		});

		await createNotification({
			userId: updated.student_id,
			title: "Request Accepted",
			message: `Your ${existing.request_type?.name ?? "request"} has been accepted.`,
			notificationType: "request_update",
			actionUrl: `/requests/${updated.request_number}`,
		});

		return updated;
	});
};

// ── Reject Request ────────────────────────────────────────────────────────────
export const rejectRequest = async (
	reqNumber: string,
	staffId: string,
	comment: string,
) => {
	return prisma.$transaction(async (tx) => {
		await tx.$executeRaw`SET LOCAL "app.role" = 'affairs_staff'`;

		const existing = await tx.request.findUnique({
			where: { request_number: reqNumber },
			include: { request_type: { select: { name: true } } },
		});

		if (!existing) {
			throw new NotFoundError({
				message: "Request not found",
				code: "ERR_NF",
				statusCode: 404,
			});
		}

		const updated = await tx.request.update({
			where: { request_number: reqNumber },
			data: {
				status: "rejected",
				comments: comment,
				updated_by: staffId,
				updated_at: new Date(),
				processed_at: new Date(),
			},
			select: {
				request_number: true,
				status: true,
				comments: true,
				updated_at: true,
				processed_at: true,
				updated_by: true,
				student_id: true,
			},
		});

		await createNotification({
			userId: updated.student_id,
			title: "Request Rejected",
			message: `Your ${existing.request_type?.name ?? "request"} has been rejected.`,
			notificationType: "request_update",
			actionUrl: `/requests/${updated.request_number}`,
		});

		return updated;
	});
};

// ── Resubmit Request ──────────────────────────────────────────────────────────
// affairs_staff asks student to re-upload a document or fix their data
export const resubmitRequest = async (
	reqNumber: string,
	staffId: string,
	comment: string,
) => {
	return prisma.$transaction(async (tx) => {
		await tx.$executeRaw`SET LOCAL "app.role" = 'affairs_staff'`;

		const existing = await tx.request.findUnique({
			where: { request_number: reqNumber },
			include: { request_type: { select: { name: true } } },
		});

		if (!existing) {
			throw new NotFoundError({
				message: "Request not found",
				code: "ERR_NF",
				statusCode: 404,
			});
		}

		const updated = await tx.request.update({
			where: { request_number: reqNumber },
			data: {
				status: "resubmit",
				comments: comment,
				updated_by: staffId,
				updated_at: new Date(),
			},
			select: {
				request_number: true,
				status: true,
				comments: true,
				updated_at: true,
				updated_by: true,
				student_id: true,
			},
		});

		await createNotification({
			userId: updated.student_id,
			title: "Request Requires Resubmission",
			message: `Your ${existing.request_type?.name ?? "request"} requires resubmission.`,
			notificationType: "request_update",
			actionUrl: `/requests/${updated.request_number}`,
		});

		return updated;
	});
};
