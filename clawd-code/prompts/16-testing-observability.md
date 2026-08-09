# 16 — Testing & Observability

Build test infrastructure, run smoke tests, and wire observability — PostHog analytics, OpenTelemetry tracing, structured logs, and error recovery for the Clawd stack.

## Test infrastructure

### Unit tests (vitest)

The clawd-router uses Node's built-in test runner:

```bash
cd core-ai/clawd-router
npm test        # 65 tests across router, scorer, tunnel, forward, providers
npm run build   # tsc typecheck + build
```

The `clawd-connectors` package uses Node test runner:

```bash
cd clawd-connectors
npm test        # provider factory, ids, status, listTools errors
```

The `clawd-core` package uses Vitest:

```bash
cd clawd-core
npm test
npm run typecheck
npm run build   # tsup → CJS + ESM + DTS
```

### Test suite layout

| Test file | Coverage |
|-----------|----------|
| `tests/router.test.ts` | Model registry, aliases, cost estimation, routing profiles, end-to-end scoring |
| `tests/scorer.test.ts` | 15-dimension request scoring, text extraction, tier determination |
| `tests/tunnel.test.ts` | TunnelHub — auth, hello, heartbeats, eviction, frames |
| `tests/forward.test.ts` | Spoke HTTP forwarders, streaming, accumulate |
| `tests/providers.test.ts` | Connector factory, provider ids, status, MCP listTools |

## Smoke tests

### Local

```bash
# Start the router
cd core-ai/clawd-router && npm run build && node dist/index.js

# Verify endpoints
curl http://localhost:8402/health                    # {"status":"ok",...}
curl http://localhost:8402/v1/models                 # 59 models
curl http://localhost:8402/v1/web/config             # recipient + tokens
curl http://localhost:8402/web/                      # HTML UI
```

### Production

```bash
curl https://clawdrouter-zk.fly.dev/health
curl https://clawdrouter-zk.fly.dev/v1/models | jq '.data | length'
curl https://clawdrouter-zk.fly.dev/v1/web/config
```

## Observability (PostHog)

Wire PostHog analytics into clawd-code (US cloud project):

```bash
npm install posthog-js posthog-node
```

```ts
import { PostHog } from 'posthog-node';

const ph = new PostHog('phc_...', { host: 'https://us.i.posthog.com' });

ph.capture({ distinctId: walletPublicKey, event: 'wallet_connected' });
ph.capture({ distinctId, event: 'trade_executed', properties: { market: 'SOL-PERP', size: 10 } });
ph.capture({ distinctId, event: 'subscription_activated', properties: { plan: 29 } });
```

### Instrumented events

| Event | When |
|-------|------|
| `wallet_connected` | Wallet connects (distinctId = wallet pubkey) |
| `request_routed` | Chat completion routed (model, tier, cost) |
| `trade_executed` | Spot / perp / pump trade |
| `subscription_activated` | MPP subscription starts |
| `subscription_cancelled` | Subscription cancelled |
| `payment_sent` | x402 / pay-per-use payment |

## OpenTelemetry

The leaked Claude Code source uses OpenTelemetry via gRPC. Enable when needed:

```bash
OTEL_EXPORTER_OTLP_ENDPOINT=http://collector:4317 \
OTEL_METRICS_EXPORTER=otlp \
  clawd --trace
```

## Structured logging

Set `CLAWDROUTER_DEBUG=true` for verbose routing:

```bash
# Debug shows scoring + routing decisions
CLAWDROUTER_DEBUG=true node dist/index.js
#   🧠 SIMPLE request, routed to nvidia/gpt-oss-120b
#   → Nvidia GPT-OSS 120B (nvidia/gpt-oss-120b)
```

## Error recovery

The `vulcan-error-recovery` skill handles common trading errors:

- Auth failures → re-auth with retry + backoff
- Rate limits → exponential backoff
- Transaction failures → simulate, analyze, retry
- Network errors → reconnect + resume strategies

```bash
/clawd:vulcan-error-recovery diagnose failed-tx-signature
/clawd:vulcan-error-recovery retry strategy --market SOL
```

## Monitoring checklist

- [ ] `/health` uptime alerts (Fly.io + external monitor)
- [ ] SQL error rate alert (OpenRouter / upstream 5xx)
- [ ] Payment verification error alerts
- [ ] Subscription renewal failure alerts
- [ ] PostHog dashboard for trades, revenue, model usage
- [ ] Cost tracking via `/v1/stats`
- [ ] Gas/SOL balance low alerts
- [ ] Liquidation risk watchers (imperial/vulcan risk skills)

---

**You've completed the full Clawd Code prompt stack.** Return to `README.md` for the full index of all 17 prompts.