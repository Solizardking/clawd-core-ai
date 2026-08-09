# 09 — x402 Payments & MPP Subscriptions

Accept USDC micropayments per API call via x402, and manage MPP subscription delegations for recurring access. Works with $CLAWD token-gated discounts.

## x402 micropayments (HTTP 402 Payment Required)

The router can charge per request via the x402 protocol:

```bash
# Client hits a paywalled endpoint
curl https://clawdrouter-zk.fly.dev/v1/chat/completions \
  -H "Authorization: Bearer x402" \
  -d '{"model":"clawdrouter/auto","messages":[{"role":"user","content":"hello"}]}'

# If payment is required, the server returns:
HTTP/1.1 402 Payment Required
X-Payment-Required: <base64 challenge>
```

### Payment flow (pull mode)

1. Client sends request → server returns 402 with payment challenge
2. Client signs a transfer authorization for the exact amount
3. Client replays the request with `X-PAYMENT` header containing the signed transfer
4. Server broadcasts the transfer to Solana, waits for confirmation
5. Server returns 200 with `X-PAYMENT-RESPONSE`

### x402 price config

Set via `CLAWDROUTER_X402_PRICE` (in USDC base units, 6 decimals):

```env
CLAWDROUTER_X402_PRICE=10000      # $0.01 per request
CLAWDROUTER_X402_PAY_TO=HKBX8...   # payment recipient
CLAWDROUTER_X402_DESCRIPTION="ClawdRouter access"
```

## MPP subscription delegations

For recurring flat-fee access (monthly plans), use MPP subscriptions:

```bash
# List active subscriptions
pay subscriptions list

# Inspect a specific subscription
pay subscriptions status <subscription_id>

# Cancel a subscription
pay subscriptions cancel <subscription_id>

# Cancel without on-chain tx (already revoked)
pay subscriptions cancel <subscription_id> --local-only

# Activate a new subscription directly
pay subscriptions new \
  --plan <PLAN_PDA_BASE58> \
  --mint <USDC_MINT> \
  --puller <SERVER_PULLER> \
  --recipient <WALLET> \
  --amount 1000000 \
  --period 30d
```

## $CLAWD holder discounts

| Balance | Discount | Savings on $0.01 req | Savings on $5/mo |
|---------|----------|---------------------|-------------------|
| ≥ 100k $CLAWD | 10% | $0.009 | $4.50 |
| ≥ 1M $CLAWD | 25% | $0.0075 | $3.75 |
| ≥ 10M $CLAWD | 50% | $0.005 | $2.50 |

## Programmatic access (clawd-connectors)

```ts
import { PaySubscriptions } from "@openclawd/clawd-connectors";

const pay = new PaySubscriptions({ network: "mainnet" });

const list = await pay.list();
for (const sub of list.entries) {
  console.log(sub.subscription_id, sub.status, sub.amount);
}

await pay.cancel("subscription_pda_base58");
```

## Payment SDK integration

```
npx @solana/pay curl https://clawdrouter-zk.fly.dev/v1/pro/endpoint
```

`pay curl` handles the full 402 handshake automatically — payment challenge → signed transfer → replay with proof → paid response.

Next → `10-dflow-integration.md`