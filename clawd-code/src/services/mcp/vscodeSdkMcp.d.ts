import { z } from 'zod/v4';
import type { MCPServerConnection } from './types.js';
export declare const LogEventNotificationSchema: () => z.ZodObject<{
    method: z.ZodLiteral<"log_event">;
    params: z.ZodObject<{
        eventName: z.ZodString;
        eventData: z.ZodObject<{}, z.core.$loose>;
    }, z.core.$strip>;
}, z.core.$strip>;
/**
 * Sends a file_updated notification to the VSCode MCP server. This is used to
 * notify VSCode when files are edited or written by Claude.
 */
export declare function notifyVscodeFileUpdated(filePath: string, oldContent: string | null, newContent: string | null): void;
/**
 * Sets up the speicial internal VSCode MCP for bidirectional communication using notifications.
 */
export declare function setupVscodeSdkMcp(sdkClients: MCPServerConnection[]): void;
//# sourceMappingURL=vscodeSdkMcp.d.ts.map