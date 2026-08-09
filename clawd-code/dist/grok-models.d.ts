/**
 * Clawd Code — Model Registry
 * xAI Grok + Anthropic Claude + DeepSeek model definitions
 *
 * Default model: xAI Grok (grok-4.3 for code/REPL, grok-4.20-multi-agent for research).
 * Single source of truth used by cli.ts, modes/*, and the /inspect command.
 */
export type ClawdProvider = 'xai' | 'anthropic' | 'deepseek' | 'openrouter';
export interface ModelDefinition {
    id: string;
    name: string;
    description: string;
    contextWindow: number;
    inputPrice: number;
    outputPrice: number;
    reasoning?: boolean;
    multiAgent?: boolean;
    responsesOnly?: boolean;
    supportsClientTools?: boolean;
    reasoningEfforts?: string[];
    aliases?: string[];
    provider: ClawdProvider;
    streaming?: boolean;
    /** Best-fit mode for this model (used by `clawd-code inspect` recommendations). */
    bestFor?: 'code' | 'research' | 'voice' | 'image' | 'general';
}
/** General-purpose default (code mode, REPL, trade). Grok 4.3 — reasoning, tools, streaming. */
export declare const DEFAULT_MODEL = "grok-4.3";
/** Default for research mode — multi-agent (responses API only, no client tools). */
export declare const DEFAULT_RESEARCH_MODEL = "grok-4.20-multi-agent";
/** Default for image generation mode. */
export declare const DEFAULT_IMAGE_MODEL = "grok-imagine-image-quality";
/** Default for voice agent mode (realtime voice). */
export declare const DEFAULT_VOICE_MODEL = "grok-voice-think-fast-1.0";
/** Default for fast/cheap tasks (alt to grok-4.3). */
export declare const DEFAULT_FAST_MODEL = "grok-4.3-fast";
/** Default provider (xAI / Grok). */
export declare const DEFAULT_PROVIDER: ClawdProvider;
export declare const MODELS: ModelDefinition[];
export declare function getModel(id: string): ModelDefinition | undefined;
export declare function normalizeModelId(id: string): string;
export declare function listModelIds(): string[];
export declare function listModelsByProvider(provider: ClawdProvider): ModelDefinition[];
/** Best default model for a given mode. */
export declare function defaultModelFor(mode: 'code' | 'research' | 'voice' | 'image' | 'general' | 'repl' | 'trade'): string;
export declare function getSupportedReasoningEfforts(id: string): string[];
export declare function getEffectiveReasoningEffort(id: string, effort?: string): string | undefined;
export declare function isMultiAgentModel(id: string): boolean;
export declare function isResponsesOnlyModel(id: string): boolean;
export declare function isStreamingSupported(id: string): boolean;
/**
 * If the requested model is not usable for the given mode (e.g. responses-only
 * models can't do client-side tool calls in code mode), return a sensible
 * fallback. Otherwise return the requested id unchanged.
 */
export declare function resolveModelForMode(requested: string, mode: 'code' | 'repl' | 'trade' | 'research' | 'voice' | 'image' | 'general'): string;
export declare function printModelsTable(): void;
//# sourceMappingURL=grok-models.d.ts.map