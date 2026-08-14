#!/usr/bin/env bun
/**
 * Clawd Cloud stack doctor — verifies clawd-code, clawd-connectors, and core-ai
 * can see each other from this checkout.
 */
import { diagnoseStack, formatStackDiagnosis, loadConnectors } from '../clawd-code/src/services/clawdStack.ts'

const diag = diagnoseStack()
process.stdout.write(formatStackDiagnosis(diag))

if (!diag.ok) {
  process.exitCode = 1
}

try {
  const connectors = await loadConnectors()
  if (!connectors) {
    console.log('  → Connectors package not importable yet. Run: bun install && bun run --cwd clawd-connectors build')
  } else {
    const instances = connectors.createConnectors()
    const ids = Object.keys(instances).join(', ')
    console.log(`  → Connectors loaded: ${ids}`)
    for (const [id, connector] of Object.entries(instances)) {
      const status = await connector.status()
      const mark = status.configured ? '✓' : '·'
      console.log(`     ${mark} ${id.padEnd(9)} mcp=${status.mcpUrl ?? '(none)'}${status.error ? `  (${status.error})` : ''}`)
    }
  }
} catch (error) {
  console.log(`  → Connectors probe skipped: ${error instanceof Error ? error.message : error}`)
}

console.log('')
console.log('  Next:')
console.log('    bun run stack:doctor')
console.log('    clawd --plugin-dir core-ai/clawd-plugin')
console.log('    bun run --cwd clawd-connectors status')
console.log('')
