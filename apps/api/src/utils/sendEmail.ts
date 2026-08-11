import nodemailer from "nodemailer";
import type { EmailOptions } from "../dto/email.dto";
import config from "../lib/config";

// the transporter is responsible to connect the ' email server' and  'sending email
export const transport = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: config.email as string,
		pass: config.emailPass as string,
	},
});

export async function sendEmail(options: EmailOptions) {
	try {
		const info = await transport.sendMail({
			from: config.email,
			to: options.to,
			subject: options.subject,
			text: options.text,
			html: options.html,
		});
		console.log("Email sent : ", info.response);
	} catch (e) {
		console.error("Email error : ", e);
	}
}
