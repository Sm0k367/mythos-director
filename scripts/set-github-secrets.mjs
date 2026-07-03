#!/usr/bin/env node
/**
 * Set GitHub Actions secrets using the repo public key.
 * Usage: node scripts/set-github-secrets.mjs VERCEL_TOKEN=xxx VERCEL_ORG_ID=yyy
 */

import { execSync } from 'child_process';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const require = createRequire(import.meta.url);
const scriptDir = dirname(fileURLToPath(import.meta.url));

// Ensure tweetsodium is available (GitHub's recommended encryption)
try {
  require.resolve('tweetsodium');
} catch {
  execSync('npm install tweetsodium --no-save', { cwd: join(scriptDir, '..'), stdio: 'ignore' });
}
const sodium = require('tweetsodium');

const REPO = 'Sm0k367/mythos-director';

function getGitHubToken() {
  const input = 'protocol=https\nhost=github.com\n';
  const out = execSync('git credential fill', { input, encoding: 'utf8' });
  for (const line of out.split('\n')) {
    if (line.startsWith('password=')) return line.slice('password='.length);
  }
  throw new Error('No GitHub token in credential manager');
}

async function gh(path, { method = 'GET', body, token }) {
  const res = await fetch(`https://api.github.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${method} ${path}: ${res.status} ${await res.text()}`);
  if (res.status === 204) return null;
  return res.json();
}

function encryptSecret(publicKey, secretValue) {
  const encrypted = sodium.seal(Buffer.from(secretValue), Buffer.from(publicKey, 'base64'));
  return Buffer.from(encrypted).toString('base64');
}

const secrets = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const i = arg.indexOf('=');
    return [arg.slice(0, i), arg.slice(i + 1)];
  })
);

if (!Object.keys(secrets).length) {
  console.error('Usage: node scripts/set-github-secrets.mjs NAME=value ...');
  process.exit(1);
}

const token = getGitHubToken();
const { key_id, key } = await gh(`/repos/${REPO}/actions/secrets/public-key`, { token });

for (const [name, value] of Object.entries(secrets)) {
  await gh(`/repos/${REPO}/actions/secrets/${name}`, {
    method: 'PUT',
    token,
    body: {
      encrypted_value: encryptSecret(key, value),
      key_id,
    },
  });
  console.log(`Set secret: ${name}`);
}