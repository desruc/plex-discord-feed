import axios from "axios";
import { PlexWebhookPayload } from "~/types/plex";
import env from "~/core/env";
import { formatSubtitle, formatTitle } from "~/utils/stringHelpers";
import { logger } from "~/core/logger";

const discordEmbedColors = [
  0, 1752220, 1146986, 3066993, 2067276, 3447003, 2123412, 10181046, 7419530,
  15277667, 11342935, 15844367, 12745742, 15105570, 11027200, 15158332, 10038562,
  9807270, 9936031, 8359053, 12370112, 3426654, 2899536, 16776960
];

export const sendPlaybackEventEmbed = async (
  event: PlexWebhookPayload,
  imageUrl: string | null
) => {
  const thumbnail = imageUrl ? { thumbnail: { url: imageUrl } } : {};

  const playbackEmbed = {
    embeds: [
      {
        title: "MEDIA.PLAY",
        color:
          discordEmbedColors[Math.floor(Math.random() * discordEmbedColors.length)],
        ...thumbnail,
        fields: [
          {
            name: "User",
            value: event.Account.title
          },
          {
            name: "Title",
            value: formatTitle(event.Metadata)
          },
          {
            name: "Subtitle",
            value: formatSubtitle(event.Metadata)
          }
        ]
      }
    ]
  };

  if (env.DISCORD_WEBHOOK_URL) {
    await axios
      .post(env.DISCORD_WEBHOOK_URL, playbackEmbed, {
        headers: {
          "content-type": "application/json"
        }
      })
      .catch((error) => logger.error("Error sending to webhook", { error }));
  }
};
