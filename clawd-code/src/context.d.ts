export declare function getSystemPromptInjection(): string | null;
export declare function setSystemPromptInjection(value: string | null): void;
export declare const getGitStatus: (() => Promise<string | null>) & import("lodash").MemoizedFunction;
/**
 * This context is prepended to each conversation, and cached for the duration of the conversation.
 */
export declare const getSystemContext: (() => Promise<{
    [k: string]: string;
}>) & import("lodash").MemoizedFunction;
/**
 * This context is prepended to each conversation, and cached for the duration of the conversation.
 */
export declare const getUserContext: (() => Promise<{
    [k: string]: string;
}>) & import("lodash").MemoizedFunction;
//# sourceMappingURL=context.d.ts.map