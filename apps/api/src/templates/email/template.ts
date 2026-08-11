import { EmailTemplateType } from "./EmailTemplateEnum";

type EmailData = {
	resetLink?: string;
	time?: string;
	device?: string;
	location?: string;
	email?: string;
	studentName?: string;
	affairName?: string;
	user_id?: string;
	first_name?: string;
	second_name?: string;
	third_name?: string;
	fourth_name?: string;
	password?: string;
	message?: string;
	details?: string;
};

const baseLayout = (content: string) => `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f5f6fa;font-family:Arial,sans-serif;">
    <div style="max-width:600px;margin:30px auto;background:#fff;padding:20px;border-radius:8px;">
      ${content}
      <hr style="margin-top:20px;border:none;border-top:1px solid #eee;" />
      <p style="font-size:12px;color:#999;text-align:center;">
        This is an automated email, please do not reply.
      </p>
    </div>
  </body>
</html>
`;

export const emailTemplate = (
	type: EmailTemplateType,
	data: EmailData = {},
): string => {
	let content = "";

	switch (type) {
		// ========================= INQUIRY =========================
		case EmailTemplateType.INQUIRY_RESPONSE:
			content = `
		<h2 style="color:#2c3e50;">Response to your inquiry ✅</h2>

		<p>Hi there,</p>

		<p>Thank you for reaching out. Here is our response:</p>

		<div style="background:#f8f9fa;padding:12px;border-left:4px solid #2c3e50;">
			${data.message || "We will get back to you soon."}
		</div>

		<p>If you have more questions, feel free to reply.</p>
	`;
			break;

		// ========================= PASSWORD RESET =========================
		case EmailTemplateType.PASSWORD_RESET:
			content = `
				<h2 style="color:#e74c3c;">Password Reset 🔐</h2>

				<p>We received a request to reset your password.</p>

				<p>
					<a href="${data.resetLink || "#"}"
						style="display:inline-block;background:#e74c3c;color:#fff;padding:12px 18px;text-decoration:none;border-radius:6px;">
						Reset Password
					</a>
				</p>

				<p style="color:#555;">
					This link expires in 15 minutes. Ignore if you didn’t request it.
				</p>
			`;
			break;

		// ========================= LOGIN ALERT =========================
		case EmailTemplateType.LOGIN_ALERT:
			content = `
				<h2 style="color:#f39c12;">New Login Detected ⚠️</h2>

				<p>We detected a login to your account.</p>

				<div style="background:#f8f9fa;padding:12px;border-radius:6px;">
					<p><strong>Time:</strong> ${data.time || "Unknown"}</p>
					<p><strong>Device:</strong> ${data.device || "Unknown"}</p>
					<p><strong>Location:</strong> ${data.location || "Unknown"}</p>
				</div>

				<p>
					If this was you, ignore this email. If not, change your password immediately.
				</p>
			`;
			break;

		// ========================= STUDENT MESSAGE =========================
		case EmailTemplateType.STUDENT_MESSAGE:
			content = `
				<h2 style="color:#2ecc71;">New Affair Message 💬</h2>

				<p><strong>From:</strong> ${data.affairName || "Affair"}</p>

				<div style="background:#f8f9fa;padding:15px;border-left:4px solid #2ecc71;">
					${data.message || "No message provided"}
				</div>

				<p>Please respond when possible.</p>
			`;
			break;

		// ========================= OTHERS =========================
		case EmailTemplateType.OTHERS:
			content = `
				<h2 style="color:#34495e;">Notification 📢</h2>

				<p>${data.message || "You have a new notification."}</p>

				${
					data.details
						? `<div style="background:#ecf0f1;padding:10px;border-radius:6px;">
						${data.details}
					</div>`
						: ""
				}
			`;
			break;

		case EmailTemplateType.NEW_USER_REGISTER:
			content = `
		<h2 style="color:#2c3e50;">Welcome to UNIQ </h2>

		<p>Hi ${data.first_name},</p>

		<p>Your account has been successfully created. Below are your login details:</p>

		<div style="background:#f8f9fa;padding:12px;border-left:4px solid #2c3e50;">
			<p><strong>Full Name:</strong> ${data.first_name} ${data.second_name || ""} ${data.third_name || ""} ${data.fourth_name || ""}</p>
			<p><strong>User ID:</strong> ${data.user_id}</p>
			<p><strong>Password:</strong> it's your SSN </p>
		</div>

		<p style="color:#e74c3c;">
			⚠️ Please change your password after your first login for security reasons.
		</p>

		<p>You can now log in using your credentials and start using the system.</p>

		<p>If you need any help, feel free to contact support.</p>

		<p>Best regards,<br/>System Administration</p>
	`;
			break;

		// ========================= DEFAULT =========================
		default:
			content = `
				<h2>Notification</h2>
				<p>Unsupported email type.</p>
			`;
	}

	return baseLayout(content);
};
