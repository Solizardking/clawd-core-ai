/**
 * Clawd Code — RESEARCH MODE
 * Deep research with extended reasoning. Default: Moonshot Kimi K2 Thinking.
 * Streaming supported for all four providers.
 */
import { createAnthropicClient, DEFAULT_CLAUDE_MODEL, isClaudeModel } from '../anthropic.js';
import { createDeepSeekClient } from '../deepseek.js';
import { loadClawdEnv } from '../env.js';
import { DEFAULT_RESEARCH_MODEL, normalizeModelId } from '../model-registry.js';
import { createOpenRouterClient } from '../openrouter.js';
import { createMoonshotClient } from '../moonshot.js';
const RESEARCH_SYSTEM = `You are Clawd Research — a precise, source-aware technical researcher. Synthesize findings across sources. Cite evidence. Flag what requires live verification. Be concise and structured.`;
export class ResearchMode {
    config;
    constructor(config) {
        this.config = config;
    }
    async run(args) {
        const query = args.filter((a) => !a.startsWith('--')).join(' ');
        if (!query.trim()) {
            console.error('[RESEARCH MODE] No query given. Usage: clawd-code research "AI agent frameworks 2025"');
            return;
        }
        const provider = this.resolveProvider();
        const requested = this.config.model ?? DEFAULT_RESEARCH_MODEL;
        const model = normalizeModelId(requested) || DEFAULT_RESEARCH_MODEL;
        console.log('\n[RESEARCH MODE] Initiating research...\n');
        console.log(`[RESEARCH MODE] Provider: ${provider}`);
        console.log(`[RESEARCH MODE] Model: ${model}`);
        console.log(`[RESEARCH MODE] Query: ${query}\n`);
        this.printHeader(query, model);
        if (this.config.stream) {
            await this.runStreaming(query, provider, model);
        }
        else {
            const result = await this.runBlocking(query, provider, model);
            console.log(`\n${result.content || 'No research output returned.'}`);
            if (result.citations.length > 0) {
                console.log('\nCitations:');
                for (const c of result.citations)
                    console.log(`  - ${c}`);
            }
        }
        console.log('\n[RESEARCH MODE] Research complete. Say "code" to generate implementation.');
    }
    resolveProvider() {
        const p = this.config.provider ?? 'moonshot';
        if (p === 'anthropic' || isClaudeModel(this.config.model ?? ''))
            return 'anthropic';
        if (p === 'deepseek' || String(this.config.model ?? '').startsWith('deepseek-'))
            return 'deepseek';
        if (p === 'openrouter')
            return 'openrouter';
        return 'moonshot';
    }
    printHeader(query, model) {
        const q = query.substring(0, 52).padEnd(52);
        console.log('╔══════════════════════════════════════════════════════════════╗');
        console.log(`║  RESEARCH MODE — ${model.padEnd(45)}║`);
        console.log('╠══════════════════════════════════════════════════════════════╣');
        console.log(`║  ${q}  ║`);
        console.log('╚══════════════════════════════════════════════════════════════╝\n');
    }
    async runStreaming(query, provider, model) {
        process.stdout.write('[RESEARCH MODE] Streaming findings:\n\n');
        try {
            if (provider === 'anthropic') {
                const client = createAnthropicClient(this.config.anthropicApiKey);
                if (!client) {
                    console.error('[RESEARCH MODE] ANTHROPIC_API_KEY not set.');
                    return;
                }
                const useModel = isClaudeModel(model) ? model : DEFAULT_CLAUDE_MODEL;
                for await (const chunk of client.stream({
                    model: useModel,
                    system: RESEARCH_SYSTEM,
                    messages: [{ role: 'user', content: query }],
                    maxTokens: 8096,
                })) {
                    if (chunk.text)
                        process.stdout.write(chunk.text);
                }
                process.stdout.write('\n');
                return;
            }
            if (provider === 'moonshot') {
                const client = createMoonshotClient(this.config.moonshotApiKey);
                if (!client) {
                    console.error('[RESEARCH MODE] MOONSHOT_API_KEY not set.');
                    return;
                }
                for await (const chunk of client.streamChat({
                    model,
                    messages: [
                        { role: 'system', content: RESEARCH_SYSTEM },
                        { role: 'user', content: query },
                    ],
                    maxTokens: 8096,
                })) {
                    if (chunk.text)
                        process.stdout.write(chunk.text);
                }
                process.stdout.write('\n');
                return;
            }
            if (provider === 'openrouter') {
                const env = loadClawdEnv();
                const client = createOpenRouterClient(env);
                if (!client) {
                    console.error('[RESEARCH MODE] OPENROUTER_API_KEY not set.');
                    return;
                }
                for await (const chunk of client.stream({
                    model: this.config.model ?? client.getDefaultModel(),
                    messages: [
                        { role: 'system', content: RESEARCH_SYSTEM },
                        { role: 'user', content: query },
                    ],
                    max_tokens: 8096,
                })) {
                    if (chunk.content)
                        process.stdout.write(chunk.content);
                }
                process.stdout.write('\n');
                return;
            }
        }
        catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            console.log(`\n[RESEARCH MODE] Streaming error: ${msg}`);
        }
    }
    async runBlocking(query, provider, model) {
        try {
            if (provider === 'anthropic') {
                const client = createAnthropicClient(this.config.anthropicApiKey);
                if (!client)
                    return { content: 'ANTHROPIC_API_KEY not set.', citations: [] };
                const useModel = isClaudeModel(model) ? model : DEFAULT_CLAUDE_MODEL;
                console.log(`[RESEARCH MODE] Running with ${useModel}...`);
                const response = await client.chat({
                    model: useModel,
                    system: RESEARCH_SYSTEM,
                    messages: [{ role: 'user', content: query }],
                    maxTokens: 8096,
                    temperature: 0.2,
                });
                return { content: response.content, citations: [] };
            }
            if (provider === 'deepseek') {
                const client = createDeepSeekClient(this.config.deepSeekApiKey, this.config.deepSeekBaseUrl);
                if (!client)
                    return { content: 'DEEPSEEK_API_KEY not set.', citations: [] };
                const useModel = String(model).startsWith('deepseek-') ? model : 'deepseek-v4-pro';
                console.log(`[RESEARCH MODE] Running DeepSeek ${useModel} (extended thinking)...`);
                const response = await client.chat({
                    model: useModel,
                    reasoningEffort: 'high',
                    thinking: true,
                    messages: [
                        { role: 'system', content: RESEARCH_SYSTEM },
                        { role: 'user', content: query },
                    ],
                    maxTokens: 8096,
                    temperature: 0.2,
                });
                return { content: response.content, citations: [] };
            }
            if (provider === 'openrouter') {
                const env = loadClawdEnv();
                const client = createOpenRouterClient(env);
                if (!client)
                    return { content: 'OPENROUTER_API_KEY not set.', citations: [] };
                const useModel = this.config.model ?? client.getDefaultModel();
                console.log(`[RESEARCH MODE] Running OpenRouter/${useModel}...`);
                const result = await client.prompt(query, {
                    model: useModel,
                    systemPrompt: RESEARCH_SYSTEM,
                    maxTokens: 8096,
                });
                return { content: result.content, citations: [] };
            }
            // Moonshot (default)
            const client = createMoonshotClient(this.config.moonshotApiKey);
            if (!client)
                return { content: 'MOONSHOT_API_KEY not set.', citations: [] };
            console.log(`[RESEARCH MODE] Running ${model}...`);
            return await client.chat({
                model,
                messages: [
                    { role: 'system', content: RESEARCH_SYSTEM },
                    { role: 'user', content: query },
                ],
                maxTokens: 8096,
                temperature: 0.2,
            });
        }
        catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            return { content: `Research unavailable (${provider}): ${msg}`, citations: [] };
        }
    }
}
//# sourceMappingURL=research.js.map