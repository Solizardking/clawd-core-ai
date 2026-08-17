import { describe, expect, it } from "vitest";
import { CONSTITUTION_MANIFEST, attestOnChainLaws, getManifest, getPromptContext, resolveConstitutionDir } from "./constitution";

describe("constitution service", () => {
    it("resolves an on-disk constitution directory", () => {
        expect(() => resolveConstitutionDir()).not.toThrow();
    });

    it("returns the full manifest in authority order", () => {
        const manifest = getManifest();
        expect(manifest).toEqual(CONSTITUTION_MANIFEST);
        expect(manifest[0].file).toBe("three-laws.md");
        expect(manifest[0].authority).toBe(1);
    });

    it("builds prompt context sorted by authority and respects maxChars", () => {
        const full = getPromptContext({ maxChars: 100_000 });
        expect(full).toContain("## three-laws.md");
        expect(full.indexOf("## three-laws.md")).toBeLessThan(full.indexOf("## SOUL.md"));

        const truncated = getPromptContext({ maxChars: 200 });
        expect(truncated.length).toBeLessThanOrEqual(200);
    });

    it("attests the on-chain laws with a stable sha256 over exact byte content", () => {
        const a = attestOnChainLaws();
        const b = attestOnChainLaws();
        expect(a.file).toBe("three-laws.md");
        expect(a.sha256).toMatch(/^[0-9a-f]{64}$/);
        expect(a.sha256).toBe(b.sha256);
        expect(a.bytes).toBe(Buffer.byteLength(a.laws, "utf8"));
    });
});
