/**
 * x402 MCP Server for Claude Code
 * Exposes x402-enabled tools via Model Context Protocol
 * 
 * This is the bridge that lets Claude:
 * - Discover x402 services
 * - Pay for API calls autonomously
 * - Use browser and terminal tools
 * - Manage wallet and spending
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

import type { X402SolanaClient } from "../x402/solana-client.js";
import type { ServiceRegistry } from "../discovery/registry.js";
import type { XGateClient } from "../discovery/xgate.js";
import type { BrowserTool } from "../tools/browser.js";
import type { TerminalTool } from "../tools/terminal.js";
import type { HttpTool } from "../tools/http.js";

export interface McpServerConfig {
  name?: string;
  version?: string;
  x402Client: X402SolanaClient;
  registry: ServiceRegistry;
  xgate?: XGateClient;
  browser?: BrowserTool;
  terminal?: TerminalTool;
  http: HttpTool;
}

export class X402McpServer {
  private server: Server;
  private config: McpServerConfig;

  constructor(config: McpServerConfig) {
    this.config = config;
    this.server = new Server(
      {
        name: config.name ?? "x402-claude-mcp",
        version: config.version ?? "0.1.0",
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = [
        // === Discovery Tools ===
        {
          name: "x402_discover",
          description:
            "Search for x402-enabled services by capability or query. Returns a list of services that can be paid per-request.",
          inputSchema: {
            type: "object" as const,
            properties: {
              query: {
                type: "string",
                description: "Search query or capability (e.g., 'scrape', 'news', 'defi')",
              },
            },
            required: ["query"],
          },
        },
        {
          name: "x402_list_services",
          description:
            "List all registered x402 services with their capabilities and pricing",
          inputSchema: {
            type: "object" as const,
            properties: {},
          },
        },

        // === Payment Tools ===
        {
          name: "x402_wallet_status",
          description:
            "Get wallet status including USDC balance, SOL balance, and spending limits",
          inputSchema: {
            type: "object" as const,
            properties: {},
          },
        },
        {
          name: "x402_check_payment",
          description:
            "Check if a URL requires x402 payment and get the price (without paying)",
          inputSchema: {
            type: "object" as const,
            properties: {
              url: {
                type: "string",
                description: "URL to check for payment requirements",
              },
            },
            required: ["url"],
          },
        },

        // === HTTP Tools ===
        {
          name: "x402_get",
          description:
            "Make a GET request to any URL with automatic x402 payment handling",
          inputSchema: {
            type: "object" as const,
            properties: {
              url: {
                type: "string",
                description: "URL to fetch",
              },
              params: {
                type: "object",
                description: "Optional query parameters",
                additionalProperties: { type: "string" },
              },
            },
            required: ["url"],
          },
        },
        {
          name: "x402_post",
          description:
            "Make a POST request to any URL with automatic x402 payment handling",
          inputSchema: {
            type: "object" as const,
            properties: {
              url: {
                type: "string",
                description: "URL to post to",
              },
              body: {
                type: "object",
                description: "Request body (will be JSON encoded)",
              },
            },
            required: ["url"],
          },
        },
        {
          name: "x402_call_service",
          description:
            "Call a registered x402 service by its ID with automatic payment",
          inputSchema: {
            type: "object" as const,
            properties: {
              serviceId: {
                type: "string",
                description: "Service ID from the registry",
              },
              path: {
                type: "string",
                description: "API path to call (e.g., '/search')",
              },
              method: {
                type: "string",
                enum: ["GET", "POST", "PUT", "DELETE"],
                description: "HTTP method",
              },
              params: {
                type: "object",
                description: "Query parameters",
                additionalProperties: { type: "string" },
              },
              body: {
                type: "object",
                description: "Request body for POST/PUT",
              },
            },
            required: ["serviceId"],
          },
        },

        // === Browser Tools ===
        {
          name: "browser_goto",
          description: "Navigate browser to a URL and return page info",
          inputSchema: {
            type: "object" as const,
            properties: {
              url: {
                type: "string",
                description: "URL to navigate to",
              },
            },
            required: ["url"],
          },
        },
        {
          name: "browser_screenshot",
          description: "Take a screenshot of the current page",
          inputSchema: {
            type: "object" as const,
            properties: {
              path: {
                type: "string",
                description: "Path to save screenshot",
              },
              fullPage: {
                type: "boolean",
                description: "Capture full page (default: false)",
              },
            },
            required: ["path"],
          },
        },
        {
          name: "browser_extract_text",
          description: "Extract text content from the current page",
          inputSchema: {
            type: "object" as const,
            properties: {
              selector: {
                type: "string",
                description: "CSS selector (optional, defaults to body)",
              },
            },
          },
        },
        {
          name: "browser_click",
          description: "Click an element on the page",
          inputSchema: {
            type: "object" as const,
            properties: {
              selector: {
                type: "string",
                description: "CSS selector of element to click",
              },
            },
            required: ["selector"],
          },
        },
        {
          name: "browser_type",
          description: "Type text into an input field",
          inputSchema: {
            type: "object" as const,
            properties: {
              selector: {
                type: "string",
                description: "CSS selector of input field",
              },
              text: {
                type: "string",
                description: "Text to type",
              },
            },
            required: ["selector", "text"],
          },
        },

        // === Terminal Tools ===
        {
          name: "terminal_run",
          description: "Execute a shell command and return output",
          inputSchema: {
            type: "object" as const,
            properties: {
              command: {
                type: "string",
                description: "Command to execute",
              },
              cwd: {
                type: "string",
                description: "Working directory (optional)",
              },
              timeout: {
                type: "number",
                description: "Timeout in milliseconds (optional)",
              },
            },
            required: ["command"],
          },
        },
      ];

      return { tools };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request: { params: { name: string; arguments?: unknown } }) => {
      const { name, arguments: args } = request.params;

      try {
        let result: unknown;

        switch (name) {
          // === Discovery ===
          case "x402_discover": {
            const query = (args as { query: string }).query;
            const services = this.config.registry.search(query);
            result = {
              count: services.length,
              services: services.map((s) => ({
                id: s.id,
                name: s.name,
                capabilities: s.capabilities,
                pricing: s.pricing,
                baseUrl: s.baseUrl,
              })),
            };
            break;
          }

          case "x402_list_services": {
            const services = this.config.registry.getAllServices();
            result = {
              count: services.length,
              services: services.map((s) => ({
                id: s.id,
                name: s.name,
                capabilities: s.capabilities,
                pricing: s.pricing,
              })),
            };
            break;
          }

          // === Wallet ===
          case "x402_wallet_status": {
            result = await this.config.x402Client.getStatus();
            break;
          }

          case "x402_check_payment": {
            const url = (args as { url: string }).url;
            const requirements = await this.config.http.checkPayment(url);
            result = requirements
              ? {
                  requiresPayment: true,
                  amount: Number(requirements.maxAmountRequired) / 1_000_000,
                  asset: requirements.asset,
                  payTo: requirements.payTo,
                }
              : { requiresPayment: false };
            break;
          }

          // === HTTP ===
          case "x402_get": {
            const { url, params } = args as { url: string; params?: Record<string, string> };
            result = await this.config.http.get(url, { params });
            break;
          }

          case "x402_post": {
            const { url, body } = args as { url: string; body?: unknown };
            result = await this.config.http.post(url, body);
            break;
          }

          case "x402_call_service": {
            const { serviceId, path, method, params, body } = args as {
              serviceId: string;
              path?: string;
              method?: "GET" | "POST" | "PUT" | "DELETE";
              params?: Record<string, string>;
              body?: unknown;
            };
            result = await this.config.http.callService(serviceId, {
              path,
              method,
              params,
              body,
            });
            break;
          }

          // === Browser ===
          case "browser_goto": {
            if (!this.config.browser) {
              throw new Error("Browser tool not configured");
            }
            if (!this.config.browser.isRunning()) {
              await this.config.browser.start();
            }
            const url = (args as { url: string }).url;
            result = await this.config.browser.goto(url);
            break;
          }

          case "browser_screenshot": {
            if (!this.config.browser) {
              throw new Error("Browser tool not configured");
            }
            const { path, fullPage } = args as { path: string; fullPage?: boolean };
            result = await this.config.browser.screenshot(path, fullPage);
            break;
          }

          case "browser_extract_text": {
            if (!this.config.browser) {
              throw new Error("Browser tool not configured");
            }
            const selector = (args as { selector?: string }).selector;
            const text = await this.config.browser.extractText(selector);
            result = { text };
            break;
          }

          case "browser_click": {
            if (!this.config.browser) {
              throw new Error("Browser tool not configured");
            }
            const selector = (args as { selector: string }).selector;
            await this.config.browser.click(selector);
            result = { success: true };
            break;
          }

          case "browser_type": {
            if (!this.config.browser) {
              throw new Error("Browser tool not configured");
            }
            const { selector, text } = args as { selector: string; text: string };
            await this.config.browser.type(selector, text);
            result = { success: true };
            break;
          }

          // === Terminal ===
          case "terminal_run": {
            if (!this.config.terminal) {
              throw new Error("Terminal tool not configured");
            }
            const { command, cwd, timeout } = args as {
              command: string;
              cwd?: string;
              timeout?: number;
            };
            result = await this.config.terminal.run(command, { cwd, timeout });
            break;
          }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({ error: message }),
            },
          ],
          isError: true,
        };
      }
    });

    // List resources (wallet info, registry)
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: "x402://wallet",
            name: "Wallet Status",
            description: "Current wallet balance and spending status",
            mimeType: "application/json",
          },
          {
            uri: "x402://services",
            name: "Service Registry",
            description: "All registered x402 services",
            mimeType: "application/json",
          },
        ],
      };
    });

    // Read resources
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request: { params: { uri: string } }) => {
      const { uri } = request.params;

      if (uri === "x402://wallet") {
        const status = await this.config.x402Client.getStatus();
        return {
          contents: [
            {
              uri,
              mimeType: "application/json",
              text: JSON.stringify(status, null, 2),
            },
          ],
        };
      }

      if (uri === "x402://services") {
        const services = this.config.registry.getAllServices();
        return {
          contents: [
            {
              uri,
              mimeType: "application/json",
              text: JSON.stringify(services, null, 2),
            },
          ],
        };
      }

      throw new Error(`Unknown resource: ${uri}`);
    });
  }

  /**
   * Start the MCP server with stdio transport
   */
  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("[x402-mcp] Server started");
  }

  /**
   * Graceful shutdown
   */
  async stop(): Promise<void> {
    await this.config.browser?.close();
    this.config.terminal?.killAll();
    console.error("[x402-mcp] Server stopped");
  }
}
