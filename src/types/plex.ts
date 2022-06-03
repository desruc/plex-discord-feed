type PlexWebhookEvent =
  | "library.on.deck"
  | "library.new"
  | "playback.started"
  | "media.play";

export interface PlexPayloadMetadata {
  librarySectionType: string;
  ratingKey: string;
  key: string;
  parentRatingKey: string;
  grandparentRatingKey: string;
  guid: string;
  librarySectionID: number;
  type: string;
  title: string;
  grandparentKey: string;
  parentKey: string;
  grandparentTitle: string;
  parentTitle: string;
  summary: string;
  index: number;
  parentIndex: number;
  ratingCount: number;
  thumb: string;
  art: string;
  parentThumb: string;
  grandparentThumb: string;
  grandparentArt: string;
  addedAt: number;
  updatedAt: number;
  tagline: string;
  originallyAvailableAt: string;
  year: string;
}

export interface PlexWebhookPayload {
  event: PlexWebhookEvent;
  user: boolean;
  owner: boolean;
  thumb: string;
  Account: {
    id: number;
    thumb: string;
    title: string;
  };
  Server: {
    title: string;
    uuid: string;
  };
  Player: {
    local: boolean;
    publicAddress: string;
    title: string;
    uuid: string;
  };
  Metadata: PlexPayloadMetadata;
}

export interface PlexWebhookRequest {
  payload: PlexWebhookPayload;
}
