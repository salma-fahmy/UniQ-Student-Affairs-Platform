// apps/api/src/routes/chatbot/chatbot.route.ts

import { Router, type Request, type Response } from "express";
import { prisma } from "@repo/db";
import { optionalAuth } from "../../middlewares/optional-auth.js";
import { ipRateLimiter } from "../../middlewares/ip-rate-limiter.js";

const chatbotRouter = Router();

const CHATBOT_URL = process.env.CHATBOT_URL ?? "http://chatbot:7860";

// ─── Cache for courses catalog  ──────────
let coursesCatalogCache: Record<string, unknown> | null = null;
let catalogCachedAt = 0;
const CATALOG_TTL_MS = 60 * 60 * 1000; // 1 hour

async function getCoursesCatalog(): Promise<Record<string, unknown>> {
	const now = Date.now();
	if (coursesCatalogCache && now - catalogCachedAt < CATALOG_TTL_MS) {
		return coursesCatalogCache;
	}

	// get active courses with their prerequisites from the database
	const courses = await prisma.course.findMany({
		where: { is_active: true },
		select: {
			course_code:    true,
			course_name_en: true,
			credit_hours:   true,
			course_type:    true,
			prerequisites: {
				select: {
					prerequisite: {
						select: { course_name_en: true },
					},
				},
			},
		},
	});

	
	
	const catalog: Record<string, unknown> = {};
	for (const c of courses) {
		if (!c.course_name_en) continue;

		catalog[c.course_name_en] = {
			code:        c.course_code   ?? "",
			credits:     c.credit_hours  ?? 3,
			prereq:      c.prerequisites.map((p) => p.prerequisite.course_name_en ?? "").filter(Boolean),
			course_type: c.course_type,
		};
	}

	coursesCatalogCache = catalog;
	catalogCachedAt     = now;
	return catalog;
}

// ─── Main chat endpoint ────────────────────────────────────────────────────────
chatbotRouter.post(
	"/chat",
	optionalAuth,
	ipRateLimiter,
	async (req: Request, res: Response) => {

		const { query } = req.body;

		if (!query || typeof query !== "string" || query.trim() === "") {
			return res.status(400).json({
				message:    "query is required",
				statusCode: 400,
			});
		}

		// ─── Determine user type ────────────────────────────────
		const isStudent = req.auth?.payload?.role === "student";
		const userId    = req.auth?.payload?.userId ?? `guest_${req.ip}`;

		// ─── Get student data if the user is a student ─────────────────────
		let studentData: {
			name:       string;
			department: string | null;
			records:    Record<string, { grade: string; credit_hours: number }>;
		} | null = null;

		if (isStudent) {
			try {
				const student = await prisma.student.findUnique({
					where:  { student_id: userId },
					select: {
						user: {
							select: {
								first_name:  true,
								second_name: true,
							},
						},
						program: {
							select: { program_name_en: true },
						},
						student_course: {
							select: {
								grade: true,
								course: {
									select: {
										course_name_en: true,
										credit_hours:   true,
									},
								},
							},
						},
					},
				});

				if (student) {
					const records: Record<string, { grade: string; credit_hours: number }> = {};
					for (const sc of student.student_course) {
						const name = sc.course.course_name_en;
						if (!name) continue;
						records[name] = {
							grade:        sc.grade,
							credit_hours: sc.course.credit_hours ?? 3,
						};
					}

					studentData = {
						name:       [student.user.first_name, student.user.second_name].filter(Boolean).join(" "),
						department: student.program?.program_name_en ?? null,
						records,
					};
				}
			} catch (err) {
				console.error("[chatbot.route] DB error fetching student:", err);
				
			}
		}

		// ─── get courses catalog ────────────────────────────────
		let coursesCatalog: Record<string, unknown> = {};
		try {
			coursesCatalog = await getCoursesCatalog();
		} catch (err) {
			console.error("[chatbot.route] DB error fetching courses catalog:", err);
		}

		// ─── send request to Python chatbot ───────────────────────────────────
		try {
			const pythonRes = await fetch(`${CHATBOT_URL}/chat`, {
				method:  "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					user_id:         userId,
					user_status:     isStudent ? "student" : "guest",
					student_data:    studentData,
					courses_catalog: coursesCatalog,
					query,
				}),
				signal: AbortSignal.timeout(120_000),
			});

			if (!pythonRes.ok) {
				throw new Error(`Chatbot server error: ${pythonRes.status}`);
			}

			const data = await pythonRes.json();
			return res.status(200).json(data);

		} catch (err) {
			console.error("[chatbot.route] Python call failed:", err);
			return res.status(502).json({
				message:    "Chatbot service unavailable",
				statusCode: 502,
			});
		}
	},
);

// ─── Calculate GPA endpoint ────────────────────────────────────────────────────
// POST /api/v1/chatbot/calculate-gpa
// Body: { subjects: [{ credit_hours: number, grade: string }] }
chatbotRouter.post(
	"/calculate-gpa",
	ipRateLimiter,
	async (req: Request, res: Response) => {

		const { subjects } = req.body;

		if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
			return res.status(400).json({
				message:    "subjects array is required",
				statusCode: 400,
			});
		}

		try {
			const pythonRes = await fetch(`${CHATBOT_URL}/calculate-gpa`, {
				method:  "POST",
				headers: { "Content-Type": "application/json" },
				body:    JSON.stringify({ subjects }),
				signal:  AbortSignal.timeout(30_000),
			});

			if (!pythonRes.ok) {
				throw new Error(`Chatbot server error: ${pythonRes.status}`);
			}

			const data = await pythonRes.json();
			return res.status(200).json(data);

		} catch (err) {
			console.error("[chatbot.route] calculate-gpa failed:", err);
			return res.status(502).json({
				message:    "Chatbot service unavailable",
				statusCode: 502,
			});
		}
	},
);

// ─── Plan GPA endpoint ─────────────────────────────────────────────────────────
// POST /api/v1/chatbot/plan-gpa
// Body: { current_gpa, target_gpa, completed_hours, remaining_hours }
chatbotRouter.post(
	"/plan-gpa",
	ipRateLimiter,
	async (req: Request, res: Response) => {

		const { current_gpa, target_gpa, completed_hours, remaining_hours } = req.body;

		if (
			current_gpa    == null || typeof current_gpa    !== "number" ||
			target_gpa     == null || typeof target_gpa     !== "number" ||
			completed_hours == null || typeof completed_hours !== "number" ||
			remaining_hours == null || typeof remaining_hours !== "number"
		) {
			return res.status(400).json({
				message:    "current_gpa, target_gpa, completed_hours, and remaining_hours are required numbers",
				statusCode: 400,
			});
		}

		try {
			const pythonRes = await fetch(`${CHATBOT_URL}/plan-gpa`, {
				method:  "POST",
				headers: { "Content-Type": "application/json" },
				body:    JSON.stringify({ current_gpa, target_gpa, completed_hours, remaining_hours }),
				signal:  AbortSignal.timeout(30_000),
			});

			if (!pythonRes.ok) {
				throw new Error(`Chatbot server error: ${pythonRes.status}`);
			}

			const data = await pythonRes.json();
			return res.status(200).json(data);

		} catch (err) {
			console.error("[chatbot.route] plan-gpa failed:", err);
			return res.status(502).json({
				message:    "Chatbot service unavailable",
				statusCode: 502,
			});
		}
	},
);

export default chatbotRouter;