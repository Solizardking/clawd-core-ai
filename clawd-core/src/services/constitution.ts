import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * One entry in the Clawd Constitution bundle, in descending authority order.
 * Lower `authority` number = higher precedence (1 is highest).
 */
export type ConstitutionEntry = {
    file: string;
    role: string;
    authority: number;
};

/**
 * The canonical manifest — mirrors the table in `constitution/README.md`.
 * Authority order: on-chain laws > CONSTITUTION.md / six-laws.md > spawn harness > identity > soul > program/strategy.
 */
export const CONSTITUTION_MANIFEST: readonly ConstitutionEntry[] = [
    { file: "three-laws.md", role: "Immutable on-chain execution laws I-III", authority: 1 },
    { file: "six-laws.md", role: "Full six-law harness (I-VI)", authority: 2 },
    { file: "CONSTITUTION.md", role: "Highest interpretive authority", authority: 2 },
    { file: "CLAWD.md", role: "Spawn harness context", authority: 3 },
    { file: "IDENTITY.md", role: "Sovereign identity document", authority: 3 },
    { file: "SOUL.md", role: "Character, philosophy, trading spirit", authority: 4 },
    { file: "program.md", role: "Research-loop program", authority: 5 },
    { file: "strategy.md", role: "Active strategy parameters", authority: 5 },
] as const;

const currentDir = typeof __dirname !== "undefined" ? __dirname : dirname(fileURLToPath(import.meta.url));

/**
 * Resolves the on-disk constitution directory.
 *
 * Resolution order:
 * 1. `CLAWD_CONSTITUTION_DIR` env var — explicit override, e.g. for testing or a custom bundle.
 * 2. Walking up from this module's own location, checking 1-3 parent levels for either the bundled
 *    copy (`clawd-core/constitution/`, published via `files` in package.json) or the canonical monorepo
 *    source (`core-ai/constitution/`).
 *
 * Multiple depths are checked because `currentDir` differs depending on how this module is loaded:
 * unbundled from `src/services/` (tests, ts-node) vs. tsup's single-file bundle output at `dist/`.
 * Both copies currently have identical content — only depth differs between them, not the result.
 *
 * Throws if none of the candidates exist, rather than silently returning an empty manifest.
 */
export function resolveConstitutionDir(): string {
    const candidates = [
        process.env.CLAWD_CONSTITUTION_DIR,
        join(currentDir, "constitution"),
        join(currentDir, "..", "constitution"),
        join(currentDir, "..", "..", "constitution"),
        join(currentDir, "..", "..", "..", "constitution"),
    ].filter((p): p is string => Boolean(p));

    for (const candidate of candidates) {
        if (existsSync(join(candidate, "three-laws.md"))) return candidate;
    }

    throw new Error(
        `Could not resolve the Clawd Constitution directory. Checked:\n${candidates.map((c) => `  - ${c}`).join("\n")}\n` +
            "Set CLAWD_CONSTITUTION_DIR to override, or ensure clawd-core was built with its bundled constitution/ copy.",
    );
}

function readEntry(dir: string, entry: ConstitutionEntry): string {
    return readFileSync(join(dir, entry.file), "utf8");
}

/**
 * Returns the constitution manifest — file, role, and authority rank — without reading file contents.
 */
export function getManifest(): readonly ConstitutionEntry[] {
    return CONSTITUTION_MANIFEST;
}

/**
 * Assembles a prompt-injectable context string from the constitution bundle, highest authority first,
 * truncated to `maxChars`. Each section is preceded by a `## <file>` header so the source is traceable.
 */
export function getPromptContext(options: { maxChars?: number } = {}): string {
    const maxChars = options.maxChars ?? 6000;
    const dir = resolveConstitutionDir();
    const sorted = [...CONSTITUTION_MANIFEST].sort((a, b) => a.authority - b.authority);

    let out = "";
    for (const entry of sorted) {
        const section = `## ${entry.file}\n\n${readEntry(dir, entry)}\n\n`;
        if (out.length + section.length > maxChars) {
            const remaining = maxChars - out.length;
            if (remaining > 0) out += section.slice(0, remaining);
            break;
        }
        out += section;
    }
    return out.trimEnd();
}

export type OnChainLawsAttestation = {
    file: string;
    sha256: string;
    bytes: number;
    laws: string;
};

/**
 * Reads `three-laws.md` — the immutable, highest-authority document — and returns a SHA-256 attestation
 * of its exact byte content, so callers can verify the on-chain laws in a running agent match the
 * canonical text without trusting the process that loaded them.
 */
export function attestOnChainLaws(): OnChainLawsAttestation {
    const dir = resolveConstitutionDir();
    const entry = CONSTITUTION_MANIFEST.find((e) => e.file === "three-laws.md");
    if (!entry) throw new Error("three-laws.md missing from CONSTITUTION_MANIFEST");

    const laws = readEntry(dir, entry);
    const sha256 = createHash("sha256").update(laws, "utf8").digest("hex");

    return { file: entry.file, sha256, bytes: Buffer.byteLength(laws, "utf8"), laws };
}
