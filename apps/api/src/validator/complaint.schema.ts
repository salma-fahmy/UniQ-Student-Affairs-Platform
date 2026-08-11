import { z } from "zod";

export const COMPLAINT_TYPES = ["financial", "academic", "administrative", "doctor_complaint"] as const;

export const complaintSchema = z.object({
	studentId: z.string(),
	complaintType: z.enum(COMPLAINT_TYPES, {
		errorMap: () => ({
			message: `Invalid complaint type. Allowed types are: ${COMPLAINT_TYPES.join(", ")}`,
		}),
	}),
	complaintText: z.string().min(15).max(500),
	attachment: z.string().optional(),
	priority: z.enum(["low", "medium", "high"]).optional(),
});