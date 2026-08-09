# 04 — Memecoin Launches & Prediction Markets

Launch memecoin tokens on Pump.fun, manage the full token lifecycle, and trade prediction markets on DFlow/Kalshi.

## Pump.fun — Memecoin Lifecycle

### Create a token

```
/clawd:pumpfun-launcher create-token name="My Token" symbol="MYTOK" description="The next big thing" image_url="https://example.com/image.png"
```

Key Pump.fun skills:

| Skill | Use when |
|-------|----------|
| `pumpfun-launcher` | Creating tokens, initial buys, metadata upload |
| `pumpfun-trading` | Buy/sell on bonding curve or AMM, slippage control |
| `pumpfun-analytics` | Bonding curve state, graduation progress, price impact |
| `pumpfun-fees` | Creator fee sharing, shareholder splits, claims |
| `pump-bonding-curve` | Bonding curve math — buy/sell quotes, virtual vs real reserves |
| `pump-token-lifecycle` | Full lifecycle from creation through graduation to AMM trading |
| `pump-security` | Security audits, anti-rug checks, supply verification |
| `swarm-orchestrator` | Multi-bot trading swarms on Pump.fun |

### Trade on Pump.fun

```
/clawd:pumpfun-trading buy 0.1 SOL of MYTOK with 5% slippage
/clawd:pumpfun-trading sell 50% of MYTOK position
/clawd:pumpfun-analytics show bonding-curve MYTOK
```

### Fee sharing

```
/clawd:pumpfun-fees setup fee-sharing for MYTOK split 70/20/10
/clawd:pumpfun-fees claim fees from MYTOK
```

## DFlow Prediction Markets (Kalshi)

```bash
# Scan for markets
/clawd:dflow-kalshi-market-scanner find arbitrage opportunities
/clawd:dflow-kalshi-market-scanner scan markets closing in 24h

# Read market data
/clawd:dflow-kalshi-market-data show orderbook for BTC-above-100k-dec
/clawd:dflow-kalshi-market-data stream prices for ETH-above-5k

# Trade
/clawd:dflow-kalshi-trading buy YES 100 tokens on BTC-above-100k-dec
/clawd:dflow-kalshi-trading sell position on ETH-settlement

# Check portfolio
/clawd:dflow-kalshi-portfolio show positions
/clawd:dflow-kalshi-portfolio show P&L
```

### Key DFlow skills

| Skill | Use when |
|-------|----------|
| `dflow-kalshi-market-scanner` | Finding markets by criteria (arb, volume, expiry) |
| `dflow-kalshi-market-data` | Orderbook, trades, candles, WebSocket streams |
| `dflow-kalshi-trading` | Buy/sell/redeem YES/NO tokens |
| `dflow-kalshi-portfolio` | Positions, P&L, activity, redeemable winnings |
| `dflow-spot-trading` | Solana spot swaps via DFlow |
| `dflow-proof-kyc` | Wallet identity verification for Kalshi markets |
| `dflow-platform-fees` | Builder fee monetization |

## DEX Screener — Token Discovery

```
/clawd:dex-screener-scanner scan new tokens on Solana
/clawd:dex-screener-scanner find trending tokens with 100K+ volume
/clawd:dex-screener-scanner screen tokens by age <1h and holders >50
```

Next → `05-deep-research.md`