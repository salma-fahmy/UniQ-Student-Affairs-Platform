import {Worker} from "bullmq" ;
import {redisConfig} from "@repo/config"
import { emailProcessor } from "./email.processor.js";
const EmailWorker = new Worker("email" , emailProcessor , {connection:redisConfig}) ; 

EmailWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully!`);
});

EmailWorker.on('failed', (job, err) => {
  console.log(`Job ${job?.id} failed: ${err.message}`);
});