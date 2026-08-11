import { Request, Response, NextFunction } from "express";
import { userLimiter } from "./rate-limiter.js";
import AuthenticationError from "../error/AuthenticationError.js";
export  async function jwtRateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.auth?.payload?.userId;



    if (!userId) {
        return next( 
                new AuthenticationError({

                    message:"Unauthorized User" , 
                    statusCode:401 , 
                    code:"ERR_AUTH"
                })
        )

    }

    await userLimiter.consume(userId);
   return next();
  } catch {
        return next( 
                new AuthenticationError({

                    message:"Too many requests from this user" , 
                    statusCode:429 , 
                    code:"ERR_AUTH"
                })
        )
  }
}