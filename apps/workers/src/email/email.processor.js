import "dotenv/config";
import { sendEmailBusiness, sendEmailSupportTeam } from "./email.service.js";

export const emailProcessor = async (job) => {
	switch (job.data.type) {
		case "CONTACT_SUPPORT":
			{
				const { fullName, email, message, subject } = job.data;

				await sendEmailSupportTeam({ fullName, email, message, subject });
			}
			break;

		case "BUSINESS_EMAIL":
			{
				const { to, subject, html } = job.data;
				await sendEmailBusiness({ to, subject, html });
			}
			break;
	}

	// console.log(`Processing job ${job.id} with data:`, job.data);
	console.log(`Processing job ${job.id} `);
	// report progress
	await job.updateProgress(50);
};
