<div align="center">

# 🦞 Clawd Cloud — Monorepo

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&duration=2600&pause=900&color=F7931A&center=true&vCenter=true&multiline=true&repeat=true&width=760&height=70&lines=Solana-native+AI+agent+stack.;Clawd+Code+CLI+%C2%B7+Clawd+Core+%C2%B7+Leaked-source+archive.)](https://github.com/Solizardking/clawd-core-ai)

**Solana-native AI agent stack · Clawd Code CLI · Claude Code leaked source archive**

[![npm clawd-code](https://img.shields.io/npm/v/@onchainai/clawd-code?label=%40onchainai%2Fclawd-code&color=cb3837&logo=npm&style=for-the-badge)](https://www.npmjs.com/package/@onchainai/clawd-code)
[![npm clawd-core](https://img.shields.io/npm/v/@onchainai/clawd-core?label=%40onchainai%2Fclawd-core&color=cb3837&logo=npm&style=for-the-badge)](https://www.npmjs.com/package/@onchainai/clawd-core)
[![TypeScript](https://img.shields.io/badge/TypeScript-512K%2B_lines-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Runtime-Bun-f472b6?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh)
[![React + Ink](https://img.shields.io/badge/UI-React_%2B_Ink-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://github.com/vadimdemedes/ink)
[![Solana](https://img.shields.io/badge/Solana-14F195?style=for-the-badge&logo=solana&logoColor=black)](https://solana.com)
[![MCP](https://img.shields.io/badge/MCP-Model_Context_Protocol-blueviolet?style=for-the-badge)](https://modelcontextprotocol.io)

[![Buy $CLAWD](https://img.shields.io/badge/Buy_%24CLAWD-Phantom-blueviolet?style=flat-square)](https://phantom.com/tokens/solana/8cHzQHUS2s2h8TzCmfqPKYiM4dSt4roa3n7MyRLApump)
[![Dexscreener](https://img.shields.io/badge/Chart-Dexscreener-green?style=flat-square)](https://dexscreener.com/solana/8cHzQHUS2s2h8TzCmfqPKYiM4dSt4roa3n7MyRLApump)

> `$CLAWD` · `8cHzQHUS2s2h8TzCmfqPKYiM4dSt4roa3n7MyRLApump`

</div>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=110&section=header&text=&fontSize=0" width="100%" alt="" />
</p>

---

## What Is This?

This monorepo bundles the **Clawd Cloud** ecosystem — Solana-native AI agents built on top of the Claude Code source archive:

| Layer | What it is |
|-------|-----------|
| **Clawd Code** (`clawd-code/`) | Solana-native AI coding agent CLI — code, trade, research, image, and voice modes with paper-gated perpetuals workflows. Its `src/` merges the Claude Code leaked source with Clawd-native agents (perps, arena, x402, wallet). Published as [`@onchainai/clawd-code`](https://www.npmjs.com/package/@onchainai/clawd-code) |
| **Clawd Core AI** (`core-ai/`) | Clawd-wrapped Helius AI tooling — Solana infrastructure, skills, MCP servers, perps agents, Grok runtime. Its typed-tool foundation ships as [`@onchainai/clawd-core`](https://www.npmjs.com/package/@onchainai/clawd-core) |
| **Clawd Connectors** (`clawd-connectors/`) | MCP-powered provider connectors (DFlow, Helius, Jupiter, Birdeye) — remote MCP + REST fallback, package `@openclawd/clawd-connectors` |
| **Leaked source archive & docs** | Root `package.json` (the leaked `@anthropic-ai/claude-code` manifest) and `docs/` architecture guides |
| **MCP Explorer** (`clawd-code/mcp-server/`) | MCP server exposing the leaked source itself for browsing (tools, commands, search) — deployed via root `vercel.json` |

---

## Directory Layout

```
.
├── clawd-code/                  # Clawd Code CLI — package @onchainai/clawd-code
│   ├── src/                     # CLI source — Claude Code leak foundation + Clawd-native agents
│   │   ├── main.tsx             # Entrypoint — CLI parser + React/Ink renderer (~4.7K lines)
│   │   ├── QueryEngine.ts       # Core LLM API caller (~1.3K lines)
│   │   ├── Tool.ts              # Tool type definitions (~820 lines)
│   │   ├── commands.ts          # Command registry
│   │   ├── arena.ts             # Cheshire Terminal agent arena (on-chain identity)
│   │   ├── x402.ts / wallet.ts  # x402 payments + wallet operations
│   │   ├── xai.ts / deepseek.ts / openrouter.ts / grok-models.ts   # Multi-model providers
│   │   ├── tools/               # ~40 agent tool implementations (184 files)
│   │   ├── commands/            # 80+ slash command implementations (191 files)
│   │   ├── components/          # 389 Ink UI components
│   │   ├── services/            # External service integrations
│   │   ├── bridge/              # IDE integration (VS Code, JetBrains)
│   │   ├── coordinator/         # Multi-agent orchestration
│   │   └── plugins/ · skills/ · tasks/ · state/ · voice/ · vim/ · mcp/ · payments/
│   ├── .agents/skills/          # 97 runtime-discovered skill packages (real skill registry)
│   ├── .clawd-plugin/           # Plugin marketplace manifest (points at an unvendored helius-plugin)
│   ├── dist/                    # Built CLI output
│   ├── agentwallet/             # Encrypted Solana + EVM keypair vault (E2B/Cloudflare deploy)
│   ├── clawdrouter/             # LLM router — 58 models / 9 providers, x402-metered
│   ├── mcp-server/              # This repo's own source exposed as an MCP server
│   ├── web/                     # Next.js dashboard
│   └── docs/ · knowledge/ · prompts/ · spinners/
│
├── core-ai/                     # Clawd Core AI
│   ├── clawd-core/              # Typed-tool foundation — package @onchainai/clawd-core
│   ├── clawd-code/              # Clawd Code build
│   ├── clawd-grok/              # Bun-native Clawd/Grok agent runtime
│   ├── clawd-perps-agent/       # Perps agent (Phoenix Rise, Vulcan, Imperial WS, TWAMM)
│   ├── clawd-mcp/ · mcp-server/ # MCP servers
│   ├── clawd-plugin/ · clawd-skills/   # Plugins + skills (the real bundled-plugin implementation)
│   ├── clawd-agents/            # Agent definitions/catalog
│   ├── clawdrouter/             # Router
│   ├── v3/                      # Next-gen Clawd runtime scaffolding
│   ├── tailclawd/               # Local UI + Tailscale proxy for session monitoring
│   ├── constitution/            # Governance bundle — laws, SOUL.md, IDENTITY.md
│   ├── knowledge/               # Knowledge base (facts, gotchas, patterns)
│   └── zk-primitives/           # ZK primitives
│
├── clawd-connectors/             # MCP provider connectors (DFlow, Helius, Jupiter, Birdeye)
│
├── docs/                        # Architecture guides for the leaked source
│   ├── architecture.md          # Core pipeline, startup, state, rendering
│   ├── tools.md                 # Complete tool catalog + permission model
│   ├── commands.md              # All slash commands by category
│   ├── subsystems.md            # Bridge, MCP, Permissions, Plugins, Skills
│   ├── exploration-guide.md     # How to navigate the codebase
│   └── ADR-001-open-clawd-v2.md # Open-clawd v2 architecture decision record
│
└── *.root-config               # Root toolchain, deployment, and legal files (see below)
```

### Root files

| File | What it is |
|------|-----------|
| `package.json` | Leaked Claude Code manifest (`@anthropic-ai/claude-code`, `0.0.0-leaked`) — Bun build/lint/typecheck scripts |
| `bun.lock` · `package-lock.json` | Lockfiles for Bun and npm |
| `bunfig.toml` | Bun config — preloads `scripts/bun-plugin-shims.ts` to intercept `bun:bundle` feature-flag imports |
| `tsconfig.json` | TypeScript config — includes `clawd-code/src/**`, maps `bun:bundle` to `clawd-code/src/types/bun-bundle.d.ts` |
| `biome.json` | Biome linter/formatter config (tab indent, single quotes, as-needed semicolons) |
| `Dockerfile` | Multi-stage production container for the CLI — Bun build → minimal Alpine runtime with git + ripgrep |
| `vercel.json` | Vercel deployment — routes `/health`, `/mcp`, `/sse`, `/messages` to `mcp-server/api/index.ts`. **Note:** this path is relative to repo root, but the explorer actually lives at [`clawd-code/mcp-server/`](clawd-code/mcp-server) — verify before deploying |
| `server.json` | MCP registry manifest — publishes the explorer as `warrioraashuu-codemaster` on npm (package not yet rebranded to Clawd) |
| `gitpretty-apply.sh` | Per-file emoji commit helper |
| `agent.md` | Agent operating guide — how an automated coding agent should behave in this repo |
| `Skill.md` | Repository skill — development conventions + architecture guide for the leaked source |
| `.gitignore` | Ignores node_modules, dist, env files, and Clawd runtime state/artifacts |
| `LICENSE` | **UNLICENSED** — leaked proprietary Anthropic code, published for educational/research purposes only |

---

## Clawd Code

Clawd Code is a Solana-native AI coding agent CLI with code generation, trading, research, image, and voice modes. Published to npm as [`@onchainai/clawd-code`](https://www.npmjs.com/package/@onchainai/clawd-code):

```bash
npm install -g @onchainai/clawd-code
```

It pairs with a plugin that auto-starts MCP servers for live blockchain access — the bundled implementation lives in [`core-ai/clawd-plugin/`](core-ai/clawd-plugin):

```bash
clawd --plugin-dir core-ai/clawd-plugin
```

Configured MCP servers:

- **Helius** — 10 routed tools for Solana blockchain access
- **Clawd Code** — the CLI itself exposed as an MCP server
- **Pump MCP** — 55 tools for Pump.fun: token creation, AMM swaps, analytics, wallet ops
- **Phoenix Rise** — real-time perpetuals market data
- **DFlow** — trading API details and code examples
- **ZK Compression** — ZK compressed token and account tools

### Agent Arena (Cheshire Terminal)

Native on-chain agent identity via Metaplex Core NFTs:

```bash
clawd-code arena status                     # Show stored on-chain identity
clawd-code arena mint --wallet <PUBKEY>     # Mint agent NFT (~0.01 SOL tx fee)
clawd-code arena register                   # Register capabilities + A2A/MCP cards
clawd-code arena fetch <addr>               # Fetch any agent's profile
clawd-code arena review <addr> --tx <sig>   # Submit verified review
```

### API Keys

Set in `~/.clawd-code/.env` or project `.env`:

| Variable | Description |
| --- | --- |
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude models (streaming) |
| `MOONSHOT_API_KEY` | Moonshot API key for Kimi models |
| `DEEPSEEK_API_KEY` | DeepSeek API key |
| `OPENROUTER_API_KEY` | OpenRouter API key (free models available) |
| `HELIUS_API_KEY` | Helius API key for DAS/RPC |
| `SOLANA_RPC_URL` | Solana RPC endpoint |
| `VULCAN_MCP_URL` | Vulcan MCP server URL |
| `LIVE_TRADING` | Enable live trading (default: false) |

> **Trading defaults to PAPER mode** — live execution requires explicit confirmation.

---

## Clawd Core AI

The Clawd-wrapped Helius AI tooling — Solana infrastructure, skills, MCP servers, and agent runtimes.

### Packages

| Package | Description |
|---|---|
| [`clawd-core/`](core-ai/clawd-core) | Typed-tool foundation — `ToolBase`/`PluginBase`/`WalletClientBase`. Published as [`@onchainai/clawd-core`](https://www.npmjs.com/package/@onchainai/clawd-core) — `npm install @onchainai/clawd-core` |
| `clawd-code/` | Clawd Code build |
| `clawd-grok/` | Bun-native Clawd/Grok agent runtime — REPL, audio, LSP, MCP, payments |
| `clawd-perps-agent/` | Perps agent — Phoenix Rise, Vulcan, Imperial WS, on-chain MM, TWAMM |
| `clawd-mcp/` · `mcp-server/` | MCP servers |
| `clawd-plugin/` | Plugin bundling skills + auto-starting MCP servers |
| `clawd-skills/` | Solana/Pump/DFlow skill suite |
| `clawd-agents/` | Agent definitions and catalog |
| `clawdrouter/` | LLM routing service |
| `v3/` | Next-gen Clawd runtime scaffolding |
| `tailclawd/` | Local UI + Tailscale proxy for Clawd/Claude session monitoring |
| `knowledge/` | Knowledge base — facts, gotchas, patterns |
| `zk-primitives/` | ZK primitives |

See [`core-ai/README.md`](core-ai/README.md) for the Helius tooling surface (helius-cli, helius-mcp, helius-skills, helius-plugin).

---

## Claude Code Leaked Source (Archive)

This repo preserves the leaked source of Anthropic's Claude Code CLI, leaked on **2026-03-31** via a `.map` file in Anthropic's npm registry. The original source now lives inside `clawd-code/src/`, merged with Clawd-native agents.

| | |
|---|---|
| **Leaked** | 2026-03-31 |
| **Language** | TypeScript (strict) |
| **Runtime** | [Bun](https://bun.sh) |
| **Terminal UI** | [React](https://react.dev) + [Ink](https://github.com/vadimdemedes/ink) |
| **Scale** | ~1,900 files · 512,000+ lines of code |

> The root `package.json` is the original leaked manifest (`@anthropic-ai/claude-code`).

### Explore with the MCP Server

[`clawd-code/mcp-server/`](clawd-code/mcp-server) ships an MCP explorer server (npm package `warrioraashuu-codemaster`) for any MCP-compatible client (Claude Code, Claude Desktop, VS Code Copilot, Cursor):

```bash
# Claude Code
claude mcp add claude-code-explorer -- node /abs/path/to/clawd-cloud/clawd-code/mcp-server/dist/index.js
```

Set `CLAUDE_CODE_SRC_ROOT` env to point at the source root (defaults to `clawd-code/src`).

### Available tools

| Tool | Description |
|------|-------------|
| `list_tools` | List all ~40 agent tools with source files |
| `list_commands` | List all ~50 slash commands with source files |
| `get_tool_source` | Read full source of any tool |
| `get_command_source` | Read source of any slash command |
| `read_source_file` | Read any file from `clawd-code/src/` by path |
| `search_source` | Grep across the entire source tree |
| `list_directory` | Browse source directories |
| `get_architecture` | High-level architecture overview |
| `explain_tool` / `explain_command` / `architecture_overview` / `how_does_it_work` / `compare_tools` | Guided deep-dive prompts |

### Architecture highlights

- **Tool System** — ~40 self-contained tools (FileRead/Write/Edit, Glob, Grep, Bash, Agent, MCP, LSP…)
- **Command System** — ~50 slash commands (`/commit`, `/review`, `/compact`, `/mcp`, `/config`…)
- **Service Layer** — API, MCP, OAuth, LSP, analytics, plugins, context compression, memory extraction
- **Bridge System** — bidirectional IDE integration (VS Code, JetBrains)
- **Permission System** — modes: `default`, `plan`, `bypassPermissions`, `auto`
- **Feature Flags** — build-time dead-code elimination via `bun:bundle` (`PROACTIVE`, `KAIROS`, `BRIDGE_MODE`, `VOICE_MODE`, `DAEMON`…)

### Key files

| File | Lines | Purpose |
|------|------:|---------|
| `clawd-code/src/QueryEngine.ts` | ~46K | Core LLM API engine — streaming, tool loops, thinking, retries |
| `clawd-code/src/Tool.ts` | ~29K | Base types/interfaces for all tools |
| `clawd-code/src/commands.ts` | ~25K | Command registration & execution |
| `clawd-code/src/main.tsx` | — | CLI parser + React/Ink renderer |

---

## Docs

| Guide | Description |
|-------|-------------|
| [Architecture](docs/architecture.md) | Core pipeline, startup sequence, state management, rendering |
| [Tools Reference](docs/tools.md) | Complete catalog of all ~40 agent tools |
| [Commands Reference](docs/commands.md) | All slash commands organized by category |
| [Subsystems Guide](docs/subsystems.md) | Bridge, MCP, Permissions, Plugins, Skills, Tasks, Memory, Voice |
| [Exploration Guide](docs/exploration-guide.md) | Study paths, grep patterns, key files |
| [Open Clawd ADR](docs/ADR-001-open-clawd-v2.md) | Architecture decision record for the open-clawd stack |

Also see: [`agent.md`](agent.md) · [`Skill.md`](Skill.md) · [`clawd-code/CLAWD.md`](clawd-code/CLAWD.md) · [`core-ai/README.md`](core-ai/README.md)

---

## Development

The leaked-source build uses Bun:

```bash
bun install
bun run build          # bundle the CLI
bun run typecheck      # tsc --noEmit
bun run lint           # biome check src/
bun run check          # biome + tsc
```

Clawd Code / Core AI packages each carry their own manifests — see the per-package READMEs.

### GitPretty Setup

```bash
# Apply per-file emoji commit messages
bash ./gitpretty-apply.sh .

# Optional: install hooks for future commits
bash ./gitpretty-apply.sh . --hooks
```

---

## Contributing

Contributions to documentation, the MCP explorer server, and exploration tooling are welcome. Keep changes small and targeted — see [`agent.md`](agent.md) for the agent operating guide.

---

## Disclaimer

`clawd-code/src/` preserves source code leaked from Anthropic's npm registry on **2026-03-31**. All original source code is the property of [Anthropic](https://www.anthropic.com). This is not an official release and is not licensed for redistribution. The Clawd Code and Clawd Core AI layers are independent Clawd-native software built on top.

---

## Links

- [Clawd Code](clawd-code/) · [Clawd Code Agent Instructions](clawd-code/CLAWD.md)
- [Clawd Core AI](core-ai/)
- [$CLAWD on Phantom](https://phantom.com/tokens/solana/8cHzQHUS2s2h8TzCmfqPKYiM4dSt4roa3n7MyRLApump) · [$CLAWD on Dexscreener](https://dexscreener.com/solana/8cHzQHUS2s2h8TzCmfqPKYiM4dSt4roa3n7MyRLApump)
- [Helius](https://www.helius.dev) · [Helius Docs](https://www.helius.dev/docs)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [`@onchainai/clawd-code` on npm](https://www.npmjs.com/package/@onchainai/clawd-code) · [`@onchainai/clawd-core` on npm](https://www.npmjs.com/package/@onchainai/clawd-core)

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=90&section=footer&text=&fontSize=0" width="100%" alt="" />
</p>

<div align="center">
<sub>🦞 <i>The shell molts. The laws do not.</i></sub>
</div>
