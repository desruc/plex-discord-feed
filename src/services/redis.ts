import Redis from "ioredis";

const SEVEN_DAYS = 7 * 24 * 60 * 60; // in seconds

const redisClient = new Redis(process.env.REDIS_URL!);

export const getCachedImage = async (key: string) => {
  const image = await redisClient.getBuffer(key);
  return image;
};

export const saveImageToCache = (key: string, image: Buffer) =>
  redisClient.set(key, image, "EX", SEVEN_DAYS);
