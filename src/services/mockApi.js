/* ------------------------------------------------------------------ *
 * Mock API — the single seam where the Express/MongoDB backend will slot in.
 *
 * Every function here returns a promise and holds no React state, so each
 * one can later be swapped for a `fetch('/api/...')` call without touching
 * any component. Nothing is persisted: data lives for the page session only.
 * ------------------------------------------------------------------ */

import { CATALOG } from '../data/catalog.js';
import { seedTapes } from '../data/seedTapes.js';
import { daysFrom } from '../utils/format.js';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const CODE_CHARS = 'abcdefghjkmnpqrstuvwxyz23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

/** Six-character share code, ambiguous characters left out. */
export const makeCode = () =>
  Array.from(
    { length: 6 },
    () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)],
  ).join('');

export const isEmail = (value) => /^\S+@\S+\.\S+$/.test(value.trim());

export const isTrackLink = (value) => /spotify\.com|music\.apple\.com/i.test(value);

/**
 * Validates registration input the way the real endpoint will.
 * Returns { ok, error, user, tapes }.
 */
export async function register({ name, email, password, confirm }) {
  if (!isEmail(email)) return { ok: false, error: "That email doesn't look right." };
  if (password.length < 8)
    return { ok: false, error: 'Passwords need at least 8 characters.' };
  if (!name.trim()) return { ok: false, error: 'What should we call you?' };
  if (password !== confirm)
    return { ok: false, error: "Those two passwords don't match." };

  return { ok: true, user: { name: name.trim(), email: email.trim() }, tapes: [] };
}

/** Signs a returning user in. Any valid-looking credentials are accepted. */
export async function login({ email, password }) {
  if (!isEmail(email)) return { ok: false, error: "That email doesn't look right." };
  if (password.length < 8)
    return { ok: false, error: 'Passwords need at least 8 characters.' };

  return {
    ok: true,
    user: { name: 'Wren Adeyemi', email: email.trim() },
    tapes: seedTapes(),
  };
}

/** Resolves a pasted Spotify / Apple Music link into track metadata. */
export async function resolveTrack(link, catalogIndex) {
  if (!isTrackLink(link)) return { ok: false };
  await delay(650);
  return { ok: true, track: CATALOG[catalogIndex % CATALOG.length] };
}

/** Builds the record that will eventually be POSTed to /api/tapes. */
export function buildTapeRecord(draft, status, existingCode) {
  const code =
    status === 'Active' ? existingCode || makeCode() : null;

  return {
    id: draft.editingId || Date.now(),
    code,
    title: draft.title || 'untitled',
    recipient: draft.recipient.trim(),
    shell: draft.shell,
    stickers: draft.placed.slice(),
    tracks: draft.tracks.slice(),
    letter: draft.letter,
    status,
    created: new Date(),
    expires: status === 'Active' ? daysFrom(14) : null,
  };
}

/** Copies text, falling back quietly where the clipboard API is unavailable. */
export async function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* Ignored — the confirmation toast still shows, as in the prototype. */
    }
  }
  return true;
}

/** Native share sheet where the browser offers one. */
export const canNativeShare = () =>
  typeof navigator !== 'undefined' && !!navigator.share;

export async function nativeShare({ title, text, url }) {
  try {
    await navigator.share({ title, text, url });
  } catch {
    /* User dismissed the sheet. */
  }
}
