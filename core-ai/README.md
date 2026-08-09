# Clawd Core AI

The Clawd-wrapped Helius AI tooling repository — live Solana infrastructure, Helius skills, MCP tooling, and Clawd Code integration for lobster-native agents.

[![Buy $CLAWD](https://img.shields.io/badge/Buy_%24CLAWD-Phantom-blueviolet?style=flat-square)](https://phantom.com/tokens/solana/8cHzQHUS2s2h8TzCmfqPKYiM4dSt4roa3n7MyRLApump)
[![Dexscreener](https://img.shields.io/badge/Chart-Dexscreener-green?style=flat-square)](https://dexscreener.com/solana/8cHzQHUS2s2h8TzCmfqPKYiM4dSt4roa3n7MyRLApump)
[![Birdeye](https://img.shields.io/badge/Chart-Birdeye-orange?style=flat-square)](https://birdeye.so/token/8cHzQHUS2s2h8TzCmfqPKYiM4dSt4roa3n7MyRLApump)
[![Jupiter](https://img.shields.io/badge/Swap-Jupiter-blue?style=flat-square)](https://jup.ag/swap/SOL-8cHzQHUS2s2h8TzCmfqPKYiM4dSt4roa3n7MyRLApump)
[![Model](https://img.shields.io/badge/Model-DeepSolanaZKr--1-yellow?style=flat-square)](https://huggingface.co/ordlibrary/DeepSolanaZKr-1)
[![Dataset](https://img.shields.io/badge/Dataset-solana--clawd--instruct-blue?style=flat-square)](https://huggingface.co/datasets/solanaclawd/solana-clawd-instruct)

```text
Token:  $CLAWD · 8cHzQHUS2s2h8TzCmfqPKYiM4dSt4roa3n7MyRLApump
Model:  ordlibrary/DeepSolanaZKr-1 · solanaclawd/solana-clawd-1.5b-lora
```

## Clawd Fork Note

This fork keeps the Helius Solana infrastructure surface and replaces the old assistant/plugin identity with Clawd and Clawd Code. The intent is direct: show that the Helius agent tooling can run as a Clawd-native lobster stack while preserving the useful MCP, CLI, and skill machinery.

## Packages

> Directory names below are the actual on-disk paths in this checkout. Older docs in this repo (and some `.github/workflows/`) still refer to a prior `helius-cli` / `helius-mcp` / `helius-skills` / `helius-plugin` layout from before the Clawd rename — those directories no longer exist; the npm package name `helius-mcp` lives on inside [`clawd-mcp`](./clawd-mcp), and no `helius-cli` or `helius-cursor` package exists in this checkout at all.

| Package | Description | Install |
|---|---|---|
| [`clawd-mcp`](./clawd-mcp) | MCP server (npm name `helius-mcp`) with 10 public tools total: 9 routed domains plus `expandResult` | `npx helius-mcp@latest` in `.clawd/settings.json` |
| [`clawd-core`](./clawd-core) | Solana-native agent toolkit (package `@onchainai/clawd-core`, rebranded from `@goat-sdk/core`) — typed tools (`ToolBase`/`createTool()`), a reflect-metadata plugin system, and wallet clients | `npm install @onchainai/clawd-core` |
| [`constitution`](./constitution) | Governance bundle — three/six laws, `CONSTITUTION.md`, `SOUL.md`, `IDENTITY.md`, research-loop `program.md` and `strategy.md` — the authority hierarchy every Clawd spawn inherits | read-only reference |
| [`clawd-plugin`](./clawd-plugin) | Clawd Code plugin — bundles all skills and auto-starts the MCP server | `clawd --plugin-dir ./clawd-plugin` |
| [`.agents/skills`](./.agents/skills) / [`clawd-skills`](./clawd-skills) | Clawd Code skills for building on Solana — `clawd-skills/` is canonical source, `.agents/skills/` is the generated Clawd-native output (`npx tsx scripts/compile-skills.ts`) | discovered automatically by Clawd Code |
| [`clawd-code`](./clawd-code) | Curl-installable Solana-native AI coding CLI (xAI / Anthropic / DeepSeek / OpenRouter) with paper-gated perps workflows | `curl -fsSL https://raw.githubusercontent.com/Solizardking/solana-clawd/main/clawd-code/install.sh \| sh` |
| [`clawd-grok`](./clawd-grok) | Bun-native Clawd / Grok agent runtime — REPL, headless, audio, LSP, MCP, payments, wallet, verify | `bun install && bun run dev` |
| [`clawd-perps-agent`](./clawd-perps-agent) | Specialized perps agent (package `@solanaclawd/clawd-agents-perps`, private): Phoenix Rise, Vulcan, Imperial WS, on-chain MM, TWAMM, Telegram | `cd clawd-perps-agent && npm install && npm run build` |
| [`clawdrouter`](./clawdrouter) | Tiered multi-model LLM routing service (package `@openclawd/clawdrouter`) — deployable as a Cloudflare Worker | `cd clawdrouter && npm install && npm run build` |
| [`mcp-server`](./mcp-server) | Standalone MCP server for pump-sdk and related tooling (package `@pump-fun/mcp-server`) | `npm install && npm run build` |
| [`zk-primitives`](./zk-primitives) | ZK compression / Light Protocol primitives (package `@clawd/zk-primitives`, private) | `npm install && npm run build` |
| [`v3`](./v3) | v3 Clawd runtime (package `open-clawd`) — next-generation Clawd scaffolding | `npm install && npm run build` |
| [`tailclawd`](./tailclawd) | Local UI + Tailscale proxy for Clawd/Claude session monitoring (private) | `cd tailclawd && npm install && npm run dev` |
| [`knowledge`](./knowledge) | Clawd knowledge base — facts, gotchas, patterns, anti-patterns, decisions, API behaviors | read-only reference |
| [`docs`](./docs) | Architecture decision records (ADRs) for the open-clawd stack | read-only reference |

`character/` and `clawd-agents/` are currently empty placeholder directories in this checkout — the perps-agent functionality they'd suggest lives in `clawd-perps-agent/` instead.

## Clawd Code Integration

Use this repository with Clawd Code:

```bash
clawd --plugin-dir ./clawd-plugin
```

For MCP-only setup, add Helius to `.clawd/settings.json`:

```json
{
  "mcpServers": {
    "helius": {
      "command": "npx",
      "args": ["helius-mcp@latest"]
    }
  }
}
```

For ZK Compression and Light Protocol work, also install the Light Protocol skills and enable the documentation MCP:

```bash
npx skills add Lightprotocol/skills
```

```json
{
  "mcpServers": {
    "zkcompression": {
      "type": "http",
      "url": "https://www.zkcompression.com/mcp"
    }
  }
}
```

## clawd-mcp (npm: helius-mcp)

A Model Context Protocol server that exposes Helius and Solana tools directly to Clawd Code and other MCP-compatible clients.

The server exposes 10 public tools total:

- `heliusAccount`
- `heliusWallet`
- `heliusAsset`
- `heliusTransaction`
- `heliusChain`
- `heliusStreaming`
- `heliusKnowledge`
- `heliusWrite`
- `heliusCompression`
- `expandResult`

The routed domain tools take a Helius action name in `action`, for example `heliusWallet` + `getBalance` or `heliusStreaming` + `createWebhook`. Heavy responses are summary-first; use `expandResult` to fetch a full section, range, page, or continuation on demand.

## clawd-skills (canonical source)

Standalone Clawd Code skills turn Clawd into a Solana domain expert. Each skill is a self-contained directory with a `SKILL.md` and reference files. This is the canonical source read by `scripts/compile-skills.ts`; it also holds many more vendored skill packs (Cheshire Terminal, Imperial, Vulcan, Pump, DFlow, etc.) beyond the six below.

| Skill | Invoke | Description |
|---|---|---|
| [`helius`](./clawd-skills/helius) | `/clawd:build` or the Helius skill | Build Solana apps with Helius infrastructure |
| [`helius-dflow`](./clawd-skills/helius-dflow) | `/clawd:dflow` | Build Solana trading apps with DFlow and Helius |
| [`helius-jupiter`](./clawd-skills/helius-jupiter) | `/clawd:jupiter` | Build DeFi apps with Jupiter and Helius |
| [`helius-phantom`](./clawd-skills/helius-phantom) | `/clawd:phantom` | Build frontend Solana apps with Phantom and Helius |
| [`helius-okx`](./clawd-skills/helius-okx) | `/clawd:okx` | Compose OKX DEX/intelligence tooling with Helius |
| [`svm`](./clawd-skills/svm) | `/clawd:svm` | Explore Solana architecture and protocol internals |

For compressed PDA, compressed token, and custom ZK app development, install the upstream Light Protocol skills:

```bash
npx skills add Lightprotocol/skills
```

By default, skill installers now target `~/.clawd/skills/`. Use `--project` to install to `.clawd/skills/` in your current project.

## clawd-plugin

An all-in-one Clawd Code plugin that bundles skills and auto-starts MCP servers.

```bash
clawd --plugin-dir ./clawd-plugin
```

Included skills:

| Skill | Invoke | Description |
|---|---|---|
| Build | `/clawd:build` | Expert Solana developer — Helius APIs, routing logic, SDK patterns |
| DFlow | `/clawd:dflow` | Trading apps — DFlow swaps, prediction markets, KYC, Helius Sender |
| Jupiter | `/clawd:jupiter` | DeFi apps — swaps, lending, limit orders, DCA, transaction submission |
| Phantom | `/clawd:phantom` | Frontend Solana apps — Phantom wallet integration and secure proxying |
| OKX | `/clawd:okx` | DEX aggregation and intelligence integrations |
| SVM | `/clawd:svm` | Solana protocol architecture and internals |

## Generated Content

The following directories are generated by `npx tsx scripts/compile-skills.ts` from canonical sources in `clawd-skills/`:

- `.agents/skills/` — Clawd-native skills + prompt variants
- `clawd-mcp/system-prompts/` — npm-shipped prompt copies (package `helius-mcp`)

Modify canonical sources in `clawd-skills/` and re-run the compiler. It also syncs the `SKILL.md` version stamp into `clawd-plugin/skills/`; a third sync target (`clawd-cursor/skills/`, for Cursor IDE) is referenced in the script but that package doesn't exist in this checkout, so that step is a no-op.

## Development

```bash
cd clawd-mcp   # or any other package directory listed above
pnpm install   # or npm/bun, per that package's lockfile
pnpm build
pnpm test
```

Requirements: Node.js 20+, pnpm, and a Helius API key from https://dashboard.helius.dev.

## Resources

- [Clawd Code](../clawd-code)
- [Helius](https://www.helius.dev/)
- [Helius Docs](https://www.helius.dev/docs)
- [helius-sdk](https://open-clawd.local/helius-labs/helius-sdk)
- [Model Context Protocol](https://modelcontextprotocol.io)
