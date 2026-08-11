const config = {
	env: process.env.NODE_ENV || "development",
	port: process.env.PORT || 9000,
	email: process.env.EMAIL,
	emailPass: process.env.EMAIL_PASS,
	cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
	cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
	appDebug: process.env.DEBUG === "true",
	jwtSecretShortLive: process.env.JWT_SECRET_SHORT_LIVE,
	jwtSecretLongLive: process.env.JWT_SECRET_LONG_LIVE,
	clientUrl: process.env.CLIENT_URL,
	stripeSecretKey: process.env.STRIPE_SECRET_KEY as string,
	stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET as string,
	chatbotUrl: process.env.CHATBOT_URL ?? "http://chatbot:7860",
};

export default config;
