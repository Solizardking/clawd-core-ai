# Contributing to Clawd Cloud

Thanks for helping the lobster molt in public.

## Before you start

- Read [`README.md`](README.md) — especially how Clawd Code, Connectors, and Core AI talk.
- Run `bun run stack:doctor` from the repo root.
- Trading stays **PAPER** unless the user explicitly arms live mode. Do not flip that in examples or tests.

## Where to work

| Area | Path | Good first PRs |
| --- | --- | --- |
| Docs / README | `README.md`, `docs/` | clarity, broken links |
| Connectors | `clawd-connectors/` | provider status, tests |
| Core AI plugin / skills | `core-ai/clawd-plugin`, `core-ai/clawd-skills` | skill copy, MCP registry |
| Stack bridge | `clawd-code/src/services/clawdStack.ts` | diagnosis output |
| MCP explorer | `clawd-code/mcp-server/` | explorer tools |

Keep changes small. Match nearby TypeScript style. Prefer existing command/tool patterns over new frameworks.

## Checks

```bash
bun install
bun run stack:doctor
bun run connectors:test          # if you touched connectors
bun run typecheck                # if you touched clawd-code
```

## Do not

- Commit `.env`, `.env.local`, keypairs, or API keys.
- Add live-trading defaults.
- Vendor secrets from `~/.clawd-code/`.
- Expand the Anthropic archive copy. Clawd-native MIT code lives beside it — do not mix licenses in a single file if you can avoid it.

## PR shape

1. One problem per PR.
2. Describe *why*, not a file list.
3. Link an issue when there is one.

Questions: open a GitHub issue on [Solizardking/clawd-core-ai](https://github.com/Solizardking/clawd-core-ai).
