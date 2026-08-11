import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response, NextFunction } from "express";
import * as collageService from "../services/collage.info.services";
import IResponseOutput from "../dto/response.dto";
import httpStatus from "../utils/httpStatus";
import NotFoundError from "../error/NotFound.Error";
export const getCollageInfo = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>, next: NextFunction) => {
		const info = await collageService.getCollageInfo();

		return res.status(200).json({
			message: "Collage info is fetched successfully",
			code: httpStatus.SUCCESS,
			statusCode: 200,
			data: info,
		});
	},
);

export const getCollageStats = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>, next: NextFunction) => {
		const collageStats = await collageService.getCollageStats();

		if (!collageService) {
			throw new NotFoundError({
				message: "No collage Stats fetched !",
				code: "ERR_NF",
				statusCode: 404,
			});
		}

		return res.status(200).json({
			message: "Collage stats are fetched Successfully",
			code: httpStatus.SUCCESS,
			statusCode: 200,
			data: collageStats,
		});
	},
);
