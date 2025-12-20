import { Queue } from "bullmq";

interface JobData {
    userId: number;
    email: string;
}

// connect to queue named
const emailQueue = new Queue("email-queue", {
    connection: {
        host: "127.0.0.1",
        port: 6379,
    },
});

async function addJob() {
    const data: JobData = {
        userId: 1,
        email: "user1@gmail.com",
    };
    const job = await emailQueue.add("send-digest", data, {
        attempts: 3, // Retry 3 times if it fails
        backoff: {
            type: "exponential",
            delay: 1000,
        },
    });

    console.log(`Job added with Id: ${job.id}`);
    process.exit();
}

addJob();
