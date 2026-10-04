import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 3) {
        return new Error("Redis:maximum retries reached");
      }
      return Math.min(retries * 50, 200); // Exponential backoff with a maximum delay of 500ms
    },
  },
});

redisClient.on("connect", () => {
  console.log("Redis is Connected");
});

redisClient.on("error", (err) => {
  console.log("Error while connecting to Redis", err.message);
});

try {
  await redisClient.connect();
} catch (err) {
  console.log(err);
}

export default redisClient;
