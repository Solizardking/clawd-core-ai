/**
 * XGATE Discovery Layer Integration
 * Connect to the Daydreams XGATE for discovering x402 endpoints
 * 
 * XGATE acts as a discovery layer for x402 resources and agents.
 * Builders list endpoints. Agents find and compose them.
 */

import type { ServiceEndpoint } from "../x402/types.js";

export interface XGateConfig {
  /** XGATE API base URL */
  baseUrl?: string;
  /** Optional API key for authenticated access */
  apiKey?: string;
  /** Network filter */
  network?: "solana-mainnet" | "solana-devnet" | "base-mainnet" | "base-sepolia";
}

export interface XGateEndpoint {
  id: string;
  name: string;
  description: string;
  url: string;
  methods: string[];
  capabilities: string[];
  pricing: {
    amount: string;
    currency: string;
    per: string;
  };
  network: string;
  owner?: string;
  verified?: boolean;
  stats?: {
    calls: number;
    revenue: string;
    uptime: number;
  };
}

export interface XGateSearchParams {
  query?: string;
  capabilities?: string[];
  maxPrice?: string;
  network?: string;
  verified?: boolean;
  limit?: number;
  offset?: number;
}

export class XGateClient {
  private baseUrl: string;
  private apiKey?: string;
  private network: string;

  constructor(config: XGateConfig = {}) {
    // XGATE is part of the Daydreams ecosystem
    this.baseUrl = config.baseUrl ?? "https://xgate.daydreams.systems/api/v1";
    this.apiKey = config.apiKey;
    this.network = config.network ?? "solana-mainnet";
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`;
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: { ...headers, ...options.headers },
    });

    if (!response.ok) {
      throw new Error(`XGATE API error: ${response.status} ${response.statusText}`);
    }

    return response.json() as T;
  }

  /**
   * Search for x402 endpoints
   */
  async search(params: XGateSearchParams = {}): Promise<XGateEndpoint[]> {
    const searchParams = new URLSearchParams();

    if (params.query) searchParams.set("q", params.query);
    if (params.capabilities) {
      searchParams.set("capabilities", params.capabilities.join(","));
    }
    if (params.maxPrice) searchParams.set("max_price", params.maxPrice);
    if (params.network) searchParams.set("network", params.network);
    if (params.verified !== undefined) {
      searchParams.set("verified", String(params.verified));
    }
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.offset) searchParams.set("offset", String(params.offset));

    // Default to configured network
    if (!params.network) {
      searchParams.set("network", this.network);
    }

    try {
      return await this.request<XGateEndpoint[]>(
        `/endpoints?${searchParams.toString()}`
      );
    } catch (error) {
      console.warn("[xgate] Search failed, using empty results:", error);
      return [];
    }
  }

  /**
   * Get endpoint details by ID
   */
  async getEndpoint(id: string): Promise<XGateEndpoint | null> {
    try {
      return await this.request<XGateEndpoint>(`/endpoints/${id}`);
    } catch {
      return null;
    }
  }

  /**
   * List popular/featured endpoints
   */
  async getFeatured(): Promise<XGateEndpoint[]> {
    try {
      return await this.request<XGateEndpoint[]>("/endpoints/featured");
    } catch {
      return [];
    }
  }

  /**
   * Register a new endpoint (requires API key)
   */
  async registerEndpoint(endpoint: Omit<XGateEndpoint, "id">): Promise<XGateEndpoint> {
    if (!this.apiKey) {
      throw new Error("API key required to register endpoints");
    }

    return this.request<XGateEndpoint>("/endpoints", {
      method: "POST",
      body: JSON.stringify(endpoint),
    });
  }

  /**
   * Convert XGATE endpoint to ServiceEndpoint format
   */
  toServiceEndpoint(xgate: XGateEndpoint): ServiceEndpoint {
    return {
      id: xgate.id,
      name: xgate.name,
      baseUrl: xgate.url,
      capabilities: xgate.capabilities,
      pricing: {
        amount: xgate.pricing.amount,
        asset: xgate.pricing.currency,
        per: xgate.pricing.per,
      },
      metadata: {
        description: xgate.description,
        methods: xgate.methods,
        verified: xgate.verified,
        owner: xgate.owner,
        stats: xgate.stats,
      },
    };
  }

  /**
   * Search and convert to ServiceEndpoint format
   */
  async findServices(params: XGateSearchParams = {}): Promise<ServiceEndpoint[]> {
    const endpoints = await this.search(params);
    return endpoints.map((e) => this.toServiceEndpoint(e));
  }
}

/**
 * Combined discovery that checks both local registry and XGATE
 */
export class UnifiedDiscovery {
  private registry: import("./registry.js").ServiceRegistry;
  private xgate: XGateClient;

  constructor(
    registry: import("./registry.js").ServiceRegistry,
    xgateConfig: XGateConfig = {}
  ) {
    this.registry = registry;
    this.xgate = new XGateClient(xgateConfig);
  }

  /**
   * Find services from all sources
   */
  async find(query: string): Promise<ServiceEndpoint[]> {
    // Search local registry
    const local = this.registry.search(query);

    // Search XGATE
    let remote: ServiceEndpoint[] = [];
    try {
      remote = await this.xgate.findServices({ query });
    } catch {
      // XGATE might not be available
    }

    // Dedupe by ID
    const seen = new Set<string>();
    const results: ServiceEndpoint[] = [];

    for (const svc of [...local, ...remote]) {
      if (!seen.has(svc.id)) {
        seen.add(svc.id);
        results.push(svc);
      }
    }

    return results;
  }

  /**
   * Find by capability
   */
  async findByCapability(capability: string): Promise<ServiceEndpoint[]> {
    const local = this.registry.findByCapability(capability);
    let remote: ServiceEndpoint[] = [];

    try {
      remote = await this.xgate.findServices({ capabilities: [capability] });
    } catch {
      // Fallback to local only
    }

    // Dedupe
    const seen = new Set<string>();
    return [...local, ...remote].filter((svc) => {
      if (seen.has(svc.id)) return false;
      seen.add(svc.id);
      return true;
    });
  }

  /**
   * Get best service for a task
   */
  async getBestMatch(capabilities: string[]): Promise<ServiceEndpoint | undefined> {
    const services = await Promise.all(
      capabilities.map((cap) => this.findByCapability(cap))
    );

    const allServices = services.flat();
    const scored = new Map<string, { service: ServiceEndpoint; score: number }>();

    for (const svc of allServices) {
      const existing = scored.get(svc.id);
      if (existing) {
        existing.score++;
      } else {
        scored.set(svc.id, { service: svc, score: 1 });
      }
    }

    const sorted = Array.from(scored.values()).sort((a, b) => b.score - a.score);
    return sorted[0]?.service;
  }
}
