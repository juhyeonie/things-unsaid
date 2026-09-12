import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Cassette from '../components/Cassette/Cassette.jsx';
import { LetterSheet } from '../components/letter/Letter.jsx';
import TrackList from '../components/tracks/TrackList.jsx';
import Button from '../components/ui/Button.jsx';
import { ArrowDownIcon } from '../components/ui/Icons.jsx';
import { useApp } from '../context/AppContext.js';
import { forLineFor, letterTextFor, salutationFor } from '../utils/format.js';
import styles from './Recipient.module.css';

/** Codes that mean "show the tape currently in the editor". */
const WORKING_CODES = ['demo', 'preview'];

/**
 * What the person on the other end sees. The tape arrives closed; opening it
 * starts the reels and reveals side A, and the letter waits until they ask.
 *
 * Mounted with the share code as its key, so every link opens closed.
 */
export default function Recipient() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { user, draft, findTapeByCode, loadTape } = useApp();

  const [opened, setOpened] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);

  /* A link opened directly needs its tape pulled into the editor first. */
  useEffect(() => {
    if (WORKING_CODES.includes(code)) return;

    const tape = findTapeByCode(code);
    if (!tape) return;

    if (tape.status === 'Expired') {
      navigate('/expired', { replace: true });
      return;
    }

    if (draft.editingId !== tape.id) loadTape(tape);
  }, [code, findTapeByCode, loadTape, navigate, draft.editingId]);

  const letterText = letterTextFor(draft.letter);

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <span className={styles.kicker}>Someone made you a tape</span>
        <span className={styles.forLine}>{forLineFor(draft.recipient)}</span>
      </div>

      <div className={styles.tape}>
        <Cassette
          shell={draft.shell}
          label={draft.title}
          stickers={draft.placed}
          spinning={opened}
        />
      </div>

      {!opened && (
        <div className={styles.openBlock}>
          <Button
            variant="dark"
            size="xl"
            soft
            lift
            className={styles.openBtn}
            onClick={() => setOpened(true)}
          >
            Open the mixtape
          </Button>
          <span className={styles.openNote}>Somewhere quiet is better.</span>
        </div>
      )}

      {opened && (
        <section className={styles.songs}>
          <div className={styles.sideRow}>
            <span className={styles.sideLabel}>Side A</span>
            <span className={styles.divider} />
          </div>
          <TrackList tracks={draft.tracks} variant="reader" />
        </section>
      )}

      {opened && !letterOpen && (
        <button
          type="button"
          className={styles.letterHint}
          onClick={() => setLetterOpen(true)}
        >
          <ArrowDownIcon />
          <span className={styles.letterHintText}>there&apos;s a letter too</span>
        </button>
      )}

      {letterOpen && (
        <>
          <LetterSheet
            text={letterText}
            salutation={salutationFor(draft.recipient)}
          />
          <Button
            variant="secondary"
            size="md"
            className={styles.cta}
            onClick={() => navigate(user ? '/dashboard' : '/')}
          >
            {user ? 'Back to my mixtapes' : 'Make one back'}
          </Button>
        </>
      )}
    </div>
  );
}
