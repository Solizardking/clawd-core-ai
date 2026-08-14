# `.clawd-plugin/`

Plugin marketplace manifest — describes the **clawd-helius** plugin bundle that lives in Core AI.

## Contents

- **`marketplace.json`** — Declares one plugin, `helius`. Source resolves from this package root (`clawd-code/`) to [`../core-ai/clawd-plugin`](../../core-ai/clawd-plugin).

The repo-root marketplace (what the CLI actually auto-discovers) is [`.claude-plugin/marketplace.json`](../../.claude-plugin/marketplace.json), pointing at `./core-ai/clawd-plugin`.

## How it's used

```bash
clawd --plugin-dir ../core-ai/clawd-plugin
# from repo root:
clawd --plugin-dir core-ai/clawd-plugin
```

The plugin auto-starts Helius, DFlow, Jupiter, Birdeye, and ZK Compression MCP servers via its `.mcp.json`.
