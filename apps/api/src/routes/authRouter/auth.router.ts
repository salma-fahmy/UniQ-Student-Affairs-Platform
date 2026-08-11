import { authenticateUser } from "../../middlewares/authenticate-user";
import { ipRateLimiter } from "../../middlewares/ip-rate-limiter";
import { jwtRateLimiter } from "../../middlewares/jwt-rate-limiter";
import { verifySameUser } from "../../middlewares/verify-same-user";
import {
	forgetPassword,
	login,
	logOut,
	resetPassword,
	changePassword,
	checkPassword,
	refreshToken,
	sendToSupport,
} from "../../controller/auth.controller";

import express from "express";
const authRouter = express.Router();

authRouter.post("/login", ipRateLimiter, login);

authRouter.post("/logout", ipRateLimiter, logOut);

authRouter.post("/forget-password", ipRateLimiter, forgetPassword);

authRouter.post("/reset-password", ipRateLimiter, resetPassword);

authRouter.post(
	"/check-password/:userId",
	authenticateUser,
	jwtRateLimiter,
	verifySameUser,
	checkPassword,
);

authRouter.post(
	"/change-password/:userId",
	authenticateUser,
	jwtRateLimiter,
	verifySameUser,
	changePassword,
);

authRouter.post("/refresh-token", ipRateLimiter, refreshToken);

// authRouter.post(
// 	"/send-email",
// 	authenticateUser,
// 	jwtRateLimiter,
// 	sendEmail,
// );

// authRouter.post("")

authRouter.post("/contact-form", ipRateLimiter, sendToSupport);

export default authRouter;
