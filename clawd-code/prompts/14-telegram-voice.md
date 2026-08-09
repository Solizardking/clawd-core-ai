# 14 — Telegram & Voice

Run Clawd via Telegram bot or voice commands — LiveKit streaming, Sag TTS, ElevenLabs voice, and text-to-speech.

## Telegram bot (clawd-bot)

The clawd-bot Telegram integration lets you trade, research, and deploy from chat.

```bash
# Start the bot
clawd telegram start

# Configure
clawd telegram config set-token <YOUR_BOT_TOKEN>
clawd telegram config set-webhook https://your-domain.com/webhook
```

### Telegram commands (60+)

| Command | Purpose |
|---------|---------|
| `/trade <pair>` | Execute a spot swap |
| `/perps <market>` | Open a perpetuals position |
| `/price <token>` | Get current price |
| `/portfolio` | Show holdings + P&L |
| `/research <query>` | Deep web + on-chain research |
| `/launch <name>` | Launch a Pump.fun token |
| `/subscribe <plan>` | Start a monthly subscription |
| `/cancel` | Cancel subscription |
| `/arena` | Agent identity operations |
| `/status` | Router health + model status |

### Telegram skills

| Skill | Use when |
|-------|----------|
| `clawd-bot` | Telegram bot setup, commands, webhook config |
| `imperial` + `vulcan` | Trading commands via Telegram |
| `clawd-trading-terminal` | Full trading terminal in Telegram |

## Voice commands (LiveKit + ElevenLabs)

```bash
# Start voice mode
clawd voice start

# Talk to your terminal
clawd voice listen

# Voice respond via ElevenLabs
clawd voice respond "SOL is trading at $150"
```

### Voice config

```env
ELEVENLABS_API_KEY=sk-...
LIVEKIT_URL=wss://...
LIVEKIT_API_KEY=...
LIVEKIT_API_SECRET=...
```

### Voice skills

| Skill | Use when |
|-------|----------|
| `voice-call` | Start / manage voice calls |
| `sag` | ElevenLabs text-to-speech with macOS-style UX |
| `openai-whisper-api` | Speech-to-text transcription |
| `gemini` | Gemini CLI for Q&A and voice-grounded answers |

## Streaming mode

```bash
# Enable streaming output
export CLAWD_STREAM=true

# Stream chat completions
clawd chat --stream "tell me about Solana"

# Stream with voice output
clawd chat --stream --voice "what's the SOL price?"
```

## Clawd Trading Terminal (Telegram)

```bash
/clawd:trade swap 1 SOL to USDC
/clawd:trade orderbook SOL-PERP
/clawd:trade position SOL-PERP
/clawd:trade portfolio
/clawd:trade scanner — top trending tokens
```

The clawd trading terminal is the complete trading surface — Jupiter swaps, DFlow markets, Phoenix perps, and pump.fun all accessible from Telegram or the CLI.

Next → `15-deploy-production.md`