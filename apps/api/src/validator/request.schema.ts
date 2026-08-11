import { z } from "zod";

const requestSchema = z.object({
	studentId: z.string(),
	body: z.record(z.string(), z.any()), // flexible JSON object
	// price can be 0 for free services
	price: z.number().nonnegative(),
	requestTypeId: z.number().positive(),
	attachment_links: z.array(z.string()).optional(),
	description: z
		.string()
		.min(20)
		.max(500)
		.optional()
		.default("No description !"),
});

export default requestSchema;
