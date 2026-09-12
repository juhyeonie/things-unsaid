import { LetterEditor } from '../../../components/letter/Letter.jsx';
import { salutationFor } from '../../../utils/format.js';
import styles from '../Create.module.css';

/** Step four — the letter itself. */
export default function LetterStep({ letter, recipient, onPatch }) {
  return (
    <section className={`${styles.letterSection} tu-rise`}>
      <div className={`${styles.stepHeading} ${styles.stepHeadingCentered}`}>
        <h2 className={styles.h2}>The letter</h2>
        <p className={styles.stepBlurb} style={{ maxWidth: '44ch' }}>
          They&apos;ll read this after the songs. You can&apos;t edit it once it&apos;s
          sent.
        </p>
      </div>

      <LetterEditor
        value={letter}
        salutation={salutationFor(recipient)}
        onChange={(e) => onPatch({ letter: e.target.value })}
      />
    </section>
  );
}
