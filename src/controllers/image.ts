import { RequestHandler } from "express";
import sharp from "sharp";
import { logger } from "~/core/logger";
import { getCachedImage } from "~/services/redis";

// eslint-disable-next-line
export const getImage: RequestHandler = async (req, res, next) => {
  const exists = await getCachedImage(req.params.key);

  if (!exists) {
    logger.info("Image does not exist", { key: req.params.key });
    return next();
  }

  res.type("image/jpeg");

  sharp(exists).jpeg().pipe(res);
};
