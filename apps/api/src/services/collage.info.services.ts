import { prisma } from "@repo/db";
import NotFoundError from "../error/NotFound.Error";
export async function getCollageInfo() {
	try {
		const collageInfo = await prisma.collegeInfo.findFirst();
		return collageInfo;
	} catch (error) {
		throw new NotFoundError({
			message: "NOt found Collage Info",
			code: "ERR_NF",
			statusCode: 404,
		});
	}
}

export async function getCollageStats() {
	try {
		const [studentNumber, facultyNumber, facultyServices] = await Promise.all([
			prisma.student.count({
				where: {
					status: "active",
				},
			}),
			prisma.academicStaff.count(),
			prisma.requestType.count({
				where: {
					is_active: true,
				},
			}),
		]);

		return { studentNumber, facultyNumber, facultyServices };
	} catch (error) {
		throw new Error("Error in fetching Collage stats .");
	}
}
