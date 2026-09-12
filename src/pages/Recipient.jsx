import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Cassette from '../components/Cassette/Cassette.jsx';
import { LetterSheet } from '../components/letter/Letter.jsx';
import MusicPlayer from '../components/player/MusicPlayer.jsx';
import TrackList from '../components/tracks/TrackList.jsx';
import Button from '../components/ui/Button.jsx';
import { ArrowDownIcon } from '../components/ui/Icons.jsx';
import { useApp } from '../context/AppContext.js';
import { usePlayer } from '../hooks/usePlayer.js';
import { forLineFor, salutationFor } from '../utils/format.js';

/** Codes that mean "show the tape currently in the editor". */
const WORKING_CODES = ['demo', 'preview'];

/**
 * What the person on the other end sees. The tape arrives closed; opening it
 * starts the reels and reveals side A, and the letter waits until they ask.
 *
 * Mounted with the share code as its key, so every link opens closed.
 *
 * A code that cannot be resolved — unknown, or a tape that has expired — sends
 * the visitor to the faded-away screen. This is the one route that is always
 * opened cold by someone with no session, so it must never fall back to
 * whatever happens to be in the editor.
 */
export default function Recipient() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { user, draft, findTapeByCode } = useApp();

  const [opened, setOpened] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);

  const isWorking = WORKING_CODES.includes(code);
  const tape = isWorking ? null : findTapeByCode(code);
  const unresolved = !isWorking && (!tape || tape.status === 'Expired');

  /* The demo and the sender's own preview read from the editor; a real share
     code reads from the stored tape. Resolved above the early return, because
     the player's hook has to run on every render. */
  const view = tape || draft;
  const stickers = view.stickers || view.placed;
  const hasLetter = view.letter.trim().length > 0;

  const player = usePlayer(view.tracks);

  useEffect(() => {
    if (unresolved) navigate('/expired', { replace: true });
  }, [unresolved, navigate]);

  /* Render nothing on the way out, rather than flashing the wrong tape. */
  if (unresolved) return null;

  return (
    <div className="flex flex-col items-center gap-[clamp(40px,7vw,88px)] w-full max-w-[760px] mx-auto px-[clamp(20px,5vw,40px)] pt-[clamp(32px,6vw,72px)] pb-[clamp(64px,10vw,140px)]">
      <div className="flex flex-col items-center gap-2.5 text-center animate-rise-slower">
        <span className="text-[12px] tracking-[0.2em] uppercase text-ink-faint font-medium">
          Someone made you a tape
        </span>
        <span className="font-hand text-[clamp(40px,9vw,64px)] leading-none text-ink">
          {forLineFor(view.recipient)}
        </span>
      </div>

      <div className="w-full max-w-[520px] animate-rise-hero-late">
        <Cassette
          shell={view.shell}
          label={view.title}
          stickers={stickers}
          spinning={opened && player.playing}
        />
      </div>

      {!opened && (
        <div className="flex flex-col items-center gap-3.5">
          <Button
            variant="dark"
            lift
            className="text-[17px] px-[38px] py-[18px] min-h-[54px] rounded-xl"
            onClick={() => setOpened(true)}
          >
            Open the mixtape
          </Button>
          <span className="text-[13px] text-ink-faint">Somewhere quiet is better.</span>
        </div>
      )}

      {opened && (
        <section className="w-full flex flex-col gap-[18px] animate-rise-slower">
          <MusicPlayer player={player} shell={view.shell} stickers={stickers} />

          <div className="flex items-center gap-3">
            <span className="text-[12px] tracking-[0.18em] uppercase text-ink-faint font-medium whitespace-nowrap">
              Side A
            </span>
            <span className="flex-1 h-px bg-line" />
          </div>
          <TrackList
            tracks={view.tracks}
            variant="reader"
            onPlay={(t) => player.playTrackId(t.id)}
            activeTrackId={player.track?.id}
            playing={player.playing}
          />
        </section>
      )}

      {/* Only offered when there is a letter to read. An unwritten one is not
          filled in with placeholder prose — that would put words in the
          sender's mouth. */}
      {opened && hasLetter && !letterOpen && (
        <button
          type="button"
          className="flex flex-col items-center gap-2.5 font-sans bg-none border-none cursor-pointer whitespace-nowrap px-4 py-2 text-ink-soft animate-fade"
          onClick={() => setLetterOpen(true)}
        >
          <ArrowDownIcon />
          <span className="font-hand text-[30px] text-accent">
            there&apos;s a letter too
          </span>
        </button>
      )}

      {letterOpen && hasLetter && (
        <LetterSheet text={view.letter} salutation={salutationFor(view.recipient)} />
      )}

      {opened && (letterOpen || !hasLetter) && (
        <Button
          variant="secondary"
          className="text-[15px] px-[26px] py-[15px] min-h-[50px] rounded-[10px]"
          onClick={() => navigate(user ? '/dashboard' : '/')}
        >
          {user ? 'Back to my mixtapes' : 'Make one back'}
        </Button>
      )}
    </div>
  );
}
