import express from "express";
import complaintRouter from "../complaints/complaints.router";
import { verifyRoles } from "../../middlewares/verify-role";
import { authenticateUser } from "../../middlewares/authenticate-user";
import { jwtRateLimiter } from "../../middlewares/jwt-rate-limiter";
import notificationRouter from "../notifications/notification.router";
import authRouter from "../authRouter/auth.router";
import userRouter from "../user/user.router";
import studentRouter from "../student/student.router";
import requestRouter from "../requests/requests.router";
import programRouter from "../program/program.router";
import collageRule from "../collageInfoRouter/collageInfo.router";
import academicRouter from "../academic/academic.router";
import staffRouter from "../staff/staff.router";
import paymentRouter from "../payments/payment.router";
import chatbotRouter from "../chatbot/chatbot.route";   // ← جديد

const v1 = express.Router();

// ─── Public routes (no auth required) ─────────────────────────
v1.use("/auth",       authRouter);
v1.use("/programs",   programRouter);
v1.use("/collageInfo", collageRule);
v1.use("/chatbot",    chatbotRouter);  

// ─── Protected routes (auth required) ─────────────────────────
v1.use(authenticateUser, jwtRateLimiter);
v1.use("/notifications", notificationRouter);
v1.use("/users",         userRouter);
v1.use("/students",      verifyRoles("student"), studentRouter);
v1.use("/complaints",    complaintRouter);
v1.use("/requests",      requestRouter);
v1.use("/academic",      academicRouter);
v1.use("/staff",         staffRouter);
v1.use("/payments",      paymentRouter);

export default v1;