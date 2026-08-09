# 12 — Vulcan & Phoenix DEX

Direct Phoenix DEX perpetuals access via Vulcan SDK — paper trading, live execution, market intel, OODA loop strategy, technical analysis, and on-chain market-making.

## Onboarding

```bash
/clawd:vulcan-onboarding setup paper trading wallet
/clawd:vulcan-onboarding register for Phoenix DEX
/clawd:vulcan-onboarding deposit initial collateral
/clawd:vulcan-onboarding install MCP skills
/clawd:vulcan-onboarding check readiness for live trading
```

## Quickstart

```bash
/clawd:vulcan-quickstart install and verify
/clawd:vulcan-quickstart health check
/clawd:vulcan-quickstart read first market (SOL)
/clawd:vulcan-quickstart place first paper trade
```

## Market intel

```bash
/clawd:vulcan-market-intel show SOL ticker
/clawd:vulcan-market-intel show SOL orderbook depth
/clawd:vulcan-market-intel pull SOL candles 5m for last 100
/clawd:vulcan-market-intel check SOL funding rate
/clawd:vulcan-market-intel show SOL spread and liquidity
```

## Position management

```bash
/clawd:vulcan-position-management show all positions
/clawd:vulcan-position-management show SOL position
/clawd:vulcan-position-management close SOL position
/clawd:vulcan-position-management reduce SOL size=5
/clawd:vulcan-position-management attach TP/SL to SOL
```

## TP/SL management

```bash
/clawd:vulcan-tpsl-management attach to SOL tp=155 sl=138
/clawd:vulcan-tpsl-management cancel tp on SOL
/clawd:vulcan-tpsl-management cancel sl on SOL
/clawd:vulcan-tpsl-management attach laddered exits to SOL
/clawd:vulcan-tpsl-management verify all TP/SL on SOL
```

## Margin operations

```bash
/clawd:vulcan-margin-operations deposit 1000 USDC
/clawd:vulcan-margin-operations withdraw 500 USDC
/clawd:vulcan-margin-operations check margin health
/clawd:vulcan-margin-operations show leverage tiers
/clawd:vulcan-margin-operations check isolated margin
```

## Scale orders (laddered entry)

```bash
/clawd:vulcan-scale-orders place scale buy for SOL range 145-150 levels=5
/clawd:vulcan-scale-orders attach laddered TP/SL to scale order
```

## Technical analysis strategy

```bash
/clawd:vulcan-ta-strategy define strategy: RSI <30 → long, RSI >70 → short
/clawd:vulcan-ta-strategy backtest strategy on SOL 1h candles
/clawd:vulcan-ta-strategy run strategy on SOL (paper)
/clawd:vulcan-ta-strategy show strategy ledger
```

## TWAP execution

```bash
/clawd:vulcan-twap-execution start SOL size=50 duration=1h side=buy
/clawd:vulcan-twap-execution status SOL
/clawd:vulcan-twap-execution monitor SOL
/clawd:vulcan-twap-execution finalize SOL
```

## Grid trading

```bash
/clawd:vulcan-grid-trading setup grid SOL range=140-160 levels=10
/clawd:vulcan-grid-trading monitor grid SOL
/clawd:vulcan-grid-trading pause / resume grid SOL
/clawd:vulcan-grid-trading stop grid SOL
```

## Error recovery

```bash
/clawd:vulcan-error-recovery diagnose failed tx
/clawd:vulcan-error-recovery recover from auth error
/clawd:vulcan-error-recovery handle rate limit
/clawd:vulcan-error-recovery recover from network error
/clawd:vulcan-error-recovery retry failed strategy execution
```

## Lot size calculator

```bash
/clawd:vulcan-lot-size-calculator convert 10 SOL to base lots
/clawd:vulcan-lot-size-calculator convert $1000 notional to base lots
```

## Skill index

| Skill | Trigger |
|-------|---------|
| `vulcan-onboarding` | First-run setup, paper→live |
| `vulcan-quickstart` | 5-minute install + first trade |
| `vulcan-market-intel` | Market data, tickers, candles, funding |
| `vulcan-position-management` | Open / close / show positions |
| `vulcan-tpsl-management` | Take-profit & stop-loss |
| `vulcan-margin-operations` | Collateral deposit / withdraw |
| `vulcan-scale-orders` | Laddered limit entries |
| `vulcan-ta-strategy` | Technical analysis rules engine |
| `vulcan-twap-execution` | Time-weighted average price |
| `vulcan-grid-trading` | Automated grid strategies |
| `vulcan-error-recovery` | Diagnose + fix errors |
| `vulcan-lot-size-calculator` | Convert amounts to lots |

> **All Vulcan trading defaults to PAPER mode.** Set `LIVE_TRADING=true` only after verifying in paper.

Next → `13-zk-compression.md`