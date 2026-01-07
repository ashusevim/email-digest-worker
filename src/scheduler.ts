import { Queue } from "bullmq";

const emailQueue = new Queue("email-queue", {
    connection: {
        host: "127.0.0.1",
        port: 6379,
    },
});

async function schedule() {
    await emailQueue.add(
        "daily-digest",
        {
            email: "atankmember@gmail.com",
        },
        {
            repeat: {
                pattern: "*/10 * * * * *", // runs every 10 seconds
            },
        },
    );

    console.log("Digest scheduled to run every 10 seconds");
}

schedule();
