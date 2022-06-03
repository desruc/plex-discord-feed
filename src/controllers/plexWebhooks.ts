import { RequestHandler } from "express";
import { getImageUrl } from "../services/image";
import { sendPlaybackEventEmbed } from "../services/discord";
import { PlexWebhookPayload, PlexWebhookRequest } from "../types/plex";

type PlexWebhookReqHandler = RequestHandler<
  unknown,
  unknown,
  PlexWebhookRequest,
  unknown
>;

export const handleEvent: PlexWebhookReqHandler = async (req, res) => {
  const { payload } = req.body;

  // eslint-disable-next-line
  // @ts-ignore
  const parsed = JSON.parse(payload as PlexWebhookPayload);

  const {
    event,
    Account: { title: user }
  } = parsed;

  console.log("EVENT RECIEVED: ", event);
  console.log("USER: ", user);

  const isVideo = ["movie", "episode"].includes(parsed.Metadata.type);

  if (event === "media.play" && isVideo) {
    const image = await getImageUrl(parsed, req);
    sendPlaybackEventEmbed(parsed, image);
  }

  res.status(200);
};
