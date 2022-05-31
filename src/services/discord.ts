import axios from "axios";
import { PlexPayloadMetadata, PlexWebhookPayload } from "../types/plex";
import env from "../core/env";

const discordEmbedColors = [
  0, 1752220, 1146986, 3066993, 2067276, 3447003, 2123412, 10181046, 7419530,
  15277667, 11342935, 15844367, 12745742, 15105570, 11027200, 15158332, 10038562,
  9807270, 9936031, 8359053, 12370112, 3426654, 2899536, 16776960
];

// https://github.com/plexinc/webhooks-slack/blob/master/index.js#L148
function formatTitle(metadata: PlexPayloadMetadata) {
  if (metadata.grandparentTitle) {
    return metadata.grandparentTitle;
  }

  let ret = metadata.title;

  if (metadata.year) {
    ret += ` (${metadata.year})`;
  }

  return ret;
}

// https://github.com/plexinc/webhooks-slack/blob/master/index.js#L160
function formatSubtitle(metadata: PlexPayloadMetadata) {
  let ret = "";

  if (metadata.grandparentTitle) {
    if (metadata.type === "track") {
      ret = metadata.parentTitle;
    } else if (metadata.index && metadata.parentIndex) {
      ret = `S${metadata.parentIndex} E${metadata.index}`;
    } else if (metadata.originallyAvailableAt) {
      ret = metadata.originallyAvailableAt;
    }

    if (metadata.title) {
      ret += ` - ${metadata.title}`;
    }
  } else if (metadata.type === "movie") {
    ret = metadata.tagline;
  }

  return ret;
}

export const sendPlaybackEventEmbed = async (event: PlexWebhookPayload) => {
  const playbackEmbed = {
    embeds: [
      {
        title: "MEDIA.PLAY",
        color:
          discordEmbedColors[Math.floor(Math.random() * discordEmbedColors.length)],
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

  await axios
    .post(env.DISCORD_WEBHOOK_URL!, playbackEmbed, {
      headers: {
        "content-type": "application/json"
      }
    })
    .catch((e) => console.error(e));
};
