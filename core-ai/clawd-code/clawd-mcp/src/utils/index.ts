/**
 * Utility functions for x402 Claude MCP
 */

/**
 * Format USDC amount from base units (6 decimals) to human readable
 */
export function formatUsdc(baseUnits: string | number): string {
  const amount = Number(baseUnits) / 1_000_000;
  return `$${amount.toFixed(6)} USDC`;
}

/**
 * Convert USDC to base units
 */
export function toUsdcBaseUnits(amount: number): string {
  return Math.floor(amount * 1_000_000).toString();
}

/**
 * Format SOL amount from lamports
 */
export function formatSol(lamports: number): string {
  const sol = lamports / 1_000_000_000;
  return `${sol.toFixed(4)} SOL`;
}

/**
 * Truncate address for display
 */
export function truncateAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Sleep utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    baseDelay?: number;
    maxDelay?: number;
    shouldRetry?: (error: unknown) => boolean;
  } = {}
): Promise<T> {
  const maxAttempts = options.maxAttempts ?? 3;
  const baseDelay = options.baseDelay ?? 1000;
  const maxDelay = options.maxDelay ?? 10000;
  const shouldRetry = options.shouldRetry ?? (() => true);

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxAttempts || !shouldRetry(error)) {
        throw error;
      }

      const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * Parse environment variable as boolean
 */
export function envBool(key: string, defaultValue = false): boolean {
  const value = process.env[key];
  if (!value) return defaultValue;
  return value.toLowerCase() === "true" || value === "1";
}

/**
 * Parse environment variable as number
 */
export function envNumber(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (!value) return defaultValue;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Create a rate limiter
 */
export function createRateLimiter(options: {
  maxRequests: number;
  windowMs: number;
}) {
  const timestamps: number[] = [];

  return {
    canProceed(): boolean {
      const now = Date.now();
      const windowStart = now - options.windowMs;

      // Remove old timestamps
      while (timestamps.length > 0 && timestamps[0] < windowStart) {
        timestamps.shift();
      }

      return timestamps.length < options.maxRequests;
    },

    record(): void {
      timestamps.push(Date.now());
    },

    async wait(): Promise<void> {
      while (!this.canProceed()) {
        await sleep(100);
      }
      this.record();
    },
  };
}

/**
 * Safe JSON parse
 */
export function safeJsonParse<T>(str: string, defaultValue: T): T {
  try {
    return JSON.parse(str) as T;
  } catch {
    return defaultValue;
  }
}
