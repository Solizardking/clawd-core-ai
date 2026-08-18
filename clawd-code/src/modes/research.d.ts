/**
 * Clawd Code — RESEARCH MODE
 * Deep research with extended reasoning. Default: Moonshot Kimi K2 Thinking.
 * Streaming supported for all four providers.
 */
interface ResearchConfig {
    provider?: string;
    model?: string;
    stream?: boolean;
    moonshotApiKey?: string;
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