import "express";
import { JwtPayload } from "jsonwebtoken";

// over ride on the request interface inside express namespace i
// to add the auth object that will contain the payload
// that returned after the process of the authentication for the token
declare global {
	namespace Express {
		interface Request {
			auth?: {
				payload: JwtPayload;
				token: string;
			};
			requestId: string;
			startTime: number;
		}
	}
}
