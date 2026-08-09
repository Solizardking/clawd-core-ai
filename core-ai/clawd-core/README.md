# 🦞 Clawd Core

**The Solana-native agent toolkit for Clawd Code** — typed tools, plugins, and wallet clients with decorator-based tool discovery.

[![npm](https://img.shields.io/npm/v/@openclawd/clawd-core?label=npm&color=cb3837&logo=npm)](https://www.npmjs.com/package/@openclawd/clawd-core)
[![License](https://img.shields.io/github/license/Solizardking/clawd-core-ai)](https://github.com/Solizardking/clawd-core-ai)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9%2B-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

<small>*The lobster that never forgets a route.* 🦞</small>

## Overview

Clawd Core is the lightweight foundation of the Clawd agent stack. It keeps the core minimal — typed tools, plugins, and wallet clients — so agents install only the pieces they need.

**What you get:**

- **Typed tools** — `ToolBase` + `createTool()` with Zod-schema-validated parameters
- **Plugin system** — `PluginBase` that reflectively discovers `@Tool`-decorated methods
- **Wallet clients** — `WalletClientBase` with core tools (`get_address`, `get_chain`, `get_balance`, `sign_message`)
- **Tool builders** — `createToolParameters()`, `addParametersToDescription()`, `getTools()`

## Install

```bash
npm install @openclawd/clawd-core
# or
bun add @openclawd/clawd-core
```

Requires `zod@^3` as a peer dependency. `reflect-metadata` is bundled as a dependency.

## Quickstart

```ts
import { Tool, createToolParameters, z, PluginBase, type Chain } from "@openclawd/clawd-core";

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

## Packages

| Package | Description |
|---------|-------------|
| `@openclawd/clawd-core` | This package — typed tools, plugins, wallet clients |

## Development

```bash
npm install
npm run build       # tsup → dist (CJS + ESM + DTS)
npm run typecheck   # tsc --noEmit
npm test            # vitest
```

## License

MIT — see [LICENSE](../LICENSE).