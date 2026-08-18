/**
 * Integration checks for the tailclawd package as registered in core-ai.
 * Drives real package.json scripts metadata and shipped source modules.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const src = join(root, "src");

describe("tailclawd package metadata", () => {
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

  it('name is "tailclawd"', () => {
    assert.equal(pkg.name, "tailclawd");
  });

  it("scripts.dev and scripts.start target src/index.ts", () => {
    assert.ok(pkg.scripts?.dev, "scripts.dev missing");
    assert.ok(pkg.scripts?.start, "scripts.start missing");
    assert.match(pkg.scripts.dev, /src\/index\.ts/);
    assert.match(pkg.scripts.start, /src\/index\.ts/);
  });

  it("declares iii-sdk, qrcode, and tsx", () => {
    assert.ok(pkg.dependencies?.["iii-sdk"], "iii-sdk dependency required");
    assert.ok(pkg.dependencies?.qrcode, "qrcode dependency required");
    assert.ok(pkg.devDependencies?.tsx, "tsx devDependency required");
  });
});

describe("tailclawd README", () => {
  const readmePath = join(root, "README.md");

  it("exists and documents purpose, install, run, and env", () => {
    assert.ok(existsSync(readmePath), "README.md must exist");
    const text = readFileSync(readmePath, "utf8");
    for (const needle of [
      "III_BRIDGE_URL",
      "TAILCLAWD_TOKEN",
      "TAILCLAUDE_TOKEN",
      "3110",
      "3111",
      "npm install",
      "npm run dev",
      "npm start",
      "Tailscale",
    ]) {
      assert.ok(text.includes(needle), `README missing: ${needle}`);
    }
  });
});

describe("tailclawd shipped source layout", () => {
  it("keeps entry, proxy, ui, and handlers", () => {
    for (const rel of [
      "index.ts",
      "proxy.ts",
      "ui.html",
      "iii.ts",
      "handlers/setup.ts",
      "handlers/health.ts",
    ]) {
      assert.ok(existsSync(join(src, rel)), `missing ${rel}`);
    }
  });

  it("proxy source uses ports 3110/3111 and token envs", () => {
    const proxy = readFileSync(join(src, "proxy.ts"), "utf8");
    assert.match(proxy, /const III_PORT = 3111/);
    assert.match(proxy, /const PROXY_PORT = 3110/);
    assert.match(proxy, /TAILCLAWD_TOKEN/);
    assert.match(proxy, /TAILCLAUDE_TOKEN/);
  });

  it("iii source defaults III_BRIDGE_URL", () => {
    const iii = readFileSync(join(src, "iii.ts"), "utf8");
    assert.match(iii, /III_BRIDGE_URL/);
    assert.match(iii, /ws:\/\/localhost:49134/);
  });
});

describe("tailclawd shipped iii module", () => {
  it("exports getEngineConnectionState that returns a string state", async () => {
    const mod = await import(pathToFileURL(join(src, "iii.ts")).href);
    assert.equal(typeof mod.getEngineConnectionState, "function");
    const state = mod.getEngineConnectionState();
    assert.equal(typeof state, "string");
    assert.ok(state.length > 0, "connection state should be non-empty");
  });
});
