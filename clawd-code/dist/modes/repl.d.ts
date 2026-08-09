/**
 * Clawd Code — REPL MODE
 * Interactive multi-turn conversation with persistent history.
 * Type a prompt and get a streamed response. Switch modes inline.
 * Default provider: xAI (Grok). Streams via SSE like Anthropic & OpenRouter.
 * Commands: .exit .mode <mode> .model <id> .provider <name> .clear .help
 */
interface ReplConfig {
    provider?: string;
    model?: string;
    stream?: boolean;
    xaiApiKey?: string;
    anthropicApiKey?: string;
    deepSeekApiKey?: string;
    deepSeekBaseUrl?: string;
}
export declare class ReplMode {
    private config;
    private history;
    private provider;
    private model;
    private mode;
    constructor(config: ReplConfig);
    run(): Promise<void>;
    private handleCommand;
    private respond;
    private generate;
    private resolveProvider;
    private defaultModel;
    private promptString;
    private printWelcome;
    private printHelp;
}
export {};
//# sourceMappingURL=repl.d.ts.map