import { Worker } from "bullmq";
import Redis from "ioredis";

// create a redis connection for locking mchanism separately
// we need this referece so we can close it later if needed
const redisLockConnection = new Redis({
    host: "127.0.0.1",
    port: 6379,
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const worker = new Worker(
    "email-queue",
    async (job) => {
        //  locking ensures no multiple workers process the same job simultaneously
        const idempotentKey = `lock:${job.name}`;

        // 1. Try to acquire a lock for a job
        // "NX": means "only set the key if it does not already exist"
        // "EX", 10: means "set the key to expire after 10 seconds"
        const acquiredLock = await redisLockConnection.set(
            idempotentKey,
            "LOCKED",
            "EX",
            10,
            "NX",
        );

        // it means the key already exists
        // another process is working on this job
        if (!acquiredLock) {
            console.log(
                `JOB ${job.id} is already being processed. Skipping...`,
            );
            return;
        }

        console.log(
            `[worked] started job ${job.id}. (worked promised to finish this!)`,
        );

        // simulate API call
        await sleep(5000);

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

// shutdown gracefully

async function gracefulShutdown(signal: string) {
    console.log(`Received  ${signal}. Shutting down gracefully...`);
    console.log("Closing worker");

    // 1. stop accepting new jobs
    // wait for current jobs to complete
    await worker.close();

    // close the redis connnection used for locking
    await redisLockConnection.quit();

    console.log("Shutdown complete. Exiting now.");
    process.exit(0);
}

process.on("SIGINT", async () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", async () => gracefulShutdown("SIGTERM"));
