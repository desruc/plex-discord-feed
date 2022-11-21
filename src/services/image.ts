import axios from "axios";
import { Request } from "express";
import sha1 from "sha1";
import sharp from "sharp";
import { logger } from "~/core/logger";
import { PlexWebhookPayload, PlexWebhookRequest } from "~/types/plex";
import { getCachedImage, isRedisConfigured, saveImageToCache } from "./redis";

const appURL = process.env.APP_URL;

const getBuffer = async (
  payload: PlexWebhookPayload,
  req: Request<unknown, unknown, PlexWebhookRequest, unknown, Record<string, any>>
) => {
  if (!isRedisConfigured) {
    logger.info("Redis not configured. Skipping image.");
    return null;
  }

  if (req.file && req.file.buffer) {
    logger.info("Using request file");
    return req.file.buffer;
  }

  if (payload.thumb) {
    try {
      logger.info("Attempting to fetch thumbnail", { ur: payload.thumb });
      const bufferRes = await axios.get(payload.thumb);
      return bufferRes.data as Buffer;
    } catch (error) {
      logger.error("Error fetching thumbnail", { error });
      return null;
    }
  }

  return null;
};

export const getImageUrl = async (
  payload: PlexWebhookPayload,
  req: Request<unknown, unknown, PlexWebhookRequest, unknown, Record<string, any>>
) => {
  const key = sha1(payload.Server.uuid + payload.Metadata.ratingKey);

  const existing = await getCachedImage(key);

  if (existing) {
    logger.info("Using cached image", { key });
    return `${appURL}/images/${key}`;
  }

  const buffer = await getBuffer(payload, req);

  if (buffer && isRedisConfigured) {
    const image = await sharp(buffer)
      .resize({
        height: 75,
        width: 75,
        fit: "contain",
        background: "white"
      })
      .toBuffer();

    await saveImageToCache(key, image);

    const imageUrl = `${appURL}/images/${key}`;

    logger.info("Image saved to cache", { url: imageUrl });

    return imageUrl;
  }

  return null;
};
