import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as programService from "../services/program.service";
import IResponseOutput from "../dto/response.dto";
import httpStatus from "../utils/httpStatus";
// get all programs
export const getPrograms = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>, next: NextFunction) => {
		const programs = await programService.getPrograms();

		return res.status(200).json({
			message: "Programs fetched Successfully",
			code: httpStatus.SUCCESS,
			statusCode: 200,
			data: programs,
		});
	},
);

// get specific program Details
export const getProgramDetails = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>, next: NextFunction) => {
		const programId = parseInt(req.params.programId as string);
		const programs = await programService.getProgramDetails(programId);

		return res.status(200).json({
			message: "Program fetched Successfully",
			code: httpStatus.SUCCESS,
			statusCode: 200,
			data: programs,
		});
	},
);


export const getProgramsWithStudentCounts = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>, next: NextFunction) => {
		const programStats = await programService.getProgramsWithStudentCounts();
		return res.status(200).json({
			message: "Number of student in each Program fetched Successfully",
			code: httpStatus.SUCCESS,
			statusCode: 200,
			data: programStats,
		});
	},
);
