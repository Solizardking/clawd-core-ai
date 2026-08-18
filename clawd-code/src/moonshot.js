/**
 * Clawd Code - Moonshot AI (Kimi) API client
 * OpenAI-compatible chat completions, with SSE streaming.
 */
export const MOONSHOT_BASE_URL = 'https://api.moonshot.ai/v1';
export class MoonshotClient {
    apiKey;
    baseUrl;
    constructor(apiKey, baseUrl = MOONSHOT_BASE_URL) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }
    hasApiKey() {
        return this.apiKey.length > 0;
    }
    /** Lightweight health check — hits the public /models endpoint. */
    async ping() {
        try {
            const response = await fetch(`${this.baseUrl}/models`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${this.apiKey}` },
            });
            if (!response.ok) {
                return { ok: false, error: `Moonshot ${response.status}` };
            }
            const data = (await response.json());
            const models = (data.data ?? []).map((m) => m.id);
            return { ok: true, models };
        }
        catch (error) {
            return { ok: false, error: error instanceof Error ? error.message : String(error) };
        }
    }
    async chat(options) {
        const response = await this.post('/chat/completions', {
            model: options.model,
            messages: options.messages,
            max_tokens: options.maxTokens,
            temperature: options.temperature,
        });
        return {
            content: response.choices?.[0]?.message?.content?.trim() ?? '',
            citations: [],
            usage: response.usage,
            model: response.model,
        };
    }
    /**
     * Stream a chat completion (SSE). Yields text deltas + final usage.
     * Mirrors the Anthropic/OpenRouter streaming UX.
     */
    async *streamChat(options) {
        const response = await fetch(`${this.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                Accept: 'text/event-stream',
            },
            body: JSON.stringify({
                model: options.model,
                messages: options.messages,
                max_tokens: options.maxTokens,
                temperature: options.temperature,
                stream: true,
            }),
        });
        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Moonshot ${response.status}: ${err}`);
        }
        const reader = response.body?.getReader();
        if (!reader)
            throw new Error('Moonshot stream: no response body');
        const decoder = new TextDecoder();
        let buffer = '';
        let finalUsage;
        let finalModel;
        while (true) {
            const { done, value } = await reader.read();
            if (done)
                break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';
            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed.startsWith('data:'))
                    continue;
                const data = trimmed.slice(5).trim();
                if (!data || data === '[DONE]')
                    continue;
                try {
                    const parsed = JSON.parse(data);
                    const delta = parsed.choices?.[0]?.delta?.content ?? '';
                    if (parsed.usage)
                        finalUsage = parsed.usage;
                    if (parsed.model)
                        finalModel = parsed.model;
                    if (delta)
                        yield { text: delta, done: false };
                }
                catch {
                    // skip malformed SSE frames
                }
            }
        }
        yield { text: '', done: true, usage: finalUsage, model: finalModel };
    }
    async post(path, body) {
        const response = await fetch(`${this.baseUrl}${path}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Moonshot ${response.status}: ${error}`);
        }
        return (await response.json());
    }
}
export function createMoonshotClient(apiKey) {
    if (!apiKey)
        return null;
    return new MoonshotClient(apiKey);
}
//# sourceMappingURL=moonshot.js.map