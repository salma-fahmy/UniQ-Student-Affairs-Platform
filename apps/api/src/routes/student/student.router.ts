import { Router } from "express";
import * as studentController from "../../controller/student.controller";

const studentRouter = Router();

studentRouter.get(
	"/complaints",

	studentController.getAllStudentComplaints,
);
studentRouter.get(
	"/complaints/:complaintId",

	studentController.getStudentComplaint,
);
studentRouter.get(
	"/requests/:requestId",

	studentController.getStudentRequest,
);
studentRouter.get(
	"/requests",

	studentController.getAllStudentRequests,
);
studentRouter.get(
	"/payments",

	studentController.getAllStudentPayments,
);
studentRouter.get(
	"/operations-summary",

	studentController.getStudentOperationsSummary,
);
studentRouter.get(
	"/payment-summary",

	studentController.getStudentPaymentsSummary,
);

studentRouter.get("/failed-courses", studentController.studentFailedCourses);

studentRouter.get("/study-info", studentController.getStudentStudyInfo);

export default studentRouter;
