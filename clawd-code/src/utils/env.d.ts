import { isRunningWithBun } from './bundledMode.js';
type Platform = 'win32' | 'darwin' | 'linux';
export declare const getGlobalClaudeFile: (() => string) & import("lodash").MemoizedFunction;
/**
 * Checks if we're running via Conductor
 * @returns true if running via Conductor, false otherwise
 */
declare function isConductor(): boolean;
export declare const JETBRAINS_IDES: string[];
/**
 * Detects the deployment environment/platform based on environment variables
 * @returns The deployment platform name, or 'unknown' if not detected
 */
export declare const detectDeploymentEnvironment: (() => string) & import("lodash").MemoizedFunction;
declare function isSSHSession(): boolean;
export declare const env: {
    hasInternetAccess: (() => Promise<boolean>) & import("lodash").MemoizedFunction;
    isCI: boolean;
    platform: Platform;
    arch: NodeJS.Architecture;
    nodeVersion: string;
    terminal: string | null;
    isSSH: typeof isSSHSession;
    getPackageManagers: (() => Promise<string[]>) & import("lodash").MemoizedFunction;
    getRuntimes: (() => Promise<string[]>) & import("lodash").MemoizedFunction;
    isRunningWithBun: typeof isRunningWithBun & import("lodash").MemoizedFunction;
    isWslEnvironment: (() => boolean) & import("lodash").MemoizedFunction;
    isNpmFromWindowsPath: (() => boolean) & import("lodash").MemoizedFunction;
    isConductor: typeof isConductor;
    detectDeploymentEnvironment: (() => string) & import("lodash").MemoizedFunction;
};
/**
 * Returns the host platform for analytics reporting.
 * If CLAUDE_CODE_HOST_PLATFORM is set to a valid platform value, that overrides
 * the detected platform. This is useful for container/remote environments where
 * process.platform reports the container OS but the actual host platform differs.
 */
export declare function getHostPlatformForAnalytics(): Platform;
export {};
//# sourceMappingURL=env.d.ts.map