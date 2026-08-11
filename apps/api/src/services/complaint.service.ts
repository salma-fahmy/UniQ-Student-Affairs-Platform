import { prisma } from "@repo/db";
import { complaintSchema } from "../validator/complaint.schema";
import { z } from "zod";
import NotFoundError from "../error/NotFound.Error";
import AuthenticationError from "../error/AuthenticationError";
import { getStudentStudyInfo } from "./student.service";
import { createNotification } from "./notification.service";

// ── Complaint type human-readable labels ─────────────────────────────────────
const complaintTypeLabel: Record<string, string> = {
	financial: "Financial Complaint",
	academic: "Academic Complaint",
	administrative: "Administrative Complaint",
	doctor_complaint: "Doctor Complaint",
};

const getComplaintTypeLabel = (type: string | null | undefined): string => {
	if (!type) return "Complaint";
	return complaintTypeLabel[type.toLowerCase()] ?? type;
};

export async function getAllComplaints(
	page = 1,
	limit = 10,
	role: string,
	userId: string,
) {
	const skip = (page - 1) * limit;

	// ── RLS: build the where clause based on caller's role ──────────────────
	let where: Parameters<typeof prisma.complaint.findMany>[0]["where"] = {};

	if (role === "student") {
		// Students see only their own complaints
		const student = await prisma.student.findUnique({
			where: { student_id: userId },
			select: { student_id: true },
		});
		where = { student_id: student?.student_id };
	} else if (role === "affairs_staff") {
		// Affairs staff see everything EXCEPT doctor_complaint
		where = { complaint_type: { not: "doctor_complaint" } };
	}
	// admin → no filter (sees everything)

	const [complaints, total] = await Promise.all([
		prisma.complaint.findMany({
			where,
			skip,
			take: limit,
			orderBy: { created_at: "desc" },
		}),
		prisma.complaint.count({ where }),
	]);

	return {
		data: complaints,
		meta: {
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		},
	};
}

export async function getComplaint(
	complaintNumber: string,
	userId: string,
	role: string,
) {
	return prisma.$transaction(async (tx) => {
		const complaint = await tx.complaint.findUnique({
			where: { complaint_number: complaintNumber },
		});

		if (!complaint) {
			throw new NotFoundError({
				message: "Complaint not found",
				code: "ERR_NF",
				statusCode: 404,
			});
		}

		// ── RLS: role-based access ────────────────────────────────────────────

		if (role === "student") {
			// Student can only view their own complaints
			const student = await tx.student.findUnique({
				where: { student_id: userId },
				select: { student_id: true },
			});
			if (!student || complaint.student_id !== student.student_id) {
				throw new AuthenticationError({
					message: "forbidden: you can only view your own complaints",
					statusCode: 403,
					code: "ERR_VALID",
				});
			}
			// Students get a read-only view — no status mutation
			return complaint;
		}

		if (role === "affairs_staff") {
			// Affairs staff cannot open doctor_complaint
			if (complaint.complaint_type === "doctor_complaint") {
				throw new AuthenticationError({
					message: "forbidden: affairs staff cannot access doctor complaints",
					statusCode: 403,
					code: "ERR_VALID",
				});
			}

			// Mark as in_progress only if not already resolved
			if (complaint.status === "accepted" || complaint.status === "rejected") {
				return complaint;
			}

			return tx.complaint.update({
				where: { complaint_number: complaintNumber },
				data: {
					status: "in_progress",
					handled_by: userId,
				},
				select: {
					complaint_number: true,
					complaint_type: true,
					priority: true,
					resolution_text: true,
					complaint_text: true,
					created_at: true,
					resolved_at: true,
					status: true,
					staff: {
						select: {
							job_title: true,
							user: {
								select: {
									first_name: true,
									second_name: true,
									third_name: true,
									email: true,
								},
							},
						},
					},
				},
			});
		}

		// admin → full access, no mutation needed
		return complaint;
	});
}

export const getStudentComplaint = async (complaintNumber: string) => {
	const student = await prisma.complaint.findUnique({
		where: {
			complaint_number: complaintNumber,
		},
		select: {
			student: {
				select: {
					academic_semester: {
						select: {
							semester_name: true,
						},
						where: {
							is_current: true,
						},
					},
					student_id: true,
					program: {
						select: {
							program_name_ar: true,
						},
					},
					fees_due: true,
					user: {
						select: {
							first_name: true,
							second_name: true,
							is_active: true,
							phone: true,
							email: true,
						},
					},
				},
			},
		},
	});

	const studentMeta = await getStudentStudyInfo(
		student?.student?.student_id as string,
	);

	return { ...student, ...studentMeta };
};

// ── Approve ──────────────────────────────────────────────────────────────────
// affairs_staff → non-doctor complaints only | admin → all complaints
export const approveComplaint = async (
	complaintNumber: string,
	staffId: string,
	resolutionText: string,
	role: string,
) => {
	const complaint = await prisma.complaint.findUnique({
		where: { complaint_number: complaintNumber },
	});

	if (!complaint) {
		throw new NotFoundError({
			message: "Complaint not found",
			code: "ERR_NF",
			statusCode: 404,
		});
	}

	// Affairs staff cannot act on doctor_complaint
	if (role === "affairs_staff" && complaint.complaint_type === "doctor_complaint") {
		throw new AuthenticationError({
			message: "forbidden: affairs staff cannot manage doctor complaints",
			statusCode: 403,
			code: "ERR_VALID",
		});
	}

	if (complaint.status === "accepted" || complaint.status === "rejected") {
		throw new Error("Complaint is already resolved");
	}

	const updated = await prisma.complaint.update({
		where: { complaint_number: complaintNumber },
		data: {
			status: "accepted",
			resolution_text: resolutionText,
			resolved_at: new Date(),
			handled_by: staffId,
		},
		select: {
			complaint_number: true,
			complaint_type: true,
			status: true,
			resolution_text: true,
			resolved_at: true,
			handled_by: true,
		},
	});

	await createNotification({
		userId: complaint.student_id as string,
		title: "Complaint Accepted",
		message: `Your ${getComplaintTypeLabel(complaint.complaint_type)} has been accepted.`,
		notificationType: "complaint",
		actionUrl: `/complaints/${complaint.complaint_number}`,
	});

	return updated;
};

// ── Reject ───────────────────────────────────────────────────────────────────
// affairs_staff → non-doctor complaints only | admin → all complaints
export const rejectComplaint = async (
	complaintNumber: string,
	staffId: string,
	resolutionText: string,
	role: string,
) => {
	const complaint = await prisma.complaint.findUnique({
		where: { complaint_number: complaintNumber },
	});

	if (!complaint) {
		throw new NotFoundError({
			message: "Complaint not found",
			code: "ERR_NF",
			statusCode: 404,
		});
	}

	// Affairs staff cannot act on doctor_complaint
	if (role === "affairs_staff" && complaint.complaint_type === "doctor_complaint") {
		throw new AuthenticationError({
			message: "forbidden: affairs staff cannot manage doctor complaints",
			statusCode: 403,
			code: "ERR_VALID",
		});
	}

	if (complaint.status === "accepted" || complaint.status === "rejected") {
		throw new Error("Complaint is already resolved");
	}

	const updated = await prisma.complaint.update({
		where: { complaint_number: complaintNumber },
		data: {
			status: "rejected",
			resolution_text: resolutionText,
			resolved_at: new Date(),
			handled_by: staffId,
		},
		select: {
			complaint_number: true,
			complaint_type: true,
			status: true,
			resolution_text: true,
			resolved_at: true,
			handled_by: true,
		},
	});

	await createNotification({
		userId: complaint.student_id as string,
		title: "Complaint Rejected",
		message: `Your ${getComplaintTypeLabel(complaint.complaint_type)} has been rejected.`,
		notificationType: "complaint",
		actionUrl: `/complaints/${complaint.complaint_number}`,
	});

	return updated;
};

export const createComplaint = async (
	complaint: z.infer<typeof complaintSchema>,
) => {
	return await prisma.$transaction(async (tx) => {
		const year = new Date().getFullYear();

		const counter = await tx.complaintCounter.upsert({
			where: { year },
			update: { sequence: { increment: 1 } },
			create: { year, sequence: 1 },
		});

		const complaintNumber = `CMP-${year}-${String(counter.sequence).padStart(3, "0")}`;

		const student = await tx.student.findUnique({
			where: {
				student_id: complaint.studentId,
			},
		});

		if (!student) {
			throw new NotFoundError({
				message: "Not Found Student !",
				code: "ERR_NF",
				statusCode: 404,
			});
		}

		return await tx.complaint.create({
			data: {
				complaint_number: complaintNumber,
				student_id: complaint.studentId,
				status: "open",
				complaint_text: complaint.complaintText,
				complaint_type: complaint.complaintType,
				priority: complaint.priority || "low",
				created_at: new Date(),
			},
			select: {
				complaint_number: true,
				complaint_text: true,
				complaint_type: true,
				status: true,
				created_at: true,
				student_id: true,
			},
		});
	});
};