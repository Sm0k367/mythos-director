#!/usr/bin/env node
/**
 * Fails CI if likely secrets are committed to the repo.
 * Placeholders in .env.example are allowed.
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative, dirname, resolve, extname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(new URL('..', import.meta.url))));
const SCAN_DIRS = ['apps', 'packages', 'scripts', 'agents', 'desktop', 'mobile', 'marketing', 'iron-jarvis'];
const SCAN_ROOT_FILES = ['README.md', 'package.json', 'vercel.json', 'kortix.toml', 'turbo.json'];
const SKIP_DIRS = new Set(['node_modules', '.git', '.next', '.vercel', '.kortix']);
const TEXT_EXT = new Set(['.ts', '.tsx', '.js', '.mjs', '.py', '.md', '.json', '.toml', '.yml', '.yaml', '.css', '.html']);

const PATTERNS = [
  { name: 'GitHub PAT', regex: /ghp_[A-Za-z0-9]{20,}/ },
  { name: 'OpenAI key', regex: /sk-[A-Za-z0-9]{20,}/ },
  { name: 'HuggingFace token', regex: /hf_[A-Za-z0-9]{20,}/ },
  { name: 'Stripe live key', regex: /sk_live_[A-Za-z0-9]{20,}/ },
  { name: 'Bearer token', regex: /Bearer\s+[A-Za-z0-9._-]{20,}/ },
];

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (!full.startsWith(ROOT)) continue;
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, files);
    else if (TEXT_EXT.has(extname(entry))) files.push(full);
  }
  return files;
}

const files = [];
for (const dir of SCAN_DIRS) {
  const full = join(ROOT, dir);
  try {
    walk(full, files);
  } catch {
    // directory may not exist
  }
}
for (const file of SCAN_ROOT_FILES) {
  const full = join(ROOT, file);
  try {
    statSync(full);
    files.push(full);
  } catch {
    // optional root file
  }
}

const violations = [];

for (const file of files) {
  const rel = relative(ROOT, file).replace(/\\/g, '/');
  if (rel.endsWith('.env.example')) continue;

  const content = readFileSync(file, 'utf8');
  for (const { name, regex } of PATTERNS) {
    if (regex.test(content)) violations.push({ file: rel, type: name });
  }
}

if (violations.length) {
  console.error('Secret scan failed — possible credentials in repo:\n');
  for (const v of violations) console.error(`  ${v.type}: ${v.file}`);
  process.exit(1);
}

console.log('Secret scan passed — no hardcoded credentials found.');