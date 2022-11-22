import { RequestHandler } from "express";
import sharp from "sharp";
import { getCachedImage } from "~/services/redis";

// eslint-disable-next-line
export const getImage: RequestHandler = async (req, res, next) => {
  const exists = await getCachedImage(req.params.key);

  if (!exists) return next();

  res.set("Content-Type", "image/webp");

  sharp(exists).jpeg().pipe(res);

  next();
};
