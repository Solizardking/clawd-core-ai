/**
 * Clawd Code — CODE MODE
 * Write, review, and ship production code
 * Default provider: Moonshot Kimi (kimi-k2-thinking). Streams via SSE like Anthropic & OpenRouter.
 */
interface CodeConfig {
    provider?: string;
    model?: string;
    stream?: boolean;
    moonshotApiKey?: string;
    anthropicApiKey?: string;
    deepSeekApiKey?: string;
    deepSeekBaseUrl?: string;
}
export declare class CodeMode {
    private config;
    constructor(config: CodeConfig);
    run(args: string[]): Promise<void>;
    private resolveProvider;
    private generateStreaming;
    private generateBlocking;
    private fallbackCode;
}
export {};
//# sourceMappingURL=code.d.ts.map