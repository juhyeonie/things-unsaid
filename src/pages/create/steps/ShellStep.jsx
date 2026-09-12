import { Field } from '../../../components/ui/Field.jsx';
import { CheckIcon } from '../../../components/ui/Icons.jsx';
import { SHELLS, checkColorFor, shellName } from '../../../data/shells.js';
import styles from '../Create.module.css';

/** Step one — the shell colour, who it is for, and what the label says. */
export default function ShellStep({ shell, title, recipient, onPatch }) {
  return (
    <section className={`${styles.shellSection} tu-rise`}>
      <div className={styles.column}>
        <div className={styles.stepHeading}>
          <h2 className={styles.h2}>Pick a shell</h2>
          <p className={styles.stepBlurb} style={{ maxWidth: '42ch' }}>
            Eight colors, all of them real tape stock. Pick the one that sounds like
            them.
          </p>
        </div>

        <div className={styles.swatches}>
          {SHELLS.map((c) => {
            const selected = shell === c.hex;
            return (
              <button
                key={c.hex}
                type="button"
                aria-label={`${c.name} shell`}
                aria-pressed={selected}
                className={`${styles.swatch} ${selected ? styles.swatchOn : ''}`}
                style={{ background: c.hex }}
                onClick={() => onPatch({ shell: c.hex })}
              >
                {selected && <CheckIcon size={18} stroke={checkColorFor(c.hex)} />}
              </button>
            );
          })}
        </div>

        <span className={styles.note}>Selected: {shellName(shell)}</span>
      </div>

      <div className={styles.column}>
        <Field
          label="Who is it for"
          placeholder="their name"
          value={recipient}
          onChange={(e) => onPatch({ recipient: e.target.value })}
        />
        <Field
          label="What's written on the label"
          tone="hand"
          maxLength={40}
          placeholder="for when you can't sleep"
          value={title}
          hint={`${title.length} / 40 — it goes on the J-card in your handwriting.`}
          onChange={(e) => onPatch({ title: e.target.value })}
        />
      </div>
    </section>
  );
}
