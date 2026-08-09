# 10 — DFlow Integration

Full DFlow trading suite — spot swaps on Solana, Kalshi prediction markets, Proof KYC, and builder platform fees.

## Spot swaps on Solana

```bash
# Get a quote
/clawd:dflow-spot-trading quote 1 SOL to USDC

# Execute swap
/clawd:dflow-spot-trading swap 10 USDC to SOL

# Priority fees (for congestion)
/clawd:dflow-spot-trading swap 0.5 SOL to JUP with priorityFee=50000

# Sponsored swaps (app pays tx fees)
/clawd:dflow-spot-trading swap 100 USDC to SOL sponsored=true
```

## Kalshi prediction markets

```bash
# Scan for opportunities
/clawd:dflow-kalshi-market-scanner find arbitrage (YES + NO < $1)
/clawd:dflow-kalshi-market-scanner scan cheap long-shots with volume >$10K
/clawd:dflow-kalshi-market-scanner markets closing within 24h

# Market data
/clawd:dflow-kalshi-market-data show orderbook for "BTC above 100K Dec 2026"
/clawd:dflow-kalshi-market-data stream prices for "ETH settlement"
/clawd:dflow-kalshi-market-data pull 1-minute candles for last 24h

# Execute trades
/clawd:dflow-kalshi-trading buy YES 100 tokens on "Fed cuts rates"
/clawd:dflow-kalshi-trading sell NO 50 tokens on "Unemployment above 5%"
/clawd:dflow-kalshi-trading redeem winning tokens from settled markets

# Portfolio
/clawd:dflow-kalshi-portfolio show positions
/clawd:dflow-kalshi-portfolio show unrealized P&L
/clawd:dflow-kalshi-portfolio show fill history
```

## Proof KYC

Wallet identity verification required for Kalshi markets:

```bash
/clawd:dflow-proof-kyc check wallet status
/clawd:dflow-proof-kyc initiate KYC flow
/clawd:dflow-proof-kyc verify jurisdiction
```

## Phantom Connect

Build frontend apps with Phantom wallet + DFlow trading:

```bash
/clawd:dflow-phantom-connect setup React app with Phantom wallet
/clawd:dflow-phantom-connect add DFlow swap integration
/clawd:dflow-phantom-connect add Kalshi prediction market widget
```

## Platform fees (builder monetization)

```bash
# Percentage fee on spot + PM trades
/clawd:dflow-platform-fees set platformFeeBps=5 (0.05%)

# Dynamic fee for prediction market outcome tokens
/clawd:dflow-platform-fees set platformFeeScale=10
```

## Client CLI

```bash
curl -fsS https://cli.dflow.net | sh
dflow setup
dflow whoami
dflow positions
dflow guardrails show
```

Next → `11-imperial-perpetuals.md`