import { emailQueue } from "../queues/email.queue";

export const addEmailJob = async (emailData: {
	to: string;
	subject: string;
	type:"CONTACT_SUPPORT"|"BUSINESS_EMAIL";
	message?: string;
	html?: string;
}) => {
	// Add a job named 'send-email' with the provided data
	await emailQueue.add("send-mail", emailData, {
		attempts: 3,
		backoff: {
			type: "exponential",
			delay: 2000,
		},
	});
};

export const sendingToSupport = async (emailData: {
	email: string;
	subject: string;
	message?: string;
	type: string;
}) => {
	// Add a job named 'send-email' with the provided data
	await emailQueue.add("support-mail", emailData, {
		attempts: 3,
		backoff: {
			type: "exponential",
			delay: 2000,
		},
	});
};
