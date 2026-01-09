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
    const userId = 1;
    const date = new Date().toISOString().split("T")[0];

    const uniqueJobId = `digest-user${userId}-${date}`;

    const job = await emailQueue.add(
        "daily-digest",
        { userId, email: "demouser@gmail.com" },
        { jobId: uniqueJobId },
    );

    console.log(`Job added with Id: ${uniqueJobId}`);
}

addJob();
