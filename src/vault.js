// The photos are stored encrypted (see scripts/encrypt-photos.mjs). The
// passphrase typed at the gate derives the key; once it works the key is
// kept on this device so the game opens straight away next time.

import lock from './photo-lock.json';

const KEY = 'bobia-photo-key';
const norm = (v) => String(v).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]/g, '');
const from64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const to64 = (u8) => btoa(String.fromCharCode(...u8));
let key = null;
const urls = new Map();

async function open(bytes, k = key) {
  return new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: bytes.slice(0, 12) }, k, bytes.slice(12)));
}

async function tryKey(k) {
  try {
    await open(from64(lock.check), k);
    return true;
  } catch {
    return false;
  }
}

// Turns the passphrase into the photo key. Resolves true when it fits.
export async function unlock(pass) {
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(norm(pass)), 'PBKDF2', false, ['deriveKey']);
  const k = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: from64(lock.salt), iterations: lock.iterations, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    true,
    ['decrypt'],
  );
  if (!(await tryKey(k))) return false;
  key = k;
  try {
    localStorage.setItem(KEY, to64(new Uint8Array(await crypto.subtle.exportKey('raw', k))));
  } catch {}
  return true;
}

// Picks up the key saved by an earlier visit, if it still fits.
export async function restore() {
  let raw = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {}
  if (!raw) return false;
  const k = await crypto.subtle.importKey('raw', from64(raw), 'AES-GCM', true, ['decrypt']);
  if (!(await tryKey(k))) return false;
  key = k;
  return true;
}

export function forget() {
  key = null;
  try {
    localStorage.removeItem(KEY);
  } catch {}
}

// Fetches and decrypts every photo the game uses, ready for photo().
export async function loadPhotos(paths) {
  await Promise.all(
    [...new Set(paths)].filter((p) => p && !urls.has(p)).map(async (p) => {
      const res = await fetch(p.replace(/\.jpg$/, '.bin'));
      const bytes = new Uint8Array(await res.arrayBuffer());
      urls.set(p, URL.createObjectURL(new Blob([await open(bytes)], { type: 'image/jpeg' })));
    }),
  );
}

export const photo = (p) => urls.get(p) || null;
