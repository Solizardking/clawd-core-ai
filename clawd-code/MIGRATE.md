# 🦞 MIGRATE.md — Clawd Code Consolidation Plan

**One-shot migration map: folding every sibling Clawd/Claude harness into this repo's `clawd-code/` as a single blockchain-first, native financial harness.**

[![Status](https://img.shields.io/badge/status-planning_%2F_not_executed-orange)](#1-why-this-exists)
[![Target](https://img.shields.io/badge/target-clawd--code%2F-14F195?logo=solana&logoColor=black)](#3-target-architecture)
[![Sources](https://img.shields.io/badge/sources-5_repos-blueviolet)](#2-source-inventory)

</br>

> This document is a **plan**, not a changelog. Nothing described below has been executed yet — it is the map to follow so the merge happens deliberately, in order, with no silent overwrites of the Six Laws, no leaked secrets, and no regressions to the PAPER-default trading gate. Each phase in [§7](#7-phased-plan) ends with a commit boundary.

---

## Table of Contents

1. [Why This Exists](#1-why-this-exists)
2. [Source Inventory](#2-source-inventory)
3. [Target Architecture](#3-target-architecture)
4. [What's Already Merged](#4-whats-already-merged)
5. [Migration Map](#5-migration-map)
6. [Do-Not-Migrate List](#6-do-not-migrate-list)
7. [Phased Plan](#7-phased-plan)
8. [Conflict Resolution Rules](#8-conflict-resolution-rules)
9. [Financial-Harness Non-Negotiables](#9-financial-harness-non-negotiables)
10. [Verification Checklist](#10-verification-checklist)
11. [Open Risks](#11-open-risks)

---

## 1. Why This Exists

`clawd-cloud` (this repo) is two things stacked on top of each other:

- **The leaked Claude Code source** (`package.json` name `@anthropic-ai/claude-code`, root `docs/`, `mcp-server/` explorer) — the harness skeleton: `QueryEngine.ts`, `Tool.ts`, `commands.ts`, tools/commands/components/services.
- **`clawd-code/`** — a Solana-native overlay already grafted onto that skeleton: `SOUL.md`, `IDENTITY.md`, `CLAWD.md`, `clawd.json`, `wallet.ts`, `x402.ts`, `payments/`, `arena.ts`, `coordinator/`, `telegram/`, `voice/`, multi-provider model files (`grok-models.ts`, `deepseek.ts`, `openrouter.ts`, `xai.ts`).

That overlay didn't originate here. It was built (and is still being built, in parallel, in different languages) across at least four other checkouts on this machine. Right now those checkouts disagree with each other — different copies of `CONSTITUTION.md`, different `SOUL.md` drafts, a Go rewrite with capabilities the TypeScript CLI doesn't have yet, a computer-use module that isn't wired in, and a model provider (Hermes) that's live in Cheshire Terminal but has no client here.

This file is the single map for reconciling all of it into `clawd-code/` without losing the parts that are already correct.

---

## 2. Source Inventory

| # | Source | Path | Stack | Role |
|---|--------|------|-------|------|
| A | **This repo** | `/Users/8bit/clawd-cloud` | Bun + TS + React/Ink | Leaked Claude Code skeleton + `clawd-code/` overlay (the merge target) |
| B | **solana-clawd** | `/Users/8bit/Downloads/solana-clawd` | Bun + TS | The original 50+-agent Solana financial stack: `CONSTITUTION.md`, `AGENTS.md`, `a2a/`, `agent-arena-skill/`, `agents/` (57 agent defs), `ai-training/`, `apps/` (chrome extension, mcp-studio, signal-dashboard, tui, web) |
| C | **open-clawd-code-main** | `/Users/8bit/Downloads/open-clawd-code-main` | Bun + TS + Go | "OpenClawd" — sibling fork with its own `clawd-code/`, plus `clawd-grok/`, `openclawd-framework/packages`, and `open-computer-use/clawd-computer-use` |
| D | **clawdbot-go** | `.../open-clawd-code-main/clawdbot-go` | Go | Autonomous daemon: `ooda/` (OODA-loop runtime), `dna/` (persona/trait system), `program.md`, `schema.sql`, its own `CONSTITUTION.md`/`SOUL.md`/`IDENTITY.md` |
| E | **zero** ("zero code") | `/Users/8bit/ClawdBrowser/zero-main` | Go | Mature coding-agent CLI: sandboxing (`cmd/zero-*-sandbox`, seccomp), `credstore/`, `keyring/`, `oauth/`, `doctor/`, `lsp/`, `modelregistry/`, `providercatalog/`, `attest/`, `acp/`, `cron/`, `background/` daemon, `browser/` |
| F | **Hermes** | n/a (remote) | HTTP API via Cheshire Terminal | Model provider already live at `get_api_hermes_*` / `post_api_hermes_chat*` — no local client exists yet |

Source B, C, and D each carry their **own copy** of `CONSTITUTION.md` / `SOUL.md` / `IDENTITY.md`. Treat every one of those as a diff candidate, never a drop-in replacement — see [§8](#8-conflict-resolution-rules).

---

## 3. Target Architecture

Everything lands under `clawd-code/` in this repo. No new top-level sibling directories unless a phase below says otherwise.

```text
clawd-code/
├── CONSTITUTION.md          # NEW — canonical Six Laws, sourced from B (§5.1)
├── SOUL.md / IDENTITY.md    # EXISTING — reconciled against C/D drafts, not overwritten
├── src/
│   ├── hermes.ts            # NEW — mirrors xai.ts / deepseek.ts / openrouter.ts (§5.6)
│   ├── daemon/               # EXISTING (TS) — hardened using clawdbot-go/ooda as reference (§5.3)
│   ├── tools/computerUse/    # NEW — wraps open-computer-use/clawd-computer-use (§5.4)
│   └── ...                  # unchanged
├── sandbox/                 # NEW — vendored zero cmd/zero-*-sandbox binaries, invoked by BashTool (§5.5)
├── clawd-skills/            # EXISTING — dedupe against B's agent-arena-skill/ (§5.2)
└── knowledge/                # EXISTING — receives B's ai-training/ corpus (§5.2)

AGENTS.md                    # NEW at repo root — sourced from B/AGENTS.md, referenced by clawd-code/IDENTITY.md §"Agent Catalog" which currently points at a file that doesn't exist yet
```

---

## 4. What's Already Merged

Confirmed by inspecting `clawd-code/src/` — do **not** re-migrate these, only reconcile drift:

- `wallet.ts`, `x402.ts`, `payments/` — wallet + x402 payment layer
- `arena.ts` — Cheshire Terminal Agent Arena (on-chain identity, ATOM reputation)
- `coordinator/`, `telegram/`, `voice/` — multi-agent orchestration, Telegram bridge, TTS/STT
- `grok-models.ts`, `deepseek.ts`, `openrouter.ts`, `xai.ts` — multi-provider model routing
- `core-ai/` at repo root — Helius-wrapped Solana tooling
- `clawdrouter/` — standalone Cloudflare Worker for tiered LLM routing

The gap this file addresses is everything **not** in that list.

---

## 5. Migration Map

### 5.1 Canonical governance docs (from B: solana-clawd)

| Source file | Size | Target | Priority | Notes |
|---|---|---|---|---|
| `solana-clawd/CONSTITUTION.md` | 30,490 bytes | `clawd-code/CONSTITUTION.md` | **P0** | Currently `clawd-code/SOUL.md` only *paraphrases* the Six Laws. `IDENTITY.md` promises every spawn inherits a hash-verified `three-laws.md` — that file doesn't exist anywhere in this repo yet. Import the full text, hash it, and make `SOUL.md` reference it instead of restating it. |
| `solana-clawd/AGENTS.md` | 16,320 bytes | `AGENTS.md` (repo root) | **P0** | `clawd-code/IDENTITY.md` §"Agent Catalog" says agents are "indexed in the root `AGENTS.md`" — today the repo root only has a generic `agent.md` stub. Import the real 50+-agent catalog and re-point the stub or fold it in. |
| `solana-clawd/GEMINI.md`, `UNIVERSAL_COMPUTER.md` | — | `clawd-code/docs/` | P2 | Reference material for future Gemini provider + computer-use design |

### 5.2 Agent/skill assets (from B)

| Source | Target | Priority | Notes |
|---|---|---|---|
| `agent-arena-skill/` | diff against `clawd-code/clawd-skills/cheshire-terminal/` | P1 | Likely already superseded by `arena.ts` — confirm before deleting the source copy |
| `agents/` (57 defs), `agents-catalog.json`, `agents-manifest.json`, `agent-template*.json` | `clawd-code/.agents/skills/` or new `clawd-code/.agents/catalog/` | P1 | Feeds the same catalog `AGENTS.md` describes in prose |
| `ai-training/` | `clawd-code/knowledge/` | P2 | Training corpus / eval sets |
| `apps/` (`clawd-chrome-extensions`, `mcp-studio`, `signal-dashboard`, `tui`, `web`) | `clawd-code/web/` or new `clawd-code/apps/` | P3 | Evaluate each sub-app individually — don't bulk-copy; `tui` may overlap with the Ink UI already in `src/components/` |
| `a2a/` | `clawd-code/src/bridge/` (or new `src/a2a/`) | P2 | Google A2A discovery cards — `IDENTITY.md` already claims A2A support via arena registration; confirm this is the implementation backing that claim |

### 5.3 Autonomous daemon (from D: clawdbot-go)

| Source | Target | Priority | Notes |
|---|---|---|---|
| `clawdbot-go/ooda/` | reference for hardening `clawd-code/src/daemon/` | P2 | Port the **loop design** (Observe-Orient-Decide-Act), not the Go code — the TS daemon should stay TS. Treat this as a spec, not a vendor drop. |
| `clawdbot-go/dna/` | design reference for `clawd-code/character/` | P3 | Persona/trait system — compare against the existing `character/` directory before adding a second one |
| `clawdbot-go/schema.sql` | reference for `clawd-code/memdir/` persistence | P3 | Only if `memdir/` needs relational storage; don't introduce SQL if the current memory store is file-based and sufficient |
| `clawdbot-go/CONSTITUTION.md`, `SOUL.md`, `IDENTITY.md` | **diff only** | P0 | Do not copy — see [§8](#8-conflict-resolution-rules). If this copy has drifted from B's, that drift itself is a bug to report, not a merge to perform silently. |

### 5.4 Computer use (from C: open-clawd-code-main/open-computer-use)

| Source | Target | Priority | Notes |
|---|---|---|---|
| `open-computer-use/clawd-computer-use/` | `clawd-code/src/tools/computerUse/` | P2 | New tool, gated behind explicit user opt-in like any tool that controls the OS — follow the existing permission-system pattern in `src/hooks/toolPermission/`, don't bypass it |

### 5.5 Sandboxing & credential infra (from E: zero)

| Source | Target | Priority | Notes |
|---|---|---|---|
| `zero-main/cmd/zero-linux-sandbox`, `zero-seccomp`, `zero-windows-command-runner`, `zero-windows-sandbox-setup` | `clawd-code/sandbox/` (vendored **binaries built from source**, not the committed 30MB blob) | P1 | These give OS-level command isolation the current Bun/Node `BashTool` doesn't have. Build from `zero-main` source at merge time; do not copy the pre-built `zero` binary sitting in that repo's root. |
| `zero-main/internal/config/{credentials,resolver,writer}.go` | design reference for `clawd-code/src/services/oauth/` and multi-provider key resolution | P2 | Port the *resolution precedence* (env → keyring → config file) as a pattern; the Go code itself is not directly importable into a TS codebase |
| `zero-main/internal/{doctor,lsp,modelregistry,providercatalog,attest}` | design references for `clawd-code/docs/` + `src/lsp/` | P2 | `attest/` in particular is worth comparing against the `agent-auth` skill's SAS/TEE attestation flow — possible convergence, not necessarily a merge |
| `zero-main/internal/{acp,cron,background}` | evaluate against `clawd-code/src/daemon/`, `src/tasks/` | P3 | May be redundant with existing TS daemon/task system — confirm before adding |

### 5.6 Hermes provider (from F)

| Source | Target | Priority | Notes |
|---|---|---|---|
| Cheshire Terminal `get_api_hermes_status`, `get_api_hermes_models`, `post_api_hermes_chat`, `post_api_hermes_chat_completions`, `post_api_hermes_completions` | `clawd-code/src/hermes.ts` | P1 | New file, same shape as `xai.ts` / `deepseek.ts` / `openrouter.ts`. Register it in `clawdrouter/` alongside the existing providers so it's tier-routable, not just directly callable. |

---

## 6. Do-Not-Migrate List

Explicit exclusions — copying any of these would be a regression, not progress:

- **`solana-clawd/.env`, `.env.local`, `agent-wallet.json`** — live-looking secrets and a mode-600 wallet keypair file sitting in that checkout. Never copy, never `cp -r` a parent directory that contains them. Run the `clawd-guard-secrets` skill checklist before any bulk copy out of `solana-clawd/`.
- **`zero-main/zero`** — the pre-built 30MB binary committed to that repo's root. Build from source instead; a committed binary is not something to vendor into this repo.
- **Any `.git/`, `.claude/`, `.vercel/`, `.mypy_cache/`, `.playwright-mcp/`** directory from a source repo — local tool state, not source.
- **`clawdbot-go`'s `CONSTITUTION.md`/`SOUL.md`/`IDENTITY.md` as direct copies** — diff-only per [§8](#8-conflict-resolution-rules).

---

## 7. Phased Plan

Each phase is a separate commit (or PR). Don't collapse phases — the ordering exists so that governance docs land before anything that depends on them (e.g. the sandbox layer's permission model should cite the canonical Six Laws, not a paraphrase of them).

| Phase | Scope | Depends on |
|---|---|---|
| **0** | This document | — |
| **1** | Canonical docs: `CONSTITUTION.md`, root `AGENTS.md` (§5.1) | Phase 0 |
| **2** | Hermes provider (§5.6) — smallest, self-contained, good first real merge | Phase 1 |
| **3** | Agent/skill catalog consolidation (§5.2) | Phase 1 |
| **4** | Sandbox binaries from `zero` (§5.5) | Phase 1 |
| **5** | Computer-use tool (§5.4) | Phase 4 (shares the permission-gating work) |
| **6** | OODA daemon hardening using `clawdbot-go` as spec (§5.3) | Phase 1, 3 |
| **7** | `apps/` evaluation — chrome extension, mcp-studio, signal-dashboard, tui, web (§5.2) | Phase 3 |
| **8** | Dedupe pass — delete/archive superseded source-repo copies once every P0/P1 item above is confirmed merged | All prior phases |

---

## 8. Conflict Resolution Rules

1. **Governance files never get silently overwritten.** `CONSTITUTION.md`, `SOUL.md`, `IDENTITY.md`, and the (not-yet-created) `three-laws.md` are hash-verified per `IDENTITY.md`. When B, C, and D all have a copy, `diff` them first. If they've diverged, that divergence is the finding to surface to the user — not something to resolve by picking one silently.
2. **Canonical source wins by specificity, not by recency.** `solana-clawd` (B) is the origin of the Constitution and the agent catalog — it wins over C's and D's copies for those two files specifically, even if C or D was touched more recently.
3. **Go code is a spec, not a vendor drop**, except for the sandbox binaries in §5.5, which are the one case where running zero's compiled Go directly (as a subprocess) is the point — everything else in `zero-main` and `clawdbot-go` gets re-implemented in TS to match the existing `src/` conventions, or left as a design reference.
4. **Every new tool respects the existing permission system** (`src/hooks/toolPermission/`). Computer-use and sandboxed-bash are exactly the kind of state-changing tools that system exists for — don't add a side door.

---

## 9. Financial-Harness Non-Negotiables

Restated here only because every migrated component must respect them — full detail already lives in `SOUL.md` and `IDENTITY.md`:

- Trading defaults to **PAPER**. Live orders require `LIVE_TRADING=true` **and** `OPERATOR_CONFIRMED=true` **and** `PERPS_SIM_ONLY=false` — all three, no exceptions, no new code path that trades on fewer than three gates.
- Every trade path carries a preflight check and an explicit execution-mode label in its output.
- `confirmed` commitment for reads, `finalized` for anything that moves funds.
- No hardcoded or mocked chain state when an MCP tool for live data exists — this applies to anything ported from `zero`'s `providercatalog`/`modelregistry` too.

If a migrated component (especially anything from `zero` or `clawdbot-go`) doesn't yet respect these gates, it is **not done migrating** even if the code compiles and runs.

---

## 10. Verification Checklist

Per phase, before marking it complete:

- [ ] `bun run typecheck` and `bun run lint` pass in `clawd-code/`
- [ ] No file under [§6](#6-do-not-migrate-list) was copied — `git status`/`git diff` reviewed for stray `.env`, keypair JSON, or committed binaries
- [ ] If a governance doc changed, the new hash is recorded and `SOUL.md`/`IDENTITY.md` still point at the right file
- [ ] Any new trading-adjacent code path defaults to PAPER and is covered by [§9](#9-financial-harness-non-negotiables)
- [ ] Any new tool that touches the filesystem, OS, or a browser is registered with the permission system, not bypassing it
- [ ] Source repo's corresponding directory is left untouched (read-only reference) until Phase 8 dedupe

---

## 11. Open Risks

- **Provenance/licensing.** The root `package.json` in this repo is literally Anthropic's leaked `@anthropic-ai/claude-code` manifest (`"license": "UNLICENSED"`). That's an existing condition of this repo, not something this migration changes — but it means nothing here should be treated as safe to publish or redistribute without separately resolving that status.
- **Divergent Constitutions.** B, C, and D each carry their own `CONSTITUTION.md`/`SOUL.md`. If they've drifted in substance (not just wording), that's a soul-integrity problem worth resolving *before* Phase 1, not after.
- **Sandbox binaries need platform review.** `zero`'s macOS/Linux/Windows sandbox tooling (seccomp, Windows sandbox setup) needs code-signing and platform-specific testing before it's trusted to gate `BashTool` execution — don't wire it in as the default without a fallback to the current unsandboxed path.
- **`clawdbot-go`'s autonomy loop (`ooda/`) is the highest-blast-radius item in this whole plan.** An OODA loop that observes, decides, and acts on its own is the one component here that could act *without* a human in the loop. Its safety review — trust-level gating equivalent to `IDENTITY.md`'s Observer → Sovereign ladder — is a precondition for Phase 6, not a nice-to-have.
