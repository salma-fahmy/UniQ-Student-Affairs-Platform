import type { NextFunction, Request, Response } from "express";
import CustomError from "../error/CustomError.js";
import config from "../lib/config.js";
import getErrorMessage from "../utils/getErrorMessage.js";
import logger from "../utils/logger.js";
export default function errorHandler(
	error: any,
	req: Request,
	res: Response,
	next: NextFunction,
) {
	logger.error("Unhandled error", {
		message: error.message,
		stack: error.stack,
		method: req.method,
		url: req.originalUrl,
	});

	if (res.headersSent || config.appDebug) {
		// the response that has status 204 ,
		// 	this refers to there is content will be returned ,
		// so the response will not have a body e
		res.status(204).json({
			message: "there is not a content !",
			statusCode: 204,
			status: "ERR_NO_CONTENT",
			data: null,
		});
		return;
	}

	if (error instanceof CustomError) {
		res.status(error.statusCode).json({
			message: getErrorMessage(error),
			statusCode: error.statusCode,
			code: error.code,
			data: null,
			errors: error.errors,
		});
		return;
	}

	res.status(500).json({
		message:
			getErrorMessage(error) ||
			"An error occurred . Please view logs for more details",
		statusCode: 500,
		status: "ERR_SERVER",
		data: null,
	});
}
