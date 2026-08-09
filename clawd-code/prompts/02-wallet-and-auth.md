# 02 — Wallet & Auth

Set up your Solana wallet, API keys, and $CLAWD holder tiers that gate model access and discount rates.

## 1. Create or import a wallet

```bash
clawd wallet create        # new wallet
clawd wallet import        # import from keypair/mnemonic
clawd wallet show          # display pubkey, SOL/USDC/$CLAWD balances
```

Wallet stored at `~/.clawd/clawdrouter/wallet.json`.

## 2. Set API keys

Create `~/.clawd/.env`:

```env
ANTHROPIC_API_KEY=sk-ant-...
OPENROUTER_API_KEY=or-...
HELIUS_API_KEY=...
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

| Key | Required for |
|-----|-------------|
| `ANTHROPIC_API_KEY` | Claude models (streaming) |
| `OPENROUTER_API_KEY` | OpenRouter model routing (55+ models) |
| `DEEPSEEK_API_KEY` | DeepSeek models |
| `MOONSHOT_API_KEY` | Kimi K2 models |
| `HELIUS_API_KEY` | $CLAWD balance checks, DAS token lookups, RPC |
| `SOLANA_RPC_URL` | On-chain reads, transaction submission |

## 3. Fund your wallet

```bash
# From Phantom or any Solana wallet, send to your clawd wallet address.
# Minimum: 0.01 SOL for fees, $5 USDC for ~500 paid requests.
```

## 4. Check your $CLAWD tier

```bash
curl -s http://localhost:8402/v1/clawd/status | jq
```

| Balance | Tier | Discount | Access |
|---------|------|----------|--------|
| 0 | FREE | 0% | Budget models only |
| ≥ 1,000 | HOLDER | 5% | Mid-tier models |
| ≥ 100,000 | DIAMOND | 10% | Premium models |
| ≥ 1M | WHALE | 25% | Unlimited |
| ≥ 10M | WHALE | 50% | Unlimited + top speed |

Wallet `x-clawd-wallet` header in chat requests passes your tier to the router.

## 5. Auth modes

| Mode | Use case |
|------|----------|
| `x402` | Local development — no API key needed |
| `x402:<pubkey>:<sig>` | Wallet-signed auth — attach a signed message as bearer |
| `clawd_sk_...` | API key — for hosted deployments |

Next → `03-trading-spot-perps.md`