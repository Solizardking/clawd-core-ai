/**
 * x402 Protocol Types for Solana
 * HTTP 402 Payment Required - Native micropayments for AI agents
 */

export interface PaymentRequirements {
  /** Unique payment scheme (e.g., "exact", "upto", "channel") */
  scheme: "exact" | "upto" | "channel";
  /** Network identifier */
  network: "solana-mainnet" | "solana-devnet" | "base-mainnet" | "base-sepolia";
  /** Maximum amount required in base units (e.g., USDC has 6 decimals) */
  maxAmountRequired: string;
  /** Asset contract address or identifier */
  asset: string;
  /** Recipient address for payment */
  payTo: string;
  /** Resource being paid for */
  resource: string;
  /** Human-readable description */
  description?: string;
  /** Optional: Payment expiration (ISO timestamp) */
  expiresAt?: string;
  /** Optional: Facilitator URL for verification */
  facilitator?: string;
  /** Extra metadata */
  extra?: Record<string, unknown>;
}

export interface PaymentPayload {
  /** The x402 scheme used */
  scheme: string;
  /** Network where payment occurred */
  network: string;
  /** Serialized + signed transaction (base64) */
  payload: string;
  /** Resource being accessed */
  resource: string;
}

export interface PaymentResult {
  /** Whether payment was successful */
  success: boolean;
  /** Transaction signature */
  signature?: string;
  /** Error message if failed */
  error?: string;
  /** The X-PAYMENT header value to send */
  headerValue?: string;
}

export interface X402Response<T = unknown> {
  /** HTTP status code */
  status: number;
  /** Response data (if 200) */
  data?: T;
  /** Payment requirements (if 402) */
  paymentRequired?: PaymentRequirements;
  /** Error message */
  error?: string;
}

export interface ServiceEndpoint {
  /** Unique service identifier */
  id: string;
  /** Human-readable name */
  name: string;
  /** Base URL */
  baseUrl: string;
  /** Capabilities/tags */
  capabilities: string[];
  /** Expected pricing info */
  pricing?: {
    amount: string;
    asset: string;
    per: string; // "request", "byte", "second", etc.
  };
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

export interface WalletConfig {
  /** Solana RPC URL */
  rpcUrl: string;
  /** Private key (base58 encoded) or path to keypair file */
  privateKey?: string;
  keypairPath?: string;
  /** Default network */
  network: "solana-mainnet" | "solana-devnet";
  /** USDC mint address */
  usdcMint?: string;
  /** Max amount to auto-approve per request (in USDC) */
  maxAutoApprove?: number;
  /** Daily spending limit (in USDC) */
  dailyLimit?: number;
}

// USDC Mint Addresses
export const USDC_MINTS = {
  "solana-mainnet": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "solana-devnet": "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU", // Devnet USDC
} as const;

// Well-known facilitators
export const FACILITATORS = {
  coinbase: "https://x402.coinbase.com",
  cloudflare: "https://x402.cloudflare.com",
  // Add more as ecosystem grows
} as const;
