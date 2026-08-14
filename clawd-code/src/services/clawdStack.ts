/**
 * Clawd Cloud stack bridge.
 *
 * Resolves the sibling packages that make this monorepo communicate:
 *   clawd-code  →  clawd-connectors (DFlow / Helius / Jupiter / Birdeye MCP)
 *   clawd-code  →  core-ai/clawd-plugin (skills + auto-started MCP servers)
 *   clawd-code  →  core-ai/clawd-core (ToolBase / PluginBase / WalletClientBase)
 *   clawd-code  →  core-ai/clawd-mcp (Helius routed tools)
 */
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

export const STACK_PACKAGES = [
  'clawd-code',
  'clawd-connectors',
  'core-ai',
] as const

export interface ClawdStackPaths {
  root: string
  clawdCode: string
  connectors: string
  coreAi: string
  plugin: string
  clawdCore: string
  clawdMcp: string
  mcpJson: string
}

export interface StackLayerStatus {
  id: string
  path: string
  present: boolean
  detail: string
}

export interface StackDiagnosis {
  root: string | null
  ok: boolean
  layers: StackLayerStatus[]
  mcpServers: string[]
  pluginDir: string | null
  hints: string[]
}

function isRepoRoot(dir: string): boolean {
  return (
    existsSync(join(dir, 'clawd-code')) &&
    existsSync(join(dir, 'clawd-connectors')) &&
    existsSync(join(dir, 'core-ai'))
  )
}

export function findClawdCloudRoot(start = process.cwd()): string | null {
  let dir = resolve(start)
  for (let i = 0; i < 12; i++) {
    if (isRepoRoot(dir)) return dir
    const parent = dirname(dir)
    if (parent === dir) break
    dir = parent
  }

  try {
    const here = dirname(fileURLToPath(import.meta.url))
    dir = resolve(here)
    for (let i = 0; i < 12; i++) {
      if (isRepoRoot(dir)) return dir
      const parent = dirname(dir)
      if (parent === dir) break
      dir = parent
    }
  } catch {
    // import.meta.url unavailable in some CJS shims
  }

  return null
}

export function getStackPaths(root = findClawdCloudRoot()): ClawdStackPaths | null {
  if (!root) return null
  return {
    root,
    clawdCode: join(root, 'clawd-code'),
    connectors: join(root, 'clawd-connectors'),
    coreAi: join(root, 'core-ai'),
    plugin: join(root, 'core-ai', 'clawd-plugin'),
    clawdCore: join(root, 'core-ai', 'clawd-core'),
    clawdMcp: join(root, 'core-ai', 'clawd-mcp'),
    mcpJson: join(root, '.mcp.json'),
  }
}

function layer(id: string, path: string, detail: string): StackLayerStatus {
  return { id, path, present: existsSync(path), detail }
}

function readMcpServerNames(mcpJsonPath: string): string[] {
  if (!existsSync(mcpJsonPath)) return []
  try {
    const parsed = JSON.parse(readFileSync(mcpJsonPath, 'utf-8')) as {
      mcpServers?: Record<string, unknown>
    }
    return Object.keys(parsed.mcpServers ?? {})
  } catch {
    return []
  }
}

export function diagnoseStack(start = process.cwd()): StackDiagnosis {
  const root = findClawdCloudRoot(start)
  const paths = getStackPaths(root)
  const hints: string[] = []

  if (!paths) {
    return {
      root: null,
      ok: false,
      layers: [],
      mcpServers: [],
      pluginDir: null,
      hints: [
        'Run from the clawd-cloud repo (needs clawd-code/, clawd-connectors/, and core-ai/).',
      ],
    }
  }

  const layers: StackLayerStatus[] = [
    layer('clawd-code', paths.clawdCode, 'CLI + query engine + tools'),
    layer('clawd-connectors', paths.connectors, 'DFlow / Helius / Jupiter / Birdeye MCP clients'),
    layer('core-ai', paths.coreAi, 'Helius-wrapped skills, MCP, plugin, clawd-core'),
    layer('clawd-plugin', paths.plugin, 'Auto-starts MCP servers + Solana skills'),
    layer('clawd-core', paths.clawdCore, 'ToolBase / PluginBase / WalletClientBase'),
    layer('clawd-mcp', paths.clawdMcp, 'Helius routed MCP tools (npm: helius-mcp)'),
    layer('.mcp.json', paths.mcpJson, 'Shared remote + local MCP registry'),
  ]

  const mcpServers = [
    ...new Set([
      ...readMcpServerNames(paths.mcpJson),
      ...readMcpServerNames(join(paths.clawdCode, '.mcp.json')),
      ...readMcpServerNames(join(paths.plugin, '.mcp.json')),
    ]),
  ]

  if (!existsSync(paths.mcpJson)) {
    hints.push('Missing root .mcp.json — Clawd Code will not auto-load provider MCP servers from cwd.')
  }
  if (!existsSync(join(paths.plugin, '.mcp.json'))) {
    hints.push('core-ai/clawd-plugin/.mcp.json missing — pass --plugin-dir core-ai/clawd-plugin')
  }
  if (mcpServers.length === 0) {
    hints.push('No MCP servers registered. Check .mcp.json in repo root and the plugin.')
  } else {
    hints.push(`Launch with: clawd --plugin-dir ${paths.plugin}`)
  }

  return {
    root: paths.root,
    ok: layers.every(l => l.present),
    layers,
    mcpServers,
    pluginDir: paths.plugin,
    hints,
  }
}

export function formatStackDiagnosis(diag = diagnoseStack()): string {
  const lines: string[] = []
  lines.push('')
  lines.push('╔══════════════════════════════════════════════════════════════╗')
  lines.push('║  CLAWD CLOUD STACK                                           ║')
  lines.push('╠══════════════════════════════════════════════════════════════╣')
  if (!diag.root) {
    lines.push('║  Not inside the clawd-cloud monorepo.                        ║')
    lines.push('╚══════════════════════════════════════════════════════════════╝')
    return lines.join('\n')
  }
  lines.push(`║  Root: ${diag.root.slice(0, 54).padEnd(54)}║`)
  lines.push(`║  Status: ${diag.ok ? 'linked' : 'incomplete'}`.padEnd(63) + '║')
  lines.push('╠══════════════════════════════════════════════════════════════╣')
  for (const layer of diag.layers) {
    const mark = layer.present ? '✓' : '✗'
    const row = `  ${mark} ${layer.id.padEnd(18)} ${layer.detail}`
    lines.push(`║ ${row.slice(0, 60).padEnd(60)} ║`)
  }
  lines.push('╠══════════════════════════════════════════════════════════════╣')
  const mcp = diag.mcpServers.length ? diag.mcpServers.join(', ') : '(none)'
  lines.push(`║  MCP: ${mcp.slice(0, 55).padEnd(55)}║`)
  if (diag.pluginDir) {
    lines.push(`║  Plugin: ${diag.pluginDir.slice(0, 52).padEnd(52)}║`)
  }
  lines.push('╚══════════════════════════════════════════════════════════════╝')
  for (const hint of diag.hints) {
    lines.push(`  → ${hint}`)
  }
  lines.push('')
  return lines.join('\n')
}

async function importFromPath<T>(candidates: string[]): Promise<T | null> {
  for (const candidate of candidates) {
    try {
      return (await import(candidate)) as T
    } catch {
      // try next specifier
    }
  }
  return null
}

export async function loadConnectors(): Promise<{
  createConnectors: (overrides?: Record<string, unknown>) => Record<string, {
    id: string
    listTools(): Promise<unknown[]>
    callTool(name: string, args: Record<string, unknown>): Promise<unknown>
    status(): Promise<{ provider: string; configured: boolean; mcpUrl?: string; error?: string }>
  }>
} | null> {
  const paths = getStackPaths()
  const fileSpec = paths
    ? pathToFileURL(join(paths.connectors, 'src', 'index.ts')).href
    : null

  return importFromPath([
    ...(fileSpec ? [fileSpec] : []),
    '@openclawd/clawd-connectors',
    '@onchainai/clawd-connectors',
  ])
}

export async function loadClawdCore(): Promise<Record<string, unknown> | null> {
  const paths = getStackPaths()
  const fileSpec = paths
    ? pathToFileURL(join(paths.clawdCore, 'src', 'index.ts')).href
    : null

  return importFromPath([
    ...(fileSpec ? [fileSpec] : []),
    '@onchainai/clawd-core',
  ])
}

export function getDefaultPluginDir(): string | undefined {
  return getStackPaths()?.plugin
}
