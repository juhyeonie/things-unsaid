// @vitest-environment node

import { describe, expect, it } from 'vitest';

import {
  buildTapeRecord,
  isEmail,
  isTrackLink,
  login,
  makeCode,
  register,
  resolveTrack,
} from './mockApi.js';

/**
 * These cover the contract the Express routes will have to honour, so the
 * suite should keep passing when the bodies are swapped for fetch calls.
 */

const draft = (over = {}) => ({
  editingId: null,
  activeCode: null,
  shell: '#F2C7CB',
  title: 'the long way round',
  recipient: '  Mara  ',
  letter: 'I should have said this in the car.',
  placed: [],
  tracks: [{ id: 1, title: 'Dreams', artist: 'The Cranberries', len: '4:14' }],
  nextId: 2,
  ...over,
});

describe('validators', () => {
  it('accepts an address with a domain and rejects the near misses', () => {
    expect(isEmail('wren@somewhere.com')).toBe(true);
    expect(isEmail('  wren@somewhere.com  ')).toBe(true);
    expect(isEmail('wren@somewhere')).toBe(false);
    expect(isEmail('wren.somewhere.com')).toBe(false);
    expect(isEmail('')).toBe(false);
  });

  it('only recognises Spotify and Apple Music links', () => {
    expect(isTrackLink('https://open.spotify.com/track/abc')).toBe(true);
    expect(isTrackLink('https://music.apple.com/us/album/x')).toBe(true);
    expect(isTrackLink('https://example.com/track/abc')).toBe(false);
    expect(isTrackLink('')).toBe(false);
  });
});

describe('register', () => {
  const good = {
    name: 'Juni',
    email: 'juni@somewhere.com',
    password: 'password12',
    confirm: 'password12',
  };

  it('creates an account with no tapes', async () => {
    const result = await register(good);
    expect(result.ok).toBe(true);
    expect(result.user).toEqual({ name: 'Juni', email: 'juni@somewhere.com' });
    expect(result.tapes).toEqual([]);
  });

  it('trims the name it stores', async () => {
    const { user } = await register({ ...good, name: '  Juni  ' });
    expect(user.name).toBe('Juni');
  });

  it.each([
    ['a malformed email', { email: 'nope' }, "That email doesn't look right."],
    ['a short password', { password: 'short', confirm: 'short' }, 'Passwords need at least 8 characters.'],
    ['a missing name', { name: '   ' }, 'What should we call you?'],
    ['a mismatched confirmation', { confirm: 'password13' }, "Those two passwords don't match."],
  ])('rejects %s', async (_label, over, error) => {
    const result = await register({ ...good, ...over });
    expect(result.ok).toBe(false);
    expect(result.error).toBe(error);
  });
});

describe('login', () => {
  const good = { email: 'wren@somewhere.com', password: 'longenough1' };

  it('returns the account and its existing tapes', async () => {
    const result = await login(good);
    expect(result.ok).toBe(true);
    expect(result.user.email).toBe('wren@somewhere.com');
    expect(result.tapes).toHaveLength(3);
    expect(result.tapes.map((t) => t.status)).toEqual(['Active', 'Draft', 'Expired']);
  });

  it.each([
    ['a malformed email', { email: 'nope' }, "That email doesn't look right."],
    ['a short password', { password: 'short' }, 'Passwords need at least 8 characters.'],
  ])('rejects %s', async (_label, over, error) => {
    const result = await login({ ...good, ...over });
    expect(result.ok).toBe(false);
    expect(result.error).toBe(error);
  });
});

describe('resolveTrack', () => {
  it('refuses a link that is not from a supported service', async () => {
    expect(await resolveTrack('https://example.com/x', 0)).toEqual({ ok: false });
  });

  it('resolves a link to track metadata', async () => {
    const { ok, track } = await resolveTrack('https://open.spotify.com/track/x', 0);
    expect(ok).toBe(true);
    expect(track).toMatchObject({
      title: expect.any(String),
      artist: expect.any(String),
      len: expect.any(String),
    });
  });

  it('walks the catalog and wraps around', async () => {
    const first = await resolveTrack('https://open.spotify.com/track/x', 0);
    const second = await resolveTrack('https://open.spotify.com/track/x', 1);
    const wrapped = await resolveTrack('https://open.spotify.com/track/x', 6);
    expect(second.track.title).not.toBe(first.track.title);
    expect(wrapped.track).toEqual(first.track);
  });
});

describe('makeCode', () => {
  it('is six characters with no ambiguous glyphs', () => {
    for (let i = 0; i < 200; i += 1) {
      const code = makeCode();
      expect(code).toHaveLength(6);
      expect(code).toMatch(/^[a-zA-Z0-9]{6}$/);
      expect(code).not.toMatch(/[ilo0O1I]/);
    }
  });
});

describe('buildTapeRecord', () => {
  it('stores a draft without a share code or expiry', () => {
    const record = buildTapeRecord(draft(), 'Draft');
    expect(record.code).toBeNull();
    expect(record.expires).toBeNull();
    expect(record.status).toBe('Draft');
  });

  it('trims the recipient and falls back to a title', () => {
    const record = buildTapeRecord(draft({ recipient: '  Mara  ', title: '' }), 'Draft');
    expect(record.recipient).toBe('Mara');
    expect(record.title).toBe('untitled');
  });

  it('mints a code and a fourteen-day expiry when a tape goes live', () => {
    const record = buildTapeRecord(draft(), 'Active');
    expect(record.code).toMatch(/^[a-zA-Z0-9]{6}$/);

    const days = (record.expires - record.created) / 86400000;
    expect(days).toBeGreaterThan(13.9);
    expect(days).toBeLessThan(14.1);
  });

  it('copies the tracks and stickers rather than aliasing the draft', () => {
    const d = draft();
    const record = buildTapeRecord(d, 'Draft');
    d.tracks.push({ id: 2, title: 'Linger', artist: 'The Cranberries', len: '4:34' });
    expect(record.tracks).toHaveLength(1);
  });

  /* The regression this suite exists for: an update must not restamp the
     tape. buildTapeRecord doubles as the body of PATCH /api/tapes/:id. */
  it('keeps the original creation date and code when updating', () => {
    const existing = {
      id: 101,
      code: '3fK82a',
      created: new Date('2026-09-01T10:00:00Z'),
    };
    const record = buildTapeRecord(draft({ editingId: 101 }), 'Active', existing);

    expect(record.id).toBe(101);
    expect(record.code).toBe('3fK82a');
    expect(record.created).toEqual(existing.created);
  });

  it('mints a code when an existing draft is sent for the first time', () => {
    const existing = { id: 102, code: null, created: new Date('2026-09-01T10:00:00Z') };
    const record = buildTapeRecord(draft({ editingId: 102 }), 'Active', existing);

    expect(record.code).toMatch(/^[a-zA-Z0-9]{6}$/);
    expect(record.created).toEqual(existing.created);
  });

  it('drops the code again if a live tape is saved back to a draft', () => {
    const existing = { id: 101, code: '3fK82a', created: new Date() };
    const record = buildTapeRecord(draft({ editingId: 101 }), 'Draft', existing);
    expect(record.code).toBeNull();
  });
});
