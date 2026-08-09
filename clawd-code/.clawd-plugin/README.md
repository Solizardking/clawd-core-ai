# `.clawd-plugin/`

Plugin marketplace manifest — a single `marketplace.json` describing the **clawd-helius** plugin bundle.

## Contents

- **`marketplace.json`** — Declares one plugin, `helius`: Clawd-wrapped Helius developer tools for building on Solana (live blockchain RPC/DAS tools, coding patterns, autonomous account signup). Points at `./helius-plugin` as the plugin source, licensed MIT, tagged `solana`, `blockchain`, `rpc`, `nft`, `defi`, `web3`, `helius`, `clawd`, `clawd-code`, `lobster`.

## How it's used

This is the marketplace descriptor consumed by the `/plugin` command and plugin loader (`src/plugins/`, `src/services/plugins/` — see [`docs/subsystems.md`](../docs/subsystems.md#plugin-system)) when resolving installable plugins by name. It's distinct from [`clawd-plugin/`](../clawd-plugin) (no leading dot), which is the actual bundled Clawd Code plugin containing skills and MCP server auto-start config.
