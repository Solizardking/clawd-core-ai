/**
 * x402 HTTP Tool
 * Make HTTP requests with automatic payment handling
 */

import type { X402SolanaClient } from "../x402/solana-client.js";
import type { PaymentRequirements, ServiceEndpoint } from "../x402/types.js";
import { createX402Fetch, checkPaymentRequired } from "../x402/middleware.js";
import type { ServiceRegistry } from "../discovery/registry.js";

export interface HttpToolConfig {
  /** x402 client for payments */
  x402Client: X402SolanaClient;
  /** Service registry for discovery */
  registry?: ServiceRegistry;
  /** Default timeout in ms */
  timeout?: number;
  /** Dry run mode (don't actually pay) */
  dryRun?: boolean;
}

export interface HttpResponse<T = unknown> {
  success: boolean;
  status: number;
  data?: T;
  error?: string;
  paymentMade?: {
    amount: string;
    signature: string;
  };
  service?: ServiceEndpoint;
}

export class HttpTool {
  private config: HttpToolConfig;
  private x402Fetch: ReturnType<typeof createX402Fetch>;

  constructor(config: HttpToolConfig) {
    this.config = config;
    this.x402Fetch = createX402Fetch(config.x402Client, {
      timeout: config.timeout ?? 30000,
      dryRun: config.dryRun,
    });
  }

  /**
   * GET request with automatic x402 payment
   */
  async get<T = unknown>(
    url: string,
    options: {
      headers?: Record<string, string>;
      params?: Record<string, string>;
    } = {}
  ): Promise<HttpResponse<T>> {
    let fullUrl = url;
    if (options.params) {
      const searchParams = new URLSearchParams(options.params);
      fullUrl = `${url}?${searchParams.toString()}`;
    }

    const response = await this.x402Fetch<T>(fullUrl, {
      method: "GET",
      headers: options.headers,
    });

    return this.formatResponse(response);
  }

  /**
   * POST request with automatic x402 payment
   */
  async post<T = unknown>(
    url: string,
    body: unknown,
    options: { headers?: Record<string, string> } = {}
  ): Promise<HttpResponse<T>> {
    const response = await this.x402Fetch<T>(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: JSON.stringify(body),
    });

    return this.formatResponse(response);
  }

  /**
   * Call a registered service by ID
   */
  async callService<T = unknown>(
    serviceId: string,
    options: {
      path?: string;
      method?: "GET" | "POST" | "PUT" | "DELETE";
      params?: Record<string, string>;
      body?: unknown;
      headers?: Record<string, string>;
    } = {}
  ): Promise<HttpResponse<T>> {
    const service = this.config.registry?.getService(serviceId);

    if (!service) {
      return {
        success: false,
        status: 404,
        error: `Service not found: ${serviceId}`,
      };
    }

    let url = service.baseUrl;
    if (options.path) {
      url = `${url}${options.path.startsWith("/") ? "" : "/"}${options.path}`;
    }
    if (options.params) {
      const searchParams = new URLSearchParams(options.params);
      url = `${url}?${searchParams.toString()}`;
    }

    const method = options.method ?? "GET";
    const response = await this.x402Fetch<T>(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const formatted = this.formatResponse<T>(response);
    formatted.service = service;
    return formatted;
  }

  /**
   * Search and call the best matching service for a capability
   */
  async callByCapability<T = unknown>(
    capability: string,
    options: {
      path?: string;
      method?: "GET" | "POST" | "PUT" | "DELETE";
      params?: Record<string, string>;
      body?: unknown;
      headers?: Record<string, string>;
    } = {}
  ): Promise<HttpResponse<T>> {
    if (!this.config.registry) {
      return {
        success: false,
        status: 500,
        error: "No registry configured for capability-based calls",
      };
    }

    const services = this.config.registry.findByCapability(capability);
    if (services.length === 0) {
      return {
        success: false,
        status: 404,
        error: `No services found for capability: ${capability}`,
      };
    }

    // Use the first matching service
    return this.callService<T>(services[0].id, options);
  }

  /**
   * Check if a URL requires payment (without paying)
   */
  async checkPayment(url: string): Promise<PaymentRequirements | null> {
    return checkPaymentRequired(url);
  }

  /**
   * Get wallet status
   */
  async getWalletStatus() {
    return this.config.x402Client.getStatus();
  }

  /**
   * Format response consistently
   */
  private formatResponse<T>(response: import("../x402/types.js").X402Response<T>): HttpResponse<T> {
    if (response.status === 200 || (response.status >= 200 && response.status < 300)) {
      return {
        success: true,
        status: response.status,
        data: response.data,
      };
    }

    if (response.paymentRequired) {
      return {
        success: false,
        status: 402,
        error: response.error ?? "Payment required but not completed",
      };
    }

    return {
      success: false,
      status: response.status,
      error: response.error,
    };
  }
}

/**
 * Convenience function to create a configured HTTP tool
 */
export function createHttpTool(config: HttpToolConfig): HttpTool {
  return new HttpTool(config);
}
