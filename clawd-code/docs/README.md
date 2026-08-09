# `docs/`

Internal engineering documentation for the Clawd Code CLI — how the codebase is structured and how to navigate it.

| Doc | Covers |
|---|---|
| [`architecture.md`](architecture.md) | End-to-end pipeline: CLI parser → Query Engine → LLM API → tool-call loop → terminal UI. State management, UI layer, config schemas, build system |
| [`bridge.md`](bridge.md) | IDE bridge layer (VS Code / JetBrains / claude.ai web) — transport protocols, auth, message flow, feature-gate analysis, Chrome extension bridge |
| [`commands.md`](commands.md) | Full catalog of 80+ slash commands (`/commit`, `/review`, `/mcp`, `/x402`, …), grouped by domain |
| [`exploration-guide.md`](exploration-guide.md) | How to navigate the source — orientation table, code patterns (`buildTool()`, feature flags), study paths, grep recipes |
| [`subsystems.md`](subsystems.md) | Deep dives: Bridge, MCP, Permissions, Plugins, Skills, Tasks, Memory, Coordinator (multi-agent), Voice, Service Layer |
| [`tools.md`](tools.md) | Full catalog of ~40 agent tools, grouped by category (file system, shell, agent/orchestration, tasks, web, MCP, integration, scheduling, utility) |
| [`ADR-001-open-clawd-v2.md`](ADR-001-open-clawd-v2.md) | Architecture decision record — the Open Clawd v2 provider-routing direction (Grok-first, model-prefix routing, paper-first Solana perps) |

Start with `architecture.md` for the big picture, then `exploration-guide.md` if you're about to go read source. `docs/` is duplicated verbatim at the monorepo root ([`/docs`](../../docs)) for discoverability from either level.
