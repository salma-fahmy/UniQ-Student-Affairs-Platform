import { addEmailJob } from "../jobs/email.job";
import logger from "./logger";

export const safeEmailJob = (job: Parameters<typeof addEmailJob>[0]) => {
	addEmailJob(job).catch((err) => logger.error("Email job failed", err));
};
