import { Worker } from "bullmq";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const worker = new Worker(
    "email-queue",
    async (job) => {
        const idempotentKey = `job-lock:${job.id}`;

        // 1. Try to acquire a lock for a job
        // "NX": means "only set the key if it does not already exist"
        // "EX", 10: means "set the key to expire after 10 seconds"
        const acquiredLock = redis.set(idempotentKey, "LOCKED", "EX", 10, "NX");

        if (!acquiredLock) {
            console.log(
                `JOB ${job.id} is already being processed. Skipping...`,
            );
            return;
        }

        // simulate API call
        await sleep(2000);

        console.log(`Job ${job.id} completed.`);
    },
    {
        connection: {
            host: "127.0.0.1",
            port: 6379,
        },
        // now it can handle 5 jobs at a same time (concurrently)
        concurrency: 5,
    },
);

console.log("[Worker] Ready for listening for jobs");
