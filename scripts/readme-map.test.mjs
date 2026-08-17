/**
 * README map test — drives the shipped root README.md and the real
 * package.json files on disk. Fails if the official map lies about
 * paths, package names, or leftover/empty items.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const README = readFileSync(join(ROOT, "README.md"), "utf8");

const OBJECTIVE_DIRS = [
  ".agents",
  ".claude-plugin",
  ".clawd-plugin",
  ".github",
  "clawd-agents",
  "clawd-code",
  "clawd-connectors",
  "clawd-core",
  "clawd-mcp",
  "clawd-plugin",
  "clawd-router",
  "clawd-skills",
  "clawd-tui",
  "clawd-wallet",
  "constitution",
  "docs",
  "knowledge",
  "mcp-server",
  "outputs",
  "scripts",
  "tailclawd",
  "v3",
  "zk-primitives",
];

const OBJECTIVE_FILES = [
  ".env.example",
  ".env.local",
  ".gitignore",
  ".mcp.json",
  ".npmrc",
  "agent.md",
  "AGENTS.md",
  "biome.json",
  "bun.lock",
  "bunfig.toml",
  "CLAUDE.md",
  "claw",
  "CLAWD.md",
  "CONTRIBUTING.md",
  "Dockerfile",
  "gitpretty-apply.sh",
  "glama.json",
  "LICENSE",
  "package-lock.json",
  "package.json",
  "README.md",
  "SECURITY.md",
  "server.json",
  "Skill.md",
  "tsconfig.json",
  "vercel.json",
  "versions.json",
];

const PUBLIC_PACKAGES = [
  { rel: "clawd-mcp/package.json", name: "@onchainai/clawd-mcp" },
  { rel: "clawd-plugin/package.json", name: "@onchainai/clawd-plugin" },
  { rel: "clawd-core/package.json", name: "@onchainai/clawd-core" },
  { rel: "clawd-skills/package.json", name: "@onchainai/clawd-skills" },
  { rel: "clawd-code/package.json", name: "@onchainai/clawd-code" },
  { rel: "clawd-connectors/package.json", name: "@onchainai/clawd-connectors" },
  { rel: "clawd-router/package.json", name: "@onchainai/clawdrouter" },
  { rel: "clawd-tui/package.json", name: "@onchainai/clawd-tui" },
  { rel: "mcp-server/package.json", name: "@onchainai/mcp-server" },
  { rel: "v3/package.json", name: "@onchainai/v3" },
  { rel: "clawd-agents/clawd-grok/package.json", name: "@onchainai/clawd-grok" },
];

const PRIVATE_PACKAGES = [
  { rel: "package.json", name: "@onchainai/core-ai" },
  { rel: "tailclawd/package.json", name: "tailclawd" },
  { rel: "clawd-agents/clawd-perps-agent/package.json", name: "@solanaclawd/clawd-agents-perps" },
];

function pkg(rel) {
  return JSON.parse(readFileSync(join(ROOT, rel), "utf8"));
}

describe("README official map", () => {
  it("has a lobster/Clawd banner and a mermaid tree", () => {
    assert.match(README, /clawd-banner\.svg|🦞|CLAWD CORE AI/);
    assert.match(README, /```mermaid/);
    assert.ok(existsSync(join(ROOT, "docs/clawd-banner.svg")), "animated banner SVG must exist");
  });

  it("names every OBJECTIVE directory", () => {
    for (const dir of OBJECTIVE_DIRS) {
      assert.ok(README.includes(dir), `README missing directory ${dir}`);
      assert.ok(existsSync(join(ROOT, dir)), `on-disk missing ${dir}`);
    }
  });

  it("names every OBJECTIVE root file", () => {
    for (const file of OBJECTIVE_FILES) {
      assert.ok(README.includes(file), `README missing file ${file}`);
      if (file === ".env.local") {
        // gitignored; presence on disk is optional
        continue;
      }
      assert.ok(existsSync(join(ROOT, file)), `on-disk missing ${file}`);
    }
  });

  it("uses on-disk package.json names for every shipping package", () => {
    for (const { rel, name } of [...PUBLIC_PACKAGES, ...PRIVATE_PACKAGES]) {
      const onDisk = pkg(rel);
      assert.equal(onDisk.name, name, `${rel} name drifted`);
      assert.ok(README.includes(name), `README missing package name ${name}`);
    }
    const mcp = pkg("clawd-mcp/package.json");
    assert.equal(mcp.bin?.["helius-mcp"], "dist/index.js");
    assert.match(README, /bin.*helius-mcp|`helius-mcp`/);
  });

  it("does not invent missing products or parent-monorepo links", () => {
    assert.doesNotMatch(README, /\]\(\.\.\/clawd-code\)/);
    assert.doesNotMatch(README, /\]\(\.\.\/clawd-connectors\)/);
    assert.doesNotMatch(README, /\]\(\.\/clawd-grok\)/);
    assert.doesNotMatch(README, /\]\(\.\/clawdrouter\)/);
    assert.doesNotMatch(README, /\]\(\.\/clawd-perps-agent\)/);
    assert.match(README, /no.*helius-cli|Not present[\s\S]*helius-cli/i);
    assert.match(README, /helius-cursor/);
    assert.match(README, /zk-primitives[\s\S]{0,80}empty|Empty placeholder/i);
    assert.match(README, /clawd-agents[\s\S]{0,40}Filled|not empty/i);
    assert.doesNotMatch(README, /character\/` are currently empty/);
    const zkKids = existsSync(join(ROOT, "zk-primitives"))
      ? readdirSync(join(ROOT, "zk-primitives"))
      : [];
    assert.equal(zkKids.length, 0, "zk-primitives is supposed to be empty");
    assert.ok(!existsSync(join(ROOT, "character")));
    assert.ok(!existsSync(join(ROOT, "helius-cli")));
    assert.ok(!existsSync(join(ROOT, "helius-cursor")));
    assert.ok(!existsSync(join(ROOT, "clawd-wallet/package.json")));
  });

  it("relative markdown links inside README resolve", () => {
    const linkRe = /\]\((\.\/[^)#\s]+)(?:#[^)]*)?\)/g;
    let m;
    const missing = [];
    while ((m = linkRe.exec(README))) {
      const rel = decodeURIComponent(m[1].replace(/^\.\//, ""));
      if (!existsSync(join(ROOT, rel))) missing.push(rel);
    }
    assert.deepEqual(missing, [], `broken README links: ${missing.join(", ")}`);
  });

  it("labels leftover marketplace sources as non-working", () => {
    assert.match(README, /core-ai\/clawd-plugin/);
    assert.match(README, /helius-plugin/);
    assert.match(README, /do \*\*not\*\* match this checkout|do not exist here/i);
  });

  it("does not claim clawd-skills/helius* sources that are missing", () => {
    assert.ok(!existsSync(join(ROOT, "clawd-skills/helius")));
    assert.ok(existsSync(join(ROOT, ".agents/skills/helius")));
    assert.doesNotMatch(README, /\]\(\.\/clawd-skills\/helius\)/);
    assert.match(README, /\.agents\/skills\/helius/);
    assert.match(README, /those source dirs are missing/i);
  });
});

describe("on-disk shipping facts the README depends on", () => {
  it("clawd-mcp bin is helius-mcp and publishConfig is public", () => {
    const mcp = pkg("clawd-mcp/package.json");
    assert.equal(mcp.publishConfig?.access, "public");
    assert.equal(mcp.version, "1.3.0");
  });

  it("private packages stay private", () => {
    assert.equal(pkg("package.json").private, true);
    assert.equal(pkg("tailclawd/package.json").private, true);
    assert.equal(pkg("clawd-agents/clawd-perps-agent/package.json").private, true);
  });

  it("clawd-agents contains rust + grok + perps", () => {
    const kids = readdirSync(join(ROOT, "clawd-agents"));
    assert.ok(kids.includes("agent"));
    assert.ok(kids.includes("clawd-grok"));
    assert.ok(kids.includes("clawd-perps-agent"));
    assert.ok(statSync(join(ROOT, "clawd-agents/agent/Cargo.toml")).isFile());
  });
});
