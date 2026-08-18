/**
 * Clawd Code - Moonshot AI (Kimi) API client
 * OpenAI-compatible chat completions, with SSE streaming.
 */
export interface MoonshotUsage {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
    reasoning_tokens?: number;
}
export interface MoonshotTextResponse {
    content: string;
    citations: string[];
    usage?: MoonshotUsage;
    model?: string;
}
export type MoonshotMessage = {
    role: 'system' | 'user' | 'assistant';
    content: string;
};
export declare const MOONSHOT_BASE_URL = "https://api.moonshot.ai/v1";
export declare class MoonshotClient {
    private readonly apiKey;
    private readonly baseUrl;
    constructor(apiKey: string, baseUrl?: string);
    hasApiKey(): boolean;
    /** Lightweight health check — hits the public /models endpoint. */
    ping(): Promise<{
        ok: boolean;
        models?: string[];
        error?: string;
    }>;
    chat(options: {
        model: string;
        messages: MoonshotMessage[];
        maxTokens?: number;
        temperature?: number;
    }): Promise<MoonshotTextResponse>;
    /**
     * Stream a chat completion (SSE). Yields text deltas + final usage.
     * Mirrors the Anthropic/OpenRouter streaming UX.
     */
    streamChat(options: {
        model: string;
        messages: MoonshotMessage[];
        maxTokens?: number;
        temperature?: number;
    }): AsyncGenerator<{
        text: string;
        done: boolean;
        usage?: MoonshotUsage;
        model?: string;
    }>;
    private post;
}
export declare function createMoonshotClient(apiKey: string | undefined): MoonshotClient | null;
//# sourceMappingURL=moonshot.d.ts.map