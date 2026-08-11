import { Router } from "express";
import * as programController from "../../controller/program.controller";
import { ipRateLimiter } from "../../middlewares/ip-rate-limiter";
import { authenticateUser } from "../../middlewares/authenticate-user";
import { jwtRateLimiter } from "../../middlewares/jwt-rate-limiter";
import { verifyRoles } from "../../middlewares/verify-role";

const programRouter = Router();

programRouter.get("/", ipRateLimiter, programController.getPrograms);

programRouter.get(
	"/programs-students-count",
	authenticateUser,
	jwtRateLimiter,
	verifyRoles("affairs_staff", "admin", "academic_staff"),
	programController.getProgramsWithStudentCounts,
);

programRouter.get(
	"/:programId",
	ipRateLimiter,
	programController.getProgramDetails,
);

export default programRouter;
