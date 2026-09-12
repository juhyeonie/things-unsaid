import styles from './Cassette.module.css';

/**
 * The cassette itself: shell, J-card label, reels and any stickers stuck
 * to it. Used decoratively on the landing page and interactively in the
 * wizard, where stickers can be dragged and double-tapped to peel off.
 */
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
  const hubClass = spinning ? `${styles.hub} ${styles.spinning}` : styles.hub;

  return (
    <div ref={bodyRef} className={styles.shell} style={{ background: shell }}>
      <div className={styles.bevel} />

      <div className={styles.card}>
        <div className={styles.cardTop}>
          <span className={styles.label}>{label?.length ? label : 'untitled'}</span>
          <span className={styles.side}>A</span>
        </div>
        <div className={styles.rules}>
          <div className={styles.rule} />
          <div className={styles.rule} />
        </div>
      </div>

      <div className={styles.window}>
        <div className={styles.reel}>
          <div className={hubClass} />
        </div>
        <div className={styles.reel}>
          <div className={hubClass} />
        </div>
      </div>

      <div className={styles.feet}>
        <div className={styles.foot} />
        <div className={styles.tab} />
        <div className={styles.tab} />
        <div className={styles.foot} />
      </div>

      {stickers.map((s) => (
        <div
          key={s.id}
          role="img"
          aria-label={`${s.name} sticker`}
          className={styles.sticker}
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
            className={styles.stickerSvg}
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
