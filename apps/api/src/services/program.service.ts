import { prisma } from "@repo/db";
import NotFoundError from "../error/NotFound.Error";
export async function getPrograms() {
	try {
		const programs = await prisma.program.findMany({
			select: {
				program_id: true,
				program_name_en: true,
				program_name_ar: true,
				program_type: true,
				tuition_fees: true,
				credit_hour_price: true,
				is_active: true,
			},
		});

		return programs;
	} catch (error) {
		throw new Error("An error in get programs info from DB");
	}
}

export async function getProgramDetails(programId: number) {
	try {
		const program = await prisma.program.findUnique({
			where: {
				program_id: programId,
			},
		});

		return program;
	} catch (error) {
		throw new NotFoundError({
			message: "Not found Program",
			code: "ERR_NF",
			statusCode: 404,
		});
	}
}
export async function getProgramsWithStudentCounts() {
	try {
		const programsWithCounts = await prisma.program.findMany({
			select: {
				program_id: true,
				program_name_en: true,
				program_name_ar: true,
				_count: {
					select: {
						student: true,
					},
				},
			},
			orderBy: {
				program_id: "asc",
			},
		});

		return programsWithCounts.map((program) => ({
			program_id: program.program_id,
			program_name_en: program.program_name_en,
			program_name_ar: program.program_name_ar,
			student_count: program._count.student,
		}));
	} catch (error) {
		console.error("Error fetching programs with student counts:", error);
		throw error;
	}
}
