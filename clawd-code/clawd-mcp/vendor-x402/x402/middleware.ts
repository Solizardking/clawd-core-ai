/**
 * x402 Fetch Middleware
 * Automatically handles HTTP 402 Payment Required responses
 */

import type { X402SolanaClient } from "./solana-client.js";
import type { PaymentRequirements, X402Response } from "./types.js";

export interface X402FetchOptions {
  /** Maximum retries after payment */
  maxRetries?: number;
  /** Timeout for requests (ms) */
  timeout?: number;
  /** Skip payment and return 402 details instead */
  dryRun?: boolean;
  /** Callback before payment */
  onBeforePayment?: (requirements: PaymentRequirements) => Promise<boolean>;
  /** Callback after payment */
  onAfterPayment?: (result: { success: boolean; signature?: string }) => void;
}

/**
 * Create an x402-enabled fetch function
 */
export function createX402Fetch(
  client: X402SolanaClient,
  defaultOptions: X402FetchOptions = {}
) {
  return async function x402Fetch<T = unknown>(
    input: string | URL | Request,
    init?: RequestInit & X402FetchOptions
  ): Promise<X402Response<T>> {
    const options = { ...defaultOptions, ...init };
    const url = typeof input === "string" ? input : input.toString();

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = options.timeout
      ? setTimeout(() => controller.abort(), options.timeout)
      : null;

    try {
      // Initial request
      const response = await fetch(input, {
        ...init,
        signal: controller.signal,
      });

      // Not a payment required response
      if (response.status !== 402) {
        const data = response.ok ? ((await response.json()) as T) : undefined;
        return {
          status: response.status,
          data,
          error: response.ok ? undefined : await response.text(),
        };
      }

      // Parse payment requirements from 402 response
      let requirements: PaymentRequirements;
      try {
        requirements = (await response.json()) as PaymentRequirements;
      } catch {
        // Try parsing from headers if JSON body fails
        const headerAmount = response.headers.get("X-Payment-Amount");
        const headerAddress = response.headers.get("X-Payment-Address");
        const headerAsset = response.headers.get("X-Payment-Asset");

        if (!headerAmount || !headerAddress) {
          return {
            status: 402,
            error: "402 received but could not parse payment requirements",
          };
        }

        requirements = {
          scheme: "exact",
          network: "solana-mainnet",
          maxAmountRequired: headerAmount,
          asset: headerAsset ?? "USDC",
          payTo: headerAddress,
          resource: url,
        };
      }

      // Fill in resource if not provided
      if (!requirements.resource) {
        requirements.resource = url;
      }

      console.log(`[x402] Payment required for ${url}`);
      console.log(
        `[x402] Amount: ${Number(requirements.maxAmountRequired) / 1_000_000} USDC`
      );

      // Dry run - return requirements without paying
      if (options.dryRun) {
        return {
          status: 402,
          paymentRequired: requirements,
        };
      }

      // Callback before payment
      if (options.onBeforePayment) {
        const shouldPay = await options.onBeforePayment(requirements);
        if (!shouldPay) {
          return {
            status: 402,
            paymentRequired: requirements,
            error: "Payment declined by callback",
          };
        }
      }

      // Execute payment
      const paymentResult = await client.pay(requirements);

      // Callback after payment
      if (options.onAfterPayment) {
        options.onAfterPayment(paymentResult);
      }

      if (!paymentResult.success) {
        return {
          status: 402,
          paymentRequired: requirements,
          error: paymentResult.error,
        };
      }

      // Retry with payment header
      const retryHeaders = new Headers(init?.headers ?? {});
      retryHeaders.set("X-PAYMENT", paymentResult.headerValue!);

      const retryResponse = await fetch(input, {
        ...init,
        headers: retryHeaders,
        signal: controller.signal,
      });

      if (retryResponse.ok) {
        const data = (await retryResponse.json()) as T;
        return {
          status: retryResponse.status,
          data,
        };
      }

      return {
        status: retryResponse.status,
        error: await retryResponse.text(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        status: 0,
        error: `Request failed: ${message}`,
      };
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  };
}

/**
 * Higher-order function to wrap any fetch-based client
 */
export function withX402<T extends (...args: unknown[]) => Promise<Response>>(
  fn: T,
  client: X402SolanaClient,
  options: X402FetchOptions = {}
): T {
  return (async (...args: Parameters<T>) => {
    const response = await fn(...args);

    if (response.status !== 402) {
      return response;
    }

    // Handle 402
    const requirements = (await response.clone().json()) as PaymentRequirements;
    const paymentResult = await client.pay(requirements);

    if (!paymentResult.success) {
      throw new Error(`x402 payment failed: ${paymentResult.error}`);
    }

    // Retry - this is a simplified version, actual impl depends on the function
    const originalRequest = args[0] as Request | string | URL;
    const headers = new Headers(
      originalRequest instanceof Request ? originalRequest.headers : {}
    );
    headers.set("X-PAYMENT", paymentResult.headerValue!);

    return fn(...args);
  }) as T;
}

/**
 * Utility to check if a URL requires payment (without paying)
 */
export async function checkPaymentRequired(
  url: string
): Promise<PaymentRequirements | null> {
  try {
    const response = await fetch(url, { method: "HEAD" });
    if (response.status !== 402) return null;

    // Try to get requirements from response
    const getResponse = await fetch(url);
    if (getResponse.status !== 402) return null;

    return (await getResponse.json()) as PaymentRequirements;
  } catch {
    return null;
  }
}
