import type { StoredResult } from './types.js';
export declare function putStoredResult(input: Omit<StoredResult, 'resultId' | 'createdAt' | 'expiresAt' | 'payloadSize'>): StoredResult;
export declare function getStoredResult(resultId: string, ownerSessionKey: string): StoredResult | null;
export declare function clearStoredResults(): void;
export declare function getStoredResultStats(): {
    count: number;
    totalPayloadBytes: number;
};
