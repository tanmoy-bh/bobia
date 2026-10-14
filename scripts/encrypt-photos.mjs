// Encrypts the game photos so the public site only ever holds scrambled
// files. They unlock in the browser with the passphrase Joy types at the gate.
//
//   PHOTO_PASS='the passphrase' npm run photos
//
// Reads every .jpg in photos-src/ (kept out of git) and writes
// public/photos/<name>.bin plus src/photo-lock.json. The passphrase is
// compared loosely, like every answer: case, spaces and punctuation are ignored.

import { webcrypto as crypto } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const src = path.join(root, 'photos-src');
const out = path.join(root, 'public', 'photos');
const pass = process.env.PHOTO_PASS;
if (!pass) {
  console.error('Set PHOTO_PASS to the passphrase first.');
  process.exit(1);
}

const norm = (v) => String(v).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]/g, '');
const ITERATIONS = 250000;
const salt = crypto.getRandomValues(new Uint8Array(16));
const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(norm(pass)), 'PBKDF2', false, ['deriveKey']);
const key = await crypto.subtle.deriveKey(
  { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
  base,
  { name: 'AES-GCM', length: 256 },
  false,
  ['encrypt'],
);

async function seal(bytes) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const body = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, bytes));
  const all = new Uint8Array(iv.length + body.length);
  all.set(iv);
  all.set(body, iv.length);
  return all;
}

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
const files = fs.readdirSync(src).filter((f) => f.endsWith('.jpg')).sort();
for (const f of files) {
  fs.writeFileSync(path.join(out, f.replace(/\.jpg$/, '.bin')), await seal(fs.readFileSync(path.join(src, f))));
}

const b64 = (u8) => Buffer.from(u8).toString('base64');
const check = await seal(new TextEncoder().encode('joy'));
fs.writeFileSync(
  path.join(root, 'src', 'photo-lock.json'),
  JSON.stringify({ salt: b64(salt), iterations: ITERATIONS, check: b64(check) }, null, 2) + '\n',
);
console.log(`Encrypted ${files.length} photos into public/photos/`);
