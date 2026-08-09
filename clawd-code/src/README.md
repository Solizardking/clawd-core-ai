# `src/`

The Clawd Code CLI source — a terminal-native AI agent built with React + Ink on the Bun runtime. This is the package the root [`tsconfig.json`](../tsconfig.json) compiles (`include: ["clawd-code/src/**/*.ts", "clawd-code/src/**/*.tsx"]`) and [`scripts/build-bundle.ts`](../scripts) bundles into [`dist/`](../dist).

For the full architectural walkthrough, see [`docs/architecture.md`](../docs/architecture.md); this file is a directory map.

## Core pipeline

| Path | Role |
|---|---|
| `main.tsx`, `entrypoints/` | CLI parsing (Commander.js), startup, REPL handoff, MCP-server entrypoint |
| `QueryEngine.ts` | Streaming, tool-call loops, thinking-mode budget, retries, token/cost tracking |
| `Tool.ts`, `tools/` | ~40 self-contained tools (Zod schemas, permissions, UI) — see [`docs/tools.md`](../docs/tools.md) |
| `commands.ts`, `commands/` | 80+ slash commands — see [`docs/commands.md`](../docs/commands.md) |
| `context.ts`, `context/` | OS/shell/git/user context assembly for the system prompt |
| `replLauncher.tsx` | REPL session bootstrap |

## Supporting subsystems

| Path | Role |
|---|---|
| `state/`, `context/` | React-context + custom store (`AppState`) |
| `components/` (~140), `screens/`, `hooks/` (~80), `ink/` | Terminal UI — Ink-rendered React |
| `bridge/` | VS Code / JetBrains / claude.ai IDE bridge — see [`docs/bridge.md`](../docs/bridge.md) |
| `services/mcp/`, `tools/MCPTool/` | MCP client + server mode |
| `hooks/toolPermission/` | Centralized permission checks before every tool call |
| `plugins/`, `services/plugins/` | Installable plugin loader |
| `skills/` | Bundled skill definitions and loader |
| `tasks/` | Background/parallel work — shell tasks, sub-agents, teammate agents |
| `memdir/` | Persistent memory system (`CLAUDE.md`/`CLAWD.md` hierarchy) |
| `coordinator/` | Multi-agent orchestration |
| `voice/`, `voice-agent.ts` | Voice input/output (sherpa-onnx / sag / Whisper) |
| `schemas/` | Zod v4 config schemas |
| `migrations/` | Config-format migrations between versions |
| `wallet.ts`, `x402.ts`, `payments/` | Solana wallet ops and x402 autonomous payments |
| `arena.ts` | Cheshire Terminal Agent Arena — on-chain identity (mint/register/fetch/review) |
| `grok*.ts`, `xai.ts`, `deepseek.ts`, `openrouter.ts`, `anthropic.ts` | Multi-provider model clients |

See [`docs/subsystems.md`](../docs/subsystems.md) for deep dives and [`docs/exploration-guide.md`](../docs/exploration-guide.md) for navigation patterns, grep recipes, and study paths.

> Two stray files, `commands.ts` and `commands copy.ts`, currently coexist at the top level — the latter looks like an uncommitted backup/duplicate worth reconciling.
