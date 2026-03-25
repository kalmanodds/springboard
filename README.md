# Springboard

![Springboard banner](assets/banner.jpg)

A home server dashboard that keeps itself up to date automatically. Add a few lines to any container in your stack and it shows up on the dashboard — grouped, linked, and with a live status indicator. No config files, no manual lists.

## How it works

Springboard mounts the Docker socket and reads container labels at request time. Any container with the right labels appears on the dashboard, grouped by category, with a live status indicator.

## Adding Springboard to your stack

Add the following service to your existing `docker-compose.yml`:

```yaml
services:
  springboard:
    image: ghcr.io/yourusername/springboard:latest
    ports:
      - "4321:4321"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    restart: unless-stopped
    environment:
      HOST: 0.0.0.0
      PORT: 4321
```

Then visit `http://<your-server-ip>:4321`.

## Labelling your services

To make a container appear on the dashboard, add `dash.*` labels to it:

```yaml
services:
  plex:
    image: plexinc/pms-docker
    labels:
      dash.enable: "true"
      dash.name: "Plex"
      dash.category: "Media"
      dash.icon: "simple-icons:plex"
      dash.url: "http://192.168.1.50:32400"
      dash.description: "Media server"
```

### Available labels

| Label | Required | Description |
|---|---|---|
| `dash.enable` | Yes — must be `"true"` | Opt-in to the dashboard |
| `dash.name` | Yes | Display name on the tile |
| `dash.category` | Yes | Groups tiles under a shared heading |
| `dash.url` | Yes | Where the tile links to |
| `dash.icon` | Yes | Iconify icon identifier, e.g. `mdi:plex` or `simple-icons:grafana` |
| `dash.description` | No | Short subtext shown below the name |

Icons are sourced from [Iconify](https://icon-sets.iconify.design/) — search there to find the right identifier for your app.

## Running locally (development)

```bash
bun install
bun run dev     # dev server on :4321
```

To spin up Springboard alongside a set of example labelled containers:

```bash
docker compose up --build -d
```

This starts Springboard and six placeholder services so you can see the dashboard populated without needing real apps running.
