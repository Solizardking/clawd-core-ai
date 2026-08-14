# Security

## Trading

Clawd Cloud defaults to **paper trading**. Live execution is off unless `LIVE_TRADING=true` and the operator confirms. Treat any path that signs or broadcasts a transaction as high risk.

## Secrets

Never commit:

- `.env` / `.env.local`
- wallet keypairs
- `HELIUS_API_KEY`, `DFLOW_API_KEY`, `XAI_API_KEY`, and other provider keys
- contents of `~/.clawd-code/`

Report leaked credentials by rotating them at the provider, then open a private report if this repo was the source.

## Vulnerability reports

If you find a bug that can drain funds, bypass paper-mode gates, or exfiltrate keys:

1. **Do not** open a public issue with a working exploit.
2. Email the maintainer via GitHub ([@Solizardking](https://github.com/Solizardking)) or open a [private security advisory](https://github.com/Solizardking/clawd-core-ai/security/advisories/new) if enabled.

Please include impact, affected package path, and a minimal reproduction.

## Scope

In scope: `clawd-code/`, `clawd-connectors/`, `core-ai/` Clawd-native packages, stack wiring, MCP config.

Out of scope: third-party MCP servers (Helius, DFlow, Jupiter, Birdeye), and the archived Anthropic sources kept for research.
