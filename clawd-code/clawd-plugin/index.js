#!/usr/bin/env node
/**
 * Clawd Code Plugin — @openclawd/clawd-plugin
 *
 * Bundles 80+ Solana skills and auto-starts MCP servers.
 *
 * CLI:
 *   clawd-plugin doctor        Validate plugin structure
 *   clawd-plugin list-skills   List all bundled skills
 */
import { readdirSync, existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILLS_DIR = join(__dirname, 'skills');
const MCP_PATH = join(__dirname, '.mcp.json');
const KNOWLEDGE_DIR = join(__dirname, 'knowledge');

const NON_SKILL_DIRS = new Set([
  'node_modules',
  '.git',
  '.github',
  'dist',
  '.clawd',
  // Application / tool directories, not skills
  'onchain',
  'scanner',
  'google',
]);

function listSkills() {
  if (!existsSync(SKILLS_DIR)) return [];
  return readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !NON_SKILL_DIRS.has(e.name))
    .map((e) => e.name)
    .sort();
}

function readSkillMeta(skill) {
  const skPath = join(SKILLS_DIR, skill, 'SKILL.md');
  if (!existsSync(skPath)) return null;
  const raw = readFileSync(skPath, 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return { name: skill };
  const meta = {};
  for (const line of m[1].split('\n')) {
    const mm = line.match(/^(\w+):\s*(.*)$/);
    if (mm) meta[mm[1]] = mm[2].trim();
  }
  return meta;
}

function doctor() {
  const skills = listSkills();
  const mcpCfg = existsSync(MCP_PATH) ? JSON.parse(readFileSync(MCP_PATH, 'utf8')) : null;
  const servers = mcpCfg?.mcpServers ? Object.keys(mcpCfg.mcpServers) : [];
  const errors = [];
  const warnings = [];
  let ok = 0;

  for (const skill of skills) {
    const hasSk = existsSync(join(SKILLS_DIR, skill, 'SKILL.md'));
    if (!hasSk) {
      errors.push(`${skill}: missing SKILL.md`);
    } else {
      ok++;
      const meta = readSkillMeta(skill);
      if (meta && !meta.description) warnings.push(`${skill}: missing description`);
    }
  }

  console.log('🦞 Clawd Code Plugin Doctor');
  console.log('═══════════════════════════════════════');
  console.log(`  Skills found:  ${skills.length}`);
  console.log(`  Valid SKILLs:  ${ok}`);
  console.log(`  MCP servers:   ${servers.length}`);
  for (const s of servers) console.log(`    • ${s}`);
  console.log(`  Knowledge:     ${existsSync(KNOWLEDGE_DIR) ? 'present' : 'MISSING'}`);
  console.log(`  Errors:        ${errors.length}`);
  if (errors.length) {
    console.log('');
    for (const e of errors) console.log(`    ✗ ${e}`);
    process.exitCode = 1;
  }
  if (warnings.length) {
    console.log('');
    console.log(`  Warnings (no description): ${warnings.length}`);
  }
}

function listCmd() {
  const skills = listSkills().map((s) => ({ name: s, ...readSkillMeta(s) }));
  console.log('🦞 Clawd Code Plugin — skills');
  for (const s of skills) {
    console.log(`  • ${s.name}${s.description ? ` — ${s.description.slice(0, 70)}` : ''}`);
  }
  console.log(`\n  Total: ${skills.length} skills`);
}

function runCli(argv = process.argv.slice(2)) {
  const cmd = argv[0] ?? 'doctor';
  switch (cmd) {
    case 'doctor':
      doctor();
      break;
    case 'list-skills':
      listCmd();
      break;
    default:
      console.error(`Unknown command: ${cmd}`);
      process.exitCode = 2;
  }
}

export { runCli };

// Direct execution (node index.js)
if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  runCli();
}