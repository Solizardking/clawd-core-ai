<div align="center">

# 🦞 Clawd Core

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&duration=2600&pause=900&color=F7931A&center=true&vCenter=true&multiline=true&repeat=true&width=760&height=70&lines=Typed+tools.+Reflective+plugins.+Wallet+clients.;The+lobster+that+never+forgets+a+route.)](https://www.npmjs.com/package/@onchainai/clawd-core)

**The minimal, Solana-native foundation of the Clawd agent stack.**

[![npm](https://img.shields.io/npm/v/@onchainai/clawd-core?label=npm&color=cb3837&logo=npm&style=for-the-badge)](https://www.npmjs.com/package/@onchainai/clawd-core)
[![npm downloads](https://img.shields.io/npm/dm/@onchainai/clawd-core?color=cb3837&logo=npm&style=for-the-badge&label=downloads)](https://www.npmjs.com/package/@onchainai/clawd-core)
[![License](https://img.shields.io/github/license/Solizardking/clawd-core-ai?style=for-the-badge&color=8B5CF6)](https://github.com/Solizardking/clawd-core-ai)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9%2B-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Solana Native](https://img.shields.io/badge/Solana-Native-14F195?style=for-the-badge&logo=solana&logoColor=black)](https://solana.com)

<sub>*The lobster that never forgets a route.* 🦞</sub>

</div>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=90&section=header&text=&fontSize=0" width="100%" alt="" />
</p>

## Overview

Clawd Core is the lightweight foundation of the Clawd agent stack — typed tools, a reflective plugin system, and wallet clients, kept deliberately small so agents install only what they need. It began as a rebrand of `@goat-sdk/core`; the original upstream history is preserved in the vendored source.

```
@Tool-decorated method  ──▶  PluginBase reflection  ──▶  getTools()  ──▶  Zod-validated call
```

| | |
|---|---|
| 🧰 **Typed tools** | `ToolBase` + `createTool()` — Zod-schema-validated parameters, description-safe |
| 🔌 **Plugin system** | `PluginBase` reflectively discovers `@Tool`-decorated methods on any class |
| 👛 **Wallet clients** | `WalletClientBase` — `get_address`, `get_chain`, `get_balance`, `sign_message` |
| 🏛️ **Constitution service** | `getPromptContext()` / `attestOnChainLaws()` — loads and SHA-256-attests the Clawd Constitution bundle for prompt injection |
| 🛠️ **Tool builders** | `createToolParameters()`, `addParametersToDescription()`, `getTools()`, `snakeCase()` |

---

## Install

```bash
npm install @onchainai/clawd-core
# or
bun add @onchainai/clawd-core
# or
pnpm add @onchainai/clawd-core
```

Requires `zod@^3` as a peer dependency. `reflect-metadata` ships as a direct dependency (auto-imported where needed).

> Previously published as `@openclawd/clawd-core` — same code, new scope. See [CHANGELOG.md](./CHANGELOG.md).

---

## Quickstart

```ts
import { Tool, createToolParameters, z, PluginBase, type Chain } from "@onchainai/clawd-core";

class AddParameters extends createToolParameters(
  z.object({ a: z.number(), b: z.number() }),
) {}

class MathTools {
  @Tool({ description: "Adds two numbers" })
  add({ a, b }: AddParameters) {
    return a + b;
  }
}

class MathPlugin extends PluginBase {
  constructor() {
    super("math", [new MathTools()]);
  }

  supportsChain(chain: Chain): boolean {
    return chain.type === "solana";
  }
}
```

<details>
<summary><b>Loading the Clawd Constitution into a prompt</b></summary>

```ts
import { getPromptContext, attestOnChainLaws } from "@onchainai/clawd-core";

// Highest-authority-first context block, truncated to maxChars, ready to inject into a system prompt
const context = getPromptContext({ maxChars: 6000 });

// SHA-256 attestation of the immutable on-chain laws (three-laws.md), independent of who loaded them
const { sha256, bytes } = attestOnChainLaws();
```

Resolves the bundled `constitution/` directory shipped in `files`, or `CLAWD_CONSTITUTION_DIR` if set.

</details>

---

## Exports

Everything is re-exported from the package root:

| Module | Path | Contents |
|---|---|---|
| Classes | `src/classes/` | `ToolBase`, `PluginBase`, `WalletClientBase` |
| Decorators | `src/decorators/` | `@Tool` |
| Services | `src/services/` | `constitution.ts` — manifest, `getPromptContext`, `attestOnChainLaws` |
| Types | `src/types/` | `Chain`, `Token` |
| Utils | `src/utils/` | `createToolParameters`, `addParametersToDescription`, `getTools`, `snakeCase`, `env` |

## Development

```bash
npm install
npm run build       # tsup → dist (CJS + ESM + DTS), syncs constitution/ from ../constitution first
npm run typecheck    # tsc --noEmit
npm test             # vitest run
```

## License

MIT — see [LICENSE](../LICENSE).

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=70&section=footer&text=&fontSize=0" width="100%" alt="" />
</p>
