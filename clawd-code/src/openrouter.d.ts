/**
 * Clawd Code — OpenRouter Adapter
 * OpenAI-compatible API for OpenRouter models (with reasoning support)
 * Default free model: nex-agi/nex-n2-pro:free
 */
export interface OpenRouterMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    reasoning_details?: unknown;
}
export interface OpenRouterRequest {
    model: string;
    messages: OpenRouterMessage[];
    stream?: boolean;
    reasoning?: {
        enabled: boolean;
        effort?: 'low' | 'medium' | 'high';
    };
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
}
export interface OpenRouterUsage {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
    reasoning_tokens?: number;
}
export interface OpenRouterResponse {
    id: string;
    model: string;
    choices: Array<{
        index: number;
        message: {
            role: 'assistant';
            content: string;
            reasoning_details?: unknown;
        };
        finish_reason: string;
    }>;
    usage?: OpenRouterUsage;
}
export declare const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
export declare const DEFAULT_FREE_MODEL = "nex-agi/nex-n2-pro:free";
export declare class OpenRouterClient {
    private apiKey;
    private baseUrl;
    private defaultModel;
    constructor(apiKey: string, baseUrl?: string, defaultModel?: string);
    /**
     * Send a chat completion request (non-streaming)
     */
    chat(request: Omit<OpenRouterRequest, 'stream'>): Promise<OpenRouterResponse>;
    /**
     * Stream a chat completion (yields text deltas + reasoning tokens)
     */
    stream(request: Omit<OpenRouterRequest, 'stream'>): AsyncGenerator<{
        content: string;
        reasoning?: string;
        usage?: OpenRouterUsage;
        done: boolean;
    }>;
    /**
     * Quick prompt helper — returns just the text content
     */
    prompt(userMessage: string, options?: {
        model?: string;
        systemPrompt?: string;
        reasoning?: boolean;
        maxTokens?: number;
    }): Promise<{
        content: string;
        reasoning_details?: unknown;
        usage?: OpenRouterUsage;
        model: string;
    }>;
    getDefaultModel(): string;
    hasApiKey(): boolean;
}
/**
 * Create an OpenRouter client from env vars
 */
export declare function createOpenRouterClient(env: Record<string, string>): OpenRouterClient | null;
//# sourceMappingURL=openrouter.d.ts.map