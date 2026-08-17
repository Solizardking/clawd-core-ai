/**
 * Thin proxy client for the cheshireterminal.ai public REST API.
 *
 * The SOL GPT tool groups (Phoenix, Imperial, Solana Tracker, market data,
 * trading, prediction markets, agents) forward to this already-deployed
 * backend rather than re-implementing each third-party integration
 * (Birdeye, Solana Tracker, Phoenix, Imperial, DFlow) from scratch.
 *
 * Public discovery (GET/HEAD/OPTIONS) requires no auth. See
 * https://cheshireterminal.ai/llms.txt.
 */

const CHESHIRE_BASE_URL = process.env.CHESHIRE_TERMINAL_BASE_URL ?? "https://cheshireterminal.ai";

export class CheshireTerminalError extends Error {
  constructor(
    public readonly status: number,
    public readonly path: string,
    message: string,
  ) {
    super(message);
    this.name = "CheshireTerminalError";
  }
}

function buildUrl(path: string, query?: Record<string, unknown>): string {
  const url = new URL(path.startsWith("/") ? path : `/${path}`, CHESHIRE_BASE_URL);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === "") {
        continue;
      }
      if (Array.isArray(value)) {
        for (const item of value) {
          url.searchParams.append(key, String(item));
        }
      } else {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

/** GET a cheshireterminal.ai API path, e.g. `/api/solana-tracker/token/:address`. */
export async function ctGet<T = unknown>(path: string, query?: Record<string, unknown>): Promise<T> {
  const url = buildUrl(path, query);
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  const text = await res.text();
  if (!res.ok) {
    throw new CheshireTerminalError(res.status, path, `cheshireterminal.ai GET ${path} -> HTTP ${res.status}: ${text.slice(0, 500)}`);
  }
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

/** POST to a cheshireterminal.ai API path with a JSON body. */
export async function ctPost<T = unknown>(path: string, body?: unknown, query?: Record<string, unknown>): Promise<T> {
  const url = buildUrl(path, query);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new CheshireTerminalError(res.status, path, `cheshireterminal.ai POST ${path} -> HTTP ${res.status}: ${text.slice(0, 500)}`);
  }
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

/** Render a JSON value as a fenced code block for MCP text content. */
export function jsonBlock(value: unknown): string {
  return "```json\n" + JSON.stringify(value, null, 2) + "\n```";
}

/** Pull the first defined string param from a params bag, trying each key in order. */
export function pickString(params: Record<string, unknown>, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = params[key];
    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }
  return undefined;
}

export function requireString(params: Record<string, unknown>, ...keys: string[]): string {
  const value = pickString(params, ...keys);
  if (!value) {
    throw new Error(`Missing required parameter: one of [${keys.join(", ")}]`);
  }
  return value;
}
