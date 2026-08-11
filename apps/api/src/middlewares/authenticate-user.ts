import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import AuthenticationError from "../error/AuthenticationError.js";
import config from "../lib/config.js";

// Middleware to authenticate user using HTTP-only cookie
export const authenticateUser = (req: Request, _: Response, next: NextFunction) => {
	
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		return next(new AuthenticationError({
			message: "Authentication token missing",
			statusCode: 401,
			code: "ERR_AUTH",
		}));
	}

	// Bearer <token>
	const token = authHeader.split(" ")[1];
	try {
		const decodedToken = jwt.verify(token, config.jwtSecretShortLive as string);
		req.auth = { payload: decodedToken as JwtPayload, token };
		return next();
	} catch (error) {
		return next(new AuthenticationError({
			message: "You are not authorized to perform this operation",
			statusCode: 403,
			code: "ERR_AUTH",
		}));
	}
};