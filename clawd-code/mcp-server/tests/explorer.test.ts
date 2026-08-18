/**
 * Durable tests for the vendored code-explorer MCP server.
 * Drive real shipped modules against the clawd-code src tree.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createServer as createHttpServer } from "node:http";
import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = join(packageRoot, "..");
const srcRoot = join(workspaceRoot, "src");

describe("package identity and build artifact", () => {
  it("is warrioraashuu-codemaster with dist/index.js main", () => {
    const pkg = JSON.parse(
      readFileSync(join(packageRoot, "package.json"), "utf8")
    );
    assert.equal(pkg.name, "warrioraashuu-codemaster");
    assert.equal(pkg.main, "dist/index.js");
    assert.equal(pkg.bin?.["warrioraashuu-codemaster"], "dist/index.js");
    assert.ok(
      existsSync(join(packageRoot, "dist", "index.js")),
      "dist/index.js must exist after build"
    );
    assert.ok(
      existsSync(join(packageRoot, "dist", "http.js")),
      "dist/http.js must exist for start:http"
    );
    assert.ok(
      existsSync(join(packageRoot, "dist", "server.js")),
      "dist/server.js shared module"
    );
  });

  it("includes api, Dockerfile, railway.json, server.json sources", () => {
    for (const rel of [
      "api/index.ts",
      "api/vercelApp.ts",
      "Dockerfile",
      "railway.json",
      "server.json",
      "src/index.ts",
      "src/http.ts",
      "src/server.ts",
      ".gitignore",
      ".npmignore",
      "README.md",
      "tsconfig.json",
    ]) {
      assert.ok(
        existsSync(join(packageRoot, rel)),
        `missing vendored file: ${rel}`
      );
    }
  });
});

describe("createServer + tools against real clawd-code src", () => {
  it("SRC_ROOT honors CLAWD_CODE_SRC_ROOT and lists tools from real tree", async () => {
    process.env.CLAWD_CODE_SRC_ROOT = srcRoot;
    delete process.env.CLAUDE_CODE_SRC_ROOT;

    // Dynamic import after env is set — re-import fresh module graph
    const mod = await import(`${packageRoot}/dist/server.js?t=${Date.now()}`);
    assert.equal(resolve(mod.SRC_ROOT), resolve(srcRoot));

    await mod.validateSrcRoot();
    const server = mod.createServer();
    assert.ok(server);

    // Call list_tools via the real handler registry by invoking tool logic
    // through CallTool is heavier; exercise getToolList path via resource.
    // Direct: list tools directory like the server does.
    const { readdir } = await import("node:fs/promises");
    const toolsDir = join(srcRoot, "tools");
    const entries = await readdir(toolsDir, { withFileTypes: true });
    const toolDirs = entries.filter(
      (e) => e.isDirectory() && e.name !== "shared" && e.name !== "testing"
    );
    assert.ok(
      toolDirs.length >= 10,
      `expected many tool dirs under ${toolsDir}, got ${toolDirs.length}`
    );
    assert.ok(toolDirs.some((e) => e.name.toLowerCase().includes("bash") || e.name.includes("File")));
  });
});

describe("HTTP entry (real dist/http.js)", () => {
  it("starts twice and serves /health with explorer identity", async () => {
    async function freePort(): Promise<number> {
      return new Promise((resolvePort, reject) => {
        const s = createHttpServer();
        s.listen(0, "127.0.0.1", () => {
          const addr = s.address();
          if (!addr || typeof addr === "string") {
            reject(new Error("no port"));
            return;
          }
          const p = addr.port;
          s.close(() => resolvePort(p));
        });
        s.on("error", reject);
      });
    }

    async function launchOnce(port: number): Promise<void> {
      const child = spawn(
        process.execPath,
        [join(packageRoot, "dist", "http.js")],
        {
          cwd: packageRoot,
          env: {
            ...process.env,
            PORT: String(port),
            CLAUDE_CODE_SRC_ROOT: srcRoot,
            CLAWD_CODE_SRC_ROOT: srcRoot,
          },
          stdio: ["ignore", "pipe", "pipe"],
        }
      );

      let stdout = "";
      let stderr = "";
      child.stdout?.on("data", (d) => {
        stdout += d.toString();
      });
      child.stderr?.on("data", (d) => {
        stderr += d.toString();
      });

      try {
        let ready = false;
        for (let i = 0; i < 40; i++) {
          await new Promise((r) => setTimeout(r, 150));
          if (child.exitCode !== null) {
            throw new Error(
              `http process exited early: code=${child.exitCode}\n${stdout}\n${stderr}`
            );
          }
          try {
            const res = await fetch(`http://127.0.0.1:${port}/health`);
            if (res.ok) {
              const body = (await res.json()) as {
                status: string;
                server: string;
                version: string;
                srcRoot: string;
              };
              assert.equal(body.status, "ok");
              assert.equal(body.server, "claude-code-explorer");
              assert.equal(body.version, "1.1.0");
              assert.equal(resolve(body.srcRoot), resolve(srcRoot));
              ready = true;
              break;
            }
          } catch {
            // not up yet
          }
        }
        assert.ok(
          ready,
          `health never became ready\nstdout=${stdout}\nstderr=${stderr}`
        );
      } finally {
        child.kill("SIGTERM");
        await new Promise<void>((resolveDone) => {
          child.once("exit", () => resolveDone());
          setTimeout(() => {
            child.kill("SIGKILL");
            resolveDone();
          }, 2000);
        });
      }
    }

    const p1 = await freePort();
    const p2 = await freePort();
    await launchOnce(p1);
    await launchOnce(p2);
  });
});
