# 00 — Overview: What Clawd Can Do

Clawd Code is a **Solana-native AI coding agent** — the CLI that ships with 70+ skills for trading, research, protocol development, and autonomous agent operations.

## Capabilities

| Domain | What you can do | Core skills |
|--------|----------------|-------------|
| **Trading** | Spot swaps, perpetuals, memecoin launches, prediction markets | `jupiter`, `imperial`, `vulcan`, `dflow-spot-trading`, `pumpfun-trading`, `dflow-kalshi-trading` |
| **Deep Research** | Web search, on-chain analytics, token screening, wallet intelligence | `scanner`, `dex-screener-scanner`, `helius`, `birdeye`, `onchain` |
| **Payments** | x402 USDC micropayments, MPP subscription delegations, per-request billing | `x402`, `pay-subscriptions`, `sponge-wallet` |
| **Protocol Dev** | Anchor programs, compressed tokens/PDAs, Solana architecture | `solana-dev`, `svm`, `compressed-pda`, `compressed-token`, `zk` |
| **Agent Identity** | On-chain agent NFTs (Metaplex Core), SIWS auth, Cheshire Terminal Arena | `agent-auth`, `cheshire-terminal`, `clawd-agent-launchpad` |
| **Infra & Deploy** | Fly.io, Vercel, Docker, MCP servers, health checks | `clawd-code/deploy`, `clawd-code/build` |
| **Voice & Telegram** | clawd-bot, voice commands, LiveKit streaming | `voice-call`, `clawd-telegram` |

## Key workflows

1. **Setup** → `01-setup-clawd.md`
2. **Wallet + auth** → `02-wallet-and-auth.md`
3. **Trading** → `03-trading-spot-perps.md`, `04-memecoin-launches.md`
4. **Research** → `05-deep-research.md`
5. **Build** → `06-solana-protocol-dev.md`
6. **Deploy** → `15-deploy-production.md`

## Skill discovery

Skills are auto-discovered based on your intent. Prefix commands with the skill slug:

```
/clawd:jupiter swap SOL to USDC on mainnet with 1% slippage
/clawd:trade open a long on SOL-PERP at $150 with 10x via Vulcan
/clawd:research analyze the top 10 wallets holding $CLAWD
/clawd:build scaffold an Anchor program for a staking vault
```

## Prerequisites

- [Bun](https://bun.sh) ≥ 1.1
- `clawd-code` installed (see `01-setup-clawd.md`)
- `clawd-plugin/` loaded (auto-starts Helius MCP, Pump MCP, Phoenix Rise, DFlow, ZK Compression)
- A Solana wallet with USDC or $CLAWD for paid operations