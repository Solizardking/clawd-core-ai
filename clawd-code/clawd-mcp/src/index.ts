#!/usr/bin/env node
/**
 * x402 Claude MCP Server
 * 
 * This is the entry point for the x402 payments + discovery MCP server.
 * It gives Claude Code the ability to:
 * 
 * - Discover x402-enabled services via XGATE
 * - Pay for API calls autonomously with USDC on Solana
 * - Browse websites with Playwright
 * - Execute terminal commands
 * - Manage wallet and spending limits
 * 
 * Usage:
 *   npx @mawdbotsonsolana/x402-claude-mcp
 *   
 * Or add to Claude Code's MCP config:
 *   {
 *     "mcpServers": {
 *       "x402": {
 *         "command": "npx",
 *         "args": ["@mawdbotsonsolana/x402-claude-mcp"],
 *         "env": {
 *           "SOLANA_RPC_URL": "https://api.mainnet-beta.solana.com",
 *           "SOLANA_PRIVATE_KEY": "your-base58-private-key",
 *           "X402_NETWORK": "solana-mainnet",
 *           "X402_MAX_AUTO_APPROVE": "1.0",
 *           "X402_DAILY_LIMIT": "10.0"
 *         }
 *       }
 *     }
 *   }
 */

import "dotenv/config";

import { X402SolanaClient } from "./x402/solana-client.js";
import { ServiceRegistry } from "./discovery/registry.js";
import { XGateClient } from "./discovery/xgate.js";
import { BrowserTool } from "./tools/browser.js";
import { TerminalTool } from "./tools/terminal.js";
import { HttpTool } from "./tools/http.js";
import { X402McpServer } from "./mcp/server.js";

async function main() {
  // Validate required environment variables
  const rpcUrl = process.env.SOLANA_RPC_URL;
  const privateKey = process.env.SOLANA_PRIVATE_KEY;
  const keypairPath = process.env.SOLANA_KEYPAIR_PATH;

  if (!rpcUrl) {
    console.error("ERROR: SOLANA_RPC_URL environment variable is required");
    console.error("Example: https://api.mainnet-beta.solana.com");
    process.exit(1);
  }

  if (!privateKey && !keypairPath) {
    console.error(
      "ERROR: Either SOLANA_PRIVATE_KEY or SOLANA_KEYPAIR_PATH is required"
    );
    console.error("SOLANA_PRIVATE_KEY: Base58 encoded private key");
    console.error("SOLANA_KEYPAIR_PATH: Path to Solana keypair JSON file");
    process.exit(1);
  }

  // Parse configuration from environment
  const network = (process.env.X402_NETWORK ?? "solana-mainnet") as
    | "solana-mainnet"
    | "solana-devnet";
  const maxAutoApprove = parseFloat(process.env.X402_MAX_AUTO_APPROVE ?? "1.0");
  const dailyLimit = parseFloat(process.env.X402_DAILY_LIMIT ?? "10.0");

  console.error("═══════════════════════════════════════════════════════════");
  console.error("  x402 Claude MCP Server");
  console.error("  Autonomous payments for AI agents on Solana");
  console.error("═══════════════════════════════════════════════════════════");
  console.error(`  Network: ${network}`);
  console.error(`  Max auto-approve: $${maxAutoApprove} USDC per request`);
  console.error(`  Daily limit: $${dailyLimit} USDC`);
  console.error("═══════════════════════════════════════════════════════════");

  // Initialize x402 client
  const x402Client = new X402SolanaClient({
    rpcUrl,
    privateKey,
    keypairPath,
    network,
    maxAutoApprove,
    dailyLimit,
  });

  // Log wallet info
  const status = await x402Client.getStatus();
  console.error(`  Wallet: ${status.address}`);
  console.error(`  USDC Balance: $${status.usdcBalance.toFixed(2)}`);
  console.error(`  SOL Balance: ${status.solBalance.toFixed(4)} SOL`);
  console.error("═══════════════════════════════════════════════════════════");

  // Initialize service registry with XGATE
  const registry = new ServiceRegistry({
    remoteRegistries: [
      // Add remote registries here as they become available
    ],
  });

  // Initialize XGATE client
  const xgate = new XGateClient({
    network,
  });

  // Initialize tools
  const browser = new BrowserTool({
    headless: true,
    timeout: 30000,
  });

  const terminal = new TerminalTool({
    timeout: 60000,
    blockedCommands: [
      "rm -rf /",
      "rm -rf /*",
      "dd if=",
      "mkfs",
      "> /dev/sda",
      ":(){ :|:& };:",
      "shutdown",
      "reboot",
    ],
  });

  const http = new HttpTool({
    x402Client,
    registry,
    timeout: 30000,
  });

  // Initialize and start MCP server
  const server = new X402McpServer({
    name: "x402-claude-mcp",
    version: "0.1.0",
    x402Client,
    registry,
    xgate,
    browser,
    terminal,
    http,
  });

  // Handle shutdown gracefully
  process.on("SIGINT", async () => {
    console.error("\n[x402-mcp] Shutting down...");
    await server.stop();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    console.error("\n[x402-mcp] Shutting down...");
    await server.stop();
    process.exit(0);
  });

  // Start the server
  await server.start();
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
