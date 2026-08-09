import { extractSections } from '../utils/docs.js';
const FAMILY_LIMITS = {
    scalar: { summary: 800, standard: 1200, full: 1200 },
    mutationReceipt: { summary: 1000, standard: 1500, full: 1500 },
    record: { summary: 1500, standard: 3000, full: 8000 },
    list: { summary: 2500, standard: 4500, full: 12000 },
    history: { summary: 2500, standard: 4500, full: 12000 },
    document: { summary: 2500, standard: 5000, full: 12000 },
    streamingConfig: { summary: 2500, standard: 5000, full: 12000 },
    catalog: { summary: 2500, standard: 5000, full: 12000 },
};
export function getFamilyLimit(family, detail) {
    return FAMILY_LIMITS[family][detail];
}
export function toPlainText(response) {
    const text = response.content
        ?.filter((item) => item.type === 'text' || item.type === undefined)
        .map((item) => item.text ?? '')
        .join('\n\n')
        .trim();
    if (text) {
        return text;
    }
    if (response.structuredContent !== undefined) {
        return JSON.stringify(response.structuredContent, null, 2);
    }
    return '';
}
export function compactErrorText(text, maxChars = 1200) {
    const withoutMeta = text
        .replace(/^```json[\s\S]*?```\n*/i, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
    return truncateText(withoutMeta, maxChars);
}
export function cleanText(text) {
    return text
        .replace(/\r\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}
export function truncateText(text, limit) {
    if (text.length <= limit) {
        return text;
    }
    const truncated = text.slice(0, limit);
    const boundary = Math.max(truncated.lastIndexOf('\n## '), truncated.lastIndexOf('\n### '), truncated.lastIndexOf('\n---\n'), truncated.lastIndexOf('\n\n'));
    const cut = boundary > limit * 0.55 ? boundary : limit;
    return `${truncated.slice(0, cut).trim()}\n\n[truncated]`;
}
function stripExampleCode(text) {
    const markers = ['**Example Code:**', '**Example:**', '```typescript', '```ts', '```javascript', '```js'];
    let cut = text.length;
    for (const marker of markers) {
        const index = text.indexOf(marker);
        if (index >= 0) {
            cut = Math.min(cut, index);
        }
    }
    return cut === text.length ? text : text.slice(0, cut).trim();
}
function summarizeDocument(text, limit) {
    const headings = Array.from(text.matchAll(/^#{1,3}\s+.+$/gm))
        .map((match) => match[0])
        .slice(0, 5);
    const intro = text
        .split('\n\n')
        .map((part) => part.trim())
        .filter(Boolean)
        .slice(0, 3)
        .join('\n\n');
    const body = headings.length > 0 ? `${headings.join('\n')}\n\n${intro}` : intro || text;
    return truncateText(body, limit);
}
function summarizeListLike(text, limit) {
    const sections = text.split(/\n---\n|\n\n(?=\*\*|\p{Emoji_Presentation}|\p{Emoji}\s)/u);
    const picked = [];
    let current = 0;
    for (const section of sections) {
        const trimmed = section.trim();
        if (!trimmed) {
            continue;
        }
        const nextLength = current + trimmed.length + 2;
        if (picked.length > 0 && nextLength > limit) {
            break;
        }
        picked.push(trimmed);
        current = nextLength;
    }
    const summary = picked.join('\n\n');
    return truncateText(summary || text, limit);
}
export function buildTextVariant(family, detail, text) {
    const limit = getFamilyLimit(family, detail);
    const cleaned = cleanText(text);
    if (!cleaned) {
        return '';
    }
    if (detail === 'full') {
        return truncateText(cleaned, limit);
    }
    switch (family) {
        case 'streamingConfig':
            return truncateText(stripExampleCode(cleaned), limit);
        case 'document':
            return summarizeDocument(stripExampleCode(cleaned), limit);
        case 'list':
        case 'history':
        case 'catalog':
            return summarizeListLike(stripExampleCode(cleaned), limit);
        case 'scalar':
        case 'mutationReceipt':
        case 'record':
        default:
            return truncateText(stripExampleCode(cleaned), limit);
    }
}
export function estimateRenderedSize(text) {
    return cleanText(text).length;
}
export function collectSectionHints(text) {
    return Array.from(text.matchAll(/^#{1,3}\s+(.+)$/gm))
        .map((match) => match[1].trim())
        .filter(Boolean)
        .slice(0, 12);
}
export function applySectionSelection(text, section) {
    if (!section) {
        return text;
    }
    const extracted = extractSections(text, section, { includeLooseMatches: true });
    if (extracted) {
        return extracted;
    }
    return `No section matching "${section}" was found.\n\n${text}`;
}
export function applyItemSelection(text, item) {
    if (item === undefined) {
        return text;
    }
    const sections = text
        .split(/\n---\n|\n\n(?=\*\*|\p{Emoji_Presentation}|\p{Emoji}\s)/u)
        .map((part) => part.trim())
        .filter(Boolean);
    const index = item - 1;
    if (index < 0 || index >= sections.length) {
        return `Item ${item} was not found.\n\n${text}`;
    }
    return sections[index];
}
export function applyRangeSelection(text, range) {
    if (!range) {
        return text;
    }
    const match = range.match(/^(\d+):(\d+)$/);
    if (!match) {
        return `Invalid range "${range}". Expected "start:end".\n\n${text}`;
    }
    const start = Number(match[1]);
    const end = Number(match[2]);
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end <= start) {
        return `Invalid range "${range}". Expected "start:end" with start >= 0 and end > start.\n\n${text}`;
    }
    return text.slice(start, end);
}
export function mcpText(text, meta) {
    return {
        content: [{ type: 'text', text }],
        ...(meta === undefined ? {} : { _meta: meta }),
    };
}
export function mcpErrorCompact(text, meta) {
    return {
        content: [{ type: 'text', text }],
        isError: true,
        ...(meta === undefined ? {} : { _meta: meta }),
    };
}
export function mcpResultHandle(summary, resultId, availableExpansions, meta) {
    const lines = [summary, '', `resultId: ${resultId}`];
    if (availableExpansions.length > 0) {
        lines.push(`expand: ${availableExpansions.join(', ')}`);
    }
    return mcpText(lines.join('\n'), meta);
}
