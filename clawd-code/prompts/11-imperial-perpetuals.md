# 11 — Imperial Perpetuals

Full perpetuals trading via Imperial routing — position management, take-profit/stop-loss, margin operations, grid trading, and TWAP execution on Phoenix DEX.

## Market intel

```bash
/clawd:imperial-market-intel show SOL-PERP orderbook
/clawd:imperial-market-intel show SOL-PERP candles 1h
/clawd:imperial-market-intel show SOL-PERP funding rate
/clawd:imperial-market-intel show SOL-PERP spread and depth
/clawd:imperial-market-intel pre-trade check SOL-PERP size=10
```

## Position management

```bash
/clawd:imperial-position-management open long SOL-PERP size=10 leverage=10x
/clawd:imperial-position-management open short BTC-PERP size=5 leverage=5x
/clawd:imperial-position-management close SOL-PERP 50%
/clawd:imperial-position-management close SOL-PERP full
/clawd:imperial-position-management reduce SOL-PERP position by 25%
/clawd:imperial-position-management show all open positions
```

## Take-profit / Stop-loss

```bash
/clawd:imperial-tpsl-management attach to SOL-PERP tp=180 sl=140
/clawd:imperial-tpsl-management update tp on SOL-PERP to 200
/clawd:imperial-tpsl-management cancel tp on SOL-PERP
/clawd:imperial-tpsl-management attach laddered exits: tp1=175(25%), tp2=190(50%), tp3=210(25%)
/clawd:imperial-tpsl-management verify all attached TP/SL orders
```

## Margin operations

```bash
/clawd:imperial-margin-operations deposit 1000 USDC into margin account
/clawd:imperial-margin-operations withdraw 500 USDC from margin
/clawd:imperial-margin-operations transfer 200 USDC between margin accounts
/clawd:imperial-margin-operations check margin health
/clawd:imperial-margin-operations show leverage tiers
/clawd:imperial-margin-operations check isolated margin status
```

## Portfolio intel

```bash
/clawd:imperial-portfolio-intel show balances
/clawd:imperial-portfolio-intel show open positions with P&L
/clawd:imperial-portfolio-intel show open orders
/clawd:imperial-portfolio-intel show total exposure
/clawd:imperial-portfolio-intel show funding payments
```

## Risk management

```bash
/clawd:imperial-risk-management check liquidation risk
/clawd:imperial-risk-management check portfolio VaR
/clawd:imperial-risk-management show correlation matrix
/clawd:imperial-risk-management recalculate position sizing
/clawd:imperial-risk-management trigger kill switch conditions
```

## Grid trading

```bash
/clawd:imperial-grid-trading setup grid for SOL-PERP range 150-200 levels=10
/clawd:imperial-grid-trading monitor grid performance
/clawd:imperial-grid-trading pause/resume grid
/clawd:imperial-grid-trading close grid and return positions
```

## TWAP execution

```bash
/clawd:imperial-twap-execution start SOL-PERP size=50 duration=1h side=buy
/clawd:imperial-twap-execution show progress SOL-PERP
/clawd:imperial-twap-execution pause/resume SOL-PERP
/clawd:imperial-twap-execution finalize SOL-PERP
```

## Execution modes

```bash
# PAPER mode (default) — no real trades
/clawd:imperial-execution-modes show current
/clawd:imperial-execution-modes set PAPER

# Dry run — build tx, simulate, don't submit
/clawd:imperial-execution-modes dry-run open long SOL-PERP size=10

# LIVE — executes real trades
/clawd:imperial-execution-modes set LIVE
```

> **Always default to PAPER.** Set LIVE only after dry-run confirmation.

## Skill index

| Skill | Trigger |
|-------|---------|
| `imperial-market-intel` | Check prices, orderbook, candles, funding |
| `imperial-position-management` | Open / close / reduce positions |
| `imperial-tpsl-management` | Take-profit & stop-loss orders |
| `imperial-margin-operations` | Deposit / withdraw / transfer collateral |
| `imperial-portfolio-intel` | Balances, positions, exposure, P&L |
| `imperial-risk-management` | Liquidation risk, VaR, sizing |
| `imperial-grid-trading` | Automated grid strategies |
| `imperial-twap-execution` | Time-weighted average price |
| `imperial-execution-modes` | PAPER / dry-run / LIVE |

Next → `12-vulcan-phoenix.md`