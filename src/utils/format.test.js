// @vitest-environment node

import { describe, expect, it } from 'vitest';

import {
  daysFrom,
  forLineFor,
  previewLetterText,
  salutationFor,
  shareUrlFor,
  trackNo,
  wordCount,
} from './format.js';

describe('trackNo', () => {
  it('numbers side A from 01', () => {
    expect(trackNo(0)).toBe('01');
    expect(trackNo(8)).toBe('09');
    expect(trackNo(11)).toBe('12');
  });
});

describe('wordCount', () => {
  it('counts words, not whitespace', () => {
    expect(wordCount('')).toBe(0);
    expect(wordCount('   ')).toBe(0);
    expect(wordCount('say the thing')).toBe(3);
    expect(wordCount('  line one\n\nline two  ')).toBe(4);
  });
});

describe('addressing', () => {
  it('uses the recipient when there is one', () => {
    expect(salutationFor('Mara')).toBe('dear Mara,');
    expect(forLineFor('Mara')).toBe('for Mara');
  });

  it('falls back to the second person when there is not', () => {
    expect(salutationFor('')).toBe('dear you,');
    expect(salutationFor('   ')).toBe('dear you,');
    expect(forLineFor('')).toBe('for you');
  });
});

describe('shareUrlFor', () => {
  it('builds the link from a code', () => {
    expect(shareUrlFor('3fK82a')).toBe('thingsunsaid.app/m/3fK82a');
  });

  it('shows a placeholder before a code exists', () => {
    expect(shareUrlFor(null)).toBe('thingsunsaid.app/m/……');
  });
});

describe('daysFrom', () => {
  it('counts forwards and backwards', () => {
    const forward = (daysFrom(14) - Date.now()) / 86400000;
    const back = (daysFrom(-2) - Date.now()) / 86400000;
    expect(forward).toBeCloseTo(14, 1);
    expect(back).toBeCloseTo(-2, 1);
  });
});

describe('previewLetterText', () => {
  it('returns what the sender wrote', () => {
    expect(previewLetterText('say the thing')).toBe('say the thing');
  });

  /* The placeholder fills the sender's own last look. `Recipient` must never
     call this — an unwritten letter is hidden there instead. */
  it('stands in for an unwritten letter', () => {
    expect(previewLetterText('')).toMatch(/I've started this six times/);
    expect(previewLetterText('   ')).toMatch(/I've started this six times/);
  });
});
