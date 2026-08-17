export type Platform = 'macos' | 'windows' | 'wsl' | 'linux' | 'unknown';
export declare const SUPPORTED_PLATFORMS: Platform[];
export declare const getPlatform: (() => Platform) & import("lodash").MemoizedFunction;
export declare const getWslVersion: (() => string | undefined) & import("lodash").MemoizedFunction;
export type LinuxDistroInfo = {
    linuxDistroId?: string;
    linuxDistroVersion?: string;
    linuxKernel?: string;
};
export declare const getLinuxDistroInfo: (() => Promise<LinuxDistroInfo | undefined>) & import("lodash").MemoizedFunction;
export declare function detectVcs(dir?: string): Promise<string[]>;
//# sourceMappingURL=platform.d.ts.map