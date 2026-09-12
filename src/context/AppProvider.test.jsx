import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useApp } from './AppContext.js';
import { AppProvider } from './AppProvider.jsx';
import { ToastProvider } from './ToastProvider.jsx';

const wrapper = ({ children }) => (
  <ToastProvider>
    <AppProvider>{children}</AppProvider>
  </ToastProvider>
);

const setup = () => renderHook(() => useApp(), { wrapper });

const signIn = async (result) => {
  await act(async () => {
    await result.current.signIn('login', {
      email: 'wren@somewhere.com',
      password: 'longenough1',
    });
  });
};

describe('account', () => {
  it('starts signed out with nothing stored', () => {
    const { result } = setup();
    expect(result.current.user).toBeNull();
    expect(result.current.tapes).toEqual([]);
  });

  it('signing in loads the account and its tapes', async () => {
    const { result } = setup();
    await signIn(result);
    expect(result.current.user.name).toBe('Wren Adeyemi');
    expect(result.current.tapes).toHaveLength(3);
  });

  it('rejected credentials leave the session untouched', async () => {
    const { result } = setup();
    let outcome;
    await act(async () => {
      outcome = await result.current.signIn('login', { email: 'nope', password: 'x' });
    });
    expect(outcome.ok).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('signing out clears the user, the tapes and the editor', async () => {
    const { result } = setup();
    await signIn(result);
    act(() => result.current.loadTape(result.current.tapes[0]));
    act(() => result.current.signOut());

    expect(result.current.user).toBeNull();
    expect(result.current.tapes).toEqual([]);
    expect(result.current.draft.editingId).toBeNull();
  });
});

describe('storing tapes', () => {
  it('adds a new tape rather than replacing one', async () => {
    const { result } = setup();
    await signIn(result);
    act(() => result.current.startNewDraft());
    act(() => result.current.storeTape('Draft'));

    expect(result.current.tapes).toHaveLength(4);
    expect(result.current.draft.editingId).not.toBeNull();
  });

  it('sending a draft gives it a code and moves it to Active', async () => {
    const { result } = setup();
    await signIn(result);

    const drafted = result.current.tapes.find((t) => t.status === 'Draft');
    act(() => result.current.loadTape(drafted));
    act(() => result.current.storeTape('Active'));

    const sent = result.current.tapes.find((t) => t.id === drafted.id);
    expect(sent.status).toBe('Active');
    expect(sent.code).toMatch(/^[a-zA-Z0-9]{6}$/);
    expect(result.current.tapes).toHaveLength(3);
  });

  /* Regression: re-saving used to restamp `created` with today's date. */
  it('re-saving a tape keeps its original creation date', async () => {
    const { result } = setup();
    await signIn(result);

    const drafted = result.current.tapes.find((t) => t.status === 'Draft');
    const createdBefore = drafted.created;

    act(() => result.current.loadTape(drafted));
    act(() => result.current.storeTape('Draft'));

    const after = result.current.tapes.find((t) => t.id === drafted.id);
    expect(after.created).toEqual(createdBefore);
  });

  it('re-sending a live tape keeps the link it already handed out', async () => {
    const { result } = setup();
    await signIn(result);

    const live = result.current.tapes.find((t) => t.status === 'Active');
    act(() => result.current.loadTape(live));
    act(() => result.current.storeTape('Active'));

    const after = result.current.tapes.find((t) => t.id === live.id);
    expect(after.code).toBe(live.code);
  });

  it('finds a tape by its share code, and nothing by an unknown one', async () => {
    const { result } = setup();
    await signIn(result);

    const live = result.current.tapes.find((t) => t.status === 'Active');
    expect(result.current.findTapeByCode(live.code).id).toBe(live.id);
    expect(result.current.findTapeByCode('zzzzzz')).toBeNull();
  });
});

describe('deleting', () => {
  it('removes the tape', async () => {
    const { result } = setup();
    await signIn(result);
    const target = result.current.tapes[0];
    act(() => result.current.deleteTape(target.id));

    expect(result.current.tapes).toHaveLength(2);
    expect(result.current.tapes.some((t) => t.id === target.id)).toBe(false);
  });

  /* Regression: the editor used to keep pointing at the deleted id, so the
     next save resurrected the tape under its old identity. */
  it('detaches the editor when it was pointed at the deleted tape', async () => {
    const { result } = setup();
    await signIn(result);

    const drafted = result.current.tapes.find((t) => t.status === 'Draft');
    act(() => result.current.loadTape(drafted));
    expect(result.current.draft.editingId).toBe(drafted.id);

    act(() => result.current.deleteTape(drafted.id));
    expect(result.current.draft.editingId).toBeNull();

    act(() => result.current.storeTape('Draft'));
    expect(result.current.tapes.some((t) => t.id === drafted.id)).toBe(false);
  });

  it('leaves the editor alone when a different tape is deleted', async () => {
    const { result } = setup();
    await signIn(result);

    const [first, second] = result.current.tapes;
    act(() => result.current.loadTape(first));
    act(() => result.current.deleteTape(second.id));

    expect(result.current.draft.editingId).toBe(first.id);
  });
});

describe('the tracklist', () => {
  it('refuses a link that is not from a supported service', async () => {
    const { result } = setup();
    let added;
    await act(async () => {
      added = await result.current.addTrackFromLink('https://example.com/x');
    });
    expect(added).toBe(false);
    expect(result.current.draft.tracks).toHaveLength(2);
  });

  it('appends a resolved track to side A', async () => {
    const { result } = setup();
    await act(async () => {
      await result.current.addTrackFromLink('https://open.spotify.com/track/x');
    });
    await waitFor(() => expect(result.current.draft.tracks).toHaveLength(3));
  });

  it('moves a track and stops at the ends', () => {
    const { result } = setup();
    const [a, b] = result.current.draft.tracks;

    act(() => result.current.moveTrack(1, -1));
    expect(result.current.draft.tracks.map((t) => t.id)).toEqual([b.id, a.id]);

    act(() => result.current.moveTrack(0, -1));
    expect(result.current.draft.tracks.map((t) => t.id)).toEqual([b.id, a.id]);

    act(() => result.current.moveTrack(1, 1));
    expect(result.current.draft.tracks.map((t) => t.id)).toEqual([b.id, a.id]);
  });

  it('removes a track by id', () => {
    const { result } = setup();
    const [first] = result.current.draft.tracks;
    act(() => result.current.removeTrack(first.id));
    expect(result.current.draft.tracks.some((t) => t.id === first.id)).toBe(false);
  });
});

describe('stickers', () => {
  const heart = { name: 'Heart', paths: [{ d: 'M0 0', f: '#C8443E', s: 'none', w: 0 }] };

  it('drops each new sticker on its own spot', () => {
    const { result } = setup();
    act(() => result.current.addSticker(heart));
    act(() => result.current.addSticker(heart));

    const [one, two] = result.current.draft.placed;
    expect(result.current.draft.placed).toHaveLength(2);
    expect([one.x, one.y]).not.toEqual([two.x, two.y]);
  });

  it('moves, peels and wipes', () => {
    const { result } = setup();
    act(() => result.current.addSticker(heart));
    const { id } = result.current.draft.placed[0];

    act(() => result.current.moveSticker(id, 42, 60));
    expect(result.current.draft.placed[0]).toMatchObject({ x: 42, y: 60 });

    act(() => result.current.removeSticker(id));
    expect(result.current.draft.placed).toEqual([]);

    act(() => result.current.addSticker(heart));
    act(() => result.current.clearStickers());
    expect(result.current.draft.placed).toEqual([]);
  });
});

describe('starting over', () => {
  it('startNewDraft clears the editor back to its defaults', async () => {
    const { result } = setup();
    await signIn(result);

    act(() => result.current.loadTape(result.current.tapes[0]));
    act(() => result.current.startNewDraft());

    expect(result.current.draft.editingId).toBeNull();
    expect(result.current.draft.recipient).toBe('');
    expect(result.current.draft.letter).toBe('');
    expect(result.current.draft.placed).toEqual([]);
  });
});
