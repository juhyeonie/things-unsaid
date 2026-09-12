import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { usePlayer } from './usePlayer.js';

const TRACKS = [
  { id: 1, title: 'About You', artist: 'The 1975', len: '0:05' },
  { id: 2, title: 'Dreams', artist: 'The Cranberries', len: '0:04' },
  { id: 3, title: 'Slow Show', artist: 'The National', len: '0:03' },
];

const setup = (tracks = TRACKS) => renderHook(() => usePlayer(tracks));

/** Runs the simulated clock forward by whole seconds. */
const tick = (seconds) =>
  act(() => {
    vi.advanceTimersByTime(seconds * 1000);
  });

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('what it starts with', () => {
  it('loads the first song, paused at zero', () => {
    const { result } = setup();
    expect(result.current.track.title).toBe('About You');
    expect(result.current.playing).toBe(false);
    expect(result.current.elapsed).toBe(0);
    expect(result.current.duration).toBe(5);
  });

  it('has nowhere to go back to, but somewhere to go on to', () => {
    const { result } = setup();
    expect(result.current.hasPrevious).toBe(false);
    expect(result.current.hasNext).toBe(true);
  });

  it('copes with a tape that has no songs', () => {
    const { result } = setup([]);
    expect(result.current.track).toBeNull();
    act(() => result.current.toggle());
    expect(result.current.playing).toBe(false);
  });
});

describe('the clock', () => {
  it('stands still until it is playing', () => {
    const { result } = setup();
    tick(3);
    expect(result.current.elapsed).toBe(0);
  });

  it('advances a second at a time while playing', () => {
    const { result } = setup();
    act(() => result.current.toggle());
    tick(3);
    expect(result.current.elapsed).toBe(3);
  });

  it('stops where it was when paused', () => {
    const { result } = setup();
    act(() => result.current.toggle());
    tick(2);
    act(() => result.current.toggle());
    tick(5);
    expect(result.current.elapsed).toBe(2);
    expect(result.current.playing).toBe(false);
  });

  it('rolls on to the next song when one runs out', () => {
    const { result } = setup();
    act(() => result.current.toggle());
    tick(5);

    expect(result.current.track.title).toBe('Dreams');
    expect(result.current.elapsed).toBe(0);
    expect(result.current.playing).toBe(true);
  });

  it('stops at the end of side A rather than looping', () => {
    const { result } = setup();
    act(() => result.current.toggle());
    tick(20);

    expect(result.current.track.title).toBe('Slow Show');
    expect(result.current.playing).toBe(false);
    expect(result.current.hasNext).toBe(false);
  });

  it('starts the song over if play is pressed at the end', () => {
    const { result } = setup();
    act(() => result.current.toggle());
    tick(20);
    act(() => result.current.toggle());

    expect(result.current.playing).toBe(true);
    expect(result.current.elapsed).toBe(0);
  });
});

describe('moving between songs', () => {
  it('next loads the following song from its start', () => {
    const { result } = setup();
    act(() => result.current.toggle());
    tick(2);
    act(() => result.current.next());

    expect(result.current.track.title).toBe('Dreams');
    expect(result.current.elapsed).toBe(0);
  });

  /* The convention every player follows: part-way in, previous restarts. */
  it('previous restarts the song when it is already under way', () => {
    const { result } = setup();
    act(() => result.current.next());
    act(() => result.current.toggle());
    tick(3);
    act(() => result.current.previous());

    expect(result.current.track.title).toBe('Dreams');
    expect(result.current.elapsed).toBe(0);
  });

  it('previous steps back when the song has only just begun', () => {
    const { result } = setup();
    act(() => result.current.next());
    act(() => result.current.previous());

    expect(result.current.track.title).toBe('About You');
  });

  it('previous on the first song only rewinds it', () => {
    const { result } = setup();
    act(() => result.current.toggle());
    tick(3);
    act(() => result.current.previous());

    expect(result.current.track.title).toBe('About You');
    expect(result.current.elapsed).toBe(0);
  });
});

describe('choosing from the list', () => {
  it('loads and starts the song that was picked', () => {
    const { result } = setup();
    act(() => result.current.playTrackId(3));

    expect(result.current.track.title).toBe('Slow Show');
    expect(result.current.playing).toBe(true);
  });

  it('pressing the song already loaded pauses and resumes it', () => {
    const { result } = setup();
    act(() => result.current.playTrackId(1));
    expect(result.current.playing).toBe(true);

    act(() => result.current.playTrackId(1));
    expect(result.current.playing).toBe(false);
  });

  it('ignores a song that is not on the tape', () => {
    const { result } = setup();
    act(() => result.current.playTrackId(999));
    expect(result.current.track.title).toBe('About You');
  });
});

describe('seeking', () => {
  it('moves to the requested second', () => {
    const { result } = setup();
    act(() => result.current.seek(3));
    expect(result.current.elapsed).toBe(3);
  });

  it('will not go past either end of the song', () => {
    const { result } = setup();
    act(() => result.current.seek(-10));
    expect(result.current.elapsed).toBe(0);

    act(() => result.current.seek(999));
    expect(result.current.elapsed).toBe(5);
  });
});

describe('a tracklist that changes underneath', () => {
  it('keeps the cursor inside the list when songs are removed', () => {
    const { result, rerender } = renderHook(({ tracks }) => usePlayer(tracks), {
      initialProps: { tracks: TRACKS },
    });

    act(() => result.current.playTrackId(3));
    expect(result.current.track.title).toBe('Slow Show');

    rerender({ tracks: TRACKS.slice(0, 1) });
    expect(result.current.track.title).toBe('About You');
  });
});
