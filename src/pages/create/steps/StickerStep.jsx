import Button from '../../../components/ui/Button.jsx';
import { STICKERS } from '../../../data/stickers.js';
import styles from '../Create.module.css';

/** Step two — the sticker tray. Dragging happens on the cassette above. */
export default function StickerStep({ placed, isNarrow, onAdd, onClear }) {
  return (
    <section className={`${styles.stickerSection} tu-rise`}>
      <div className={styles.stickerTop}>
        <div className={styles.stepHeading}>
          <h2 className={styles.h2}>Cover it in stickers</h2>
          <p className={styles.stepBlurb} style={{ maxWidth: '46ch' }}>
            Tap one to drop it on the shell, then drag it where you want. Double-tap
            a sticker to peel it off.
          </p>
        </div>
        <Button
          variant="secondary"
          size="xs"
          className={styles.clearBtn}
          disabled={placed.length === 0}
          onClick={onClear}
        >
          Peel them all off
        </Button>
      </div>

      <div className={isNarrow ? styles.trayScroll : styles.tray}>
        {STICKERS.map((s) => (
          <button
            key={s.name}
            type="button"
            aria-label={`Add ${s.name} sticker`}
            className={styles.stickerBtn}
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

      <span className={styles.note}>
        {placed.length === 0
          ? 'Nothing on it yet.'
          : `${placed.length} sticker${placed.length === 1 ? '' : 's'} — drag them around.`}
      </span>
    </section>
  );
}
