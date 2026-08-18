/**
 * Clawd Code — OpenRouter Adapter
 * OpenAI-compatible API for OpenRouter models (with reasoning support)
 * Default free model: nex-agi/nex-n2-pro:free
 */
export const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
export const DEFAULT_FREE_MODEL = 'nex-agi/nex-n2-pro:free';
export class OpenRouterClient {
    apiKey;
    baseUrl;
    defaultModel;
    constructor(apiKey, baseUrl = OPENROUTER_BASE_URL, defaultModel = DEFAULT_FREE_MODEL) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.defaultModel = defaultModel;
    }
    /**
     * Send a chat completion request (non-streaming)
     */
    async chat(request) {
        const url = `${this.baseUrl}/chat/completions`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://x402.wtf',
                'X-Title': 'Clawd Code',
            },
            body: JSON.stringify({ ...request, stream: false }),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`OpenRouter ${response.status}: ${error}`);
        }
        return response.json();
    }
    /**
     * Stream a chat completion (yields text deltas + reasoning tokens)
     */
    async *stream(request) {
        const url = `${this.baseUrl}/chat/completions`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://x402.wtf',
                'X-Title': 'Clawd Code',
            },
            body: JSON.stringify({ ...request, stream: true }),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`OpenRouter ${response.status}: ${error}`);
        }
        const reader = response.body?.getReader();
        if (!reader)
            throw new Error('No response body');
        const decoder = new TextDecoder();
        let buffer = '';
        let finalUsage;
        while (true) {
            const { done, value } = await reader.read();
            if (done)
                break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6).trim();
                    if (data === '[DONE]') {
                        yield { content: '', done: true, usage: finalUsage };
                        return;
                    }
                    try {
                        const parsed = JSON.parse(data);
                        const delta = parsed.choices?.[0]?.delta;
                        const content = delta?.content || '';
                        const reasoning = delta?.reasoning || '';
                        if (parsed.usage)
                            finalUsage = parsed.usage;
                        yield { content, reasoning, usage: finalUsage, done: false };
                    }
                    catch {
                        // Skip malformed lines
                    }
                }
            }
        }
    }
    /**
     * Quick prompt helper — returns just the text content
     */
    async prompt(userMessage, options = {}) {
        const messages = [];
        if (options.systemPrompt) {
            messages.push({ role: 'system', content: options.systemPrompt });
        }
        messages.push({ role: 'user', content: userMessage });
        const response = await this.chat({
            model: options.model || this.defaultModel,
            messages,
            reasoning: options.reasoning !== false ? { enabled: true } : undefined,
            max_tokens: options.maxTokens,
        });
        const message = response.choices[0]?.message;
        return {
            content: message?.content || '',
            reasoning_details: message?.reasoning_details,
            usage: response.usage,
            model: response.model,
        };
    }
    getDefaultModel() {
        return this.defaultModel;
    }
    hasApiKey() {
        return !!this.apiKey;
    }
}
/**
 * Create an OpenRouter client from env vars
 */
export function createOpenRouterClient(env) {
    const apiKey = env.OPENROUTER_API_KEY;
    if (!apiKey)
        return null;
    return new OpenRouterClient(apiKey, env.OPENROUTER_BASE_URL || OPENROUTER_BASE_URL, env.OPENROUTER_FREE_MODEL || DEFAULT_FREE_MODEL);
}
//# sourceMappingURL=openrouter.js.map