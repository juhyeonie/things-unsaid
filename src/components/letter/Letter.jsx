import { wordCount } from '../../utils/format.js';
import styles from './Letter.module.css';

/** Wizard step four: the letter being written. */
export function LetterEditor({ value, salutation, onChange }) {
  return (
    <div className={`${styles.sheet} ${styles.editor}`}>
      <span className={`${styles.salutation} ${styles.salutationEditor}`}>
        {salutation}
      </span>
      <textarea
        className={styles.textarea}
        value={value}
        onChange={onChange}
        rows={9}
        aria-label="Your letter"
        placeholder="say the thing."
      />
      <span className={styles.count}>{wordCount(value)} words</span>
    </div>
  );
}

/** The last look — no salutation, tighter ruling. */
export function LetterPreview({ text }) {
  return (
    <div className={`${styles.sheet} ${styles.preview}`}>
      <p className={styles.previewText}>{text}</p>
    </div>
  );
}

/** What the recipient opens. */
export function LetterSheet({ text, salutation }) {
  return (
    <section className={`${styles.sheet} ${styles.reader}`}>
      <span className={`${styles.salutation} ${styles.salutationReader}`}>
        {salutation}
      </span>
      <p className={styles.readerText}>{text}</p>
    </section>
  );
}
