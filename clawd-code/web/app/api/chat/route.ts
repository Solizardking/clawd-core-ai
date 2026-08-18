import { type NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Free harness: proxies chat requests to OpenRouter's free model tier.
//
// No paid API key is required — OPENROUTER_API_KEY is a free-to-create
// OpenRouter key, and the default model (`openrouter/free`) costs nothing to
// call. The frontend speaks Anthropic's message-streaming SSE protocol, so
// this route translates OpenRouter's OpenAI-style stream into that shape.
// ---------------------------------------------------------------------------

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_FREE_MODEL = "openrouter/free";

interface IncomingMessage {
  role: string;
  content: unknown;
}

interface OpenRouterChunk {
  model?: string;
  choices?: Array<{
    delta?: { content?: string };
    finish_reason?: string | null;
  }>;
  error?: { message?: string };
}

function sseEvent(payload: unknown): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(payload)}\n\n`);
}

/** Anthropic message content can be a string or an array of content blocks — flatten to plain text for OpenRouter. */
function flattenContent(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .filter((block): block is { type: "text"; text: string } => block?.type === "text")
      .map((block) => block.text)
      .join("\n");
  }
  return "";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages: IncomingMessage[] = Array.isArray(body.messages) ? body.messages : [];
    const model = body.model || process.env.OPENROUTER_MODEL || DEFAULT_FREE_MODEL;
    const maxTokens = body.max_tokens ?? 4096;

    const upstream = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.OPENROUTER_API_KEY
          ? { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` }
          : {}),
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
        "X-Title": "Clawd Code Web",
      },
      body: JSON.stringify({
        model,
        messages: messages.map((m) => ({ role: m.role, content: flattenContent(m.content) })),
        max_tokens: maxTokens,
        stream: true,
      }),
    });

    if (!upstream.ok || !upstream.body) {
      const errText = await upstream.text().catch(() => "");
      return NextResponse.json(
        { error: errText || "OpenRouter request failed" },
        { status: upstream.status || 502 }
      );
    }

    const upstreamBody = upstream.body;
    const messageId = `msg_${Date.now()}`;
    let resolvedModel = model;
    let outputTokens = 0;

    const readable = new ReadableStream<Uint8Array>({
      async start(controller) {
        controller.enqueue(
          sseEvent({
            type: "message_start",
            message: {
              id: messageId,
              role: "assistant",
              model: resolvedModel,
              usage: { input_tokens: 0, output_tokens: 0 },
            },
          })
        );
        controller.enqueue(
          sseEvent({ type: "content_block_start", index: 0, content_block: { type: "text", text: "" } })
        );

        const reader = upstreamBody.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              const data = line.slice(6).trim();
              if (!data || data === "[DONE]") continue;

              let chunk: OpenRouterChunk;
              try {
                chunk = JSON.parse(data);
              } catch {
                continue;
              }

              if (chunk.error?.message) {
                controller.enqueue(
                  sseEvent({ type: "error", error: { type: "server", message: chunk.error.message } })
                );
                continue;
              }

              if (chunk.model) resolvedModel = chunk.model;
              const delta = chunk.choices?.[0]?.delta?.content;
              if (delta) {
                outputTokens += 1;
                controller.enqueue(
                  sseEvent({ type: "content_block_delta", index: 0, delta: { type: "text_delta", text: delta } })
                );
              }
            }
          }
        } catch (err) {
          controller.enqueue(
            sseEvent({
              type: "error",
              error: { type: "network", message: err instanceof Error ? err.message : "Stream error" },
            })
          );
        } finally {
          reader.releaseLock();
        }

        controller.enqueue(sseEvent({ type: "content_block_stop", index: 0 }));
        controller.enqueue(
          sseEvent({
            type: "message_delta",
            delta: { stop_reason: "end_turn", stop_sequence: null },
            usage: { output_tokens: outputTokens },
          })
        );
        controller.enqueue(sseEvent({ type: "message_stop" }));
        controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new NextResponse(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
