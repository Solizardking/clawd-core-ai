export const MODELS = [
  { id: "openrouter/free", label: "Auto (Free)", description: "OpenRouter picks a free model automatically" },
  { id: "deepseek/deepseek-r1:free", label: "DeepSeek R1", description: "Free, strong reasoning" },
  { id: "meta-llama/llama-3.2-3b-instruct:free", label: "Llama 3.2 3B", description: "Free, fastest" },
] as const;

export const DEFAULT_MODEL = "openrouter/free";

export const API_ROUTES = {
  chat: "/api/chat",
  stream: "/api/stream",
} as const;

export const MAX_MESSAGE_LENGTH = 100_000;

export const STREAMING_CHUNK_SIZE = 64;
