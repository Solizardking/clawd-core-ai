# 15 — Deploy to Production

Deploy ClawdRouter, clawd-code, and Clawd Connectors to production — Fly.io, Vercel, Docker, secret management, and health monitoring.

## Fly.io (recommended)

The ClawdRouter is pre-configured for Fly.io with `fly.toml` at the package root.

```bash
cd core-ai/clawd-router

# Build
npm install && npm run build && npm test

# Deploy
flyctl deploy --app clawdrouter-zk --local-only --yes

# Set secrets
flyctl secrets set -a clawdrouter-zk \
  OPENROUTER_API_KEY=or-... \
  HELIUS_API_KEY=... \
  SOLANA_RPC_URL=https://api.mainnet-beta.solana.com \
  CLAWDROUTER_PAY_TO=your_wallet_public_key

# Check live
curl https://clawdrouter-zk.fly.dev/health
curl https://clawdrouter-zk.fly.dev/v1/models
```

### fly.toml config

```toml
app = 'clawdrouter-zk'
primary_region = 'ewr'

[http_service]
  internal_port = 8402
  force_https = true
  auto_stop_machines = 'stop'
  auto_start_machines = true
  min_machines_running = 1

[[vm]]
  memory = '512mb'
  cpus = 1
```

### Production checks

```bash
# Health
curl https://your-app.fly.dev/health

# Models
curl https://your-app.fly.dev/v1/models | jq '.data | length'

# Web UI
curl https://your-app.fly.dev/web/

# Payment config
curl https://your-app.fly.dev/v1/web/config

# Stats
curl https://your-app.fly.dev/v1/stats
```

## Vercel (MCP server)

The `mcp-server/` deploys to Vercel via `vercel.json`.

```bash
cd mcp-server
vercel --prod
```

Routes exposed: `/health`, `/mcp`, `/sse`, `/messages`.

## Docker

```bash
# Build the image (includes web/ + dist/)
docker build -t clawdrouter -f core-ai/clawd-router/Dockerfile .

# Run locally
docker run --rm -p 8402:8402 \
  -e OPENROUTER_API_KEY=or-... \
  -e CLAWDROUTER_HOSTED=true \
  clawdrouter

# Health
curl http://localhost:8402/health
```

## Secret management

| Secret | Env var | Where to set |
|--------|---------|-------------|
| OpenRouter key | `OPENROUTER_API_KEY` | Fly secrets / Docker env |
| Helius key | `HELIUS_API_KEY` | Fly secrets / Docker env |
| Solana RPC | `SOLANA_RPC_URL` / `CLAWDROUTER_SOLANA_RPC_URL` | Fly secrets / Docker env |
| Payment recipient | `CLAWDROUTER_X402_PAY_TO` / `CLAWDROUTER_PAY_TO` | Fly secrets |
| API key validation | `DATABASE_URL` / `CLAWDROUTER_VALIDATION_URL` | Fly secrets |
| Hub secret | `CLAWDROUTER_HUB_SECRET` | Fly secrets |

## 0-downtime deploy

Fly uses rolling updates — one machine at a time:

```bash
# Hot update (machine stays running)
flyctl deploy --app clawdrouter-zk --local-only

# Check after deploy
flyctl status -a clawdrouter-zk
flyctl logs -a clawdrouter-zk
```

## Production checklist

- [ ] Set all secrets via `flyctl secrets set`
- [ ] Verify `/health` returns `{"status":"ok"}`
- [ ] Verify `/v1/models` returns model list
- [ ] Verify `/web/` serves the UI
- [ ] Set `min_machines_running: 1` (no cold starts)
- [ ] Enable `auto_start_machines: true`
- [ ] Verify OpenRouter API key is configured
- [ ] Set up monitoring alerts for `/health` failures
- [ ] Add custom domain: `flyctl certs create your-domain.com`

Next → `16-testing-observability.md`