# `docker/`

Containerized deployment for the Clawd Code web terminal.

## Contents

| File | Purpose |
|---|---|
| `Dockerfile` | Multi-stage build — Stage 1 compiles the `node-pty` native addon and bundles the CLI on `oven/bun:1`; Stage 2 copies build artifacts into a slim runtime image |
| `docker-compose.yml` | Single-service compose file (`claude-web`), maps port `3000`, mounts a `claude-data` volume for persisted session/config state, ships a `/health` healthcheck |
| `entrypoint.sh` | Container entrypoint — validates `ANTHROPIC_API_KEY` is set before boot, forwards env vars to child PTY processes |

## Usage

```bash
# Build
docker build -f docker/Dockerfile -t clawd-code-web .

# Run directly
docker run -p 3000:3000 -e ANTHROPIC_API_KEY=sk-ant-... clawd-code-web

# Or via compose (reads .env)
ANTHROPIC_API_KEY=sk-ant-... docker-compose -f docker/docker-compose.yml up
```

Required env: `ANTHROPIC_API_KEY`. Optional: `AUTH_TOKEN` (endpoint protection), `MAX_SESSIONS`, `ALLOWED_ORIGINS`, `PORT` (default `3000`).

> The build context is `..` (repo root) — run `docker build` from the `clawd-code/` directory, not from inside `docker/`.
