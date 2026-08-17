import { z } from 'zod/v4';
import type { ValidationResult } from '../../Tool.js';
import type { PermissionDecision } from '../../utils/permissions/PermissionResult.js';
declare const inputSchema: () => z.ZodObject<{
    pattern: z.ZodString;
    path: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
type InputSchema = ReturnType<typeof inputSchema>;
declare const outputSchema: () => z.ZodObject<{
    durationMs: z.ZodNumber;
    numFiles: z.ZodNumber;
    filenames: z.ZodArray<z.ZodString>;
    truncated: z.ZodBoolean;
}, z.core.$strip>;
type OutputSchema = ReturnType<typeof outputSchema>;
export type Output = z.infer<OutputSchema>;
export declare const GlobTool: Omit<{
    name: string;
    searchHint: string;
    maxResultSizeChars: number;
    description(): Promise<string>;
    userFacingName: any;
    getToolUseSummary: any;
    getActivityDescription(input: Partial<{
        pattern: string;
        path?: string | undefined;
    }> | undefined): string;
    readonly inputSchema: InputSchema;
    readonly outputSchema: OutputSchema;
    isConcurrencySafe(): true;
    isReadOnly(): true;
    toAutoClassifierInput(input: {
        pattern: string;
        path?: string | undefined;
    }): string;
    isSearchOrReadCommand(): {
        isSearch: true;
        isRead: false;
    };
    getPath({ path }: {
        pattern: string;
        path?: string | undefined;
    }): string;
    preparePermissionMatcher({ pattern }: {
        pattern: string;
        path?: string | undefined;
    }): Promise<(rulePattern: string) => boolean>;
    validateInput({ path }: {
        pattern: string;
        path?: string | undefined;
    }): Promise<ValidationResult>;
    checkPermissions(input: {
        pattern: string;
        path?: string | undefined;
    }, context: import("../../Tool.js").ToolUseContext): Promise<PermissionDecision>;
    prompt(): Promise<string>;
    renderToolUseMessage: any;
    renderToolUseErrorMessage: any;
    renderToolResultMessage: any;
    extractSearchText({ filenames }: {
        durationMs: number;
        numFiles: number;
        filenames: string[];
        truncated: boolean;
    }): string;
    call(input: {
        pattern: string;
        path?: string | undefined;
    }, { abortController, getAppState, globLimits }: import("../../Tool.js").ToolUseContext): Promise<{
        data: {
            durationMs: number;
            numFiles: number;
            filenames: string[];
            truncated: boolean;
        };
    }>;
    mapToolResultToToolResultBlockParam(output: {
        durationMs: number;
        numFiles: number;
        filenames: string[];
        truncated: boolean;
    }, toolUseID: string): {
        tool_use_id: string;
        type: "tool_result";
        content: string;
    };
}, "isEnabled" | "isConcurrencySafe" | "isReadOnly" | "isDestructive" | "checkPermissions" | "toAutoClassifierInput" | "userFacingName"> & {
    isEnabled: () => boolean;
    isConcurrencySafe: () => true;
    isReadOnly: () => true;
    isDestructive: (_input?: unknown) => boolean;
    checkPermissions: (input: {
        pattern: string;
        path?: string | undefined;
    }, context: import("../../Tool.js").ToolUseContext) => Promise<PermissionDecision>;
    toAutoClassifierInput: (input: {
        pattern: string;
        path?: string | undefined;
    }) => string;
    userFacingName: any;
};
export {};
//# sourceMappingURL=GlobTool.d.ts.map