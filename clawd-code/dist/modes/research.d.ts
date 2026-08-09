/**
 * Clawd Code — RESEARCH MODE
 * Multi-agent deep research. Default: xAI Grok (grok-4.20-multi-agent) with
 * web_search + x_search + code_interpreter. Streaming supported for all four
 * providers.
 */
interface ResearchConfig {
    provider?: string;
    model?: string;
    stream?: boolean;
    agentCount?: 4 | 16;
    xaiApiKey?: string;
    anthropicApiKey?: string;
    deepSeekApiKey?: string;
    deepSeekBaseUrl?: string;
}
export declare class ResearchMode {
    private config;
    constructor(config: ResearchConfig);
    run(args: string[]): Promise<void>;
    private resolveProvider;
    private printHeader;
    private runStreaming;
    private runBlocking;
}
export {};
//# sourceMappingURL=research.d.ts.map