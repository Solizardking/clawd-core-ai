import { randomUUID } from 'node:crypto';
const MAX_RESULTS = 10;
const MAX_TOTAL_PAYLOAD_BYTES = 250 * 1024;
const RESULT_TTL_MS = 5 * 60 * 1000;
const results = new Map();
function estimateBytes(value) {
    return Buffer.byteLength(JSON.stringify(value), 'utf8');
}
function sweepExpired(now = Date.now()) {
    for (const [resultId, result] of results) {
        if (result.expiresAt <= now) {
            results.delete(resultId);
        }
    }
}
function currentTotalBytes() {
    let total = 0;
    for (const result of results.values()) {
        total += result.payloadSize;
    }
    return total;
}
function touch(resultId, result) {
    results.delete(resultId);
    results.set(resultId, result);
}
function evictToFit() {
    sweepExpired();
    while (results.size > MAX_RESULTS || currentTotalBytes() > MAX_TOTAL_PAYLOAD_BYTES) {
        const oldest = results.keys().next().value;
        if (!oldest) {
            break;
        }
        results.delete(oldest);
    }
}
export function putStoredResult(input) {
    const createdAt = Date.now();
    const payloadSize = estimateBytes(input.payload);
    const stored = {
        ...input,
        resultId: randomUUID(),
        createdAt,
        expiresAt: createdAt + RESULT_TTL_MS,
        payloadSize,
    };
    results.set(stored.resultId, stored);
    evictToFit();
    return stored;
}
export function getStoredResult(resultId, ownerSessionKey) {
    sweepExpired();
    const result = results.get(resultId);
    if (!result) {
        return null;
    }
    if (result.ownerSessionKey !== ownerSessionKey) {
        return null;
    }
    touch(resultId, result);
    return result;
}
export function clearStoredResults() {
    results.clear();
}
export function getStoredResultStats() {
    sweepExpired();
    return {
        count: results.size,
        totalPayloadBytes: currentTotalBytes(),
    };
}
