import { z } from 'zod/v4';
import type { PermissionResult } from '../../utils/permissions/PermissionResult.js';
export declare const inputSchema: () => z.ZodObject<{}, z.core.$loose>;
type InputSchema = ReturnType<typeof inputSchema>;
export declare const outputSchema: () => z.ZodString;
type OutputSchema = ReturnType<typeof outputSchema>;
export type Output = z.infer<OutputSchema>;
export type { MCPProgress } from '../../types/tools.js';
export declare const MCPTool: Omit<{
    isMcp: true;
    isOpenWorld(): false;
    name: string;
    maxResultSizeChars: number;
    description(): Promise<string>;
    prompt(): Promise<string>;
    readonly inputSchema: InputSchema;
    readonly outputSchema: OutputSchema;
    call(): Promise<{
        data: string;
    }>;
    checkPermissions(): Promise<PermissionResult>;
    renderToolUseMessage: any;
    userFacingName: () => string;
    renderToolUseProgressMessage: any;
    renderToolResultMessage: any;
    isResultTruncated(output: Output): boolean;
    mapToolResultToToolResultBlockParam(content: string, toolUseID: string): {
        tool_use_id: string;
        type: "tool_result";
        content: string;
    };
}, "isEnabled" | "isConcurrencySafe" | "isReadOnly" | "isDestructive" | "checkPermissions" | "toAutoClassifierInput" | "userFacingName"> & {
    isEnabled: () => boolean;
    isConcurrencySafe: (_input?: unknown) => boolean;
    isReadOnly: (_input?: unknown) => boolean;
    isDestructive: (_input?: unknown) => boolean;
    checkPermissions: () => Promise<PermissionResult>;
    toAutoClassifierInput: (_input?: unknown) => string;
    userFacingName: () => string;
};
//# sourceMappingURL=MCPTool.d.ts.map