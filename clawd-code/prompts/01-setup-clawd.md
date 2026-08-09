# 01 — Install Clawd Code

Bootstrap the full Clawd Code agent CLI — Bun runtime, clawd-code binary, the clawd-plugin that auto-starts MCP servers, and the clawd-skills library.

## 1. Install Bun

```bash
curl -fsSL https://bun.sh/install | bash
bun --version  # ≥ 1.1 required
```

## 2. Clone the repo

```bash
git clone https://github.com/Solizardking/clawd-core-ai.git ~/clawd-cloud
cd ~/clawd-cloud/clawd-code
```

## 3. Install dependencies

```bash
bun install
```

Key deps: `@solana/web3.js`, `@modelcontextprotocol/sdk`, `react`, `ink`, `zod`, `chalk`, `commander`, `ws`.

## 4. Install clawd-code globally

```bash
bun link
# or from core-ai:
cd ~/clawd-cloud/core-ai/clawd-code
npm install && npm run build
npm link
```

## 5. Install the clawd-plugin

The plugin bundles all skills and auto-starts 6 MCP servers:

```
.clawd/settings.json → "plugins": ["clawd-plugin"]
```

Or run explicitly:

```bash
clawd --plugin-dir ./clawd-plugin
```

### MCP servers auto-started

| Server | Port/Type | Provides |
|--------|-----------|----------|
| Helius MCP | MCP | 10 routed tools for Solana — DAS, RPC, streaming, compression |
| Pump MCP | MCP | 55 tools — Pump.fun token creation, AMM swaps, analytics, wallet ops |
| Phoenix Rise | MCP | Real-time Phoenix DEX perpetuals market data |
| DFlow | MCP | Trading API, prediction markets, KYC, platform fees |
| ZK Compression | MCP | Light Protocol — compressed tokens, compressed PDAs |
| Clawd Code | MCP | Clawd Code itself as an MCP tool server |

## 6. Install clawd-skills (70+ skills)

```bash
npx skills add Solizardking/skills
# installs to ~/.clawd/skills/
```

Or use the bundled copy:

```bash
ln -s ~/clawd-cloud/clawd-code/clawd-skills ~/.clawd/skills
```

## 7. Verify

```bash
clawd doctor          # system diagnostics
clawd models           # list available models
clawd-connectors status  # check MCP connectors
pay --version          # payment CLI (for x402/subscriptions)
```

## Quick reference

- Settings: `~/.clawd/settings.json`
- Env: `~/.clawd/.env`
- Skills: `~/.clawd/skills/`
- Wallet: `~/.clawd/clawdrouter/wallet.json`

Next → `02-wallet-and-auth.md`