import { Request, Response, NextFunction } from "express";
import { ipLimiter } from "./rate-limiter";
import AuthenticationError from "../error/AuthenticationError";
export  async function ipRateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {

    // get the ip of the device of the user 
    const ip = req.ip;

    // increase the counter for this ip >> how many number of requests that you sent .  
    await ipLimiter.consume(ip as string);

    next();
  } catch {
    return next( 
            new AuthenticationError({

                message:"Too many requests from this ip" , 
                statusCode:429 , 
                code:"ERR_AUTH"
            })
            )
  }
}