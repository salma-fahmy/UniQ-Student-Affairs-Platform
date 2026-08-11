import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as inquiriesService from "../services/inquires.service";
import IResponseOutput from "../dto/response.dto";
import httpStatus from "../utils/httpStatus";
import { inquirySchema } from "../validator/inquiery.schema";
import BadRequestError from "../error/BadRequestError";

export const getAllInquiries = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>, next: NextFunction) => {
		const { limit, page } = req.query;

		const inquiries = await inquiriesService.getAllInquiries(
			parseInt(limit as string),
			parseInt(page as string),
		);

		return res.status(200).json({
			message: "All visitor inquires are fetched successfully",
			code: httpStatus.SUCCESS,
			statusCode: 200,
			data: inquiries,
		});
	},
);

export const getInquiry = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>, next: NextFunction) => {
		const id = parseInt(req.params.id as string);
		const userId = req.auth?.payload.userId as string;

		console.log(id, userId);

		if (!id) {
			throw new BadRequestError({
				message: "Missing a valid inquiry Id",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
			});
		}

		const inquiry = await inquiriesService.getInquiry(id, userId);

		res.status(200).json({
			message: "Inquiry returned successfully",
			code: httpStatus.SUCCESS,
			statusCode: 200,
			data: inquiry,
		});
	},
);

export const createInquiry = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>, next: NextFunction) => {
		const parse = inquirySchema.safeParse(req.body);
		if (!parse.success) {
			const flatErrors = parse.error.flatten((issue) => issue.message);

			throw new BadRequestError({
				message: "Invalid input data , please enter a valid data ",
				code: "ERR_BAD_REQUEST",
				statusCode: 400,
				errors: flatErrors,
			});
		}

		const inquiry = await inquiriesService.createInquiry(parse.data);

		return res.status(200).json({
			message: "Inquiry is sent successfully",
			code: httpStatus.SUCCESS,
			statusCode: 200,
			data: inquiry,
		});
	},
);

export const deleteInquires = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>, next: NextFunction) => {
		const meta = await inquiriesService.deleteInquiries();

		return res.status(200).json({
			message: "Inquires are deleted .",
			code: httpStatus.SUCCESS,
			statusCode: 200,
			data: null,
			meta,
		});
	},
);

export const deleteInquiry = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>, next: NextFunction) => {
		await inquiriesService.deleteInquiry(parseInt(req.params.id as string));
		return res.status(200).json({
			message: "Inquiry is deleted",
			code: httpStatus.SUCCESS,
			statusCode: 200,
			data: null,
		});
	},
);
