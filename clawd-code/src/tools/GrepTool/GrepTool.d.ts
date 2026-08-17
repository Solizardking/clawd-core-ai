import { z } from 'zod/v4';
import type { ValidationResult } from '../../Tool.js';
import type { PermissionDecision } from '../../utils/permissions/PermissionResult.js';
declare const inputSchema: () => z.ZodObject<{
    pattern: z.ZodString;
    path: z.ZodOptional<z.ZodString>;
    glob: z.ZodOptional<z.ZodString>;
    output_mode: z.ZodOptional<z.ZodEnum<{
        content: "content";
        count: "count";
        files_with_matches: "files_with_matches";
    }>>;
    '-B': z.ZodPreprocess<z.ZodOptional<z.ZodNumber>>;
    '-A': z.ZodPreprocess<z.ZodOptional<z.ZodNumber>>;
    '-C': z.ZodPreprocess<z.ZodOptional<z.ZodNumber>>;
    context: z.ZodPreprocess<z.ZodOptional<z.ZodNumber>>;
    '-n': z.ZodPreprocess<z.ZodOptional<z.ZodBoolean>>;
    '-i': z.ZodPreprocess<z.ZodOptional<z.ZodBoolean>>;
    type: z.ZodOptional<z.ZodString>;
    head_limit: z.ZodPreprocess<z.ZodOptional<z.ZodNumber>>;
    offset: z.ZodPreprocess<z.ZodOptional<z.ZodNumber>>;
    multiline: z.ZodPreprocess<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strict>;
type InputSchema = ReturnType<typeof inputSchema>;
declare const outputSchema: () => z.ZodObject<{
    mode: z.ZodOptional<z.ZodEnum<{
        content: "content";
        count: "count";
        files_with_matches: "files_with_matches";
    }>>;
    numFiles: z.ZodNumber;
    filenames: z.ZodArray<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    numLines: z.ZodOptional<z.ZodNumber>;
    numMatches: z.ZodOptional<z.ZodNumber>;
    appliedLimit: z.ZodOptional<z.ZodNumber>;
    appliedOffset: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
type OutputSchema = ReturnType<typeof outputSchema>;
export declare const GrepTool: Omit<{
    name: string;
    searchHint: string;
    maxResultSizeChars: number;
    strict: true;
    description(): Promise<string>;
    userFacingName(): string;
    getToolUseSummary: any;
    getActivityDescription(input: Partial<{
        pattern: string;
        path?: string | undefined;
        glob?: string | undefined;
        output_mode?: "content" | "count" | "files_with_matches" | undefined;
        '-B'?: number | undefined;
        '-A'?: number | undefined;
        '-C'?: number | undefined;
        context?: number | undefined;
        '-n'?: boolean | undefined;
        '-i'?: boolean | undefined;
        type?: string | undefined;
        head_limit?: number | undefined;
        offset?: number | undefined;
        multiline?: boolean | undefined;
    }> | undefined): string;
    readonly inputSchema: InputSchema;
    readonly outputSchema: OutputSchema;
    isConcurrencySafe(): true;
    isReadOnly(): true;
    toAutoClassifierInput(input: {
        pattern: string;
        path?: string | undefined;
        glob?: string | undefined;
        output_mode?: "content" | "count" | "files_with_matches" | undefined;
        '-B'?: number | undefined;
        '-A'?: number | undefined;
        '-C'?: number | undefined;
        context?: number | undefined;
        '-n'?: boolean | undefined;
        '-i'?: boolean | undefined;
        type?: string | undefined;
        head_limit?: number | undefined;
        offset?: number | undefined;
        multiline?: boolean | undefined;
    }): string;
    isSearchOrReadCommand(): {
        isSearch: true;
        isRead: false;
    };
    getPath({ path }: {
        pattern: string;
        path?: string | undefined;
        glob?: string | undefined;
        output_mode?: "content" | "count" | "files_with_matches" | undefined;
        '-B'?: number | undefined;
        '-A'?: number | undefined;
        '-C'?: number | undefined;
        context?: number | undefined;
        '-n'?: boolean | undefined;
        '-i'?: boolean | undefined;
        type?: string | undefined;
        head_limit?: number | undefined;
        offset?: number | undefined;
        multiline?: boolean | undefined;
    }): string;
    preparePermissionMatcher({ pattern }: {
        pattern: string;
        path?: string | undefined;
        glob?: string | undefined;
        output_mode?: "content" | "count" | "files_with_matches" | undefined;
        '-B'?: number | undefined;
        '-A'?: number | undefined;
        '-C'?: number | undefined;
        context?: number | undefined;
        '-n'?: boolean | undefined;
        '-i'?: boolean | undefined;
        type?: string | undefined;
        head_limit?: number | undefined;
        offset?: number | undefined;
        multiline?: boolean | undefined;
    }): Promise<(rulePattern: string) => boolean>;
    validateInput({ path }: {
        pattern: string;
        path?: string | undefined;
        glob?: string | undefined;
        output_mode?: "content" | "count" | "files_with_matches" | undefined;
        '-B'?: number | undefined;
        '-A'?: number | undefined;
        '-C'?: number | undefined;
        context?: number | undefined;
        '-n'?: boolean | undefined;
        '-i'?: boolean | undefined;
        type?: string | undefined;
        head_limit?: number | undefined;
        offset?: number | undefined;
        multiline?: boolean | undefined;
    }): Promise<ValidationResult>;
    checkPermissions(input: {
        pattern: string;
        path?: string | undefined;
        glob?: string | undefined;
        output_mode?: "content" | "count" | "files_with_matches" | undefined;
        '-B'?: number | undefined;
        '-A'?: number | undefined;
        '-C'?: number | undefined;
        context?: number | undefined;
        '-n'?: boolean | undefined;
        '-i'?: boolean | undefined;
        type?: string | undefined;
        head_limit?: number | undefined;
        offset?: number | undefined;
        multiline?: boolean | undefined;
    }, context: import("../../Tool.js").ToolUseContext): Promise<PermissionDecision>;
    prompt(): Promise<string>;
    renderToolUseMessage: any;
    renderToolUseErrorMessage: any;
    renderToolResultMessage: any;
    extractSearchText({ mode, content, filenames }: {
        numFiles: number;
        filenames: string[];
        mode?: "content" | "count" | "files_with_matches" | undefined;
        content?: string | undefined;
        numLines?: number | undefined;
        numMatches?: number | undefined;
        appliedLimit?: number | undefined;
        appliedOffset?: number | undefined;
    }): string;
    mapToolResultToToolResultBlockParam({ mode, numFiles, filenames, content, numLines: _numLines, numMatches, appliedLimit, appliedOffset, }: {
        numFiles: number;
        filenames: string[];
        mode?: "content" | "count" | "files_with_matches" | undefined;
        content?: string | undefined;
        numLines?: number | undefined;
        numMatches?: number | undefined;
        appliedLimit?: number | undefined;
        appliedOffset?: number | undefined;
    }, toolUseID: string): {
        tool_use_id: string;
        type: "tool_result";
        content: string;
    };
    call({ pattern, path, glob, type, output_mode, "-B": context_before, "-A": context_after, "-C": context_c, context, "-n": show_line_numbers, "-i": case_insensitive, head_limit, offset, multiline, }: {
        pattern: string;
        path?: string | undefined;
        glob?: string | undefined;
        output_mode?: "content" | "count" | "files_with_matches" | undefined;
        '-B'?: number | undefined;
        '-A'?: number | undefined;
        '-C'?: number | undefined;
        context?: number | undefined;
        '-n'?: boolean | undefined;
        '-i'?: boolean | undefined;
        type?: string | undefined;
        head_limit?: number | undefined;
        offset?: number | undefined;
        multiline?: boolean | undefined;
    }, { abortController, getAppState }: import("../../Tool.js").ToolUseContext): Promise<{
        data: {
            appliedOffset?: number | undefined;
            appliedLimit?: number | undefined;
            mode: "content";
            numFiles: number;
            filenames: never[];
            content: string;
            numLines: number;
        };
    } | {
        data: {
            appliedOffset?: number | undefined;
            appliedLimit?: number | undefined;
            mode: "count";
            numFiles: number;
            filenames: never[];
            content: string;
            numMatches: number;
        };
    } | {
        data: {
            appliedOffset?: number | undefined;
            appliedLimit?: number | undefined;
            mode: "files_with_matches";
            filenames: string[];
            numFiles: number;
        };
    }>;
}, "isEnabled" | "isConcurrencySafe" | "isReadOnly" | "isDestructive" | "checkPermissions" | "toAutoClassifierInput" | "userFacingName"> & {
    isEnabled: () => boolean;
    isConcurrencySafe: () => true;
    isReadOnly: () => true;
    isDestructive: (_input?: unknown) => boolean;
    checkPermissions: (input: {
        pattern: string;
        path?: string | undefined;
        glob?: string | undefined;
        output_mode?: "content" | "count" | "files_with_matches" | undefined;
        '-B'?: number | undefined;
        '-A'?: number | undefined;
        '-C'?: number | undefined;
        context?: number | undefined;
        '-n'?: boolean | undefined;
        '-i'?: boolean | undefined;
        type?: string | undefined;
        head_limit?: number | undefined;
        offset?: number | undefined;
        multiline?: boolean | undefined;
    }, context: import("../../Tool.js").ToolUseContext) => Promise<PermissionDecision>;
    toAutoClassifierInput: (input: {
        pattern: string;
        path?: string | undefined;
        glob?: string | undefined;
        output_mode?: "content" | "count" | "files_with_matches" | undefined;
        '-B'?: number | undefined;
        '-A'?: number | undefined;
        '-C'?: number | undefined;
        context?: number | undefined;
        '-n'?: boolean | undefined;
        '-i'?: boolean | undefined;
        type?: string | undefined;
        head_limit?: number | undefined;
        offset?: number | undefined;
        multiline?: boolean | undefined;
    }) => string;
    userFacingName: () => string;
};
export {};
//# sourceMappingURL=GrepTool.d.ts.map