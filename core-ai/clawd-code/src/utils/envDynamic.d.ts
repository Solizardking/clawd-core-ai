declare function getIsBubblewrapSandbox(): boolean;
/**
 * Checks if the system is using MUSL libc instead of glibc.
 * In native linux builds, this is statically known at compile time via IS_LIBC_MUSL/IS_LIBC_GLIBC flags.
 * In node (unbundled), both flags are false and we fall back to a runtime async stat check
 * whose result is cached at module load. If the cache isn't populated yet, returns false.
 */
declare function isMuslEnvironment(): boolean;
export declare function getTerminalWithJetBrainsDetectionAsync(): Promise<string | null>;
export declare function getTerminalWithJetBrainsDetection(): string | null;
/**
 * Initialize JetBrains IDE detection asynchronously.
 * Call this early in app initialization to populate the cache.
 * After this resolves, getTerminalWithJetBrainsDetection() will return accurate results.
 */
export declare function initJetBrainsDetection(): Promise<void>;
export declare const envDynamic: {
    terminal: string | null;
    getIsDocker: (() => Promise<boolean>) & import("lodash").MemoizedFunction;
    getIsBubblewrapSandbox: typeof getIsBubblewrapSandbox;
    isMuslEnvironment: typeof isMuslEnvironment;
    getTerminalWithJetBrainsDetectionAsync: typeof getTerminalWithJetBrainsDetectionAsync;
    initJetBrainsDetection: typeof initJetBrainsDetection;
    hasInternetAccess: (() => Promise<boolean>) & import("lodash").MemoizedFunction;
    isCI: boolean;
    platform: "darwin" | "linux" | "win32";
    arch: NodeJS.Architecture;
    nodeVersion: string;
    isSSH: () => boolean;
    getPackageManagers: (() => Promise<string[]>) & import("lodash").MemoizedFunction;
    getRuntimes: (() => Promise<string[]>) & import("lodash").MemoizedFunction;
    isRunningWithBun: typeof import("./bundledMode.js").isRunningWithBun & import("lodash").MemoizedFunction;
    isWslEnvironment: (() => boolean) & import("lodash").MemoizedFunction;
    isNpmFromWindowsPath: (() => boolean) & import("lodash").MemoizedFunction;
    isConductor: () => boolean;
    detectDeploymentEnvironment: (() => string) & import("lodash").MemoizedFunction;
};
export {};
//# sourceMappingURL=envDynamic.d.ts.map