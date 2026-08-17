/**
 * Clawd Code — VOICE MODE
 * Local sherpa-onnx or sag CLI text-to-speech.
 *
 * Usage:
 *   clawd-code voice "Hello from Clawd"
 *   clawd-code voice "Hello from Clawd" --voice ara --output ./out.mp3
 */
interface VoiceConfig {
    rpcUrl?: string;
    liveTrading?: boolean;
    model?: string;
}
export declare class VoiceMode {
    private config;
    constructor(config: VoiceConfig);
    run(args: string[]): Promise<void>;
    private runTTS;
    private generateLocalTTS;
    private generateSagTTS;
}
export {};
//# sourceMappingURL=voice.d.ts.map