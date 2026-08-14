<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=220&section=header&text=🦞%20CLAWD%20CLOUD&fontSize=52&fontAlignY=30&fontColor=ffffff&desc=open-source%20Solana%20AI%20agent%20stack&descSize=18&descAlignY=55&animation=twinkling" width="100%" alt="Clawd Cloud" />

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=20&duration=2200&pause=600&color=F7931A&center=true&vCenter=true&multiline=true&repeat=true&width=920&height=110&lines=Probe+the+numinous%2C+then+execute+the+work.;Clawd+Code+%E2%86%94+Connectors+%E2%86%94+Core+AI;Open+source.+Solana-native.+MCP-powered.;CODE+%C2%B7+TRADE+%C2%B7+RESEARCH+%C2%B7+IMAGE+%C2%B7+VOICE)](https://github.com/Solizardking/clawd-core-ai)

**A lobster-native agent that writes code, talks to live Solana APIs, and loads Helius skills from one checkout.**

<br />

[![GitHub stars](https://img.shields.io/github/stars/Solizardking/clawd-core-ai?style=for-the-badge&logo=github&color=F7931A)](https://github.com/Solizardking/clawd-core-ai/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Solizardking/clawd-core-ai?style=for-the-badge&logo=github&color=14F195)](https://github.com/Solizardking/clawd-core-ai/network/members)
[![Last commit](https://img.shields.io/github/last-commit/Solizardking/clawd-core-ai?style=for-the-badge&color=8B5CF6)](https://github.com/Solizardking/clawd-core-ai/commits)
[![Issues](https://img.shields.io/github/issues/Solizardking/clawd-core-ai?style=for-the-badge&color=3B82F6)](https://github.com/Solizardking/clawd-core-ai/issues)

[![npm clawd-code](https://img.shields.io/npm/v/@onchainai/clawd-code?label=%40onchainai%2Fclawd-code&color=cb3837&logo=npm&style=for-the-badge)](https://www.npmjs.com/package/@onchainai/clawd-code)
[![npm clawd-core](https://img.shields.io/npm/v/@onchainai/clawd-core?label=%40onchainai%2Fclawd-core&color=cb3837&logo=npm&style=for-the-badge)](https://www.npmjs.com/package/@onchainai/clawd-core)
[![Clawd layers](https://img.shields.io/badge/Clawd_layers-MIT-22C55E?style=for-the-badge)](#license)
[![Bun](https://img.shields.io/badge/Runtime-Bun-f472b6?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh)
[![Solana](https://img.shields.io/badge/Solana-14F195?style=for-the-badge&logo=solana&logoColor=black)](https://solana.com)
[![MCP](https://img.shields.io/badge/MCP-live-blueviolet?style=for-the-badge)](https://modelcontextprotocol.io)

[![Buy $CLAWD](https://img.shields.io/badge/Buy_%24CLAWD-Phantom-blueviolet?style=flat-square)](https://phantom.com/tokens/solana/8cHzQHUS2s2h8TzCmfqPKYiM4dSt4roa3n7MyRLApump)
[![Dexscreener](https://img.shields.io/badge/Chart-Dexscreener-green?style=flat-square)](https://dexscreener.com/solana/8cHzQHUS2s2h8TzCmfqPKYiM4dSt4roa3n7MyRLApump)
[![Birdeye](https://img.shields.io/badge/Chart-Birdeye-orange?style=flat-square)](https://birdeye.so/token/8cHzQHUS2s2h8TzCmfqPKYiM4dSt4roa3n7MyRLApump)
[![Jupiter](https://img.shields.io/badge/Swap-Jupiter-blue?style=flat-square)](https://jup.ag/swap/SOL-8cHzQHUS2s2h8TzCmfqPKYiM4dSt4roa3n7MyRLApump)

`8cHzQHUS2s2h8TzCmfqPKYiM4dSt4roa3n7MyRLApump`

<br />

<img src="https://github-readme-stats.vercel.app/api/pin/?username=Solizardking&repo=clawd-core-ai&theme=radical&hide_border=true&show_owner=true" alt="clawd-core-ai repo card" />

</div>

---

## 60-second start

```bash
git clone https://github.com/Solizardking/clawd-core-ai.git
cd clawd-core-ai
bun install
cp .env.example .env.local          # add HELIUS_API_KEY (and any LLM keys)
bun run stack:doctor                # prove the three layers can see each other
clawd --plugin-dir core-ai/clawd-plugin
```

Or skip the checkout and install the CLI:

```bash
npm install -g @onchainai/clawd-code
clawd-code code "build a Jupiter swap bot with slippage protection"
```

> **Trading is PAPER by default.** Live orders require `LIVE_TRADING=true` and explicit confirmation. Never commit `.env` / `.env.local`.

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=16&duration=1800&pause=400&color=14F195&center=true&vCenter=true&repeat=true&width=780&height=28&lines=%24+bun+run+stack%3Adoctor;%24+clawd+--plugin-dir+core-ai%2Fclawd-plugin;%24+clawd+stack;%24+clawd-code+trade+%22SOL+funding+rate%22" alt="commands" />
</p>

---

## What you just cloned

Three packages that already speak MCP to each other:

<table>
<tr>
<td width="33%" align="center">

### 🦞 Clawd Code

Agent CLI · React + Ink · Bun

[`clawd-code/`](clawd-code/)
[`@onchainai/clawd-code`](https://www.npmjs.com/package/@onchainai/clawd-code)

💻 CODE · 📈 TRADE · 🔬 RESEARCH
🎨 IMAGE · 🎙️ VOICE

</td>
<td width="33%" align="center">

### 🔌 Connectors

Remote MCP + REST fallback

[`clawd-connectors/`](clawd-connectors/)
`@openclawd/clawd-connectors`

DFlow · Helius · Jupiter · Birdeye

</td>
<td width="33%" align="center">

### 🧠 Core AI

Skills, plugin, typed tools

[`core-ai/`](core-ai/)
[`@onchainai/clawd-core`](https://www.npmjs.com/package/@onchainai/clawd-core)

plugin · clawd-mcp · constitution

</td>
</tr>
</table>

```mermaid
flowchart LR
  You(("you")) --> CLI["clawd / clawd-code"]
  CLI --> Q["Query Engine"]
  Q --> MCP[".mcp.json"]
  Q --> Plug["--plugin-dir core-ai/clawd-plugin"]
  Q --> Stack["clawdStack.ts"]

  MCP --> DFlow
  MCP --> Helius
  MCP --> Jupiter
  MCP --> Birdeye

  Plug --> Skills["clawd-skills"]
  Plug --> HeliusMCP["helius-mcp"]
  Stack --> Conn["clawd-connectors"]
  Stack --> Core["clawd-core ToolBase"]
```

| Layer | Speaks via | Job |
| --- | --- | --- |
| **Clawd Code** | CLI, `.mcp.json`, [`clawdStack.ts`](clawd-code/src/services/clawdStack.ts) | Agent loop |
| **Connectors** | HTTP MCP + REST | Live DFlow / Helius / Jupiter / Birdeye |
| **Core AI** | `--plugin-dir core-ai/clawd-plugin` | Skills + Helius MCP + `ToolBase` |

Inside the CLI: `clawd stack` or `/stack`.

---

## Modes

```bash
clawd-code code "build a Jupiter swap bot with slippage protection"
clawd-code trade "what's the funding rate on SOL perps?"
clawd-code research "compare AutoGPT, LangChain, CrewAI, AutoGen"
clawd-code image "cyberpunk Solana trading desk"
clawd-code voice "the task is complete"
clawd-code arena status
```

<table>
<tr>
<td align="center" width="20%">💻<br/><b>CODE</b><br/><sub>stream, review, ship</sub></td>
<td align="center" width="20%">📈<br/><b>TRADE</b><br/><sub>Phoenix + Vulcan · paper first</sub></td>
<td align="center" width="20%">🔬<br/><b>RESEARCH</b><br/><sub>long-context synthesis</sub></td>
<td align="center" width="20%">🎨<br/><b>IMAGE</b><br/><sub>x402-paid gen</sub></td>
<td align="center" width="20%">🎙️<br/><b>VOICE</b><br/><sub>TTS + STT</sub></td>
</tr>
</table>

---

## Connectors

```ts
import { createConnectors } from "@openclawd/clawd-connectors";

const connectors = createConnectors();
await connectors.helius.rpc("getBalance", ["YourPubkeyHere"]);
await connectors.dflow.callTool("open_position", { size: 10 });
```

```bash
bun run --cwd clawd-connectors doctor
```

Shared registry: [`.mcp.json`](.mcp.json) (repo root, `clawd-code/`, and `core-ai/clawd-plugin/`).

| Server | How it loads |
| --- | --- |
| DFlow / Helius / Jupiter / Birdeye | HTTP MCP from Connectors |
| ZK Compression | HTTP MCP from the Core AI plugin |
| clawd-mcp | `npx helius-mcp@latest` |
| clawd-code-explorer | `clawd-code/mcp-server` |

Keys live in [`.env.example`](.env.example) — copy to `.env.local`.

---

## Core AI

[`core-ai/`](core-ai/) is the runtime Clawd Code loads, not a docs dump.

| Package | What you get |
| --- | --- |
| [`clawd-plugin`](core-ai/clawd-plugin) | Skills + auto-started MCP |
| [`clawd-core`](core-ai/clawd-core) | `ToolBase` / `PluginBase` / `WalletClientBase` |
| [`clawd-mcp`](core-ai/clawd-mcp) | 10 routed Helius tools |
| [`clawd-skills`](core-ai/clawd-skills) | Solana / Pump / DFlow / Imperial / Vulcan |
| [`clawd-agents`](core-ai/clawd-agents) | Perps + Grok runtimes |
| [`constitution`](core-ai/constitution) | Laws, `SOUL.md`, `IDENTITY.md` |

---

## Repo map

```
clawd-cloud/
├── clawd-code/              @onchainai/clawd-code
│   ├── src/                 query engine, tools, Ink UI
│   ├── src/services/clawdStack.ts
│   ├── .mcp.json
│   └── mcp-server/          source explorer (Vercel)
├── clawd-connectors/        @openclawd/clawd-connectors
├── core-ai/                 plugin · skills · clawd-core · clawd-mcp
├── docs/                    architecture guides
├── .mcp.json                root MCP registry
├── .claude-plugin/          marketplace → ./core-ai/clawd-plugin
└── scripts/stack-doctor.ts  bun run stack:doctor
```

---

## Develop

```bash
bun install
bun run stack:doctor
bun run build
bun run typecheck
bun run connectors:test
bun run core:skills
```

Workspaces: `clawd-code`, `clawd-connectors`, `core-ai/clawd-core`, `core-ai/clawd-plugin`.

Docs: [architecture](docs/architecture.md) · [tools](docs/tools.md) · [commands](docs/commands.md) · [subsystems](docs/subsystems.md) · [ADR](docs/ADR-001-open-clawd-v2.md)

---

## Contributing

PRs welcome on docs, the MCP explorer, connectors, Core AI skills, and stack wiring.

1. Fork → branch off `main`.
2. Keep diffs small. Match nearby TypeScript style.
3. `bun run stack:doctor` and any tests for the package you touched.
4. Never commit secrets, keypairs, or live-trading flags flipped on.

See [`CONTRIBUTING.md`](CONTRIBUTING.md) and [`SECURITY.md`](SECURITY.md).

---

## License

| What | License |
| --- | --- |
| **Clawd Code** (Clawd-native CLI, agents, arena, x402) | [MIT](clawd-code/LICENSE) |
| **Clawd Connectors** | MIT |
| **Clawd Core AI** (plugin, skills, clawd-core, clawd-mcp) | MIT |
| Archive copy of Anthropic Claude Code under `clawd-code/src/` | **Not open source** — [research-only notice](LICENSE) |

Clawd-native work is MIT. The archived Claude Code sources are Anthropic's property, kept here for research, and are **not** licensed for redistribution. Official CLI: [Claude Code docs](https://docs.anthropic.com/en/docs/claude-code).

---

<div align="center">

**Star this repo** if the stack is useful — it is the best signal that the lobster should keep molting in public.

[![Star History Chart](https://api.star-history.com/chart?repos=Solizardking/clawd-core-ai&type=Date)](https://star-history.com/#Solizardking/clawd-core-ai&Date)

[Clawd Code](clawd-code/) · [Connectors](clawd-connectors/) · [Core AI](core-ai/) · [Issues](https://github.com/Solizardking/clawd-core-ai/issues) · [$CLAWD](https://phantom.com/tokens/solana/8cHzQHUS2s2h8TzCmfqPKYiM4dSt4roa3n7MyRLApump)

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=140&section=footer&text=the%20shell%20molts.%20the%20laws%20do%20not.&fontSize=18&fontColor=F7931A&animation=twinkling" width="100%" alt="" />

<sub>🦞 MIT Clawd layers · paper trading by default · PRs welcome</sub>

</div>
