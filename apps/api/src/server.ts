import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import config from "./lib/config.js";

import errorHandler from "./middlewares/error-handler.js";
import v1 from "./routes/v1/v1.js";

import { requestContext } from "./middlewares/request-context.js";
import { httpLogger } from "./middlewares/http-logger.js";
import { requestLogger } from "./middlewares/request-logger.js";

export const createServer = () => {
	const app = express();
	app
		.disable("x-powered-by") // prevent the client to know the tech that made the api
		.use(helmet()) //for secure header on request
		.use(
			cors({
				origin: config.clientUrl,
				credentials: true, //make the front end available to send the token by cookies
			}),
		)
		.use(express.json())
		.use(requestLogger)
		.use(requestContext)
		.use(httpLogger)
		.use(cookieParser())
		.use(express.urlencoded({ extended: true })); //parse data if sent by form

	app.use("/api/v1", v1);

	app.use(errorHandler);
	return app;
};
