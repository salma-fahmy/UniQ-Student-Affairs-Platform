import { Queue } from "bullmq";

import { redisConfig } from "@repo/config";

export const emailQueue = new Queue("email", {
	connection: redisConfig,
	defaultJobOptions: {
		attempts: 3,
		backoff: {
			type: "exponential",
			delay: 1000,
		},
		removeOnComplete: {
			age: 3600,
			count: 1000,
		},
	},
});

// export const supportEmailQueue = new Queue("supportEmailQueue", {
// 	connection: redisConfig,
// 	defaultJobOptions: {
// 		attempts: 3,
// 		backoff: {
// 			type: "exponential",
// 			delay: 1000,
// 		},
// 		removeOnComplete: {
// 			age: 3600,
// 			count: 1000,
// 		},
// 	},
// });
