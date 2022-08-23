import Redis from "ioredis";

const SEVEN_DAYS = 7 * 24 * 60 * 60; // in seconds

const redisClient = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : null;

export const isRedisConfigured = redisClient !== null;

export const getCachedImage = async (key: string) => {
  if (redisClient) {
    const image = await redisClient.getBuffer(key);
    return image;
  }

  return null;
};

export const saveImageToCache = async (key: string, image: Buffer) => {
  if (redisClient) await redisClient.set(key, image, "EX", SEVEN_DAYS);
};
