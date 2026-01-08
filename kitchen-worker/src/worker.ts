import Redis from "ioredis";
import { PrismaClient } from "@prisma/client";

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: 6379,
});

const prisma = new PrismaClient();

console.log("Kitchen Worker connecting to DB & Redis...");

async function processQueue() {
  while (true) {
    try {
      // BLPOP = Blocking Left Pop
      // It asks Redis: "Give me the next item from 'pizza-queue'"
      // The '0' means: "Wait FOREVER if the queue is empty"
      const result = await redis.blpop("pizza-queue", 0);

      if (result) {
        // Parse the payload
        const job = JSON.parse(result[1]);
        console.log("-----------------------------------------");
        console.log(`Received Order #${job.id}: ${job.type}`);

        // 1. Update to PROCESSING
        await prisma.order.update({
          where: { id: job.id },
          data: { status: "PROCESSING" },
        });

        console.log(`Cooking Order #${job.id}...`);
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // 2. Update to COMPLETED
        await prisma.order.update({
          where: { id: job.id },
          data: { status: "COMPLETED" },
        });

        console.log(`Order #${job.id} is Ready!`);
        console.log("_________________________________________");
      }
    } catch (err) {
      console.error("Error:", err);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

processQueue();
