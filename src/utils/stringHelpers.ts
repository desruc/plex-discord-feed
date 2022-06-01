import { PlexPayloadMetadata } from "../types/plex";

// https://github.com/plexinc/webhooks-slack/blob/master/index.js#L148
export function formatTitle(metadata: PlexPayloadMetadata) {
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
export function formatSubtitle(metadata: PlexPayloadMetadata) {
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
