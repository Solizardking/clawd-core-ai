# 13 — ZK Compression & Privacy

Light Protocol's ZK compressed tokens and PDAs — 160x cheaper on-chain state, zero-knowledge primitives for privacy-preserving Solana apps.

## Compressed tokens (Light Protocol)

400x cheaper than SPL tokens. No rent-exemption needed.

```bash
# Create a compressed mint
/clawd:compressed-token create mint with interface PDA

# Mint compressed tokens
/clawd:compressed-token mint 1000 tokens to user

# Transfer compressed tokens
/clawd:compressed-token transfer 500 tokens from Alice to Bob

# Approve / revoke
/clawd:compressed-token approve spender for 100 tokens
/clawd:compressed-token revoke spender approval

# Compress / decompress
/clawd:compressed-token compress existing SPL tokens
/clawd:compressed-token decompress tokens back to SPL

# Merge compressed tokens
/clawd:compressed-token merge two compressed token accounts

# Token-2022 with compression
/clawd:compressed-token create mint with Token-2022 and compression
```

## Compressed PDAs

Per-user state with no rent-exemption cost. ~160x cheaper than regular PDAs.

```bash
# Create compressed PDA for per-user state
/clawd:compressed-pda create compressed PDA for user profile

# Update
/clawd:compressed-pda update compressed PDA data

# Close / burn
/clawd:compressed-pda close compressed PDA
/clawd:compressed-pda burn compressed PDA

# Reinitialize
/clawd:compressed-pda reinitialize compressed PDA with new data
```

### Key compressed account operations

| Operation | Program | Gas savings |
|-----------|---------|------------|
| Create PDA | Light Protocol | ~160x |
| Create token account | compressed-token | ~400x |
| Transfer token | compressed-token | ~10x |
| Mint token | compressed-token | ~20x |

## ZK programs (custom)

```bash
# Create nullifier PDA to prevent double-spending
/clawd:zk create nullifier PDA for transaction nonce

# Build privacy-preserving transfer
/clawd:zk scaffold confidential transfer program

# Verify Merkle proofs
/clawd:zk verify Merkle inclusion proof

# On-chain ZK proof verification
/clawd:zk deploy Groth16 verifier program
/clawd:zk submit proof for verification
```

## Helius ZK integration

Helius MCP exposes `heliusCompression` — the routed tool for compressed token + PDA lookups:

```bash
/clawd:helius compression get compressed token account by owner
/clawd:helius compression get compressed PDA state
/clawd:helius compression expand compressed account data
```

## Skill reference

| Skill | Use when |
|-------|----------|
| `compressed-token` | Compressed tokens — mint, transfer, compress, decompress, merge |
| `compressed-pda` | Compressed PDAs — create, update, close, burn, reinitialize |
| `solana-rent-free-dev` | Guide to building with compressed accounts on Solana |
| `zk` | ZK programs, nullifiers, privacy-preserving apps |

### Prerequisites

```bash
npx skills add Lightprotocol/skills
# Sets up @lightprotocol/compressed-token and @lightprotocol/stateless.js
```

```json
// In .clawd/settings.json:
{
  "mcpServers": {
    "zkcompression": {
      "type": "http",
      "url": "https://www.zkcompression.com/mcp"
    }
  }
}
```

Next → `14-telegram-voice.md`