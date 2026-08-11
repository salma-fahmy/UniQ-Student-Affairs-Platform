import { Router } from "express";
import * as paymentController from "../../controller/payment.controller";
import { verifyRoles } from "../../middlewares/verify-role";

const paymentRouter = Router();

// ── List all payments — admin / affairs_staff ─────────────────────────────────
paymentRouter.get(
	"/",
	verifyRoles("admin", "affairs_staff"),
	paymentController.listPayments,
);

// ── Initiate payment — student only ──────────────────────────────────────────
// NO DB WRITES — returns a temp payment_number + amount for the gateway.
// Body: { studentId, requestTypeId, price, body, description? }
paymentRouter.post(
	"/initiate",
	verifyRoles("student"),
	paymentController.initiatePayment,
);

// ── Confirm payment — student only ───────────────────────────────────────────
// THE ONLY endpoint that writes to DB (Request + Payment in one transaction).
// Body: { transactionId, studentId, requestTypeId, price, body, description? }
paymentRouter.post(
	"/:paymentNumber/confirm",
	verifyRoles("student"),
	paymentController.confirmPayment,
);

// ── Fail payment — student only ───────────────────────────────────────────────
// Nothing was saved in DB — just acknowledges the failure.
paymentRouter.post(
	"/:paymentNumber/fail",
	verifyRoles("student"),
	paymentController.failPayment,
);

// ── Get single payment — student (own) / staff / admin ───────────────────────
paymentRouter.get(
	"/:paymentNumber",
	verifyRoles("student", "admin", "affairs_staff"),
	paymentController.getPayment,
);

export default paymentRouter;