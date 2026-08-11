import  {redisClient}  from "@repo/config";
import { RateLimiterRedis } from "rate-limiter-flexible";

/**
 * IP limiter for public routes ex: chatbot , browser content  , ...
 */
export const ipLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "ip_limit",
  points: 100, // requests
  duration: 60, // per 60 seconds
});

/**
 * JWT user limiter for authenticated routes
 */
export const userLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "user_limit",
  points: 100, // requests
  duration: 60, // 60 seconds
});