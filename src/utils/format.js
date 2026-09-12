/** "Sep 12" — the short date used on dashboard cards and expiry notes. */
export const fmt = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

/** A date n days from now; negative n looks backwards. */
export const daysFrom = (n) => new Date(Date.now() + n * 86400000);

/** Track numbers read "01", "02", … */
export const trackNo = (i) => String(i + 1).padStart(2, '0');

/** Words in the letter, ignoring surrounding whitespace. */
export const wordCount = (text) =>
  text.trim() ? text.trim().split(/\s+/).length : 0;

/** How a tape addresses its reader. */
export const salutationFor = (recipient) =>
  recipient.trim() ? `dear ${recipient.trim()},` : 'dear you,';

export const forLineFor = (recipient) =>
  recipient.trim() ? `for ${recipient.trim()}` : 'for you';

export const shareUrlFor = (code) => `thingsunsaid.app/m/${code || '……'}`;

/**
 * Stand-in copy for the sender's own preview of an unwritten letter, so the
 * last look is never blank.
 *
 * Preview only. The recipient must never be shown this: it would read as the
 * sender's own words. `Recipient` hides the letter entirely when none was
 * written, which is why this is not exported.
 */
const PLACEHOLDER_LETTER =
  "I've started this six times. Here is the version I'm actually sending.\n\nTrack four is the one. You'll know why.";

export const previewLetterText = (letter) =>
  letter.trim().length ? letter : PLACEHOLDER_LETTER;

/* ------------------------------------------------------------------ *
 * Playback clock. Track lengths arrive as "4:17" strings; the player
 * needs them as seconds, and needs them back again for its readout.
 * ------------------------------------------------------------------ */

/** "4:17" -> 257. Anything unparseable is treated as a zero-length track. */
export const parseLength = (len) => {
  const parts = String(len ?? '').split(':').map(Number);
  if (parts.length !== 2 || parts.some(Number.isNaN)) return 0;
  const [minutes, seconds] = parts;
  return minutes * 60 + seconds;
};

/** 257 -> "4:17". Negative values clamp to zero rather than reading "-0:01". */
export const formatTime = (seconds) => {
  const total = Math.max(0, Math.floor(seconds || 0));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
};

/** What is left, written the way a player writes it. */
export const formatRemaining = (elapsed, duration) =>
  `-${formatTime(Math.max(0, duration - elapsed))}`;
