/**
 * Clawd Code — CODE MODE
 * Write, review, and ship production code
 * Default provider: xAI Grok (grok-4.3). Streams via SSE like Anthropic & OpenRouter.
 */
interface CodeConfig {
    provider?: string;
    model?: string;
    stream?: boolean;
    xaiApiKey?: string;
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