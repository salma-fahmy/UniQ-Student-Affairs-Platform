import nodemailer from "nodemailer";
import "dotenv/config";
// the transporter is responsible to connect the ' email server' and  'sending email
const transport = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL,
		pass: process.env.EMAIL_PASS,
	},
});

export async function sendEmailBusiness(options) {
	try {
		const info = await transport.sendMail({
			from: process.env.EMAIL,
			to: options.to,
			subject: options.subject,
			text: options.text,
			html: options.html,
		});
		console.log("Email sent : ", info.response);
		console.log("Accepted:", info.accepted);
		console.log("Rejected:", info.rejected);
	} catch (e) {
		console.error("Email error : ", e);
	}
}

export async function sendEmailSupportTeam(options) {
	try {
		const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="margin-bottom: 20px;">
            New Contact Form Message
        </h2>

        <p>
            You received a new message from the website contact form.
        </p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />

        <p>
            <strong>Full Name:</strong><br />
            ${options.fullName}
        </p>

        <p>
            <strong>Email Address:</strong><br />
            ${options.email}
        </p>

        <p>
            <strong>Message:</strong><br />
        </p>

        <div
            style="
                background: #f7f7f7;
                padding: 15px;
                border-radius: 8px;
                white-space: pre-wrap;
            "
        >
            ${options.message}
        </div>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />

        <p style="font-size: 12px; color: #777;">
            This message was sent from your website contact form.
        </p>
    </div>
`;

		const info = await transport.sendMail({
			from: process.env.EMAIL,
			to: process.env.SUPPORT_TEAM,
			subject: options.subject,
			replyTo: options.email,
			html,
		});
		console.log("Email sent : ", info.response);
		console.log("Accepted:", info.accepted);
		console.log("Rejected:", info.rejected);
	} catch (e) {
		console.error("Email error : ", e);
	}
}
