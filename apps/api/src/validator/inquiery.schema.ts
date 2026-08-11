import { z } from "zod";
export const inquirySchema = z.object({
	fullName: z
		.string()
		.trim()
		.min(3, "Name must be at least 3 characters")
		.max(50, "Name must not exceed 50 characters")
		.refine(
			(name) => /^[a-zA-Z\s'-]+$/.test(name),
			"Name contains invalid characters",
		),
	email: z
		.string()
		.trim()
		.max(100, "Email must not exceed 100 characters")
		.email("Invalid Email")
		.transform((email) => email.toLowerCase()),
	subject: z
		.string()
		.trim()
		.min(5, "Subject must be at least 5 characters")
		.max(100, "Subject must not exceed 100 characters")
		.refine(
			(subject) => !/<[^>]*>/.test(subject),
			"Subject cannot contain HTML tags",
		),
	message: z
		.string()
		.trim()
		.min(20, "Message must be at least 20 characters")
		.max(500, "Message must not exceed 500 characters")
		.refine((msg) => !/<[^>]*>/.test(msg), "Message cannot contain HTML tags"),
});
