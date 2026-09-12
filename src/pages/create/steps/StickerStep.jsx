import Button from '../../../components/ui/Button.jsx';
import { STICKERS } from '../../../data/stickers.js';
import { BLURB, H2, NOTE, SECTION_HEADING } from './stepStyles.js';

/* On phones the tray becomes a swipeable strip instead of wrapping. */
const TRAY = 'flex flex-wrap gap-3';
const TRAY_SCROLL =
  'flex flex-nowrap gap-3 overflow-x-auto overflow-y-hidden px-0.5 pt-1.5 pb-3 snap-x snap-proximity';

const STICKER_BTN =
  'flex-none w-16 h-16 grid place-items-center rounded-xl border border-line bg-card ' +
  'cursor-pointer snap-start transition-[translate,rotate,border-color] duration-[180ms] ease-out-soft ' +
  'hover:-translate-y-[3px] hover:-rotate-4 hover:border-line-hover active:translate-y-0 active:rotate-0';

/** Step two — the sticker tray. Dragging happens on the cassette above. */
export default function StickerStep({ placed, isNarrow, onAdd, onClear }) {
  return (
    <section className="flex flex-col gap-5 animate-rise">
      <div className="flex flex-wrap gap-4 items-end justify-between">
        <div className={SECTION_HEADING}>
          <h2 className={H2}>Cover it in stickers</h2>
          <p className={`${BLURB} max-w-[46ch]`}>
            Tap one to drop it on the shell, then drag it where you want. Double-tap
            a sticker to peel it off.
          </p>
        </div>
        <Button
          variant="secondary"
          className="text-[14px] px-4 py-3 min-h-[44px] rounded-[10px]"
          disabled={placed.length === 0}
          onClick={onClear}
        >
          Peel them all off
        </Button>
      </div>

      <div className={isNarrow ? TRAY_SCROLL : TRAY}>
        {STICKERS.map((s) => (
          <button
            key={s.name}
            type="button"
            aria-label={`Add ${s.name} sticker`}
            className={STICKER_BTN}
            onClick={() => onAdd(s)}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" aria-hidden="true">
              {s.paths.map((p, i) => (
                <path
                  key={i}
                  d={p.d}
                  fill={p.f}
                  stroke={p.s}
                  strokeWidth={p.w}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}
            </svg>
          </button>
        ))}
      </div>

      <span className={NOTE}>
        {placed.length === 0
          ? 'Nothing on it yet.'
          : `${placed.length} sticker${placed.length === 1 ? '' : 's'} — drag them around.`}
      </span>
    </section>
  );
}
