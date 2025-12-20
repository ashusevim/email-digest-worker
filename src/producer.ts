import { Queue } from "bullmq";

interface userData {
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
    const job = await emailQueue.add("send-digest", {
        userId: 1,
        email: "user1@gmail.com",
    });

    console.log(`Job added with Id: ${job.userId}`);
    process.exit();
}

addJob();
