import { cx } from '../../utils/cx.js';
import { formatRemaining, formatTime } from '../../utils/format.js';
import {
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForwardIcon,
} from '../ui/Icons.jsx';
import TapeArt from './TapeArt.jsx';

const CARD = cx(
  'w-full bg-card border border-line-strong rounded-[20px]',
  'px-4 py-3.5 sm:px-5 sm:py-4 flex flex-col gap-3.5',
  'shadow-[0_10px_30px_-22px_rgba(36,31,27,0.55)]',
);

const CONTROL = cx(
  'grid place-items-center rounded-full cursor-pointer border border-transparent',
  'text-ink-soft transition-[background,color,translate] duration-[160ms]',
  'enabled:hover:bg-muted enabled:hover:text-ink',
  'disabled:opacity-30 disabled:cursor-not-allowed',
);

/**
 * Compact player for the recipient's side A: sleeve, what is playing, where it
 * has got to, and the three controls anyone expects. Everything is real except
 * the sound — see `usePlayer`.
 */
export default function MusicPlayer({ player, shell, stickers }) {
  const {
    track,
    playing,
    elapsed,
    duration,
    hasPrevious,
    hasNext,
    toggle,
    next,
    previous,
    seek,
  } = player;

  if (!track) return null;

  const percent = duration > 0 ? Math.min(100, (elapsed / duration) * 100) : 0;

  return (
    /* A named region, so the player is somewhere a screen reader can jump to. */
    <section aria-label="Now playing" className="w-full flex flex-col gap-2">
      <div className={CARD}>
        {/* The controls drop to their own line rather than squeezing the
            artist off the end of a narrow card. */}
        <div className="flex items-center gap-3.5 flex-wrap">
          <TapeArt shell={shell} stickers={stickers} />

          <div className="flex flex-col gap-0.5 min-w-0 flex-1 basis-[150px]">
            <span className="text-[12px] tracking-[0.16em] uppercase text-ink-faint font-medium">
              {playing ? 'Playing' : 'Paused'}
            </span>
            <span className="text-[17px] font-medium text-ink overflow-hidden text-ellipsis whitespace-nowrap">
              {track.title}
            </span>
            <span className="text-[14px] text-ink-soft overflow-hidden text-ellipsis whitespace-nowrap">
              {track.artist}
            </span>
          </div>

          <div className="flex items-center gap-1 flex-none ml-auto">
            <button
              type="button"
              className={cx(CONTROL, 'w-10 h-10')}
              aria-label="Previous song"
              disabled={!hasPrevious}
              onClick={previous}
            >
              <SkipBackIcon />
            </button>

            <button
              type="button"
              className={cx(
                'grid place-items-center rounded-full cursor-pointer w-12 h-12 flex-none',
                'bg-accent text-card border border-accent shadow-button',
                'transition-[background,translate] duration-[160ms]',
                'hover:bg-accent-hover hover:-translate-y-px active:translate-y-0 active:bg-accent-active',
              )}
              aria-label={playing ? `Pause ${track.title}` : `Play ${track.title}`}
              onClick={toggle}
            >
              {playing ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
            </button>

            <button
              type="button"
              className={cx(CONTROL, 'w-10 h-10')}
              aria-label="Next song"
              disabled={!hasNext}
              onClick={next}
            >
              <SkipForwardIcon />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          {/* The visible bar is drawn; the range input above it is what the
              pointer and the keyboard actually operate. */}
          <div className="relative h-3 flex items-center rounded-full focus-within:outline-2 focus-within:outline-accent focus-within:outline-offset-4">
            <div className="absolute inset-x-0 h-1 rounded-full bg-line" />
            <div
              className="absolute left-0 h-1 rounded-full bg-accent"
              style={{ width: `${percent}%` }}
            />
            <div
              className="absolute w-3 h-3 rounded-full bg-ink -translate-x-1/2 shadow-[0_1px_3px_rgba(36,31,27,0.35)]"
              style={{ left: `${percent}%` }}
            />
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={1}
              value={Math.min(elapsed, duration)}
              onChange={(e) => seek(Number(e.target.value))}
              aria-label={`Seek within ${track.title}`}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between font-mono text-[12px] text-ink-faint">
            <span>{formatTime(elapsed)}</span>
            <span>{formatRemaining(elapsed, duration)}</span>
          </div>
        </div>
      </div>

      {/* Said plainly, so a moving bar is not mistaken for sound. */}
      <span className="text-[13px] text-ink-faint text-center">
        Silent for now — the songs arrive with the backend.
      </span>
    </section>
  );
}
