# 06 — Solana Protocol Development

Build, test, and deploy Solana programs (Anchor, Native Rust, Pinocchio) with compressed accounts, ZK primitives, and on-chain agent identity.

## Anchor program scaffolding

```
/clawd:build scaffold an Anchor program for a token staking vault
/clawd:build generate PDAs for a bonding curve AMM
/clawd:build add CPI calls to Jupiter for auto-compounding
```

### Key Solana dev skills

| Skill | Use when |
|-------|----------|
| `solana-dev` | General Solana dApp development — programs, accounts, PDAs, CPIs |
| `svm` | Solana Virtual Machine internals, architecture, protocol-level work |
| `solana-ralphy-skill` | Autonomous coding loop for Solana tasks |
| `solana-formal-verification` | Lean 4 proofs for program correctness |

## Compressed accounts (Light Protocol / Helius ZK)

160x cheaper on-chain state. No rent-exemption needed for per-user accounts.

```
/clawd:compressed-pda create compressed PDA for user state
/clawd:compressed-pda update compressed account data
/clawd:compressed-pda close compressed PDA

/clawd:compressed-token create compressed mint
/clawd:compressed-token mint compressed tokens to user
/clawd:compressed-token transfer compressed tokens
```

### Key compressed skills

| Skill | Use when |
|-------|----------|
| `compressed-pda` | Compressed PDAs — create, update, close, burn, reinitialize |
| `compressed-token` | Compressed tokens — mint, transfer, approve, compress/decompress, merge |
| `solana-rent-free-dev` | Compressed accounts + tokens with Helius + Light Protocol |
| `zk` | ZK programs, nullifier PDAs, privacy-preserving apps |

## ZK primitives

```
/clawd:zk create nullifier PDA for double-spend prevention
/clawd:zk build privacy-preserving transfer program
```

## MagicBlock Ephemeral Rollups

High-performance gaming + real-time apps with fast finality.

```
/clawd:magicblock delegate account to ephemeral rollup
/clawd:magicblock commit rollup state to base layer
/clawd:magicblock set up VRF for verifiable randomness
/clawd:magicblock process private payment (deposit/transfer/withdraw)
```

## Dev workflow

1. **Scaffold** → `solana-dev` creates the Anchor workspace
2. **Build** → `anchor build` or `cargo build-sbf`
3. **Test** → `solana-test-validator` + `anchor test` / LiteSVM
4. **Formally verify** → `solana-formal-verification` (Lean 4 proofs)
5. **Deploy** → `solana program deploy` to devnet → mainnet

## Reference files

Each skill has reference docs in its `skills/<skill-name>/` directory:

```
clawd-skills/solana-dev/references.md
clawd-skills/svm/references.md
clawd-skills/compressed-pda/references.md
clawd-skills/compressed-token/references.md
clawd-skills/zk/references.md
clawd-skills/magicblock/references.md
```

Use `npx skills add Lightprotocol/skills` for the full Light Protocol suite.

Next → `07-mcp-tools-connectors.md`