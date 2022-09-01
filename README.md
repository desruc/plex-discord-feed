<h1 align="center">
    Plex Discord Feed
</h1>

## What it does

This is a small server that will post Plex events to Discord. It listens for Plex events, parses them, then creates and posts an embed to the configured Discord webhook.

Plex posts image content with its events. These are recieved and cached in Redis for 7 days.

The server will still work if you do not have Redis configured (it just won't include an image on the embed).

## Getting started

- Create a Plex webhook hook and point it to `http://[YOUR_IP]:[PORT]/plex-event`
- Create a Discord webhook
- Create an `.env` file based off `.env.example` and fill out the values
- Run `docker-compose up` if you want to spin up a local Redis instance (used for images)
  - Discord won't actually see images from `localhost`. It requires all images to be from `https`.
- Install the packages and run the `start` script!
