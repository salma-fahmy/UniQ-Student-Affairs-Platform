import { Response, Request, NextFunction } from "express";
import AuthenticationError from "../error/AuthenticationError";
export function verifySameUser(req: Request, _: Response, next: NextFunction) {
	let userIdFromParams = null;
	let userIdFromToken = req.auth?.payload.studentId;

	if (!req.auth?.payload.studentId) {
		// check if payload don't contain studentId ,
		userIdFromToken = req.auth?.payload.userId;
		userIdFromParams = req.params.userId as string;
	} else {
		userIdFromParams = parseInt(req.params.userId as string);
	}

	console.log("params : ", userIdFromParams);
	console.log("token : ", userIdFromToken);

	// check the same person
	if (userIdFromToken !== userIdFromParams)
		return next(
			new AuthenticationError({
				message: "Forbidden: you are not the same person to take the action",
				code: "ERR_AUTH",
				statusCode: 403,
			}),
		);

	return next();
}
