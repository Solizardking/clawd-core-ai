/**
 * Clawd Code — Model Registry
 * Moonshot Kimi + Anthropic Claude + DeepSeek model definitions
 *
 * Default model: Moonshot Kimi K2 Thinking (code/REPL/trade/research).
 * Single source of truth used by cli.ts, modes/*, and the /inspect command.
 */

export type ClawdProvider = 'moonshot' | 'anthropic' | 'deepseek' | 'openrouter';

export interface ModelDefinition {
  id: string;
  name: string;
  description: string;
  contextWindow: number;
  inputPrice: number;   // per 1M tokens
  outputPrice: number;  // per 1M tokens
  reasoning?: boolean;
  supportsClientTools?: boolean;
  reasoningEfforts?: string[];
  aliases?: string[];
  provider: ClawdProvider;
  streaming?: boolean;
  /** Best-fit mode for this model (used by `clawd-code inspect` recommendations). */
  bestFor?: 'code' | 'research' | 'image' | 'general';
}

// ─── Default model constants (single source of truth) ───────────────────────
/** General-purpose default (code mode, REPL, trade, research). Kimi K2 Thinking — reasoning, tools, streaming. */
export const DEFAULT_MODEL = 'kimi-k2-thinking';
/** Default for research mode. */
export const DEFAULT_RESEARCH_MODEL = 'kimi-k2-thinking';
/** Default for image generation mode (Moonshot has no image API — falls back to Gemini/DALL-E). */
export const DEFAULT_IMAGE_MODEL = 'gemini-2.0-flash-exp-image-gen';
/** Default for fast/cheap tasks (alt to kimi-k2-thinking). */
export const DEFAULT_FAST_MODEL = 'kimi-k2-turbo-preview';
/** Default provider (Moonshot). */
export const DEFAULT_PROVIDER: ClawdProvider = 'moonshot';

// ─── Model catalog ──────────────────────────────────────────────────────────
export const MODELS: ModelDefinition[] = [
  // ── Anthropic Claude ──────────────────────────────────────────────────
  {
    id: 'claude-sonnet-4-6',
    name: 'Claude Sonnet 4.6',
    description: 'Anthropic flagship — best for code, reasoning, and agent tasks',
    contextWindow: 200_000,
    inputPrice: 3.0,
    outputPrice: 15.0,
    reasoning: true,
    supportsClientTools: true,
    streaming: true,
    provider: 'anthropic',
    bestFor: 'code',
    aliases: ['sonnet', 'claude-sonnet', 'sonnet-4-6'],
  },
  {
    id: 'claude-opus-4-8',
    name: 'Claude Opus 4.8',
    description: 'Anthropic most capable — deep reasoning, complex synthesis',
    contextWindow: 200_000,
    inputPrice: 15.0,
    outputPrice: 75.0,
    reasoning: true,
    supportsClientTools: true,
    streaming: true,
    provider: 'anthropic',
    bestFor: 'research',
    aliases: ['opus', 'claude-opus', 'opus-4-8'],
  },
  {
    id: 'claude-haiku-4-5-20251001',
    name: 'Claude Haiku 4.5',
    description: 'Anthropic fastest model — low latency, high throughput',
    contextWindow: 200_000,
    inputPrice: 0.8,
    outputPrice: 4.0,
    supportsClientTools: true,
    streaming: true,
    provider: 'anthropic',
    bestFor: 'general',
    aliases: ['haiku', 'claude-haiku', 'haiku-4-5'],
  },
  // ── DeepSeek ──────────────────────────────────────────────────────────
  {
    id: 'deepseek-v4-pro',
    name: 'DeepSeek V4 Pro',
    description: 'DeepSeek flagship reasoning/coding model with 1M context',
    contextWindow: 1_000_000,
    inputPrice: 0.435,
    outputPrice: 0.87,
    reasoning: true,
    supportsClientTools: true,
    provider: 'deepseek',
    bestFor: 'code',
    aliases: ['deepseek/pro', 'deepseek-v4-pro[1m]', 'v4-pro'],
  },
  {
    id: 'deepseek-v4-flash',
    name: 'DeepSeek V4 Flash',
    description: 'DeepSeek fast model with 1M context and low token cost',
    contextWindow: 1_000_000,
    inputPrice: 0.14,
    outputPrice: 0.28,
    reasoning: true,
    supportsClientTools: true,
    provider: 'deepseek',
    bestFor: 'general',
    aliases: ['deepseek/flash', 'v4-flash', 'deepseek-chat', 'deepseek-reasoner'],
  },
  // ── Moonshot Kimi (default) ───────────────────────────────────────────
  {
    id: 'kimi-k2-thinking',
    name: 'Kimi K2 Thinking',
    description: 'Moonshot flagship reasoning model — extended chain-of-thought, agentic tool use, 256K context. DEFAULT for code/REPL/trade/research.',
    contextWindow: 256_000,
    inputPrice: 0.6,
    outputPrice: 2.5,
    reasoning: true,
    supportsClientTools: true,
    streaming: true,
    provider: 'moonshot',
    bestFor: 'code',
    aliases: ['kimi-thinking', 'k2-thinking', 'kimi', 'default'],
  },
  {
    id: 'kimi-k2-turbo-preview',
    name: 'Kimi K2 Turbo',
    description: 'Faster, cost-optimised Kimi K2 — same family, lower latency, higher throughput.',
    contextWindow: 128_000,
    inputPrice: 0.6,
    outputPrice: 2.5,
    supportsClientTools: true,
    streaming: true,
    provider: 'moonshot',
    bestFor: 'general',
    aliases: ['kimi-turbo', 'k2-turbo'],
  },
  {
    id: 'kimi-k2-0711-preview',
    name: 'Kimi K2',
    description: 'Moonshot base K2 model — strong general-purpose agentic coding and tool use.',
    contextWindow: 128_000,
    inputPrice: 0.6,
    outputPrice: 2.5,
    supportsClientTools: true,
    streaming: true,
    provider: 'moonshot',
    bestFor: 'general',
    aliases: ['kimi-k2', 'k2'],
  },
];

const MODEL_BY_ID = new Map<string, ModelDefinition>();
const ALIAS_MAP = new Map<string, string>();

for (const m of MODELS) {
  MODEL_BY_ID.set(m.id, m);
  ALIAS_MAP.set(m.id.toLowerCase(), m.id);
  for (const alias of m.aliases ?? []) {
    ALIAS_MAP.set(alias.toLowerCase(), m.id);
  }
}

export function getModel(id: string): ModelDefinition | undefined {
  const canonical = ALIAS_MAP.get(id.toLowerCase());
  return canonical ? MODEL_BY_ID.get(canonical) : MODEL_BY_ID.get(id);
}

export function normalizeModelId(id: string): string {
  return ALIAS_MAP.get(id.toLowerCase()) ?? id;
}

export function listModelIds(): string[] {
  return MODELS.map((m) => m.id);
}

export function listModelsByProvider(provider: ClawdProvider): ModelDefinition[] {
  return MODELS.filter((m) => m.provider === provider);
}

/** Best default model for a given mode. */
export function defaultModelFor(mode: 'code' | 'research' | 'image' | 'general' | 'repl' | 'trade'): string {
  switch (mode) {
    case 'research': return DEFAULT_RESEARCH_MODEL;
    case 'image':    return DEFAULT_IMAGE_MODEL;
    case 'code':
    case 'repl':
    case 'trade':
    case 'general':
    default:         return DEFAULT_MODEL;
  }
}

export function getSupportedReasoningEfforts(id: string): string[] {
  return getModel(id)?.reasoningEfforts ?? [];
}

export function getEffectiveReasoningEffort(id: string, effort?: string): string | undefined {
  const supported = getSupportedReasoningEfforts(id);
  if (supported.length === 0) return undefined;
  if (effort && supported.includes(effort)) return effort;
  return undefined;
}

export function isStreamingSupported(id: string): boolean {
  return getModel(id)?.streaming === true;
}

/** Resolve a requested model id to its canonical form for a given mode, falling back to the default. */
export function resolveModelForMode(
  requested: string,
  mode: 'code' | 'repl' | 'trade' | 'research' | 'image' | 'general',
): string {
  return normalizeModelId(requested) || DEFAULT_MODEL;
}

export function printModelsTable(): void {
  const providers: ClawdProvider[] = ['moonshot', 'anthropic', 'deepseek', 'openrouter'];
  const labels: Record<ClawdProvider, string> = {
    moonshot: 'Moonshot Kimi  ⭐ default',
    anthropic: 'Anthropic Claude',
    deepseek: 'DeepSeek',
    openrouter: 'OpenRouter',
  };

  console.log('\n╔════════════════════════════════════════════════════════════════════════════╗');
  console.log('║  CLAWD CODE — MODEL REGISTRY (Moonshot Kimi is the default provider)       ║');
  console.log('╠════════════════════════════════════════════════════════════════════════════╣');
  console.log('║  ID                              │  Provider   │  Ctx   │  $/1M in/out  │ M ║');
  console.log('╠════════════════════════════════════════════════════════════════════════════╣');

  for (const provider of providers) {
    const group = MODELS.filter((m) => m.provider === provider);
    if (group.length === 0) continue;
    console.log(`║  ── ${labels[provider].padEnd(72)}║`);
    for (const m of group) {
      const ctx = m.contextWindow >= 1_000_000
        ? `${(m.contextWindow / 1_000_000).toFixed(0)}M`
        : m.contextWindow >= 1000
          ? `${(m.contextWindow / 1000).toFixed(0)}K`
          : '—';
      const price = m.inputPrice || m.outputPrice ? `$${m.inputPrice}/$${m.outputPrice}` : 'see docs';
      const stream = m.streaming ? '~' : ' ';
      const best = m.bestFor ? m.bestFor[0].toUpperCase() : ' ';
      console.log(`║  ${stream}${(m.id.padEnd(32))} │  ${(provider.padEnd(10))} │  ${ctx.padStart(5)} │  ${price.padStart(12)}  │ ${best} ║`);
    }
  }

  console.log('╚════════════════════════════════════════════════════════════════════════════╝');
  console.log('  ~ = streaming supported    M = best-fit mode (C=code, R=research, I=image, G=general)');
  console.log(`\n  Default provider: ${DEFAULT_PROVIDER}    Default model: ${DEFAULT_MODEL}`);
  console.log(`  Research default: ${DEFAULT_RESEARCH_MODEL}    Image default: ${DEFAULT_IMAGE_MODEL}`);
  console.log('  Override: CLAWD_MODEL=<id>  |  CLAWD_PROVIDER=moonshot|anthropic|openrouter|deepseek');
  console.log('  API keys: MOONSHOT_API_KEY | ANTHROPIC_API_KEY | DEEPSEEK_API_KEY | OPENROUTER_API_KEY');
}
