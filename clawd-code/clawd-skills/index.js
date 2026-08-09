#!/usr/bin/env node
/**
 * Clawd Skills — @openclawd/clawd-skills
 *
 * CLI:
 *   clawd-skills doctor        Validate skill structure
 *   clawd-skills install       Install skills into ~/.clawd/skills/
 *   clawd-skills list          List all bundled skills
 */
import { readdirSync, existsSync, mkdirSync, cpSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
// Skills are packaged at the package root (top-level directories).
const SKILLS_DIR = __dirname;
const TARGET_DIR = join(homedir(), '.clawd', 'skills');

const REQUIRED_FILES = ['SKILL.md'];

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
  const errors = [];
  const warnings = [];
  let ok = 0;

  for (const skill of skills) {
    const missing = REQUIRED_FILES.filter((f) => !existsSync(join(SKILLS_DIR, skill, f)));
    const meta = readSkillMeta(skill);
    if (missing.length) {
      errors.push(`${skill}: missing required files: ${missing.join(', ')}`);
    } else if (meta && meta.name) {
      ok++;
    }
    if (meta && !meta.description) {
      warnings.push(`${skill}: missing description in frontmatter`);
    }
  }

  console.log(`🦞 Clawd Skills Doctor`);
  console.log(`═══════════════════════════════════════`);
  console.log(`  Skills found:  ${skills.length}`);
  console.log(`  Valid:         ${ok}`);
  console.log(`  Warnings:      ${warnings.length}`);
  console.log(`  Errors:        ${errors.length}`);
  if (errors.length) {
    console.log('');
    console.log('  ERRORS:');
    for (const e of errors) console.log(`    ✗ ${e}`);
    process.exitCode = 1;
  }
  if (warnings.length) {
    console.log('');
    console.log('  WARNINGS:');
    for (const w of warnings) console.log(`    ⚠ ${w}`);
  }
}

function install() {
  const skills = listSkills();
  console.log(`Installing ${skills.length} skills → ${TARGET_DIR}`);
  mkdirSync(TARGET_DIR, { recursive: true });
  let count = 0;
  for (const skill of skills) {
    const src = join(SKILLS_DIR, skill);
    const dest = join(TARGET_DIR, skill);
    cpSync(src, dest, { recursive: true });
    count++;
  }
  console.log(`✅ Installed ${count} skills into ${TARGET_DIR}`);
}

function listCmd() {
  const skills = listSkills().map((s) => ({ name: s, ...readSkillMeta(s) }));
  console.log('🦞 Clawd Skills');
  console.log('═══════════════════════════════════════');
  for (const s of skills) {
    console.log(`  • ${s.name}${s.description ? ` — ${s.description.slice(0, 80)}` : ''}`);
  }
  console.log(`\n  Total: ${skills.length} skills`);
}

function runCli(argv = process.argv.slice(2)) {
  const cmd = argv[0] ?? 'doctor';
  switch (cmd) {
    case 'doctor':
      doctor();
      break;
    case 'install':
      install();
      break;
    case 'list':
      listCmd();
      break;
    default:
      console.error(`Unknown command: ${cmd}`);
      console.error('Usage: clawd-skills <doctor|install|list>');
      process.exitCode = 2;
  }
}

export { runCli };

// Direct execution (node index.js)
if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  runCli();
}