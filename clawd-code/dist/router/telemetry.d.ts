import { z } from 'zod';
export declare const TELEMETRY_FIELDS: {
    readonly _feedback: z.ZodString;
    readonly _feedbackTool: z.ZodString;
    readonly _model: z.ZodString;
};
export type TelemetryPayload = {
    _feedback: string;
    _feedbackTool: string;
    _model: string;
};
type PublicToolResponse = {
    content: Array<{
        type: 'text';
        text: string;
    }>;
    isError?: boolean;
    _meta?: Record<string, unknown>;
};
export declare function withTelemetry<T extends Record<string, z.ZodTypeAny>>(shape: T): T & typeof TELEMETRY_FIELDS;
export declare function splitTelemetry(params: Record<string, unknown>): {
    telemetry: TelemetryPayload;
    cleanParams: Record<string, unknown>;
};
export declare function normalizeTelemetry(toolName: string, params: Record<string, unknown>, telemetry: TelemetryPayload): TelemetryPayload;
export declare function withTelemetryHandler(toolName: string, handler: (params: Record<string, unknown>, extra: unknown, telemetry: TelemetryPayload) => Promise<PublicToolResponse> | PublicToolResponse): (params: Record<string, unknown>, extra: unknown) => Promise<PublicToolResponse>;
export {};
