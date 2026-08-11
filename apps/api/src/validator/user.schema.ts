import { z } from "zod";
import { Roles } from "../dto/RoleEnum";
import { QualificationType } from "@repo/db";

const roleMap: Record<string, Roles> = {
	student: Roles.student,
	academic_staff: Roles.academic_staff,
	affairs_staff: Roles.affairs_staff,
	admin: Roles.admin,
};

const programMap: Record<string, number> = {
	"Intelligent Systems": 1,
	"Healthcare Informatics and Data Analytics": 2,
	"Business Analytics": 3,
	"Computing and Data Sciences": 4,
	Cybersecurity: 5,
	"Media Analytics": 6,
};

export const userSchema = z
	.object({
		first_name: z.string().min(3).max(50),
		second_name: z.string().min(3).max(50).optional(),
		third_name: z.string().min(3).max(50).optional(),
		fourth_name: z.string().min(3).max(50).optional(),
		email: z.string().email().max(100),

		ssn: z.string().regex(/^\d{14}$/, "SSN must be exactly 14 digits"),

		birth: z.coerce
			.date()
			.max(new Date(), "Birth date cannot be in the future"),

		phone: z.string().regex(/^01[0125]\d{8}$/, "Invalid Egyptian phone number"),

		address: z.string().max(255).optional(),

		role: z.string().transform((val, ctx) => {
			const mapped = roleMap[val];

			if (!mapped) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Invalid role",
				});
				return z.NEVER;
			}

			return mapped;
		}),

		studentData: z
			.object({
				secondary_qualification: z.nativeEnum(QualificationType),
				secondary_grade: z.number().positive(),
				secondary_school: z.string(),
				country: z.string().default("Egypt"),
				secondary_english_grade: z.number().positive(),
				academic_supervisor_id: z.string(),
				program_id: z.string().transform((val, ctx) => {
					const id = programMap[val];

					if (!id) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: "Invalid program",
						});
						return z.NEVER;
					}

					return id;
				}),
			})
			.optional(),

		staffData: z
			.object({
				job_title: z.string(),
				department: z.string().optional(),
				academicData: z
					.object({
						academic_rank: z.string(),
						specialization: z.string(),
						office_location: z.string(),
						office_hours: z.string(),
					})
					.optional(),
			})
			.optional(),
	})
	.superRefine((data, ctx) => {
		const { ssn, birth } = data;

		// ===== SSN validation (keep as is) =====

		const century = ssn[0];
		const year = ssn.slice(1, 3);
		const month = ssn.slice(3, 5);
		const day = ssn.slice(5, 7);

		let fullYear: number;

		if (century === "2") fullYear = 1900 + Number(year);
		else if (century === "3") fullYear = 2000 + Number(year);
		else {
			ctx.addIssue({
				path: ["ssn"],
				message: "Invalid SSN century",
				code: z.ZodIssueCode.custom,
			});
			return;
		}

		const ssnDate = new Date(fullYear, Number(month) - 1, Number(day));

		if (
			ssnDate.getFullYear() !== fullYear ||
			ssnDate.getMonth() !== Number(month) - 1 ||
			ssnDate.getDate() !== Number(day)
		) {
			ctx.addIssue({
				path: ["ssn"],
				message: "Invalid SSN birth date",
				code: z.ZodIssueCode.custom,
			});
			return;
		}

		if (
			ssnDate.getFullYear() !== birth.getFullYear() ||
			ssnDate.getMonth() !== birth.getMonth() ||
			ssnDate.getDate() !== birth.getDate()
		) {
			ctx.addIssue({
				path: ["ssn"],
				message: "SSN does not match birth date",
				code: z.ZodIssueCode.custom,
			});
		}

		// ===== ROLE VALIDATION =====

		const { role, studentData, staffData } = data;
		const academicData = staffData?.academicData;

		if (role === Roles.student && !studentData) {
			ctx.addIssue({
				path: ["studentData"],
				message: "studentData required for student",
				code: z.ZodIssueCode.custom,
			});
		}

		if (role === Roles.academic_staff) {
			if (!staffData) {
				ctx.addIssue({
					path: ["staffData"],
					message: "staffData required for academic staff",
					code: z.ZodIssueCode.custom,
				});
			}

			if (!academicData) {
				ctx.addIssue({
					path: ["staffData", "academicData"],
					message: "academicData required for academic staff",
					code: z.ZodIssueCode.custom,
				});
			}
		}

		if ((role === Roles.affairs_staff || role === Roles.admin) && !staffData) {
			ctx.addIssue({
				path: ["staffData"],
				message: "staffData required for staff",
				code: z.ZodIssueCode.custom,
			});
		}
	});
