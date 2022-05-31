import { RequestHandler } from "express";
import { sendPlaybackEventEmbed } from "../services/discord";
import { PlexWebhookPayload, PlexWebhookRequest } from "../types/plex";

type PlexWebhookReqHandler = RequestHandler<
  unknown,
  unknown,
  PlexWebhookRequest,
  unknown
>;

export const handleEvent: PlexWebhookReqHandler = (req, res) => {
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

  // TODO: Store image in redis

  if (event === "media.play" && isVideo) {
    sendPlaybackEventEmbed(parsed);
  }

  res.status(200);
};
