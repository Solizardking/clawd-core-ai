# 05 — Deep Research

Full-stack research: web search, on-chain analytics, token screening, wallet intelligence, and market data aggregation.

## Web search (scanner skill)

```
/clawd:scanner search "what are the top Solana DeFi protocols by TVL"
/clawd:scanner find recent news about $JUP governance
/clawd:scanner research the team behind pump.fun
```

## On-chain analytics (Helius DAS + RPC)

```bash
# Wallet intelligence
/clawd:helius enrich wallet 6EF8... — full DAS portfolio, DeFi positions, NFTs

# Transaction deep-dive
/clawd:helius parse transaction 5J8... — instructions, inner calls, token changes

# Token analysis
/clawd:helius asset get metadata for token 8cHz...

# Streaming real-time data
/clawd:helius streaming watch transactions for wallet 6EF8...
/clawd:helius streaming create webhook for program 675kPX...
```

### Key Helius tools (10 routed domains)

| Tool | Domain |
|------|--------|
| `heliusAccount` | Account info, token balances |
| `heliusWallet` | Wallet portfolio, DeFi positions, NFTs |
| `heliusAsset` | Token metadata, holder counts, supply |
| `heliusTransaction` | Parse, search, history |
| `heliusChain` | Block, slot, epoch, validator info |
| `heliusStreaming` | Real-time webhooks, gRPC streaming |
| `heliusKnowledge` | Protocol docs, best practices |
| `heliusWrite` | RPC calls (simulate, getTransaction, etc.) |
| `heliusCompression` | Compressed token lookups |
| `expandResult` | Unpack paginated/summary responses |

## Token screening (DEX Screener + Birdeye)

```bash
# Scan DEX Screener
/clawd:dex-screener-scanner scan new tokens on Solana with >$50K volume
/clawd:dex-screener-scanner screen tokens by age <30min and holders >100
/clawd:dex-screener-scanner find trending tokens in last 24h

# Birdeye data
/clawd:birdeye get price for CL...
/clawd:birdeye check holder distribution for MYTOK
/clawd:birdeye analyze token metrics: volume, liquidity, ATH
```

## Cross-chain data (MCP)

```
npx skills add Lightprotocol/skills  # ZK compression + cross-chain
```

## Research aggregation workflow

1. **Search the web** for context → `scanner`
2. **Check token fundamentals** → `helius Asset/Account`
3. **Screen for momentum** → `dex-screener-scanner` + `birdeye`
4. **Analyze wallets** → `helius Wallet` (top holders, insiders)
5. **Verify transactions** → `helius Transaction` (supply, minting, liquidity adds)
6. **Set up monitoring** → `helius Streaming` (webhook for ongoing tracking)

Next → `06-solana-protocol-dev.md`