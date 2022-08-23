import { RequestHandler } from "express";
import { getImageUrl } from "~/services/image";
import { sendPlaybackEventEmbed } from "~/services/discord";
import { PlexWebhookPayload, PlexWebhookRequest } from "~/types/plex";
import { logger } from "~/core/logger";

type PlexWebhookReqHandler = RequestHandler<
  unknown,
  unknown,
  PlexWebhookRequest,
  unknown
>;

export const handleEvent: PlexWebhookReqHandler = async (req, res) => {
  const { payload } = req.body;

  // TODO: Validate payload
  // eslint-disable-next-line
  // @ts-ignore
  const parsed = JSON.parse(payload as PlexWebhookPayload);

  const { event } = parsed;

  logger.info("EVENT RECIEVED", { event });

  const isVideo = ["movie", "episode"].includes(parsed.Metadata.type);

  if (event === "media.play" && isVideo) {
    const image = await getImageUrl(parsed, req);
    sendPlaybackEventEmbed(parsed, image);
  }

  res.status(200);
};
