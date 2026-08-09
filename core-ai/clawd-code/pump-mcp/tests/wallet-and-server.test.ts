/**
 * Durable smoke tests for the vendored @pump-fun/mcp-server package.
 * These import the real shipped modules (not re-implementations) and drive
 * local wallet tools + the real HTTP entry path.
 */
import { createServer as createHttpServer } from "node:http";
import { afterAll, describe, expect, it } from "vitest";
import { ALL_TOOLS } from "../src/tools/index.js";
import {
  estimateVanityTime,
  generateKeypair,
  validateAddress,
} from "../src/tools/wallet.js";
import { SolanaWalletMCPServer } from "../src/server.js";
import { MCP_VERSION } from "../src/types.js";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(readFileSync(join(packageRoot, "package.json"), "utf8"));

describe("package identity", () => {
  it("is @pump-fun/mcp-server with dist/index.js main and pump-mcp bin", () => {
    expect(pkg.name).toBe("@pump-fun/mcp-server");
    expect(pkg.main).toBe("dist/index.js");
    expect(pkg.bin?.["pump-mcp"]).toBe("dist/index.js");
    expect(pkg.type).toBe("module");
  });
});

describe("tool surface (shipped ALL_TOOLS)", () => {
  it("exports 55 named tools covering wallet, quoting, trading, fees", () => {
    expect(ALL_TOOLS.length).toBe(55);
    const names = ALL_TOOLS.map((t) => t.name);
    expect(names).toContain("generate_keypair");
    expect(names).toContain("validate_address");
    expect(names).toContain("get_buy_quote");
    expect(names).toContain("build_buy_instructions");
    expect(names).toContain("get_fee_tier");
    // every tool has a handler and schema
    for (const tool of ALL_TOOLS) {
      expect(typeof tool.name).toBe("string");
      expect(tool.name.length).toBeGreaterThan(0);
      expect(typeof tool.handler).toBe("function");
      expect(tool.inputSchema).toBeTruthy();
    }
  });
});

describe("wallet tools (real implementations)", () => {
  it("generate_keypair returns a valid Solana public key", async () => {
    const result = await generateKeypair({});
    expect(result.isError).toBeFalsy();
    const data = JSON.parse(result.content[0].text) as {
      publicKey: string;
      secretKey: number[];
    };
    expect(data.publicKey).toMatch(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/);
    expect(Array.isArray(data.secretKey)).toBe(true);
    expect(data.secretKey.length).toBe(64);

    // Cross-check with validate_address on the real key we just generated
    const validated = await validateAddress({ address: data.publicKey });
    const v = JSON.parse(validated.content[0].text) as {
      valid: boolean;
      address: string;
      isOnCurve: boolean;
    };
    expect(v.valid).toBe(true);
    expect(v.address).toBe(data.publicKey);
    expect(v.isOnCurve).toBe(true);
  });

  it("validate_address rejects garbage", async () => {
    const result = await validateAddress({ address: "not-a-key" });
    const data = JSON.parse(result.content[0].text) as {
      valid: boolean;
      reason?: string;
    };
    expect(data.valid).toBe(false);
    expect(data.reason).toBeTruthy();
  });

  it("estimate_vanity_time computes expected attempts from prefix length", async () => {
    const result = await estimateVanityTime({
      prefix: "ab",
      keysPerSecond: 1000,
    });
    expect(result.isError).toBeFalsy();
    const data = JSON.parse(result.content[0].text) as {
      expectedAttempts: string;
      estimatedTime: string;
      keysPerSecond: number;
      recommendation: string;
    };
    // Real formula in wallet.ts: 58^N, serialized via toExponential(2)
    expect(data.expectedAttempts).toBe((58 ** 2).toExponential(2));
    expect(data.keysPerSecond).toBe(1000);
    expect(data.estimatedTime).toMatch(/seconds|minutes|hours|days|years/);
    expect(data.recommendation).toContain("TypeScript");
  });
});

describe("HTTP server (real SolanaWalletMCPServer)", () => {
  let server: SolanaWalletMCPServer | undefined;
  let port = 0;

  it("binds HTTP and serves /health with tools:55", async () => {
    // Reserve an ephemeral port first so the test is deterministic
    port = await new Promise<number>((resolve, reject) => {
      const s = createHttpServer();
      s.listen(0, "127.0.0.1", () => {
        const addr = s.address();
        if (!addr || typeof addr === "string") {
          reject(new Error("no port"));
          return;
        }
        const p = addr.port;
        s.close(() => resolve(p));
      });
      s.on("error", reject);
    });

    server = new SolanaWalletMCPServer();
    // startHttp does not return until listen resolves; leave it running
    const startPromise = server.startHttp(port);
    // startHttp resolves after listen — await it
    await startPromise;

    const res = await fetch(`http://127.0.0.1:${port}/health`);
    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean; tools: number };
    expect(body.ok).toBe(true);
    expect(body.tools).toBe(55);

    // MCP initialize via real /mcp path
    const init = await fetch(`http://127.0.0.1:${port}/mcp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: MCP_VERSION,
          capabilities: {},
          clientInfo: { name: "vitest", version: "0.0.1" },
        },
      }),
    });
    expect(init.status).toBe(200);
    const text = await init.text();
    expect(text).toContain("solana-clawd-mcp-server");
    expect(text).toContain(MCP_VERSION);
  });

  afterAll(async () => {
    if (server) {
      await server.shutdown();
    }
  });
});
