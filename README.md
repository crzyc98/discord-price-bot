# Discord Price Bot

A Discord bot for tracking prices, built with Node.js and Docker.

## Setup

1. Make sure you have Docker and Docker Compose installed
2. Create a `config.json` file in `/mnt/tank/appdata/discordpricebot/config/`
3. Run the bot using Docker Compose:

```bash
docker-compose up -d
```

## Building

To build and push the Docker image:

```bash
./build.sh
```

## Configuration

The bot expects a `config.json` file mounted at `/app/config.json` inside the container. Make sure to configure your Discord bot token and other settings in this file.

## Docker Image

The Docker image is available on Docker Hub:
```bash
docker pull crzyc/discordpricebot:consolidated
```
