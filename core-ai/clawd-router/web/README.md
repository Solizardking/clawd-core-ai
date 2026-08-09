# 🦞 ClawdRouter Web UI

Connect a Solana wallet (Phantom), check your $CLAWD / USDC / SOL balances, get your holder tier + discount, top up with **pay-per-use**, or **subscribe monthly** — paying with **USDC**, **$CLAWD**, or **SOL** — then chat with the router from the playground.

## Run

```bash
# From the clawd-router package
npm run build
node dist/index.js
```

Open http://localhost:8402 in a browser (or the deployed URL, e.g. https://clawdrouter-zk.fly.dev).

## Features

- **Connect wallet** — one-click Phantom connect (any Solana adapter that injects `window.solana`)
- **Balances** — live $CLAWD, USDC, SOL balances via the Solana RPC
- **Holder tier & discount** — WHALE / DIAMOND / HOLDER / FREE based on $CLAWD balance
- **Pay per use** — one-time top-ups of $2/$5/$10/$25 in USDC, $CLAWD, or SOL
- **Subscribe monthly** — $9/$29/$99 per month, same three tokens
- **Live price conversion** — USD amounts converted to $CLAWD/SOL using Jupiter's price API v2
- **Playground** — chat with `/v1/chat/completions` authenticated as your wallet (`x402:<pubkey>:<sig>`)

## Payment flow

1. User picks a token (USDC / $CLAWD / SOL) and amount (top-up or monthly plan)
2. Frontend fetches the recipient wallet from `GET /v1/web/config` (backed by `CLAWDROUTER_PAY_TO`)
3. Frontend builds an SPL/native transfer (auto-creating the recipient ATA if needed) and signs via Phantom
4. After a confirmed payment, the router's `x402` wallet-auth header enables chat requests

## Config

Recipient is read from the router env `CLAWDROUTER_PAY_TO`. The UI fetches it at boot:

```
GET /v1/web/config
→ { "recipient": "…", "clawdToken": "…", "usdcToken": "…" }
```

Set it on Fly:

```bash
flyctl secrets set -a clawdrouter-zk CLAWDROUTER_PAY_TO=<your-wallet>