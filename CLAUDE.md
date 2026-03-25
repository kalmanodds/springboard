# Springboard

Docker-label driven home server dashboard. Automatically discovers apps via Docker labels on containers and renders a grouped tile grid.

## Stack
- Astro 6 (SSR, `output: 'server'`)
- `@astrojs/node` standalone adapter
- Tailwind CSS v4 (via `@tailwindcss/vite` — no config file needed)
- `astro-icon` v1 with `@iconify-json/mdi` and `@iconify-json/simple-icons`
- `dockerode` for Docker socket communication
- Bun as package manager and runtime

## Running locally
```bash
bun install
bun run dev        # dev server on :4321
```

## Docker (full stack with example apps)
```bash
docker compose up --build -d   # springboard + 6 example labelled containers
```
Dashboard available at http://localhost:4321.

## How discovery works
Springboard reads `/var/run/docker.sock` at request-time (server-side, no caching). Any container with these labels appears on the dashboard:

| Label | Required | Description |
|---|---|---|
| `dash.enable` | Yes — must be `"true"` | Opt-in to dashboard |
| `dash.name` | Yes | Display name |
| `dash.category` | Yes | Grouping header |
| `dash.url` | Yes | Link target |
| `dash.icon` | Yes | Iconify identifier e.g. `mdi:plex` |
| `dash.description` | No | Subtext on tile |

## Key files
- `src/lib/types.ts` — `App` and `GroupedApps` types
- `src/lib/docker.ts` — dockerode integration, label parsing, grouping by category
- `src/components/AppTile.astro` — tile card with icon + status dot
- `src/components/StatusDot.astro` — animated pulse for running / stopped / paused
- `src/components/CategorySection.astro` — responsive CSS grid with heading
- `src/pages/index.astro` — SSR page, zero client JS
- `docker-compose.yml` — mounts `/var/run/docker.sock:ro`, includes 6 example services

## TODO
- Create a public Docker registry account (Docker Hub or GHCR) and set up automated image builds so users can use `image: username/springboard:latest` instead of building from source. Update the README and docker-compose accordingly.

## Git commits
- Do NOT add `Co-Authored-By` trailers for AI agents in commit messages

## Example label config
```yaml
labels:
  - "dash.enable=true"
  - "dash.name=Plex"
  - "dash.category=Media"
  - "dash.icon=simple-icons:plex"
  - "dash.url=http://192.168.1.50:32400"
  - "dash.description=Media server"
```
