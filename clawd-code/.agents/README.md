# `.agents/`

Agent-runtime skill manifest directory. Discovered automatically by Clawd Code (and compatible agent runtimes) at startup — this is where the CLI looks for locally-registered skills, independent of the bundled [`clawd-skills/`](../clawd-skills) catalog.

## Contents

- **`skills/`** — 97 skill packages, one directory per skill (e.g. `vulcan`, `dflow-spot-trading`, `pump-bonding-curve`, `imperial-risk-management`, `helius`, `cheshire-terminal`, `zk`, `solana-dev`). Each follows the standard skill layout (`SKILL.md` + reference docs) described in the root [`SKILL.md`](../SKILL.md).
- **`.gitignore`** — keeps locally-synced/derived skill state out of version control.

## Relationship to `clawd-skills/` and `clawd-plugin/`

| Directory | Purpose |
|---|---|
| `.agents/skills/` | Runtime-discovered skill registry (this directory) |
| [`clawd-plugin/skills/`](../clawd-plugin) | Curated skill set bundled with the Clawd Code plugin, auto-started with MCP servers |
| [`clawd-skills/`](../clawd-skills) | The full source catalog of 100+ skill packages these are drawn from |

Most entries here are Solana-trading and infra skills — Vulcan (Phoenix perps), DFlow (swap/prediction routing), Pump.fun (bonding curve, fee sharing, security), Imperial (execution modes, risk, TWAP/TPSL), Helius (RPC/DAS), and ZK compression — reflecting Clawd Code's primary domain per [`SOUL.md`](../SOUL.md) and [`IDENTITY.md`](../IDENTITY.md).
