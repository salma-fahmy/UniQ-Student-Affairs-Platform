import { jwtRateLimiter } from "../../middlewares/jwt-rate-limiter";
import * as userController from "../../controller/user.controller";
import { Router } from "express";
import { verifyRoles } from "../../middlewares/verify-role";
import { authorizePermission } from "../../middlewares/authorize-permission";

const userRouter = Router();

// ── Self-service routes (any authenticated user) ──────────────────────────────

userRouter.get(
	"/photo-signature",
	jwtRateLimiter,
	userController.userProfilePhotoSignature,
);

userRouter.patch(
	"/profile-photo",
	jwtRateLimiter,
	userController.updateUserProfilePhotoUrl,
);

userRouter.get(
	"/profile",
	jwtRateLimiter,
	userController.getUserProfile,
);

userRouter.get(
	"/notifications",
	jwtRateLimiter,
	userController.getUserNotifications,
);

// ── Create user (admin + affairs_staff) ──────────────────────────────────────

userRouter.post(
	"/create",
	verifyRoles("admin", "affairs_staff"),
	jwtRateLimiter,
	authorizePermission("create:user"),
	userController.createUser,
);

// ── Admin-only routes ─────────────────────────────────────────────────────────
// GET  /v1/users/admin/all               → list all users (paginated, filterable by role)
// GET  /v1/users/admin/:userId           → get single user full detail
// PATCH /v1/users/admin/:userId          → update user editable fields

userRouter.get(
	"/admin/all",
	verifyRoles("admin"),
	authorizePermission("read:user"),
	userController.adminGetAllUsers,
);

userRouter.get(
	"/admin/:userId",
	verifyRoles("admin"),
	authorizePermission("read:user"),
	userController.adminGetUserById,
);

userRouter.patch(
	"/admin/:userId",
	verifyRoles("admin"),
	authorizePermission("update:user"),
	userController.adminUpdateUser,
);

export default userRouter;
