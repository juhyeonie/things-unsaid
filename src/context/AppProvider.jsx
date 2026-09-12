import { useCallback, useMemo, useRef, useState } from 'react';

import { STARTER_TRACKS } from '../data/catalog.js';
import { DEFAULT_SHELL } from '../data/shells.js';
import { SPOTS } from '../data/stickers.js';
import * as api from '../services/mockApi.js';
import { AppContext } from './AppContext.js';
import { useToast } from './ToastContext.js';

/* ------------------------------------------------------------------ *
 * Application state.
 *
 * Three things live here: the signed-in user, the tapes they own, and the
 * tape currently being edited ("the draft"). Every mutation that will one
 * day hit the server goes through ../services/mockApi.js, so components
 * never need to change when the backend arrives.
 * ------------------------------------------------------------------ */

const DEFAULT_TITLE = "for when you can't sleep";

const emptyDraft = () => ({
  editingId: null,
  activeCode: null,
  shell: DEFAULT_SHELL,
  title: DEFAULT_TITLE,
  recipient: '',
  letter: '',
  placed: [],
  tracks: STARTER_TRACKS.map((t) => ({ ...t })),
  nextId: STARTER_TRACKS.length + 1,
});

export function AppProvider({ children }) {
  const { flash } = useToast();

  const [user, setUser] = useState(null);
  const [tapes, setTapes] = useState([]);
  const [remember, setRemember] = useState(true);
  const [draft, setDraft] = useState(emptyDraft);
  const [dashFilter, setDashFilter] = useState('All');

  /* Which catalog entry the next resolved link becomes. */
  const catalogIndex = useRef(0);

  const patchDraft = useCallback((patch) => {
    setDraft((d) => ({ ...d, ...(typeof patch === 'function' ? patch(d) : patch) }));
  }, []);

  /* ---------------------------------------------------------------- *
   * Account (mocked — no real authentication yet)
   * ---------------------------------------------------------------- */

  const signIn = useCallback(
    async (mode, fields) => {
      const result =
        mode === 'login' ? await api.login(fields) : await api.register(fields);

      if (!result.ok) return result;

      setUser(result.user);
      setTapes(result.tapes);
      flash(mode === 'login' ? 'Welcome back.' : 'Account made. Welcome.');
      return result;
    },
    [flash],
  );

  const signOut = useCallback(() => {
    setUser(null);
    setTapes([]);
    setDraft(emptyDraft());
    flash('Logged out.');
  }, [flash]);

  /* ---------------------------------------------------------------- *
   * Draft lifecycle
   * ---------------------------------------------------------------- */

  const startNewDraft = useCallback(() => {
    catalogIndex.current = 0;
    setDraft(emptyDraft());
  }, []);

  /** Copies a saved tape into the editor, for continuing or previewing it. */
  const loadTape = useCallback((tape) => {
    setDraft({
      editingId: tape.id,
      activeCode: tape.code,
      shell: tape.shell,
      title: tape.title,
      recipient: tape.recipient,
      letter: tape.letter,
      placed: tape.stickers.slice(),
      tracks: tape.tracks.slice(),
      nextId: tape.tracks.length + 1,
    });
  }, []);

  /** Saves the draft as a Draft or an Active tape. Returns the stored record. */
  const storeTape = useCallback(
    (status) => {
      const record = api.buildTapeRecord(
        draft,
        status,
        draft.editingId ? draft.activeCode : null,
      );

      setTapes((list) =>
        list.some((t) => t.id === record.id)
          ? list.map((t) => (t.id === record.id ? record : t))
          : list.concat(record),
      );

      patchDraft({ editingId: record.id, activeCode: record.code });
      flash(status === 'Active' ? 'Link generated.' : 'Draft saved.');
      return record;
    },
    [draft, flash, patchDraft],
  );

  const deleteTape = useCallback(
    (id) => {
      setTapes((list) => list.filter((t) => t.id !== id));
      flash('Deleted.');
    },
    [flash],
  );

  const findTapeByCode = useCallback(
    (code) => tapes.find((t) => t.code === code) || null,
    [tapes],
  );

  /* ---------------------------------------------------------------- *
   * Stickers
   * ---------------------------------------------------------------- */

  const addSticker = useCallback((sticker) => {
    setDraft((d) => ({
      ...d,
      placed: d.placed.concat({
        id: Date.now() + Math.random(),
        name: sticker.name,
        paths: sticker.paths,
        ...SPOTS[d.placed.length % SPOTS.length],
        rot: Math.round(-16 + Math.random() * 32),
        size: 13,
      }),
    }));
  }, []);

  const moveSticker = useCallback((id, x, y) => {
    setDraft((d) => ({
      ...d,
      placed: d.placed.map((p) => (p.id === id ? { ...p, x, y } : p)),
    }));
  }, []);

  const setStickerDragging = useCallback((id) => {
    setDraft((d) => ({
      ...d,
      placed: d.placed.map((p) => ({ ...p, dragging: p.id === id })),
    }));
  }, []);

  const removeSticker = useCallback(
    (id) => {
      setDraft((d) => ({ ...d, placed: d.placed.filter((p) => p.id !== id) }));
      flash('Sticker peeled off.');
    },
    [flash],
  );

  const clearStickers = useCallback(() => {
    setDraft((d) => (d.placed.length ? { ...d, placed: [] } : d));
    flash('Shell wiped clean.');
  }, [flash]);

  /* ---------------------------------------------------------------- *
   * Tracks
   * ---------------------------------------------------------------- */

  /** Resolves a pasted link and appends the track. Returns false if invalid. */
  const addTrackFromLink = useCallback(
    async (link) => {
      const result = await api.resolveTrack(link.trim(), catalogIndex.current);
      if (!result.ok) return false;

      catalogIndex.current += 1;
      setDraft((d) => ({
        ...d,
        tracks: d.tracks.concat({ id: d.nextId, ...result.track }),
        nextId: d.nextId + 1,
      }));
      flash('Added to side A.');
      return true;
    },
    [flash],
  );

  const removeTrack = useCallback(
    (id) => {
      setDraft((d) => ({ ...d, tracks: d.tracks.filter((t) => t.id !== id) }));
      flash('Taken off the tape.');
    },
    [flash],
  );

  /** Swaps a track with its neighbour. `dir` is -1 for earlier, 1 for later. */
  const moveTrack = useCallback((index, dir) => {
    setDraft((d) => {
      const target = index + dir;
      if (target < 0 || target >= d.tracks.length) return d;
      const tracks = d.tracks.slice();
      [tracks[target], tracks[index]] = [tracks[index], tracks[target]];
      return { ...d, tracks };
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      tapes,
      draft,
      remember,
      setRemember,
      dashFilter,
      setDashFilter,
      patchDraft,
      signIn,
      signOut,
      startNewDraft,
      loadTape,
      storeTape,
      deleteTape,
      findTapeByCode,
      addSticker,
      moveSticker,
      setStickerDragging,
      removeSticker,
      clearStickers,
      addTrackFromLink,
      removeTrack,
      moveTrack,
    }),
    [
      user,
      tapes,
      draft,
      remember,
      dashFilter,
      patchDraft,
      signIn,
      signOut,
      startNewDraft,
      loadTape,
      storeTape,
      deleteTape,
      findTapeByCode,
      addSticker,
      moveSticker,
      setStickerDragging,
      removeSticker,
      clearStickers,
      addTrackFromLink,
      removeTrack,
      moveTrack,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
