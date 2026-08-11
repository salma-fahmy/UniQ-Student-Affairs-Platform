import { prisma } from "@repo/db";
import NotFoundError from "../error/NotFound.Error";
import CustomError from "../error/CustomError";
import httpStatus from "../utils/httpStatus";

export const getStudentComplaints = async (student: string) => {
	return prisma.complaint.findMany({
		where: { student_id: student },
		select: {
			complaint_id: true,
			complaint_number: true,
			complaint_text: true,
			complaint_type: true,
			created_at: true,
			status: true,
			resolution_text: true,
			resolved_at: true,
		},
		orderBy: {
			created_at: "desc",
		},
	});
};

export const getStudentComplaint = async (
	student: string,
	complaintId: string,
) => {
	const complaint = await prisma.complaint.findFirst({
		where: {
			student_id: student,
			complaint_number: complaintId,
		},
		select: {
			complaint_number: true,
			complaint_text: true,
			complaint_type: true,
			created_at: true,
			status: true,
			resolution_text: true,
			resolved_at: true,
		},
	});

	if (!complaint) {
		throw new NotFoundError({
			message: "Complaint not found",
			code: "ERR_NF",
			statusCode: 404,
		});
	}

	return {
		...complaint,
		resolution_text: complaint.resolution_text ?? "No resolution yet",
		resolved_at: complaint.resolved_at ?? null,
	};
};

export const getStudentRequest = async (student: string, requestId: string) => {
	const request = await prisma.request.findUnique({
		where: {
			student_id: student,
			request_number: requestId,
		},
		select: {
			request_number: true,
			comments: true,
			status: true,
			description: true,
			created_at: true,
			updated_by: true,
			price_at_request: true,
			processed_at: true,
			request_body: true,
			attachment_links:true,
			request_type: {
				select: {
					name: true,
					name_ar: true,
				},
			},
		},
	});

	if (!request) {
		throw new NotFoundError({
			message: "Request not found",
			code: "ERR_NF",
			statusCode: 404,
		});
	}

	return request;
};

export const getStudentRequests = async (student: string) => {
	return await prisma.request.findMany({
		where: { student_id: student },
		select: {
			request_number: true,
			comments: true,
			status: true,
			description: true,
			created_at: true,
			updated_by: true,
			price_at_request: true,
			processed_at: true,
			request_type: { select: { name: true, name_ar: true } },
			student: {
				select: {
					program: { select: { program_name_en: true } },
				},
			},
		},
		orderBy: {
			created_at: "desc",
		},
	});
};

export const getStudentOperationsSummary = async (student: string) => {
	const [complaintsCount, paymentsCount, requestsCount] = await Promise.all([
		prisma.complaint.count({ where: { student_id: student } }),
		prisma.payment.count({ where: { student_id: student } }),
		prisma.request.count({ where: { student_id: student } }),
	]);

	return { complaintsCount, paymentsCount, requestsCount };
};

export const getStudentPayments = async (student: string) => {
	const payments = await prisma.payment.findMany({
		where: { student_id: student },
		select: {
			payment_number: true,
			status: true,
			amount: true,
			payment_date: true,
			request: {
				select: {
					description: true,
					request_type: { select: { name: true } },
				},
			},
		},
		orderBy: {
			created_at: "desc",
		},
	});

	return payments;
};

export const getStudentPaymentsSummary = async (studentId: string) => {
	const [totalAmountPaid, failuresCoursesCount] = await Promise.all([
		prisma.payment.aggregate({
			where: { student_id: studentId },
			_sum: { amount: true },
		}),
		prisma.studentCourse.count({
			where: {
				student_id: studentId,
				grade: {
					in: ["F", "FW", "F_fail", "W", "Abs"],
				},
			},
		}),
	]);

	const totalFailureDues = failuresCoursesCount * 100;

	return {
		totalAmountPaid: totalAmountPaid._sum.amount ?? 0,
		totalFailureDues,
		failuresCoursesCount,
	};
};

export const getStudentFailedCourses = async (studentId: string) => {
	return await prisma.studentCourse.findMany({
		where: {
			student_id: studentId,
			grade: {
				in: ["F", "F_fail", "Abs"],
			},
		},
		select: {
			academic_semester: {
				select: {
					academic_year: true,
					semester_name: true,
				},
			},
			course: {
				select: {
					course_code: true,
					course_name_en: true,
					credit_hours: true,
				},
			},
		},
		orderBy: {
			created_at: "desc",
		},
	});
};

export const getStudentStudyInfo = async (studentId: string) => {
	try {
		const courses = await prisma.studentCourse.findMany({
			where: {
				student_id: studentId,
				status: {
					in: ["completed", "failed"],
				},
				grade: {
					notIn: ["W", "I", "IP", "MW", "S", "AU", "FW", "U"],
				},
			},
			select: {
				course_id: true,
				grade: true,
				status: true,
				semester_id: true,
				course: {
					select: {
						credit_hours: true,
					},
				},
			},
			orderBy: {
				created_at: "desc",
			},
		});

		// map to get the latest records for courses that are updated,
		// to make sure the latest degree for course is taken .

		const latestMap = new Map<number, (typeof courses)[0]>();

		for (const c of courses) {
			if (!latestMap.has(c.course_id)) {
				latestMap.set(c.course_id, c);
			}
		}
		const latestCourses = Array.from(latestMap.values());

		const completedHours = latestCourses.reduce(
			(sum, c) => sum + (c.course.credit_hours ?? 0),
			0,
		);
		const totalPoints = latestCourses.reduce((sum, c) => {
			const credit = c.course.credit_hours ?? 0;
			const grade = c.grade ?? "F";

			const gradePoints = getGradePointFromLetter(grade);

			return sum + credit * gradePoints;
		}, 0);

		const cgpa = completedHours === 0 ? 0 : totalPoints / completedHours;

		const level =
			completedHours <= 28
				? 1
				: completedHours <= 64
					? 2
					: completedHours <= 98
						? 3
						: completedHours <= 140
							? 4
							: 5;

		const registeredCourses = await prisma.studentCourse.findMany({
			where: {
				student_id: studentId,
				status: "enrolled",
				academic_semester: {
					is_current: true,
				},
			},
			select: {
				course: {
					select: {
						credit_hours: true,
					},
				},
			},
		});

		const totalRegisteredHours = registeredCourses.reduce(
			(sum, c) => sum + (c.course.credit_hours ?? 0),
			0,
		);

		return {
			completedHours,
			level,
			cgpa: Number(cgpa.toFixed(4)),
			totalRegisteredHours,
		};
	} catch (error) {
		throw new CustomError({
			message: "An error happened while calculating student study info",
			code: httpStatus.ERROR,
			statusCode: 500,
		});
	}
};
// Convert letter grades to grade points
const getGradePointFromLetter = (grade: string): number => {
	const gradeMap: Record<string, number> = {
		A: 4.0,
		A_MINUS: 3.666,
		B_PLUS: 3.333,
		B: 3.0,
		B_MINUS: 2.666,
		C_PLUS: 2.333,
		C: 2.0,
		C_MINUS: 1.666,
		D_PLUS: 1.333,
		D: 1.0,
		F: 0.0,
		F_FAIL: 0.0,
	};

	// Normalize the grade (trim whitespace, convert to uppercase)
	const normalizedGrade = grade.trim().toUpperCase();

	return gradeMap[normalizedGrade] ?? 0.0; // Default to 0 if grade not found
};
