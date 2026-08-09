# 07 — MCP Tools & Connectors

Wire up Model Context Protocol servers, connect to remote MCP endpoints, and use the clawd-connectors package to access DFlow, Helius, Jupiter, and Birdeye tools.

## MCP server architecture

Clawd auto-starts 6 MCP servers via the clawd-plugin. Each exposes tools that your agent can call with MCP tool requests.

```bash
clawd --plugin-dir ./clawd-plugin
```

### Built-in MCP servers

| Server | Total Tools | Signature tools |
|--------|------------|-----------------|
| Helius MCP | 10 | `heliusWallet`, `heliusAsset`, `heliusAccount`, `heliusTransaction`, `heliusStreaming`, `heliusChain`, `heliusKnowledge`, `heliusWrite`, `heliusCompression`, `expandResult` |
| Pump MCP | 55 | Token creation, AMM swaps, analytics, wallet ops, fee management, security checks |
| Phoenix Rise | — | Real-time perpetuals market data (orderbook, candles, funding, trades) |
| DFlow MCP | — | Spot swaps, prediction markets, orderbook, KYC, platform fees |
| ZK Compression MCP | — | Compressed tokens, compressed PDAs, Light Protocol operations |
| Clawd Code MCP | — | Clawd Code CLI itself — code gen, trade, research commands |

## Remote MCP connectors (clawd-connectors)

The `clawd-connectors` package bridges your agent to remote MCP endpoints:

```bash
npm install @openclawd/clawd-connectors
```

### Connector status

```bash
clawd-connectors status
# DFLOW_API_KEY      ✓
# HELIUS_API_KEY     ✓
# JUPITER_API_KEY    ✓
# BIRDEYE_API_KEY    ✓
# dflow     ✓  mcp=https://api.paybox.sh/mcp?app=dflow
```

### List tools on a remote MCP server

```bash
clawd-connectors list-tools dflow
# • dflow_get_quote  — Get a swap quote for Solana tokens
# • dflow_execute_swap — Execute a swap on Solana
# • kalshi_get_markets — List Kalshi prediction markets
# ...
```

### Programmatic usage (TypeScript)

```ts
import { createConnectors } from "@openclawd/clawd-connectors";

const connectors = createConnectors();

// Call a tool on the DFlow remote MCP server
const res = await connectors.dflow.callTool("open_position", { size: 10 });

// List all tools
const tools = await connectors.helius.listTools();

// REST fallback (Helius JSON-RPC)
const balance = await connectors.helius.rpc("getBalance", ["pubkey"]);
```

## Adding new MCP servers

```bash
# Add a remote MCP server (Claude Code / Cursor format)
claude mcp add my-server -- url "https://api.example.com/mcp"

# Or define in .clawd/settings.json:
{
  "mcpServers": {
    "my-server": {
      "type": "http",
      "url": "https://api.example.com/mcp"
    }
  }
}
```

## Managing MCP servers at runtime

```bash
clawd mcp list          # show connected servers
clawd mcp status        # check server health
clawd mcp disconnect    # disconnect a server
```

## Subscription management (pay CLI)

```bash
# List MPP subscription delegations
clawd-connectors subscriptions list

# Inspect one
clawd-connectors subscriptions status <subscription_id>

# Cancel
clawd-connectors subscriptions cancel <subscription_id>

# Activate new
clawd-connectors subscriptions new --plan <PLAN> --mint <MINT> --amount 1000000 --period 30d
```

Next → `08-agent-identity.md`