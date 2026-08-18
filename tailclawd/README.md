# tailclawd

Local UI and Tailscale proxy for monitoring Clawd / Claude coding sessions.

`tailclawd` sits next to an iii engine bridge: it serves a small dashboard on your machine, optionally publishes it to your Tailnet, and streams session activity, usage, metrics, and chat events from the engine.

## What it does

- Serves a monitoring UI (proxy port **3110**) and an iii API surface (port **3111**)
- Connects to the engine over WebSocket (`III_BRIDGE_URL`)
- Indexes sessions, traces, usage, and activity for the dashboard
- On engine start, checks Tailscale and can publish the UI via `tailscale serve`
- Falls back to local-only mode at `http://127.0.0.1:3110` when Tailscale is unavailable

## Install

```bash
cd tailclawd
npm install
```

Requires Node.js 18+ and the [Tailscale](https://tailscale.com/) CLI if you want Tailnet publish (optional for local-only use).

## Run

```bash
# Development (tsx)
npm run dev

# Production-style start
npm start
```

Both scripts run `src/index.ts`.

Open the UI at:

- Local: `http://127.0.0.1:3110`
- Tailnet: hostname from `tailscale status` (when serve is active)

## Environment

| Variable | Default | Purpose |
|---|---|---|
| `III_BRIDGE_URL` | `ws://localhost:49134` | WebSocket URL for the iii engine bridge |
| `TAILCLAWD_TOKEN` | _(unset)_ | Optional bearer token for proxy API auth |
| `TAILCLAUDE_TOKEN` | _(unset)_ | Legacy alias for `TAILCLAWD_TOKEN` |
| `NODE_ENV` | _(unset)_ | Set to `production` to cache the embedded UI HTML |

If neither token env is set, the proxy is open to all Tailnet peers (and localhost). Prefer setting `TAILCLAWD_TOKEN` when publishing beyond the local machine.

## Ports

| Port | Role |
|---:|---|
| **3110** | HTTP UI + proxy (`PROXY_PORT`) |
| **3111** | iii HTTP API (`III_PORT`) |

Tailscale serve targets `http://127.0.0.1:3110`.

## Layout

```text
tailclawd/
  package.json
  README.md
  src/
    index.ts              # entry — hooks, events, proxy start
    iii.ts                # engine WebSocket (III_BRIDGE_URL)
    proxy.ts              # HTTP server, auth, UI, API routes
    ui.html               # dashboard shell
    hooks.ts              # useApi / useEvent / useCron helpers
    state.ts              # shared state store
    sessions.ts           # session index
    streams.ts            # chat event streams
    activity.ts           # activity feed + SSE
    usage.ts              # daily usage stats
    metrics.ts            # live metrics collector
    metrics-timeline.ts   # metric snapshots / alerts
    traces.ts             # completed/stopped traces
    session-costs.ts      # per-session cost backfill
    handlers/
      health.ts           # GET health
      setup.ts            # engine::started → Tailscale check/publish
      cleanup.ts
      shutdown.ts
```

## Tailscale notes

On `engine::started`, the setup handler:

1. Runs `tailscale ip -4`
2. Stores Tailscale IP in config state
3. Publishes the UI with `tailscale serve` if not already listening

Without Tailscale, the process still runs and logs local-only mode at port 3110.

## Dependencies

Runtime: `iii-sdk`, `qrcode`. Dev: `tsx`, `typescript`, Node types.

## Related packages

- [`clawd-code`](../clawd-code) — Solana-native AI coding CLI
- [`clawd-grok`](../clawd-grok) — Bun-native agent runtime
- [`clawdrouter`](../clawdrouter) — OpenAI-compatible LLM router
