import Redis from "ioredis";
import { env } from "./env";
import IoRedisStore from "route-cache/ioRedisStore";
import logger from "./logger";

export const redisClient = new Redis({
  host: env.REDIS_HOST,
  port: 6379,
  password: env.REDIS_PASSWORD,
});

async function checkCacheConnection() {
  try {
    await redisClient.get("ping");
    logger.info("cache connection healthy");
  } catch (error) {
    logger.error("cache connection check failed:", error);
    throw error;
  }
}
await checkCacheConnection();

export const cacheStore = new IoRedisStore(redisClient);
