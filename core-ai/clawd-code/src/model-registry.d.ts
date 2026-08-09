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
    inputPrice: number;
    outputPrice: number;
    reasoning?: boolean;
    supportsClientTools?: boolean;
    reasoningEfforts?: string[];
    aliases?: string[];
    provider: ClawdProvider;
    streaming?: boolean;
    /** Best-fit mode for this model (used by `clawd-code inspect` recommendations). */
    bestFor?: 'code' | 'research' | 'image' | 'general';
}
/** General-purpose default (code mode, REPL, trade, research). Kimi K2 Thinking — reasoning, tools, streaming. */
export declare const DEFAULT_MODEL = "kimi-k2-thinking";
/** Default for research mode. */
export declare const DEFAULT_RESEARCH_MODEL = "kimi-k2-thinking";
/** Default for image generation mode (Moonshot has no image API — falls back to Gemini/DALL-E). */
export declare const DEFAULT_IMAGE_MODEL = "gemini-2.0-flash-exp-image-gen";
/** Default for fast/cheap tasks (alt to kimi-k2-thinking). */
export declare const DEFAULT_FAST_MODEL = "kimi-k2-turbo-preview";
/** Default provider (Moonshot). */
export declare const DEFAULT_PROVIDER: ClawdProvider;
export declare const MODELS: ModelDefinition[];
export declare function getModel(id: string): ModelDefinition | undefined;
export declare function normalizeModelId(id: string): string;
export declare function listModelIds(): string[];
export declare function listModelsByProvider(provider: ClawdProvider): ModelDefinition[];
/** Best default model for a given mode. */
export declare function defaultModelFor(mode: 'code' | 'research' | 'image' | 'general' | 'repl' | 'trade'): string;
export declare function getSupportedReasoningEfforts(id: string): string[];
export declare function getEffectiveReasoningEffort(id: string, effort?: string): string | undefined;
export declare function isStreamingSupported(id: string): boolean;
/** Resolve a requested model id to its canonical form for a given mode, falling back to the default. */
export declare function resolveModelForMode(requested: string, mode: 'code' | 'repl' | 'trade' | 'research' | 'image' | 'general'): string;
export declare function printModelsTable(): void;
//# sourceMappingURL=model-registry.d.ts.map