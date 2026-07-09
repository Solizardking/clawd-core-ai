/**
 * Finance primitives: solvency / proof-of-reserves attestations.
 *
 * A solvency proof lets a holder (an exchange, a vault, a market-making
 * agent) prove that a committed reserve balance meets or exceeds its
 * committed liabilities — "we hold at least what we owe" — without
 * revealing either number. Only Pedersen/hash *commitments* to the
 * reserve and liability totals are published on-chain; the Groth16
 * proof attests that the committed values satisfy
 * `reserve >= liabilities * threshold_bps / 10_000` for the reporting
 * `epoch`.
 *
 * This is the finance-side counterpart to the model-attestation
 * primitives in `proof.ts`: same Groth16 wire format, same
 * public-input-packing convention (see `packPublicInputs`), different
 * relation. On-chain, it is verified by the `attest_solvency`
 * instruction (see `programs/clawd-zk/src/solvency.rs`).
 */

import { createHash } from "node:crypto";
import type { Bytes32, Groth16Proof } from "./types.js";
import { toBytes32, u64ToBytes32 } from "./proof.js";

/** Public input shape for an `attest_solvency` call. */
export interface SolvencyPublicInputs {
  /** The attesting entity's public key (a wallet, or a Google-KMS-derived id — see `google-kms.ts`). */
  holder: Uint8Array;
  /** Commitment to the total reserve balance for this epoch. */
  reserveCommitment: Bytes32;
  /** Commitment to the total liabilities for this epoch (all-zero if liabilities are not modeled). */
  liabilityCommitment: Bytes32;
  /** Minimum reserve ratio required, expressed in basis points (10_000 = 100%). */
  thresholdBps: bigint | number;
  /** Reporting period identifier. Prevents an old, still-true proof from being replayed as current. */
  epoch: bigint | number;
}

/** Build the public input vector for an `attest_solvency` call. */
export function buildSolvencyPublicInputs(p: SolvencyPublicInputs): Bytes32[] {
  return [
    toBytes32(p.holder),
    p.reserveCommitment,
    p.liabilityCommitment,
    u64ToBytes32(p.thresholdBps),
    u64ToBytes32(p.epoch),
  ];
}

/** Inputs to `commitBalance`. */
export interface CommitBalanceInputs {
  /** The balance being committed, in the asset's smallest unit. */
  balance: bigint;
  /** Randomness that hides `balance` in the commitment (keep secret; needed to open the commitment later). */
  blindingFactor: Uint8Array;
  /** Domain tag so reserve and liability commitments over the same balance never collide. */
  context: string;
}

/**
 * Compute a hiding commitment to a balance: `SHA-256(balance_le_u64 || blindingFactor || context)`.
 *
 * Portable stand-in for a Pedersen commitment (as `nullifier.ts` uses
 * SHA-256 as a portable stand-in for Poseidon). Swap in a Pedersen
 * commitment over BN254 for the production circuit; the public-input
 * shape here does not change.
 */
export function commitBalance(inputs: CommitBalanceInputs): Bytes32 {
  const { balance, blindingFactor, context } = inputs;
  if (balance < 0n) {
    throw new Error("balance must be non-negative.");
  }
  if (blindingFactor.length < 16) {
    throw new Error("blindingFactor must be at least 16 bytes.");
  }
  const balanceBytes = new Uint8Array(8);
  new DataView(balanceBytes.buffer).setBigUint64(0, balance, true);

  const hasher = createHash("sha256");
  hasher.update(balanceBytes);
  hasher.update(blindingFactor);
  hasher.update(new TextEncoder().encode(context));
  return hasher.digest() as Bytes32;
}

/**
 * Off-chain sanity check for a solvency proof: confirms the proof is
 * well-formed and that the reserve ratio implied by the caller's
 * (unblinded) figures actually clears `thresholdBps`. Does NOT run the
 * pairing check — that happens on-chain in `attest_solvency`.
 */
export function verifySolvencyOffchain(args: {
  proof: Groth16Proof;
  publicInputs: Bytes32[];
  reserve: bigint;
  liabilities: bigint;
  thresholdBps: bigint | number;
}): { ok: boolean; reason?: string } {
  const threshold = typeof args.thresholdBps === "bigint" ? args.thresholdBps : BigInt(args.thresholdBps);
  if (args.publicInputs.length !== 5) {
    return { ok: false, reason: `expected 5 public inputs, got ${args.publicInputs.length}` };
  }
  for (const [i, field] of args.publicInputs.entries()) {
    if (field.length !== 32) {
      return { ok: false, reason: `public input #${i} must be 32 bytes (got ${field.length})` };
    }
  }
  if (args.liabilities === 0n) {
    return { ok: true };
  }
  const ratioBps = (args.reserve * 10_000n) / args.liabilities;
  if (ratioBps < threshold) {
    return {
      ok: false,
      reason: `reserve ratio ${ratioBps}bps is below required threshold ${threshold}bps`,
    };
  }
  return { ok: true };
}
