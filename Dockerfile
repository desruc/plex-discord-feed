# Build layer
FROM node:lts-alpine AS build
RUN mkdir -p /usr/plex-discord-feed-src/
WORKDIR /usr/plex-discord-feed-src/
COPY package.json /usr/plex-discord-feed-src/
RUN npm install
COPY . /usr/plex-discord-feed-src/
RUN npm run build

# Image layer
FROM node:lts-alpine

ARG APP_URL
ARG DISCORD_WEBHOOK_URL
ARG REDIS_URL

ENV APP_URL=${APP_URL}
ENV DISCORD_WEBHOOK_URL=${DISCORD_WEBHOOK_URL}
ENV REDIS_URL=${REDIS_URL}

ENV NODE_ENV=production

RUN mkdir -p /usr/plex-discord-feed
WORKDIR /usr/plex-discord-feed
COPY package.json /usr/plex-discord-feed/
RUN npm install --omit=dev
COPY --from=build /usr/plex-discord-feed-src/dist /usr/plex-discord-feed

CMD ["npm", "run", "start:prod"]
