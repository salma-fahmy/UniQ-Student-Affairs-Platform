import { v4 as uuidv4 } from "uuid";
import { Response, Request, NextFunction } from "express";
export const requestContext = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	// req.requestId = uuidv4();
	// res.setHeader("x-request-id", req.requestId);
	req.startTime = Date.now();

	return next();
};
