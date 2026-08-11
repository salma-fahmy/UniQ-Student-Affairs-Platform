import { Request, Response, NextFunction } from "express";
import AuthenticationError from "../error/AuthenticationError";
import { prisma } from "@repo/db";
type Role = "student" | "admin" | "affairs_staff" | "academic_staff";

export function verifyRoles(...roles: Role[]) {
	return (req: Request, _: Response, next: NextFunction) => {
		
		const role = req.auth?.payload.role;

		if (!role || !roles.includes(role)) {
			return next(
				new AuthenticationError({
					message: "forbidden: you don't have the permission",
					statusCode: 403,
					code: "ERR_VALID",
				}),
			);
		}

		return next();
	};
}
