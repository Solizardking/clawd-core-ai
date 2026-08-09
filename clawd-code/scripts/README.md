# `scripts/`

Build, bundling, packaging, and test-runner scripts — all executed via `bun`.

| Script | Purpose |
|---|---|
| `build-bundle.ts` | Main CLI build — bundles `src/` into `dist/` (esbuild-based, Bun runtime) |
| `build-web.ts` | Builds the [`web/`](../web) Next.js dashboard |
| `build.sh` | Shell wrapper around the build pipeline |
| `ci-build.sh` | CI entrypoint — used by automated build checks |
| `bun-plugin-shims.ts` | `bun:bundle` feature-flag shim used at build time for dead-code elimination |
| `dev.ts` | Dev-mode runner (`bun run dev`) |
| `package-npm.ts` | Packages the built CLI for npm distribution |
| `test-auth.ts` | Auth/OAuth flow smoke test |
| `test-commands.ts` | Slash-command smoke test |
| `test-mcp.ts` | MCP client/server integration smoke test |
| `test-services.ts` | Service-layer smoke test |
| `types.d.ts` | Shared ambient types for these scripts |
| `tsconfig.json` | TypeScript config scoped to `scripts/` |

## Common commands

```bash
bun run build          # → scripts/build-bundle.ts
bun run build:watch    # → scripts/build-bundle.ts --watch
bun run build:prod     # → scripts/build-bundle.ts --minify
bun run build:web      # → scripts/build-web.ts
bun run typecheck      # tsc --noEmit
bun run lint           # biome check src/
bun run check          # lint + typecheck
```

See root [`package.json`](../../package.json) for the authoritative script wiring, and [`prompts/`](../prompts) for the original step-by-step build-out log these scripts came out of.
