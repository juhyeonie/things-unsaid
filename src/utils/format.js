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
