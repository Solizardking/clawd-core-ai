import { type DebugFilter } from './debugFilter.js';
export type DebugLogLevel = 'verbose' | 'debug' | 'info' | 'warn' | 'error';
/**
 * Minimum log level to include in debug output. Defaults to 'debug', which
 * filters out 'verbose' messages. Set CLAUDE_CODE_DEBUG_LOG_LEVEL=verbose to
 * include high-volume diagnostics (e.g. full statusLine command, shell, cwd,
 * stdout/stderr) that would otherwise drown out useful debug output.
 */
export declare const getMinDebugLogLevel: (() => DebugLogLevel) & import("lodash").MemoizedFunction;
export declare const isDebugMode: (() => boolean) & import("lodash").MemoizedFunction;
/**
 * Enables debug logging mid-session (e.g. via /debug). Non-ants don't write
 * debug logs by default, so this lets them start capturing without restarting
 * with --debug. Returns true if logging was already active.
 */
export declare function enableDebugLogging(): boolean;
export declare const getDebugFilter: (() => DebugFilter | null) & import("lodash").MemoizedFunction;
export declare const isDebugToStdErr: (() => boolean) & import("lodash").MemoizedFunction;
export declare const getDebugFilePath: (() => string | null) & import("lodash").MemoizedFunction;
export declare function setHasFormattedOutput(value: boolean): void;
export declare function getHasFormattedOutput(): boolean;
export declare function flushDebugLogs(): Promise<void>;
export declare function logForDebugging(message: string, { level }?: {
    level: DebugLogLevel;
}): void;
export declare function getDebugLogPath(): string;
/**
 * Logs errors for Ants only, always visible in production.
 */
export declare function logAntError(context: string, error: unknown): void;
//# sourceMappingURL=debug.d.ts.map