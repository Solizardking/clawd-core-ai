import type { ToolUseContext } from '../../Tool.js';
import { type ToolUseDiff } from '../../utils/gitDiff.js';
import type { PermissionDecision } from '../../utils/permissions/PermissionResult.js';
import { type FileEditInput, type FileEditOutput } from './types.js';
export declare const FileEditTool: Omit<{
    name: string;
    searchHint: string;
    maxResultSizeChars: number;
    strict: true;
    description(): Promise<string>;
    prompt(): Promise<string>;
    userFacingName: any;
    getToolUseSummary: any;
    getActivityDescription(input: Partial<{
        file_path: string;
        old_string: string;
        new_string: string;
        replace_all?: boolean | undefined;
    }> | undefined): string;
    readonly inputSchema: import("zod/v4").ZodObject<{
        file_path: import("zod/v4").ZodString;
        old_string: import("zod/v4").ZodString;
        new_string: import("zod/v4").ZodString;
        replace_all: import("zod/v4").ZodPreprocess<import("zod/v4").ZodOptional<import("zod/v4").ZodDefault<import("zod/v4").ZodBoolean>>>;
    }, import("zod/v4/core").$strict>;
    readonly outputSchema: import("zod/v4").ZodObject<{
        filePath: import("zod/v4").ZodString;
        oldString: import("zod/v4").ZodString;
        newString: import("zod/v4").ZodString;
        originalFile: import("zod/v4").ZodString;
        structuredPatch: import("zod/v4").ZodArray<import("zod/v4").ZodObject<{
            oldStart: import("zod/v4").ZodNumber;
            oldLines: import("zod/v4").ZodNumber;
            newStart: import("zod/v4").ZodNumber;
            newLines: import("zod/v4").ZodNumber;
            lines: import("zod/v4").ZodArray<import("zod/v4").ZodString>;
        }, import("zod/v4/core").$strip>>;
        userModified: import("zod/v4").ZodBoolean;
        replaceAll: import("zod/v4").ZodBoolean;
        gitDiff: import("zod/v4").ZodOptional<import("zod/v4").ZodObject<{
            filename: import("zod/v4").ZodString;
            status: import("zod/v4").ZodEnum<{
                modified: "modified";
                added: "added";
            }>;
            additions: import("zod/v4").ZodNumber;
            deletions: import("zod/v4").ZodNumber;
            changes: import("zod/v4").ZodNumber;
            patch: import("zod/v4").ZodString;
            repository: import("zod/v4").ZodOptional<import("zod/v4").ZodNullable<import("zod/v4").ZodString>>;
        }, import("zod/v4/core").$strip>>;
    }, import("zod/v4/core").$strip>;
    toAutoClassifierInput(input: {
        file_path: string;
        old_string: string;
        new_string: string;
        replace_all?: boolean | undefined;
    }): string;
    getPath(input: {
        file_path: string;
        old_string: string;
        new_string: string;
        replace_all?: boolean | undefined;
    }): string;
    backfillObservableInput(input: Record<string, unknown>): void;
    preparePermissionMatcher({ file_path }: {
        file_path: string;
        old_string: string;
        new_string: string;
        replace_all?: boolean | undefined;
    }): Promise<(pattern: string) => boolean>;
    checkPermissions(input: {
        file_path: string;
        old_string: string;
        new_string: string;
        replace_all?: boolean | undefined;
    }, context: ToolUseContext): Promise<PermissionDecision>;
    renderToolUseMessage: any;
    renderToolResultMessage: any;
    renderToolUseRejectedMessage: any;
    renderToolUseErrorMessage: any;
    validateInput(input: FileEditInput, toolUseContext: ToolUseContext): Promise<any>;
    inputsEquivalent(input1: {
        file_path: string;
        old_string: string;
        new_string: string;
        replace_all?: boolean | undefined;
    }, input2: {
        file_path: string;
        old_string: string;
        new_string: string;
        replace_all?: boolean | undefined;
    }): boolean;
    call(input: FileEditInput, { readFileState, userModified, updateFileHistoryState, dynamicSkillDirTriggers, }: ToolUseContext, _: CanUseToolFn, parentMessage: import("../../types/message.js").AssistantMessage): Promise<{
        data: {
            gitDiff?: ToolUseDiff | undefined;
            filePath: string;
            oldString: string;
            newString: string;
            originalFile: string;
            structuredPatch: StructuredPatchHunk[];
            userModified: boolean;
            replaceAll: boolean;
        };
    }>;
    mapToolResultToToolResultBlockParam(data: FileEditOutput, toolUseID: string): {
        tool_use_id: string;
        type: "tool_result";
        content: string;
    };
}, "isEnabled" | "isConcurrencySafe" | "isReadOnly" | "isDestructive" | "checkPermissions" | "toAutoClassifierInput" | "userFacingName"> & {
    isEnabled: () => boolean;
    isConcurrencySafe: (_input?: unknown) => boolean;
    isReadOnly: (_input?: unknown) => boolean;
    isDestructive: (_input?: unknown) => boolean;
    checkPermissions: (input: {
        file_path: string;
        old_string: string;
        new_string: string;
        replace_all?: boolean | undefined;
    }, context: ToolUseContext) => Promise<PermissionDecision>;
    toAutoClassifierInput: (input: {
        file_path: string;
        old_string: string;
        new_string: string;
        replace_all?: boolean | undefined;
    }) => string;
    userFacingName: any;
};
//# sourceMappingURL=FileEditTool.d.ts.map