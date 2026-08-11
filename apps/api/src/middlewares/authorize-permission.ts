import { Request, Response, NextFunction } from "express";
import AuthenticationError from "../error/AuthenticationError";
import { prisma } from "@repo/db";
import NotFoundError from "../error/NotFound.Error";
export function authorizePermission(permission: string) {
	return async (req: Request, _: Response, next: NextFunction) => {
		try {
			const userId = req.auth?.payload?.userId;

			if (!userId) {
				return next(
					new AuthenticationError({
						message: "unauthorized",
						code: "ERR_AUTH",
						statusCode: 401,
					}),
				);
			}

			const user = await prisma.user.findUnique({
				where: { user_id: userId },
				include: {
					role: {
						include: {
							role_permission: {
								include: {
									permission: {
										select: { permission_name: true },
									},
								},
							},
						},
					},
				},
			});

			if (!user || !user.role) {
				return next(
					new NotFoundError({
						message: "user or role not found",
						code: "ERR_NF",
						statusCode: 404,
					}),
				);
			}

			const permissions = user.role.role_permission.map(
				(p) => p.permission.permission_name,
			);

			if (!permissions.includes(permission)) {
				return next(
					new AuthenticationError({
						message: "forbidden",
						code: "ERR_VALID",
						statusCode: 403,
					}),
				);
			}

			next();
		} catch (err) {
			next(err);
		}
	};
}
