import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../lib/config.js";

export const optionalAuth = (
	req: Request,
	_: Response,
	next: NextFunction,
) => {
	const authHeader = req.headers.authorization;

	// مفيش token — guest، نكمل عادي
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		req.auth = null;
		return next();
	}

	const token = authHeader.split(" ")[1];

	try {
		const decodedToken = jwt.verify(
			token,
			config.jwtSecretShortLive as string,
		);
		req.auth = { payload: decodedToken as JwtPayload, token };
		return next();
	} catch {
		// token موجود بس باظ — نعامله كـ guest مش نرمي error
		req.auth = null;
		return next();
	}
};