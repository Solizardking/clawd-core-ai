# `prompts/`

Ordered, self-contained build-out prompts used to bootstrap this repo from source into a working build — the porting log for turning the archived CLI source into a buildable, runnable Clawd Code.

Run in order, each in its own chat session; each is independently verifiable.

| # | File | What it does | Depends on |
|---|---|---|---|
| 01 | `01-install-bun-and-deps.md` | Install Bun runtime, install all dependencies | — |
| 02 | `02-runtime-shims.md` | Create `bun:bundle` runtime shim + `MACRO` globals so code runs without Bun's bundler | 01 |
| 03 | `03-build-config.md` | esbuild-based build system bundling the CLI to a single runnable file | 01, 02 |
| 04 | `04-fix-mcp-server.md` | Fix TypeScript errors in `mcp-server/`, make it build | 01 |
| 05 | `05-env-and-auth.md` | `.env` setup, API key config, OAuth stubs | 01 |
| 06 | `06-ink-react-terminal-ui.md` | Verify/fix the Ink/React terminal rendering pipeline | 01–03 |
| 07 | `07-tool-system.md` | Audit and wire up the 40+ tool implementations | 01–03 |
| 08 | `08-command-system.md` | Audit and wire up the 50+ slash commands | 01–03, 07 |
| 09 | `09-query-engine.md` | Get the core LLM call loop (QueryEngine) functional | 01–03, 05, 07 |
| 10 | `10-context-and-prompts.md` | Wire up system prompt construction, context gathering, memory | 01–03 |
| 11 | `11-mcp-integration.md` | MCP client/server integration — registry, tool discovery | 01–04 |
| 12 | `12-services-layer.md` | Analytics, policy limits, remote settings, session memory | 01–03, 05 |
| 13 | `13-bridge-ide.md` | Stub or implement the VS Code / JetBrains bridge layer | 01–03, 09 |
| 14 | `14-dev-runner.md` | `bun run dev` script for dev-mode CLI launch | 01–03 |
| 15 | `15-production-bundle.md` | Production build — minified bundle, platform packaging | 03 |
| 16 | `16-testing.md` | Test infrastructure (vitest), smoke tests for core subsystems | all |

Prompts 07–13 can run somewhat in parallel (different subsystems). If a prompt fails, fix it before moving on — see `00-overview.md` for the full index and notes.
