/**
 * x402 Service Discovery Registry
 * Local and remote service discovery for x402-enabled endpoints
 */

import type { ServiceEndpoint } from "../x402/types.js";

// Default services registry - can be extended or loaded from remote
const DEFAULT_SERVICES: ServiceEndpoint[] = [
  {
    id: "firecrawl",
    name: "Firecrawl - Web Scraping API",
    baseUrl: "https://api.firecrawl.dev",
    capabilities: ["scrape", "crawl", "html", "markdown"],
    pricing: { amount: "0.01", asset: "USDC", per: "request" },
    metadata: { docs: "https://firecrawl.dev/docs" },
  },
  {
    id: "zyte",
    name: "Zyte - Web Scraping API",
    baseUrl: "https://api.zyte.com",
    capabilities: ["scrape", "browser", "extraction"],
    pricing: { amount: "0.001", asset: "USDC", per: "request" },
  },
  {
    id: "gloria-news",
    name: "Gloria - AI News Data",
    baseUrl: "https://api.gloria.ai",
    capabilities: ["news", "signals", "realtime"],
    pricing: { amount: "0.005", asset: "USDC", per: "request" },
  },
  {
    id: "defi-api",
    name: "DeFi API - Portfolio & Prices",
    baseUrl: "https://defi-api.x402.dev",
    capabilities: ["portfolio", "prices", "swap", "yield"],
    pricing: { amount: "0.001", asset: "USDC", per: "request" },
  },
  {
    id: "slamai",
    name: "SLAMai - Smart Money Intelligence",
    baseUrl: "https://api.slamai.io",
    capabilities: ["whale-tracking", "smart-money", "analytics"],
    pricing: { amount: "0.01", asset: "USDC", per: "request" },
  },
  {
    id: "heurist-mesh",
    name: "Heurist Mesh - Crypto Skills",
    baseUrl: "https://api.heurist.ai",
    capabilities: ["wallet-analysis", "token-tracking", "onchain"],
    pricing: { amount: "0.005", asset: "USDC", per: "request" },
  },
];

export interface RegistryConfig {
  /** Local services to include */
  localServices?: ServiceEndpoint[];
  /** Remote registry URLs to fetch from */
  remoteRegistries?: string[];
  /** Cache TTL in ms */
  cacheTtl?: number;
}

export class ServiceRegistry {
  private services: Map<string, ServiceEndpoint> = new Map();
  private config: RegistryConfig;
  private lastFetch: number = 0;
  private cacheValid: boolean = false;

  constructor(config: RegistryConfig = {}) {
    this.config = {
      cacheTtl: 5 * 60 * 1000, // 5 minutes default
      ...config,
    };

    // Initialize with default + local services
    for (const svc of DEFAULT_SERVICES) {
      this.services.set(svc.id, svc);
    }
    for (const svc of config.localServices ?? []) {
      this.services.set(svc.id, svc);
    }
  }

  /**
   * Add a service to the registry
   */
  addService(service: ServiceEndpoint): void {
    this.services.set(service.id, service);
  }

  /**
   * Remove a service from the registry
   */
  removeService(id: string): boolean {
    return this.services.delete(id);
  }

  /**
   * Get all services
   */
  getAllServices(): ServiceEndpoint[] {
    return Array.from(this.services.values());
  }

  /**
   * Get a service by ID
   */
  getService(id: string): ServiceEndpoint | undefined {
    return this.services.get(id);
  }

  /**
   * Find services by capability
   */
  findByCapability(capability: string): ServiceEndpoint[] {
    return this.getAllServices().filter((svc) =>
      svc.capabilities.some(
        (cap) =>
          cap.toLowerCase().includes(capability.toLowerCase()) ||
          capability.toLowerCase().includes(cap.toLowerCase())
      )
    );
  }

  /**
   * Search services by name or capabilities
   */
  search(query: string): ServiceEndpoint[] {
    const q = query.toLowerCase();
    return this.getAllServices().filter(
      (svc) =>
        svc.name.toLowerCase().includes(q) ||
        svc.id.toLowerCase().includes(q) ||
        svc.capabilities.some((cap) => cap.toLowerCase().includes(q))
    );
  }

  /**
   * Find the best service for a task (returns first match)
   */
  findBestMatch(capabilities: string[]): ServiceEndpoint | undefined {
    // Score services by how many capabilities they match
    const scored = this.getAllServices()
      .map((svc) => {
        const matches = capabilities.filter((cap) =>
          svc.capabilities.some((sc) => sc.toLowerCase().includes(cap.toLowerCase()))
        ).length;
        return { service: svc, score: matches };
      })
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score);

    return scored[0]?.service;
  }

  /**
   * Refresh services from remote registries
   */
  async refresh(): Promise<void> {
    const now = Date.now();
    if (this.cacheValid && now - this.lastFetch < (this.config.cacheTtl ?? 0)) {
      return;
    }

    for (const url of this.config.remoteRegistries ?? []) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const services = (await response.json()) as ServiceEndpoint[];
          for (const svc of services) {
            this.services.set(svc.id, svc);
          }
        }
      } catch (error) {
        console.warn(`[registry] Failed to fetch from ${url}:`, error);
      }
    }

    this.lastFetch = now;
    this.cacheValid = true;
  }

  /**
   * Export registry to JSON
   */
  toJSON(): ServiceEndpoint[] {
    return this.getAllServices();
  }

  /**
   * Import services from JSON
   */
  fromJSON(services: ServiceEndpoint[]): void {
    for (const svc of services) {
      this.services.set(svc.id, svc);
    }
  }
}
