// src/worker.ts
import Redis from "ioredis";

// Connect to the same Redis instance as your API
const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: 6379,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

redis.on("connect", () => {
  console.log("✅ Connected to Redis");
});

redis.on("error", (err) => {
  console.log("⚠️  Redis connection error (will retry):", err.message);
});

console.log("👨‍🍳 Kitchen Worker is listening for orders...");

async function processQueue() {
  // Infinite loop: Workers never stop!
  while (true) {
    try {
      // BLPOP = Blocking Left Pop
      // It asks Redis: "Give me the next item from 'pizza-queue'"
      // The '0' means: "Wait FOREVER if the queue is empty"
      const result = await redis.blpop("pizza-queue", 0);

      if (result) {
        // result[0] is the queue name ('pizza-queue')
        // result[1] is the value ('pepperoni')
        const pizzaType = result[1];

        console.log(`Cooking ${pizzaType}...`);

        // Simulate 3 seconds of heavy processing
        await new Promise((resolve) => setTimeout(resolve, 3000));

        console.log(`${pizzaType} is ready!`);
      }
    } catch (err) {
      console.error("Error processing order:", err);
      // Wait 1 second before retrying to avoid crashing the loop
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

processQueue();
