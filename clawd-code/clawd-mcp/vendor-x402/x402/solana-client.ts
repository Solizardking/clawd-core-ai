/**
 * x402 Solana Client
 * Handles USDC micropayments on Solana for the x402 protocol
 */

import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
  SystemProgram,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
  getAccount,
} from "@solana/spl-token";
import bs58 from "bs58";
import { readFileSync } from "node:fs";
import type {
  PaymentRequirements,
  PaymentResult,
  WalletConfig,
  PaymentPayload,
} from "./types.js";
import { USDC_MINTS } from "./types.js";

export class X402SolanaClient {
  private connection: Connection;
  private keypair: Keypair;
  private config: WalletConfig;
  private dailySpent: number = 0;
  private dailyResetTime: number = Date.now();

  constructor(config: WalletConfig) {
    this.config = config;
    this.connection = new Connection(config.rpcUrl, "confirmed");

    // Load keypair from private key or file
    if (config.privateKey) {
      const secretKey = bs58.decode(config.privateKey);
      this.keypair = Keypair.fromSecretKey(secretKey);
    } else if (config.keypairPath) {
      const keypairData = JSON.parse(readFileSync(config.keypairPath, "utf-8"));
      this.keypair = Keypair.fromSecretKey(new Uint8Array(keypairData));
    } else {
      throw new Error("Either privateKey or keypairPath must be provided");
    }
  }

  get publicKey(): PublicKey {
    return this.keypair.publicKey;
  }

  get address(): string {
    return this.keypair.publicKey.toBase58();
  }

  /**
   * Check if payment can be auto-approved based on limits
   */
  canAutoApprove(amountUsdc: number): boolean {
    // Reset daily counter if needed
    const now = Date.now();
    if (now - this.dailyResetTime > 24 * 60 * 60 * 1000) {
      this.dailySpent = 0;
      this.dailyResetTime = now;
    }

    const maxAuto = this.config.maxAutoApprove ?? 1.0; // Default $1 max per request
    const dailyLimit = this.config.dailyLimit ?? 10.0; // Default $10 daily

    if (amountUsdc > maxAuto) {
      console.warn(
        `[x402] Payment $${amountUsdc} exceeds max auto-approve ($${maxAuto})`
      );
      return false;
    }

    if (this.dailySpent + amountUsdc > dailyLimit) {
      console.warn(`[x402] Daily limit reached ($${this.dailySpent}/$${dailyLimit})`);
      return false;
    }

    return true;
  }

  /**
   * Get USDC balance
   */
  async getUsdcBalance(): Promise<number> {
    const mint = new PublicKey(
      this.config.usdcMint ?? USDC_MINTS[this.config.network]
    );
    const ata = await getAssociatedTokenAddress(mint, this.publicKey);

    try {
      const account = await getAccount(this.connection, ata);
      // USDC has 6 decimals
      return Number(account.amount) / 1_000_000;
    } catch {
      return 0;
    }
  }

  /**
   * Get SOL balance (for tx fees)
   */
  async getSolBalance(): Promise<number> {
    const balance = await this.connection.getBalance(this.publicKey);
    return balance / 1_000_000_000; // Convert lamports to SOL
  }

  /**
   * Create a USDC transfer transaction for x402 payment
   */
  async createPaymentTransaction(
    requirements: PaymentRequirements
  ): Promise<Transaction> {
    const mint = new PublicKey(
      this.config.usdcMint ?? USDC_MINTS[this.config.network]
    );
    const recipient = new PublicKey(requirements.payTo);
    const amount = BigInt(requirements.maxAmountRequired);

    // Get token accounts
    const senderAta = await getAssociatedTokenAddress(mint, this.publicKey);
    const recipientAta = await getAssociatedTokenAddress(mint, recipient);

    // Create transfer instruction
    const transferIx = createTransferInstruction(
      senderAta,
      recipientAta,
      this.publicKey,
      amount
    );

    // Optional: Add memo for tracking
    const memoIx = new TransactionInstruction({
      keys: [],
      programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
      data: Buffer.from(`x402:${requirements.resource}`),
    });

    const tx = new Transaction();
    tx.add(transferIx);
    tx.add(memoIx);

    // Get recent blockhash
    const { blockhash, lastValidBlockHeight } =
      await this.connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.lastValidBlockHeight = lastValidBlockHeight;
    tx.feePayer = this.publicKey;

    return tx;
  }

  /**
   * Pay for a resource via x402
   */
  async pay(requirements: PaymentRequirements): Promise<PaymentResult> {
    // Convert amount to USDC (6 decimals)
    const amountUsdc = Number(requirements.maxAmountRequired) / 1_000_000;

    // Check auto-approval limits
    if (!this.canAutoApprove(amountUsdc)) {
      return {
        success: false,
        error: `Payment of $${amountUsdc} requires manual approval (exceeds limits)`,
      };
    }

    // Check balance
    const balance = await this.getUsdcBalance();
    if (balance < amountUsdc) {
      return {
        success: false,
        error: `Insufficient USDC balance: have $${balance.toFixed(2)}, need $${amountUsdc.toFixed(6)}`,
      };
    }

    try {
      // Create and sign transaction
      const tx = await this.createPaymentTransaction(requirements);
      tx.sign(this.keypair);

      // Send transaction
      const signature = await sendAndConfirmTransaction(this.connection, tx, [
        this.keypair,
      ]);

      // Update daily spent
      this.dailySpent += amountUsdc;

      console.log(`[x402] Payment sent: ${signature}`);
      console.log(
        `[x402] Amount: $${amountUsdc.toFixed(6)} USDC | Daily: $${this.dailySpent.toFixed(2)}/${this.config.dailyLimit ?? 10}`
      );

      // Create the X-PAYMENT header value
      const payload: PaymentPayload = {
        scheme: requirements.scheme,
        network: requirements.network,
        payload: signature, // For Solana, we just use the tx signature
        resource: requirements.resource,
      };

      const headerValue = Buffer.from(JSON.stringify(payload)).toString("base64");

      return {
        success: true,
        signature,
        headerValue,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: `Payment failed: ${message}`,
      };
    }
  }

  /**
   * Serialize transaction for alternative flows (e.g., client submits to network)
   */
  async createSerializedPayment(
    requirements: PaymentRequirements
  ): Promise<{ serialized: string; message: string }> {
    const tx = await this.createPaymentTransaction(requirements);
    tx.sign(this.keypair);

    return {
      serialized: Buffer.from(tx.serialize()).toString("base64"),
      message: Buffer.from(tx.serializeMessage()).toString("base64"),
    };
  }

  /**
   * Get wallet status
   */
  async getStatus(): Promise<{
    address: string;
    network: string;
    usdcBalance: number;
    solBalance: number;
    dailySpent: number;
    dailyLimit: number;
    maxAutoApprove: number;
  }> {
    const [usdcBalance, solBalance] = await Promise.all([
      this.getUsdcBalance(),
      this.getSolBalance(),
    ]);

    return {
      address: this.address,
      network: this.config.network,
      usdcBalance,
      solBalance,
      dailySpent: this.dailySpent,
      dailyLimit: this.config.dailyLimit ?? 10,
      maxAutoApprove: this.config.maxAutoApprove ?? 1,
    };
  }
}
