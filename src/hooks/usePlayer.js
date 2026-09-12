import { useCallback, useEffect, useRef, useState } from 'react';

import { parseLength } from '../utils/format.js';

/**
 * Drives the player on the recipient's screen.
 *
 * There is no audio yet — the songs are links, and resolving them to something
 * playable is backend work. So the clock is simulated: while playing, elapsed
 * advances a second at a time and the tape moves to the next song when a track
 * runs out. Everything the UI needs is real except the sound.
 *
 * When audio does arrive this becomes a thin wrapper over an <audio> element:
 * `elapsed` comes from timeupdate, `toggle` from play/pause, `seek` from
 * currentTime. The shape it returns should not need to change.
 */
export function usePlayer(tracks = []) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  /* A tracklist that changes under us should not leave the cursor past its end. */
  const safeIndex = Math.min(index, Math.max(0, tracks.length - 1));
  const track = tracks[safeIndex] ?? null;
  const duration = parseLength(track?.len);

  /**
   * The tick has to be able to fire repeatedly without a render in between —
   * that is what fake timers do, and it is what a busy main thread does. So the
   * values it reads live in a ref that it updates itself, rather than in a
   * closure that only refreshes when React gets around to re-rendering.
   */
  const live = useRef({ index: safeIndex, elapsed, duration, tracks, playing });

  /* Caught up after every render for anything that changed outside this hook;
     the tick and the controls below keep it current between renders. */
  useEffect(() => {
    live.current.index = safeIndex;
    live.current.elapsed = elapsed;
    live.current.duration = duration;
    live.current.tracks = tracks;
    live.current.playing = playing;
  });

  /**
   * Moves to another song. Skipping keeps whatever the tape was doing — a
   * paused player should not start itself because someone looked ahead — while
   * choosing a song outright asks for it to play.
   */
  const goTo = useCallback((nextIndex, { play = null } = {}) => {
    const list = live.current.tracks;
    live.current.index = nextIndex;
    live.current.elapsed = 0;
    live.current.duration = parseLength(list[nextIndex]?.len);

    setIndex(nextIndex);
    setElapsed(0);
    if (play !== null) setPlaying(play);
  }, []);

  const moveElapsed = useCallback((seconds) => {
    live.current.elapsed = seconds;
    setElapsed(seconds);
  }, []);

  const next = useCallback(() => {
    const { index: i, tracks: list } = live.current;
    if (i >= list.length - 1) {
      /* End of side A: stop on the last frame rather than looping. */
      setPlaying(false);
      moveElapsed(parseLength(list[list.length - 1]?.len));
      return;
    }
    goTo(i + 1);
  }, [goTo, moveElapsed]);

  /* Matches the convention every player uses: part-way in, restart the song. */
  const previous = useCallback(() => {
    const { index: i, elapsed: e } = live.current;
    if (e > 2 || i === 0) {
      moveElapsed(0);
      return;
    }
    goTo(i - 1);
  }, [goTo, moveElapsed]);

  const toggle = useCallback(() => {
    if (!live.current.tracks[live.current.index]) return;
    /* Pressing play at the very end starts the song again. */
    if (!playing && live.current.elapsed >= live.current.duration) moveElapsed(0);
    setPlaying((p) => !p);
  }, [playing, moveElapsed]);

  const seek = useCallback(
    (seconds) =>
      moveElapsed(Math.min(live.current.duration, Math.max(0, Math.floor(seconds)))),
    [moveElapsed],
  );

  const playTrackId = useCallback(
    (id) => {
      const found = live.current.tracks.findIndex((t) => t.id === id);
      if (found === -1) return;
      /* Pressing play on the song already loaded toggles it instead. */
      if (found === live.current.index) {
        toggle();
        return;
      }
      goTo(found, { play: true });
    },
    [goTo, toggle],
  );

  useEffect(() => {
    if (!playing || !track) return undefined;

    const id = setInterval(() => {
      const { elapsed: e, duration: d } = live.current;
      if (e + 1 >= d) {
        next();
        return;
      }
      moveElapsed(e + 1);
    }, 1000);

    return () => clearInterval(id);
  }, [playing, track, next, moveElapsed]);

  return {
    track,
    index: safeIndex,
    playing,
    elapsed,
    duration,
    hasPrevious: safeIndex > 0 || elapsed > 2,
    hasNext: safeIndex < tracks.length - 1,
    toggle,
    next,
    previous,
    seek,
    playTrackId,
  };
}
