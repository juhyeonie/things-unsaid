import { cx } from '../../utils/cx.js';

/**
 * The cassette itself: shell, J-card label, reels and any stickers stuck
 * to it. Used decoratively on the landing page and interactively in the
 * wizard, where stickers can be dragged and double-tapped to peel off.
 *
 * The shell is a container, so the handwritten label scales with the tape
 * rather than with the viewport.
 */

const SHELL = cx(
  'relative w-full aspect-[16/10] @container rounded-md',
  'border border-[rgba(36,31,27,0.18)] shadow-tape font-sans',
  'touch-none transition-[background] duration-[220ms]',
);

const CARD = cx(
  'absolute top-[7%] left-[7%] right-[7%] h-[43%] bg-card rounded-[3px]',
  'border border-[rgba(36,31,27,0.14)] px-[3.6%] py-[2.6%]',
  'flex flex-col justify-between overflow-hidden',
  'shadow-[inset_0_-1px_0_rgba(36,31,27,0.06)]',
);

const WINDOW = cx(
  'absolute top-[56%] left-[13%] right-[13%] bottom-[17%]',
  'bg-[rgba(36,31,27,0.38)] rounded-[4px] flex items-center justify-around px-[6%]',
  'shadow-[inset_0_1px_3px_rgba(0,0,0,0.35)]',
);

const REEL = cx(
  'w-[26%] aspect-square rounded-full bg-ink-deep',
  'border-2 border-[rgba(255,255,255,0.16)] grid place-items-center',
);

const HUB = 'w-[46%] aspect-square rounded-full bg-[#F4E9D6] border-2 border-dashed border-ink-faint';

export default function Cassette({
  shell = '#F2C7CB',
  label = '',
  stickers = [],
  spinning = false,
  interactive = false,
  bodyRef = null,
  onStickerGrab,
  onStickerPeel,
}) {
  const hub = cx(HUB, spinning && 'animate-reel');

  return (
    <div ref={bodyRef} className={SHELL} style={{ background: shell }}>
      {/* Hairline bevel just inside the shell edge. */}
      <div className="absolute inset-[3.2%] rounded-[4px] border border-[rgba(255,255,255,0.4)] pointer-events-none" />

      <div className={CARD}>
        <div className="flex justify-between items-start gap-2">
          <span className="font-hand text-[clamp(16px,6cqi,30px)] leading-[1.02] text-ink overflow-hidden [overflow-wrap:anywhere]">
            {label?.length ? label : 'untitled'}
          </span>
          <span className="text-[9px] tracking-[0.16em] font-semibold text-ink-faint border border-line-strong rounded-[3px] px-[5px] py-[2px] whitespace-nowrap flex-none">
            A
          </span>
        </div>
        <div className="flex flex-col gap-[5px]">
          <div className="h-px bg-rule" />
          <div className="h-px bg-rule" />
        </div>
      </div>

      <div className={WINDOW}>
        <div className={REEL}>
          <div className={hub} />
        </div>
        <div className={REEL}>
          <div className={hub} />
        </div>
      </div>

      {/* Spool holes and write-protect tabs along the bottom edge. */}
      <div className="absolute bottom-[4.5%] left-0 right-0 flex justify-center gap-[9%] items-center pointer-events-none">
        <div className="w-[4.4%] aspect-square rounded-full bg-[rgba(36,31,27,0.32)]" />
        <div className="w-[10%] h-1.5 rounded-[2px] bg-[rgba(36,31,27,0.32)]" />
        <div className="w-[10%] h-1.5 rounded-[2px] bg-[rgba(36,31,27,0.32)]" />
        <div className="w-[4.4%] aspect-square rounded-full bg-[rgba(36,31,27,0.32)]" />
      </div>

      {stickers.map((s) => (
        <div
          key={s.id}
          role="img"
          aria-label={`${s.name} sticker`}
          className="absolute aspect-square touch-none transition-transform duration-[160ms] ease-out-soft"
          onPointerDown={interactive ? (e) => onStickerGrab?.(s.id, e) : undefined}
          onDoubleClick={interactive ? () => onStickerPeel?.(s.id) : undefined}
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size || 14}%`,
            transform: `translate(-50%, -50%) rotate(${s.rot}deg) scale(${s.dragging ? 1.12 : 1})`,
            cursor: interactive ? 'grab' : 'default',
            zIndex: s.dragging ? 5 : 2,
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="block drop-shadow-[0_2px_3px_rgba(36,31,27,0.28)]"
          >
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
        </div>
      ))}
    </div>
  );
}
