import PayloadType from "../dto/payload.js";
import config from "../lib/config.js";
import jwt from "jsonwebtoken";
import crypto from "crypto" ;



// generate access token
export  function generateAccessToken(payload:PayloadType) {
	return jwt.sign(payload, config.jwtSecretShortLive as string, { expiresIn: "45m" });
}

export function generateRefreshToken(){
	return crypto.randomBytes(64).toString("hex");
}

export const hashToken = (token:string)=>{
	return crypto.createHash("sha256").update(token).digest("hex"); 
}

