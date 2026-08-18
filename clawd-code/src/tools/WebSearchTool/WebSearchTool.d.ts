import type { PermissionResult } from 'src/utils/permissions/PermissionResult.js';
import { z } from 'zod/v4';
declare const inputSchema: () => z.ZodObject<{
    query: z.ZodString;
    allowed_domains: z.ZodOptional<z.ZodArray<z.ZodString>>;
    blocked_domains: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strict>;
type InputSchema = ReturnType<typeof inputSchema>;
declare const searchResultSchema: () => z.ZodObject<{
    tool_use_id: z.ZodString;
    content: z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        url: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type SearchResult = z.infer<ReturnType<typeof searchResultSchema>>;
declare const outputSchema: () => z.ZodObject<{
    query: z.ZodString;
    results: z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
        tool_use_id: z.ZodString;
        content: z.ZodArray<z.ZodObject<{
            title: z.ZodString;
            url: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodString]>>;
    durationSeconds: z.ZodNumber;
}, z.core.$strip>;
type OutputSchema = ReturnType<typeof outputSchema>;
export type Output = z.infer<OutputSchema>;
export type { WebSearchProgress } from '../../types/tools.js';
export declare const WebSearchTool: Omit<{
    name: string;
    searchHint: string;
    maxResultSizeChars: number;
    shouldDefer: true;
    description(input: {
        query: string;
        allowed_domains?: string[] | undefined;
        blocked_domains?: string[] | undefined;
    }): Promise<string>;
    userFacingName(): string;
    getToolUseSummary: any;
    getActivityDescription(input: Partial<{
        query: string;
        allowed_domains?: string[] | undefined;
        blocked_domains?: string[] | undefined;
    }> | undefined): string;
    isEnabled(): boolean;
    readonly inputSchema: InputSchema;
    readonly outputSchema: OutputSchema;
    isConcurrencySafe(): true;
    isReadOnly(): true;
    toAutoClassifierInput(input: {
        query: string;
        allowed_domains?: string[] | undefined;
        blocked_domains?: string[] | undefined;
    }): string;
    checkPermissions(_input: {
        query: string;
        allowed_domains?: string[] | undefined;
        blocked_domains?: string[] | undefined;
    }): Promise<PermissionResult>;
    prompt(): Promise<string>;
    renderToolUseMessage: any;
    renderToolUseProgressMessage: any;
    renderToolResultMessage: any;
    extractSearchText(): string;
    validateInput(input: {
        query: string;
        allowed_domains?: string[] | undefined;
        blocked_domains?: string[] | undefined;
    }): Promise<{
        result: false;
        message: string;
        errorCode: number;
    } | {
        result: true;
        message?: undefined;
        errorCode?: undefined;
    }>;
    call(input: {
        query: string;
        allowed_domains?: string[] | undefined;
        blocked_domains?: string[] | undefined;
    }, context: import("../../Tool.js").ToolUseContext, _canUseTool: CanUseToolFn, _parentMessage: import("../../types/message.js").AssistantMessage, onProgress: import("../../Tool.js").ToolCallProgress<WebSearchProgress> | undefined): Promise<{
        data: {
            query: string;
            results: (string | {
                tool_use_id: string;
                content: {
                    title: string;
                    url: string;
                }[];
            })[];
            durationSeconds: number;
        };
    }>;
    mapToolResultToToolResultBlockParam(output: {
        query: string;
        results: (string | {
            tool_use_id: string;
            content: {
                title: string;
                url: string;
            }[];
        })[];
        durationSeconds: number;
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
    checkPermissions: (_input: {
        query: string;
        allowed_domains?: string[] | undefined;
        blocked_domains?: string[] | undefined;
    }) => Promise<PermissionResult>;
    toAutoClassifierInput: (input: {
        query: string;
        allowed_domains?: string[] | undefined;
        blocked_domains?: string[] | undefined;
    }) => string;
    userFacingName: () => string;
};
//# sourceMappingURL=WebSearchTool.d.ts.map