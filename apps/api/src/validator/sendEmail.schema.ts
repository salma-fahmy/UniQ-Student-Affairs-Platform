import { z } from "zod";
import { EmailTemplateType } from "../templates/email/EmailTemplateEnum";

export const sendEmailSchema = z.object({
  template: z.enum(EmailTemplateType),

  to: z.string().max(100).email({ message: "Invalid email format" }),

  subject: z.string().min(3, "Subject is too short").max(150),

  data: z.object({
    role: z.enum(["student", "visitor"]),

    studentId: z.string().optional(), 

    message: z.string().min(5, "Message is too short").max(500),

    title: z.string().min(3).max(100),

    notificationType: z.enum([
      "request_update",
      "payment",
      "complaint",
      "course_update",
      "system",
      "announcement",
    ]),
  }).superRefine((data, ctx) => {
    if (data.role === "student" && !data.studentId) {
      ctx.addIssue({
        path: ["studentId"],
        code: "custom",
        message: "studentId is required for students",
      });
    }

    if (
      data.studentId &&
      !/^[0-9]{8,}$/.test(data.studentId)
    ) {
      ctx.addIssue({
        path: ["studentId"],
        code: "custom",
        message: "Enter valid student number",
      });
    }
  }),
});