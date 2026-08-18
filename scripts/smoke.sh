#!/usr/bin/env bash
# Drive each launchable package from its real entry. Missing deps / missing
# parent scripts are SKIPs, not passes. Exit 0 if every item is pass or skip.
set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

pass=0
skip=0
fail=0

record() {
  local status="$1" name="$2" detail="$3"
  printf '%s\t%s\t%s\n' "$status" "$name" "$detail"
  case "$status" in
    PASS) pass=$((pass + 1)) ;;
    SKIP) skip=$((skip + 1)) ;;
    FAIL) fail=$((fail + 1)) ;;
  esac
}

run_help() {
  local name="$1"
  shift
  local out ec
  out="$("$@" 2>&1)"
  ec=$?
  if [ "$ec" -eq 0 ]; then
    record PASS "$name" "$(echo "$out" | tr '\n' ' ' | cut -c1-180)"
  else
    record FAIL "$name" "exit=$ec $(echo "$out" | tr '\n' ' ' | cut -c1-180)"
  fi
}

try_or_skip() {
  local name="$1" reason_if_skip="$2"
  shift 2
  local out ec
  out="$("$@" 2>&1)"
  ec=$?
  if [ "$ec" -eq 0 ]; then
    record PASS "$name" "$(echo "$out" | tr '\n' ' ' | cut -c1-180)"
  else
    if echo "$out" | grep -qiE 'Cannot find module|Cannot find package|MODULE_NOT_FOUND|ERR_MODULE_NOT_FOUND|Could not resolve|Cannot find tsconfig|need to install|not found'; then
      record SKIP "$name" "$reason_if_skip :: $(echo "$out" | tr '\n' ' ' | cut -c1-160)"
    else
      record FAIL "$name" "exit=$ec $(echo "$out" | tr '\n' ' ' | cut -c1-180)"
    fi
  fi
}

echo "=== clawd-core-ai smoke $(date -u +%Y-%m-%dT%H:%M:%SZ) ==="

# root plugin:doctor — real shipped cli
run_help "root.plugin:doctor" node "$ROOT/clawd-plugin/cli.js" doctor

# clawd-plugin doctor (same entry, named for the minimum set)
run_help "clawd-plugin.doctor" node "$ROOT/clawd-plugin/cli.js" doctor

# clawd-skills doctor
run_help "clawd-skills.doctor" node "$ROOT/clawd-skills/cli.js" doctor

# v3 --help (source bin)
run_help "v3.--help" node "$ROOT/v3/src/index.mjs" --help

# clawd-code --help via bun (src entry)
if command -v bun >/dev/null 2>&1; then
  try_or_skip "clawd-code.--help" "clawd-code deps not installed" bun "$ROOT/clawd-code/src/cli.ts" --help
else
  record SKIP "clawd-code.--help" "bun not on PATH"
fi

# clawd-mcp: --help after build if dist exists, else tsc presence
if [ -f "$ROOT/clawd-mcp/dist/index.js" ]; then
  try_or_skip "clawd-mcp.--help" "clawd-mcp dist missing runtime" node "$ROOT/clawd-mcp/dist/index.js" --help
else
  record SKIP "clawd-mcp.--help" "dist/index.js not built (no node_modules / pnpm build)"
fi

# clawd-connectors doctor
if [ -d "$ROOT/clawd-connectors/node_modules" ]; then
  try_or_skip "clawd-connectors.doctor" "connectors runtime" bash -lc "cd \"$ROOT/clawd-connectors\" && npm run doctor"
else
  record SKIP "clawd-connectors.doctor" "node_modules missing"
fi

# clawd-router doctor
if [ -d "$ROOT/clawd-router/node_modules" ]; then
  try_or_skip "clawd-router.doctor" "router runtime" bash -lc "cd \"$ROOT/clawd-router\" && npm run doctor"
else
  record SKIP "clawd-router.doctor" "node_modules missing"
fi

# clawd-core typecheck
if [ -d "$ROOT/clawd-core/node_modules" ]; then
  try_or_skip "clawd-core.typecheck" "clawd-core deps" bash -lc "cd \"$ROOT/clawd-core\" && npm run typecheck"
else
  record SKIP "clawd-core.typecheck" "node_modules missing"
fi

# mcp-server lint
if [ -d "$ROOT/mcp-server/node_modules" ]; then
  try_or_skip "mcp-server.lint" "mcp-server deps" bash -lc "cd \"$ROOT/mcp-server\" && npm run lint"
else
  record SKIP "mcp-server.lint" "node_modules missing"
fi

# clawd-tui typecheck
if [ -d "$ROOT/clawd-tui/node_modules" ]; then
  try_or_skip "clawd-tui.typecheck" "clawd-tui deps" bash -lc "cd \"$ROOT/clawd-tui\" && npm run typecheck"
else
  record SKIP "clawd-tui.typecheck" "node_modules missing"
fi

# clawd-grok --help / test
if [ -d "$ROOT/clawd-agents/clawd-grok/node_modules" ]; then
  try_or_skip "clawd-grok.--help" "clawd-grok deps" bash -lc "cd \"$ROOT/clawd-agents/clawd-grok\" && bun run src/index.ts --help"
else
  record SKIP "clawd-grok.--help" "node_modules missing"
fi

# tailclawd test
if [ -d "$ROOT/tailclawd/node_modules" ]; then
  try_or_skip "tailclawd.test" "tailclawd deps" bash -lc "cd \"$ROOT/tailclawd\" && npm test"
else
  # tailclawd tests import node:test + shipped source; try without install
  try_or_skip "tailclawd.test" "tailclawd deps" bash -lc "cd \"$ROOT/tailclawd\" && node --import tsx --test --test-force-exit tests/package-integration.test.mjs"
fi

# parent stack:doctor
if [ -f "$ROOT/../scripts/stack-doctor.ts" ]; then
  try_or_skip "root.stack:doctor" "stack-doctor runtime" bun "$ROOT/../scripts/stack-doctor.ts"
else
  record SKIP "root.stack:doctor" "parent ../scripts/stack-doctor.ts missing"
fi

echo
echo "=== summary pass=$pass skip=$skip fail=$fail ==="
if [ "$fail" -gt 0 ]; then
  exit 1
fi
exit 0
