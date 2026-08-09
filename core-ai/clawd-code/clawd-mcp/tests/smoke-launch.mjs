/**
 * Durable smoke test for the official Clawd/Helius MCP (helius-mcp).
 * Drives the real shipped entry at dist/index.js over stdio MCP JSON-RPC.
 * Runs twice in-process to confirm consistent startup.
 */
import { spawn } from "node:child_process";
import { createInterface } from "node:readline";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const entry = join(root, "dist", "index.js");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

assert.equal(pkg.name, "helius-mcp");
assert.equal(pkg.main, "dist/index.js");
assert.ok(existsSync(entry), `missing ${entry}`);
assert.ok(existsSync(join(root, "dist", "tools", "index.js")));
assert.ok(existsSync(join(root, "system-prompts", "helius", "full.md")));

const EXPECTED_TOOLS = [
  "expandResult",
  "heliusAccount",
  "heliusAsset",
  "heliusChain",
  "heliusCompression",
  "heliusKnowledge",
  "heliusStreaming",
  "heliusTransaction",
  "heliusWallet",
  "heliusWrite",
];

async function launchOnce(label) {
  const child = spawn(process.execPath, [entry], {
    cwd: root,
    env: {
      ...process.env,
      HELIUS_API_KEY: process.env.HELIUS_API_KEY || "smoke-test-key",
    },
    stdio: ["pipe", "pipe", "pipe"],
  });

  let stderr = "";
  child.stderr.on("data", (d) => {
    stderr += d.toString();
  });

  const rl = createInterface({ input: child.stdout });
  const pending = new Map();
  let nextId = 1;

  function request(method, params) {
    const id = nextId++;
    child.stdin.write(JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n");
    return new Promise((resolve, reject) => {
      const t = setTimeout(
        () => reject(new Error(`${label}: timeout on ${method}; stderr=${stderr}`)),
        10000
      );
      pending.set(id, { resolve, reject, t });
    });
  }

  rl.on("line", (line) => {
    if (!line.trim()) return;
    let msg;
    try {
      msg = JSON.parse(line);
    } catch {
      return;
    }
    if (msg.id != null && pending.has(msg.id)) {
      const { resolve, reject, t } = pending.get(msg.id);
      clearTimeout(t);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(JSON.stringify(msg.error)));
      else resolve(msg.result);
    }
  });

  try {
    await new Promise((r) => setTimeout(r, 150));
    if (child.exitCode !== null) {
      throw new Error(`${label}: exited early code=${child.exitCode} stderr=${stderr}`);
    }

    const init = await request("initialize", {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "clawd-mcp-smoke", version: "0.0.1" },
    });
    assert.equal(init.serverInfo?.name, "helius-mcp");
    assert.equal(init.serverInfo?.version, pkg.version);

    child.stdin.write(
      JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }) + "\n"
    );

    const tools = await request("tools/list", {});
    const names = (tools?.tools || []).map((t) => t.name).sort();
    assert.deepEqual(names, [...EXPECTED_TOOLS].sort());
    console.log(`${label}: SUCCESS name=${init.serverInfo.name} tools=${names.length}`);
  } finally {
    child.kill("SIGTERM");
    await new Promise((resolve) => {
      child.once("exit", resolve);
      setTimeout(() => {
        child.kill("SIGKILL");
        resolve();
      }, 1500);
    });
  }
}

await launchOnce("run-1");
await launchOnce("run-2");
console.log("ALL_SMOKE_OK");
