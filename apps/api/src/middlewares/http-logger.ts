import logger from "../utils/logger";
import { Response, Request, NextFunction } from "express";

export const httpLogger = (req: Request, res: Response, next: NextFunction) => {
	res.on("finish", () => {
		const duration = Date.now() - req.startTime;
		logger.info("HTTP Request", {
			method: req.method,
			url: req.originalUrl,
			status: res.statusCode,
			duration: `${duration}ms`,
			ip: req.ip,
		});
	});

	next();
};
