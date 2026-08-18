/**
 * Clawd Code — VOICE MODE
 * Local sherpa-onnx or sag CLI text-to-speech.
 *
 * Usage:
 *   clawd-code voice "Hello from Clawd"
 *   clawd-code voice "Hello from Clawd" --voice ara --output ./out.mp3
 */

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

interface VoiceConfig {
  rpcUrl?: string;
  liveTrading?: boolean;
  model?: string;
}

export class VoiceMode {
  constructor(private config: VoiceConfig) {}

  async run(args: string[]): Promise<void> {
    await this.runTTS(args);
  }

  // ── TTS mode (sherpa-onnx or sag CLI) ────────────────────────────────────

  private async runTTS(args: string[]): Promise<void> {
    const text = args.filter((a) => !a.startsWith('--')).join(' ');
    let voice = 'Clawd';
    let outputFile = `/tmp/clawd-voice-${Date.now()}.mp3`;

    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--voice' && args[i + 1]) voice = args[i + 1];
      if (args[i] === '--output' && args[i + 1]) outputFile = args[i + 1];
    }

    console.log('\n[VOICE MODE] Initiating text-to-speech...\n');
    console.log(`[VOICE MODE] Text: ${text}`);
    console.log(`[VOICE MODE] Voice: ${voice}`);
    console.log(`[VOICE MODE] Output: ${outputFile}`);

    const sherpaExists = existsSync(
      `${process.env.HOME ?? ''}/.clawdbot/tools/sherpa-onnx-tts/runtime/bin/sherpa-onnx-tts`,
    );

    if (sherpaExists) {
      await this.generateLocalTTS(text, voice, outputFile);
    } else {
      await this.generateSagTTS(text, voice, outputFile);
    }
  }

  private generateLocalTTS(text: string, voice: string, outputFile: string): Promise<void> {
    console.log('\n[VOICE MODE] Generating via sherpa-onnx (local, zero API cost)...');
    const runtimeDir = `${process.env.HOME ?? ''}/.clawdbot/tools/sherpa-onnx-tts/runtime`;
    const modelDir =
      process.env.SHERPA_ONNX_MODEL_DIR ??
      `${process.env.HOME ?? ''}/.clawdbot/tools/sherpa-onnx-tts/models/vits-piper-en_US-lessac-high`;
    const ttsBinary = join(runtimeDir, 'bin', 'sherpa-onnx-tts');

    return new Promise((resolve) => {
      const proc = spawn(
        ttsBinary,
        ['--output', outputFile, '--model-file', join(modelDir, 'vits-piper-en_US-lessac-high.onnx'), '--tokens-file', join(modelDir, 'tokens.txt'), text],
        { stdio: 'pipe' },
      );
      proc.on('close', (code) => {
        if (code === 0) {
          console.log('\n[VOICE MODE] TTS generated successfully');
          console.log(`[VOICE MODE] Audio: ${outputFile}`);
        } else {
          console.log('[VOICE MODE] Local TTS failed, trying sag...');
          void this.generateSagTTS(text, voice, outputFile).then(resolve);
        }
        resolve();
      });
    });
  }

  private generateSagTTS(text: string, voice: string, outputFile: string): Promise<void> {
    console.log('\n[VOICE MODE] Generating via sag CLI...');
    return new Promise((resolve) => {
      try {
        const proc = spawn('sag', ['-v', voice, '-o', outputFile, text], { stdio: 'pipe' });
        proc.on('close', (code) => {
          if (code === 0) {
            console.log('\n[VOICE MODE] Voice generated successfully');
            console.log(`[VOICE MODE] Audio: ${outputFile}`);
          } else {
            console.log('\n[VOICE MODE] Voice unavailable. Install sherpa-onnx or set ELEVENLABS_API_KEY.');
          }
          resolve();
        });
      } catch {
        console.log('\n[VOICE MODE] sag CLI not found.');
        resolve();
      }
    });
  }
}
