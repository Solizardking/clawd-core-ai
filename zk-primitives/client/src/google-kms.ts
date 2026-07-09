/**
 * Google Cloud KMS attestor.
 *
 * Gives Clawd ZK attestations an HSM-backed root of trust. Instead of
 * signing with a raw Solana keypair held in agent memory, the attester
 * identity can be a Google Cloud KMS asymmetric-signing key (software
 * or HSM protection level). The private key never leaves Google Cloud —
 * signatures come back over the Cloud KMS `asymmetricSign` REST API,
 * and a hash of the key's resource name becomes the on-chain `holder` /
 * `attester` public input, so the Solana program itself never needs to
 * know anything about Google Cloud.
 *
 * This module talks to the Cloud KMS REST API directly over `fetch`
 * rather than depending on `@google-cloud/kms`, and takes the bearer
 * token as an injected async function — so callers can supply Application
 * Default Credentials in production (e.g. via `google-auth-library`'s
 * `GoogleAuth#getAccessToken`), a service-account JWT in CI, or a stub
 * in tests. See `docs/GOOGLE_KMS.md` for the gcloud setup commands.
 */

import { createHash } from "node:crypto";
import type { Bytes32 } from "./types.js";

/** Identifies one Cloud KMS asymmetric-signing key version. */
export interface GoogleKmsKeyRef {
  projectId: string;
  locationId: string;
  keyRingId: string;
  keyId: string;
  keyVersion: string | number;
}

export interface GoogleKmsAttestorConfig {
  key: GoogleKmsKeyRef;
  /** Must resolve to a bearer token scoped for `https://www.googleapis.com/auth/cloudkms`. */
  getAccessToken: () => Promise<string>;
  /** Override for tests/regional endpoints; defaults to the public Cloud KMS REST endpoint. */
  apiBaseUrl?: string;
  /** Override for tests; defaults to the global `fetch`. */
  fetchImpl?: typeof fetch;
}

export interface KmsAttestationResult {
  /** Raw signature bytes returned by Cloud KMS (DER-encoded, per the key's algorithm). */
  signature: Uint8Array;
  /** SHA-256(resourceName) — the deterministic on-chain identity for this KMS key. */
  attesterId: Bytes32;
  /** The 32-byte digest that was signed. */
  digest: Bytes32;
  /** Cloud KMS's resource name for the signing key version, for audit logs. */
  resourceName: string;
}

/** Build the Cloud KMS resource name for a key version. */
export function kmsResourceName(key: GoogleKmsKeyRef): string {
  return (
    `projects/${key.projectId}/locations/${key.locationId}` +
    `/keyRings/${key.keyRingId}/cryptoKeys/${key.keyId}/cryptoKeyVersions/${key.keyVersion}`
  );
}

/**
 * Wraps a single Cloud KMS asymmetric-signing key as a Clawd ZK
 * attester. Use `signCommitment` to produce a signature over a
 * payload/reserve commitment, then feed `attesterId()` into
 * `buildPublishPublicInputs` / `buildSolvencyPublicInputs` as the
 * `attester` / `holder` field.
 */
export class GoogleKmsAttestor {
  private readonly config: GoogleKmsAttestorConfig;
  private readonly resourceName: string;
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;

  constructor(config: GoogleKmsAttestorConfig) {
    this.config = config;
    this.resourceName = kmsResourceName(config.key);
    this.baseUrl = config.apiBaseUrl ?? "https://cloudkms.googleapis.com/v1";
    this.fetchImpl = config.fetchImpl ?? fetch;
  }

  /** Deterministic on-chain identity for this KMS key. */
  attesterId(): Bytes32 {
    return createHash("sha256").update(this.resourceName).digest() as Bytes32;
  }

  /**
   * Sign a 32-byte commitment with the Cloud KMS key via
   * `cryptoKeyVersions.asymmetricSign`. The digest is sent as
   * `{ sha256: base64(commitment) }` — Cloud KMS requires the caller to
   * pre-hash for asymmetric-sign keys, and our commitments are already
   * 32-byte SHA-256/Poseidon outputs, so no extra hashing is needed.
   */
  async signCommitment(commitment: Bytes32): Promise<KmsAttestationResult> {
    if (commitment.length !== 32) {
      throw new Error(`commitment must be exactly 32 bytes (got ${commitment.length}).`);
    }
    const token = await this.config.getAccessToken();
    const url = `${this.baseUrl}/${this.resourceName}:asymmetricSign`;
    const res = await this.fetchImpl(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        digest: { sha256: base64Encode(commitment) },
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Cloud KMS asymmetricSign failed: ${res.status} ${res.statusText} ${text}`);
    }
    const body = (await res.json()) as { signature?: string; name?: string };
    if (!body.signature) {
      throw new Error("Cloud KMS response was missing the `signature` field.");
    }
    return {
      signature: base64Decode(body.signature),
      attesterId: this.attesterId(),
      digest: commitment,
      resourceName: this.resourceName,
    };
  }
}

function base64Encode(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64");
}

function base64Decode(b64: string): Uint8Array {
  return new Uint8Array(Buffer.from(b64, "base64"));
}
