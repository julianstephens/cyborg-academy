import Redis from "ioredis";
import { env } from "./env";
import logger from "./logger";

export const redisClient = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
});

export async function checkCacheConnection() {
  try {
    await redisClient.get("ping");
    logger.info("cache connection healthy");
  } catch (error) {
    logger.error("cache connection check failed:", error);
    throw error;
  }
}
await checkCacheConnection();

export class RedisStore {
  client: Redis;

  constructor(client: Redis) {
    this.client = client;
  }

  get = async (key: string) => {
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : data;
  };

  set = async (key: string, value: object, ttl?: number) => {
    if (ttl) {
      return this.client.set(key, JSON.stringify(value), "EX", ttl);
    }
    return this.client.set(key, JSON.stringify(value));
  };

  lpush = async (key: string, value: string[]) => {
    return this.client.lpush(key, ...value);
  };

  all = async (key: string) => {
    return this.client.lrange(key, 0, -1);
  };

  del = async (key: string) => {
    return this.client.del(key);
  };
}
export const store = new RedisStore(redisClient);
