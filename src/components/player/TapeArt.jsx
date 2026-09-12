/**
 * The player's artwork square.
 *
 * There is no per-song artwork and there will not be until a music service is
 * wired up, so the tape stands in for it: its own shell colour, wearing its own
 * stickers. Square rather than the cassette's 16:10, because a player wants a
 * sleeve.
 */
export default function TapeArt({ shell = '#F2C7CB', stickers = [], size = 'h-16 w-16' }) {
  /* Two at most, and nudged inward — at this size a faithful scatter is mud. */
  const shown = stickers.slice(0, 2);

  return (
    <div
      className={`${size} flex-none relative rounded-xl overflow-hidden border border-[rgba(36,31,27,0.14)] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]`}
      style={{ background: shell }}
      aria-hidden="true"
    >
      {/* A slice of the J-card, so the square still reads as a cassette. */}
      <div className="absolute top-[14%] left-[12%] right-[12%] h-[30%] rounded-[2px] bg-card/90 border border-[rgba(36,31,27,0.1)]" />

      {/* Both reels, shrunk to a suggestion. */}
      <div className="absolute bottom-[20%] left-0 right-0 flex items-center justify-center gap-[16%]">
        <div className="w-[22%] aspect-square rounded-full bg-ink-deep border border-[rgba(255,255,255,0.18)] grid place-items-center">
          <div className="w-[42%] aspect-square rounded-full bg-[#F4E9D6]" />
        </div>
        <div className="w-[22%] aspect-square rounded-full bg-ink-deep border border-[rgba(255,255,255,0.18)] grid place-items-center">
          <div className="w-[42%] aspect-square rounded-full bg-[#F4E9D6]" />
        </div>
      </div>

      {shown.map((s, i) => (
        <svg
          key={s.id}
          viewBox="0 0 24 24"
          className="absolute w-[30%] h-[30%] drop-shadow-[0_1px_2px_rgba(36,31,27,0.25)]"
          style={{
            left: i === 0 ? '6%' : undefined,
            right: i === 1 ? '6%' : undefined,
            top: i === 0 ? '8%' : undefined,
            bottom: i === 1 ? '6%' : undefined,
            transform: `rotate(${s.rot || 0}deg)`,
          }}
        >
          {s.paths.map((p, n) => (
            <path
              key={n}
              d={p.d}
              fill={p.f}
              stroke={p.s}
              strokeWidth={p.w}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </svg>
      ))}
    </div>
  );
}
