/**
 * Clawd Connectors — CLI
 */
import { createConnectors } from './index.js';
import { getEnvConfig } from './config.js';

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0]?.toLowerCase();

  if (command === 'status' || command === 'doctor') {
    const env = getEnvConfig();
    console.log('🦞 Clawd Connectors');
    console.log('═══════════════════════════════════════');
    console.log(`  DFLOW_API_KEY      ${env.dflowApiKey ? '✓ set' : '✗ missing'}`);
    console.log(`  HELIUS_API_KEY     ${env.heliusApiKey ? '✓ set' : '✗ missing'}`);
    console.log(`  JUPITER_API_KEY    ${env.jupiterApiKey ? '✓ set' : '✗ missing'}`);
    console.log(`  BIRDEYE_API_KEY    ${env.birdeyeApiKey ? '✓ set' : '✗ missing'}`);
    console.log('');

    const connectors = createConnectors();
    for (const [id, connector] of Object.entries(connectors) as [string, { status(): Promise<{ provider: string; configured: boolean; mcpUrl?: string; tools?: unknown[]; error?: string }> }][]) {
      const s = await connector.status();
      console.log(`  ${id.padEnd(9)} ${s.configured ? '✓' : '✗'}  mcp=${s.mcpUrl ?? '(none)'}${s.error ? `  error=${s.error}` : ''}${s.tools ? `  tools=${s.tools.length}` : ''}`);
    }
    return;
  }

  if (command === 'list-tools') {
    const provider = args[1]?.toLowerCase();
    if (!provider || !['dflow', 'helius', 'jupiter', 'birdeye'].includes(provider)) {
      console.error('usage: clawd-connectors list-tools <dflow|helius|jupiter|birdeye>');
      process.exit(2);
    }
    const connectors = createConnectors();
    const conn = connectors[provider as 'dflow' | 'helius' | 'jupiter' | 'birdeye'];
    const tools = await conn.listTools();
    console.log(`\n  ${provider} tools (${tools.length}):`);
    for (const t of tools) {
      console.log(`    • ${t.name}  — ${t.description}`);
    }
    return;
  }

  console.log(`
  Clawd Connectors — MCP provider connectors

  USAGE:
    clawd-connectors status         Show API key + MCP status for all providers
    clawd-connectors list-tools <p> List MCP tools for a provider
    clawd-connectors help           Show this help

  PROVIDERS:
    dflow (https://api.paybox.sh/mcp?app=dflow) · helius · jupiter · birdeye
  `);
}

main().catch((err) => {
  console.error('  ✗ Fatal error:', err.message);
  process.exit(1);
});