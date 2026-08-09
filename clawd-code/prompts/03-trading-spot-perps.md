# 03 — Spot Trading & Perpetuals

Execute spot swaps on Jupiter and perpetuals on Phoenix DEX via Imperial and Vulcan routing.

## Spot swaps (Jupiter)

Direct Jupiter v6 swaps through Helius:

```bash
# Get a quote
/clawd:jupiter quote 1 SOL to USDC on mainnet

# Execute a swap
/clawd:jupiter swap 10 USDC to SOL with 1% slippage on mainnet
```

### Key Jupiter tools (via MCP)

| Tool | Purpose |
|------|---------|
| `jupiterQuote` | Get swap quote with route plan |
| `jupiterSwap` | Build + submit swap transaction |
| `jupiterPrice` | Get token prices from Jupiter API |
| `jupiterTokens` | List all tradable tokens |

### Best practices

- Always check slippage before swapping (default 1%)
- Use `confirmed` commitment for reads, `finalized` for large swaps
- Check the Jupiter price API before confirming a trade
- Verify you have enough SOL for gas + the token for the swap

## Perpetuals (Phoenix DEX via Imperial + Vulcan)

```bash
# Check market intel
/clawd:imperial-market-intel show SOL-PERP

# Open a position
/clawd:imperial-position-management open long SOL-PERP size=10 leverage=10x

# Set take-profit and stop-loss
/clawd:imperial-tpsl-management attach SOL-PERP tp=180 sl=140

# Close position
/clawd:imperial-position-management close SOL-PERP 50%

# Check portfolio
/clawd:imperial-portfolio-intel show
```

### Key Imperial skills

| Skill | Use when |
|-------|----------|
| `imperial-market-intel` | Getting market data (orderbook, candles, funding) |
| `imperial-position-management` | Opening, inspecting, closing positions |
| `imperial-tpsl-management` | Setting take-profit and stop-loss orders |
| `imperial-margin-operations` | Depositing, withdrawing collateral |
| `imperial-portfolio-intel` | Viewing positions, balances, P&L |
| `imperial-risk-management` | Checking leverage, liquidation risk, exposure |
| `imperial-execution-modes` | PAPER vs LIVE mode, dry runs, simulations |
| `imperial-grid-trading` | Automated grid strategies with layered limit orders |
| `imperial-twap-execution` | Time-weighted average price over a window |

## Vulcan-specific (direct Phoenix DEX)

```bash
/clawd:vulcan-market-intel show SOL orderbook
/clawd:vulcan-position-management open SOL size=5 long leverage=5x
/clawd:vulcan-tpsl-management attach SOL tp=155 sl=138
/clawd:vulcan-twap-execution start SOL size=20 duration=1h side=buy
```

## Safety defaults

- **All trading defaults to PAPER mode** — no real funds move until you set `LIVE_TRADING=true`
- Always use `--dry-run` before live execution
- Check `clawd guardrails` for position size limits, leverage caps, and exposure alerts

Next → `04-memecoin-launches.md`