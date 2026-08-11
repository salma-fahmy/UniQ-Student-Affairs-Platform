import { NextFunction, Request, Response } from "express";
import * as studentServices from "../services/student.service";
import IResponseOutput from "../dto/response.dto";
import httpStatus from "../utils/httpStatus";
import { asyncHandler } from "../utils/asyncHandler";
import NotFoundError from "../error/NotFound.Error";
import { getOrSetCache } from "../utils/cache";

export const getAllStudentComplaints = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>) => {
		const studentId = req.auth?.payload.userId;
		const complaints = await studentServices.getStudentComplaints(studentId);

		return res.status(200).json({
			message: "Complaints of student.",
			code: httpStatus.SUCCESS,
			statusCode: 200,
			data: complaints,
		});
	},
);

export const getStudentComplaint = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>) => {
		const studentId = req.auth?.payload.userId;

		const complaintId = req.params.complaintId;

		const complaint = await studentServices.getStudentComplaint(
			studentId,
			complaintId as string,
		);

		if (!complaint) {
			throw new NotFoundError({
				message: "Complaint not found",
				code: "ERR_NF",
				statusCode: 404,
			});
		}

		return res.status(200).json({
			message: "Complaint of student.",
			code: httpStatus.SUCCESS,
			statusCode: 200,
			data: complaint,
		});
	},
);

export const getAllStudentRequests = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>) => {
		const userId = req.auth?.payload.userId;

		const requests = await studentServices.getStudentRequests(userId);

		return res.status(200).json({
			message: "Requests of student.",
			code: httpStatus.SUCCESS,
			statusCode: 200,
			data: requests,
		});
	},
);

export const getStudentRequest = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>) => {
		const userId = req.auth?.payload.userId;
		const requestId = req.params.requestId;

		const request = await studentServices.getStudentRequest(
			userId,
			requestId as string,
		);

		if (!request) {
			throw new NotFoundError({
				message: "Request not found",
				code: "ERR_NF",
				statusCode: 404,
			});
		}

		return res.status(200).json({
			message: "Request of student.",
			code: httpStatus.SUCCESS,
			statusCode: 200,
			data: request,
		});
	},
);

export const getAllStudentPayments = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>) => {
		const userId = req.auth?.payload.userId;

		const payments = await studentServices.getStudentPayments(userId);

		return res.status(200).json({
			message: "Payments of student.",
			code: httpStatus.SUCCESS,
			statusCode: 200,
			data: payments,
		});
	},
);

export const getStudentOperationsSummary = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>) => {
		const userId = req.auth?.payload.userId;

		const summary = await studentServices.getStudentOperationsSummary(userId);

		return res.status(200).json({
			data: summary,
			message: "Student operations summary",
			code: httpStatus.SUCCESS,
			statusCode: 200,
		});
	},
);

export const getStudentPaymentsSummary = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>) => {
		const userId = req.auth?.payload.userId;

		const summary = await studentServices.getStudentPaymentsSummary(userId);

		return res.status(200).json({
			data: summary,
			message: "Student payments summary",
			code: httpStatus.SUCCESS,
			statusCode: 200,
		});
	},
);

export const studentFailedCourses = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>) => {
		const userId = req.auth?.payload.userId;

		if (!userId) {
			throw new NotFoundError({
				message: "Missing Student Id .",
				statusCode: 404,
				code: "ERR_NF",
			});
		}
		const failedCourses = await studentServices.getStudentFailedCourses(userId);

		return res.status(200).json({
			message: " Fetched failed student Courses successfully",
			data: failedCourses,
			code: httpStatus.SUCCESS,
			statusCode: 200,
		});
	},
);

export const getStudentStudyInfo = asyncHandler(
	async (req: Request, res: Response<IResponseOutput>, next: NextFunction) => {
		const studentId = req.auth?.payload.userId;

		const studyInfo = await getOrSetCache(
			`$student:studyBehavior:${studentId}`,
			() => studentServices.getStudentStudyInfo(studentId),
			100,
		);

		if (!studyInfo) {
			throw new NotFoundError({
				message: "Not Found Result about student Behavior",
				code: "ERR_NF",
				statusCode: 404,
			});
		}

		return res.status(200).json({
			message: "Student Behavior Info ",
			code: httpStatus.SUCCESS,
			statusCode: 200,
			data: studyInfo,
		});
	},
);
