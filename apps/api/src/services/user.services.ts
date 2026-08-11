import { prisma } from "@repo/db";
import AuthenticationError from "../error/AuthenticationError";
import { Roles } from "../dto/RoleEnum";
import z from "zod";
import { userSchema } from "../validator/user.schema";
import bcrypt from "bcrypt";
import CustomError from "../error/CustomError";
import BadRequestError from "../error/BadRequestError";
import { safeEmailJob } from "../utils/safeEmailJob";
import { emailTemplate } from "../templates/email/template";
import { EmailTemplateType } from "../templates/email/EmailTemplateEnum";

export const updateUserProfilePhotoUrl = async (
	user_id: string,
	profilePhoto: string,
	publicId: string,
) => {
	try {
		await prisma.user.update({
			where: {
				user_id,
			},
			data: {
				photo_url: profilePhoto,
				public_photo_cloud_id: publicId,
			},
		});
	} catch (error) {
		throw new Error("An error in updating photo url");
	}
};

export const getUserById = async (user_id: string) => {
	try {
		return await prisma.user.findUnique({
			where: {
				user_id,
			},
		});
	} catch (error) {
		throw new AuthenticationError({
			message: "user not found",
			code: "ERR_NF",
			statusCode: 404,
		});
	}
};

export const getUserDataById = async (userId: string, role: string) => {
	const roleId = Roles[role as keyof typeof Roles];

	const user = await prisma.user.findUnique({
		where: {
			user_id: userId,
			role_id: roleId,
		},
		select: {
			user_id: true,
			email: true,
			ssn: true,
			first_name: true,
			second_name: true,
			third_name: true,
			fourth_name: true,
			photo_url: true,
			last_login: true,
			phone: true,
			birth: true,
			is_active: true,

			...(role === "student"
				? {
						student: {
							select: {
								status: true,
								fees_due: true,
								secondary_school: true,
								country: true,
								secondary_qualification: true,
								program: {
									select: {
										program_name_en: true,
										program_name_ar: true,
									},
								},
								academic_semester: {
									select: {
										semester_name: true,
										academic_year: true,
									},
									where: {
										is_current: true,
									},
								},
							},
						},
					}
				: {
						staff: true,
					}),
		},
	});

	return user;
};

export const getUserNotification = async (
	userId: string,
	notificationId: number,
) => {
	const notification = await prisma.notification.update({
		where: {
			user_id: userId,
			notification_id: notificationId,
		},
		select: {
			notification_id: true,
			created_at: true,
			is_read: true,
			title: true,
			notification_type: true,
			action_url: true,
			message: true,
		},
		data: {
			is_read: true,
		},
	});

	return notification;
};

export const getUserNotifications = async (userId: string) => {
	const notifications = await prisma.notification.findMany({
		where: {
			user_id: userId,
		},
		select: {
			notification_id: true,
			created_at: true,
			is_read: true,
			title: true,
			notification_type: true,
			action_url: true,
			message: true,
		},
		orderBy: {
			created_at: "desc",
		},
	});

	return notifications;
};

export async function createUser(data: z.infer<typeof userSchema>) {
	let result: any;
	try {
		let user: any;
		result = await prisma.$transaction(async (tx) => {
			const existingUser = await tx.user.findFirst({
				where: {
					OR: [{ ssn: data.ssn }, { email: data.email }, { phone: data.phone }],
				},
			});

			if (existingUser) {
				if (existingUser.ssn === data.ssn) {
					throw new BadRequestError({
						message: "SSN already exists",
						statusCode: 400,
						code: "ERR_BAD_REQUEST",
					});
				}

				if (existingUser.email === data.email) {
					throw new BadRequestError({
						message: "Email already exists",
						statusCode: 400,
						code: "ERR_BAD_REQUEST",
					});
				}

				if (existingUser.phone === data.phone) {
					throw new BadRequestError({
						message: "Phone already exists",
						statusCode: 400,
					});
				}
			}
			const year = new Date().getFullYear();
			const month = String(data.birth.getMonth() + 1).padStart(1, "0");
			const day = String(data.birth.getDate()).padStart(1, "0");
			const birthDataNumber = `${month}${day}`;

			if (data.role === Roles.student) {
				const counter = await tx.studentCounter.upsert({
					where: {
						year,
					},
					update: {
						sequence: { increment: 1 },
					},
					create: {
						year,
						sequence: 1,
					},
				});

				// make UserId that insert in  the user table and student table refers to as FK
				const studentId = `${year}${birthDataNumber}${String(counter.sequence).padStart(3, "0")}`;

				user = await insertUser(tx, data, studentId);

				if (!user) {
					throw new CustomError({
						message: "Can't insert user in User table",
						statusCode: 500,
						code: "SERVER_ERR",
					});
				}

				const { studentData } = data;

				if (!studentData) {
					throw new BadRequestError({
						message: "Not Found Student data to create a Student",
						code: "ERR_BAD_REQUEST",
						statusCode: 400,
					});
				}

				const currentSemester = await tx.academicSemester.findFirst({
					where: {
						is_current: true,
					},
					select: {
						semester_id: true,
					},
				});

				const student = await tx.student.create({
					data: {
						student_id: user.user_id,
						country: studentData?.country || "Egypt",
						program_id: studentData?.program_id,
						secondary_qualification: studentData?.secondary_qualification,
						secondary_school: studentData.secondary_school,
						secondary_grade: studentData.secondary_grade,
						secondary_english_grade: studentData.secondary_english_grade,
						current_semester_id: currentSemester?.semester_id,
						enrollment_date: new Date(),
						academic_staff_id: studentData.academic_supervisor_id,
						status: "active",
					},
				});

				if (!student) {
					throw new CustomError({
						message: "Can't create the Student  account.",
						code: "ERR_SERVER",
						statusCode: 500,
					});
				}

				return {
					message: "Student is created successfully",
					welcomeData: {
						first_name: user.first_name,
						second_name: user.second_name,
						third_name: user.third_name,
						fourth_name: user.fourth_name,
						user_id: user.user_id,
						email: user.email,
					},
				};
			} else if (data.role === Roles.affairs_staff) {
				const { staffData } = data;

				if (!staffData) {
					throw new BadRequestError({
						message: "staffData is required",
						statusCode: 400,
					});
				}

				const userId = await generateUserId(tx, data);

				user = await insertUser(tx, data, userId);

				await insertStaff(tx, staffData, user.user_id);

				return {
					message: "Affairs staff created successfully",
					welcomeData: {
						first_name: user.first_name,
						second_name: user.second_name,
						third_name: user.third_name,
						fourth_name: user.fourth_name,
						user_id: user.user_id,
						email: user.email,
					},
				};
			} else if (data.role === Roles.academic_staff) {
				const { staffData } = data;

				if (!staffData || !staffData.academicData) {
					throw new BadRequestError({
						message: "staffData + academicData required",
						statusCode: 400,
					});
				}

				const counter = await tx.userCounter.upsert({
					where: { year },
					update: { sequence: { increment: 1 } },
					create: { year, sequence: 1 },
				});

				const userId = `${data.first_name}-${data.birth.getFullYear()}-${String(counter.sequence).padStart(3, "0")}`;

				user = await insertUser(tx, data, userId);

				await insertStaff(tx, staffData, user.user_id);

				await tx.academicStaff.create({
					data: {
						staff_id: user.user_id,
						academic_rank: staffData.academicData.academic_rank,
						specialization: staffData.academicData.specialization,
						office_location: staffData.academicData.office_location,
						office_hours: staffData.academicData.office_hours,
					},
				});

				return {
					message: "Academic staff created successfully",

					welcomeData: {
						first_name: user.first_name,
						second_name: user.second_name,
						third_name: user.third_name,
						fourth_name: user.fourth_name,
						user_id: user.user_id,
						email: user.email,
					},
				};
			} else if (data.role === Roles.admin) {
				const { staffData } = data;

				if (!staffData) {
					throw new BadRequestError({
						message: "staffData is required",
						statusCode: 400,
					});
				}

				const userId = await generateUserId(tx, data);

				// insert in user table

				user = await insertUser(tx, data, userId);

				// insert in Staff table
				await insertStaff(tx, staffData, user.user_id);

				return {
					message: "Admin staff created successfully",
					welcomeData: {
						first_name: user.first_name,
						second_name: user.second_name,
						third_name: user.third_name,
						fourth_name: user.fourth_name,
						user_id: user.user_id,
						email: user.email,
					},
				};
			}
			throw new BadRequestError({
				message: "Not matched Role to create  a user",
				statusCode: 400,
				code: "ERR_BAD_REQUEST",
			});
		});

		await welcomeEmail(result.welcomeData);

		return result.message;
	} catch (error: any) {
		if (error instanceof CustomError) {
			throw error;
		}

		throw new Error("An error happened in Creation user");
	}
}

async function insertUser(tx: any, data: any, userId: string) {
	const password = await bcrypt.hash(data.ssn, 10);
	return await tx.user.create({
		data: {
			user_id: userId,
			first_name: data.first_name,
			second_name: data.second_name,
			third_name: data.third_name,
			fourth_name: data.fourth_name,
			email: data.email,
			phone: data.phone,
			ssn: data.ssn,
			is_active: true,
			birth: data.birth,
			role_id: data.role,
			password,
			address: data.address,
		},
	});
}

async function insertStaff(tx: any, staffData: any, userId: string) {
	return await tx.staff.create({
		data: {
			staff_id: userId,
			job_title: staffData.job_title,
			department: staffData.department,
			hire_date: new Date(),
		},
	});
}

async function generateUserId(tx: any, data: any) {
	const year = new Date().getFullYear();

	const counter = await tx.userCounter.upsert({
		where: {
			year,
		},
		update: {
			sequence: { increment: 1 },
		},
		create: {
			year,
			sequence: 1,
		},
	});

	return `${data.first_name}-${data.second_name}-${data.birth.getFullYear()}-${String(counter.sequence).padStart(3, "4")}`;
}

async function welcomeEmail(welcomeData: any) {
	const html = emailTemplate(EmailTemplateType.NEW_USER_REGISTER, welcomeData);
	// send email
	await safeEmailJob({
		to: welcomeData.email,
		subject: "A new User register",
		html,
	});
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — List all users (paginated, optional role filter)
// ─────────────────────────────────────────────────────────────────────────────
export const getAllUsers = async (
	page: number,
	limit: number,
	roleFilter?: number,
) => {
	const skip = (page - 1) * limit;

	const where = roleFilter ? { role_id: roleFilter } : {};

	const [users, total] = await Promise.all([
		prisma.user.findMany({
			where,
			select: {
				user_id: true,
				first_name: true,
				second_name: true,
				third_name: true,
				fourth_name: true,
				email: true,
				phone: true,
				ssn: true,
				birth: true,
				address: true,
				is_active: true,
				last_login: true,
				photo_url: true,
				created_at: true,
				role: { select: { role_name: true } },
				student: {
					select: {
						status: true,
						fees_due: true,
						program: { select: { program_name_en: true } },
					},
				},
				staff: {
					select: {
						job_title: true,
						department: true,
					},
				},
			},
			orderBy: { created_at: "desc" },
			skip,
			take: limit,
		}),
		prisma.user.count({ where }),
	]);

	return {
		data: users,
		meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
	};
};

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — Get single user detail by userId
// ─────────────────────────────────────────────────────────────────────────────
export const getUserDetailById = async (userId: string) => {
	const user = await prisma.user.findUnique({
		where: { user_id: userId },
		select: {
			user_id: true,
			first_name: true,
			second_name: true,
			third_name: true,
			fourth_name: true,
			email: true,
			phone: true,
			ssn: true,
			birth: true,
			address: true,
			is_active: true,
			last_login: true,
			photo_url: true,
			created_at: true,
			updated_at: true,
			role: { select: { role_name: true } },
			student: {
				select: {
					status: true,
					fees_due: true,
					enrollment_date: true,
					country: true,
					secondary_qualification: true,
					secondary_school: true,
					secondary_grade: true,
					program: {
						select: { program_name_en: true, program_name_ar: true },
					},
					academic_staff: {
						select: {
							staff: { select: { user: { select: { first_name: true, second_name: true } } } },
						},
					},
				},
			},
			staff: {
				select: {
					job_title: true,
					department: true,
					hire_date: true,
					academic_staff: {
						select: {
							academic_rank: true,
							specialization: true,
							office_location: true,
							office_hours: true,
						},
					},
				},
			},
		},
	});

	return user;
};

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — Update user core fields (no password, no role change)
// Editable: first_name, second_name, third_name, fourth_name,
//           email, phone, address, birth, is_active
// ─────────────────────────────────────────────────────────────────────────────
export const adminUpdateUser = async (
	userId: string,
	data: {
		first_name?: string;
		second_name?: string;
		third_name?: string;
		fourth_name?: string;
		email?: string;
		phone?: string;
		address?: string;
		birth?: Date;
		is_active?: boolean;
		photo_url?: string;
		public_photo_cloud_id?: string;
	},
) => {
	// Check uniqueness for email and phone before update
	if (data.email) {
		const conflict = await prisma.user.findFirst({
			where: { email: data.email, NOT: { user_id: userId } },
			select: { user_id: true },
		});
		if (conflict) {
			throw new BadRequestError({
				message: "Email already in use by another user",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}
	}

	if (data.phone) {
		const conflict = await prisma.user.findFirst({
			where: { phone: data.phone, NOT: { user_id: userId } },
			select: { user_id: true },
		});
		if (conflict) {
			throw new BadRequestError({
				message: "Phone already in use by another user",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}
	}

	return await prisma.user.update({
		where: { user_id: userId },
		data,
		select: {
			user_id: true,
			first_name: true,
			second_name: true,
			third_name: true,
			fourth_name: true,
			email: true,
			phone: true,
			address: true,
			birth: true,
			is_active: true,
			photo_url: true,
			public_photo_cloud_id: true,
			updated_at: true,
			role: { select: { role_name: true } },
		},
	});
};