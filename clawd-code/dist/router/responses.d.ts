import type { DetailLevel, ResponseFamily } from './types.js';
export type RouterResponse = {
    content: Array<{
        type: 'text';
        text: string;
    }>;
    isError?: boolean;
    _meta?: Record<string, unknown>;
};
export declare function getFamilyLimit(family: ResponseFamily, detail: DetailLevel): number;
export declare function toPlainText(response: {
    content?: Array<{
        type?: string;
        text?: string;
    }>;
    structuredContent?: unknown;
}): string;
export declare function compactErrorText(text: string, maxChars?: number): string;
export declare function cleanText(text: string): string;
export declare function truncateText(text: string, limit: number): string;
export declare function buildTextVariant(family: ResponseFamily, detail: DetailLevel, text: string): string;
export declare function estimateRenderedSize(text: string): number;
export declare function collectSectionHints(text: string): string[];
export declare function applySectionSelection(text: string, section?: string): string;
export declare function applyItemSelection(text: string, item?: number): string;
export declare function applyRangeSelection(text: string, range?: string): string;
export declare function mcpText(text: string, meta?: Record<string, unknown>): RouterResponse;
export declare function mcpErrorCompact(text: string, meta?: Record<string, unknown>): RouterResponse;
export declare function mcpResultHandle(summary: string, resultId: string, availableExpansions: string[], meta?: Record<string, unknown>): RouterResponse;
