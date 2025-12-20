import { Worker } from "bullmq";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const worker = new Worker(
    "email-queue",
    async (job) => {
        console.log(`Processing job ${job.id} for ${job.data.email}`);

        await sleep(2000);

        if (Math.random() > 0.5) throw new Error("Random API Failure!");

        console.log(`Job ${job.id} completed.`);
    },
    {
        connection: {
            host: "127.0.0.1",
            port: 6379,
        },
    },
);

console.log("[Worker] Ready for listening for jobs");
