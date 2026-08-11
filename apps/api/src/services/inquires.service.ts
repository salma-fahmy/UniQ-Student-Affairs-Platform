import { prisma } from "@repo/db";
import NotFoundError from "../error/NotFound.Error";
import { z } from "zod";
import { inquirySchema } from "../validator/inquiery.schema";
import CustomError from "../error/CustomError";

export async function getAllInquiries(limit: number = 10, page: number = 1) {
	try {
		const skip = (page - 1) * limit;

		const inquiries = await prisma.contactSubmission.findMany({
			skip,
			take: limit,
			orderBy: {
				created_at: "desc",
			},
		});

		// findMany returns an empty array, not null
		if (inquiries.length === 0) {
			throw new NotFoundError({
				message: "No inquiries found",
				statusCode: 404,
				code: "ERR_NF",
			});
		}

		const total = await prisma.contactSubmission.count();

		return {
			inquiries,
			meta: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
			},
		};
	} catch (error: unknown) {
		if (error instanceof CustomError) {
			throw error; // Re-throw the custom error
		}
		throw new Error("Failed to fetch inquiries");
	}
}

export async function createInquiry(
	inquiryData: z.infer<typeof inquirySchema>,
) {
	try {
		const inquiry = await prisma.contactSubmission.create({
			data: {
				full_name: inquiryData.fullName,
				email: inquiryData.email,
				subject: inquiryData.subject,
				message: inquiryData.message,
				created_at: new Date(),
			},
		});

		return inquiry;
	} catch (error: unknown) {
		if (error instanceof CustomError) {
			throw error;
		}
		throw new Error("Failed to create visitor inquiry");
	}
}

export async function getInquiry(id: number, userId: string) {
	try {
		// Update and retrieve in a single query
		const inquiry = await prisma.contactSubmission.update({
			where: {
				submission_id: id,
			},
			data: {
				is_read: true,
				read_by: userId,
				read_at: new Date(),
			},
			select: {
				submission_id: true,
				full_name: true,
				email: true,
				subject: true,
				message: true,
				is_read: true,
				created_at: true,
				staff: {
					select: {
						user: {
							select: {
								first_name: true,
								second_name: true,
								email: true,
							},
						},
					},
				},
			},
		});

		return inquiry;
	} catch (error: unknown) {
		// Prisma throws P2025 error when record not found
		if (error instanceof Error && "code" in error && error.code === "P2025") {
			throw new NotFoundError({
				message: "Inquiry not found",
				code: "ERR_NF",
				statusCode: 404,
			});
		}

		if (error instanceof CustomError) {
			throw error;
		}

		throw new Error("Failed to retrieve inquiry");
	}
}

export async function deleteInquiry(id: number) {
	try {
		await prisma.contactSubmission.delete({
			where: {
				submission_id: id,
			},
		});
	} catch (error: unknown) {
		if (error instanceof Error && "code" in error && error.code === "P2025") {
			throw new NotFoundError({
				message: "Inquiry not found",
				statusCode: 404,
				code: "ERR_NF",
			});
		}

		if (error instanceof CustomError) {
			throw error;
		}

		throw new Error("Failed to delete inquiry");
	}
}

export async function deleteInquiries() {
	try {
		const result = await prisma.contactSubmission.deleteMany();

		return {
			count: result.count,
			message: `Successfully deleted ${result.count} inquiries`,
		};
	} catch (error: unknown) {
		if (error instanceof CustomError) {
			throw error;
		}
		throw new Error("Failed to delete inquiries");
	}
}
