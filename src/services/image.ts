import axios from "axios";
import { Request } from "express";
import sha1 from "sha1";
import sharp from "sharp";
import { PlexWebhookPayload, PlexWebhookRequest } from "../types/plex";
import { getCachedImage, saveImageToCache } from "./redis";

const appURL = process.env.APP_URL;

const getBuffer = async (
  payload: PlexWebhookPayload,
  req: Request<unknown, unknown, PlexWebhookRequest, unknown, Record<string, any>>
) => {
  if (req.file && req.file.buffer) return req.file.buffer;

  if (payload.thumb) {
    try {
      const bufferRes = await axios.get(payload.thumb);
      return bufferRes.data as Buffer;
    } catch (e) {
      console.error("Error fetching thumbnail");
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
    console.log(`Using cached image ${key}`);
    return `${appURL}/images/${key}`;
  }

  const buffer = await getBuffer(payload, req);

  if (buffer) {
    const image = await sharp(buffer)
      .resize({
        height: 75,
        width: 75,
        fit: "contain",
        background: "white"
      })
      .toBuffer();

    await saveImageToCache(key, image);

    return `${appURL}/images/${key}`;
  }

  return null;
};
