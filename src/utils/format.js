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

/** What an unwritten letter shows in previews, so the page is never blank. */
export const FALLBACK_LETTER =
  "I've started this six times. Here is the version I'm actually sending.\n\nTrack four is the one. You'll know why.";

export const letterTextFor = (letter) =>
  letter.trim().length ? letter : FALLBACK_LETTER;
