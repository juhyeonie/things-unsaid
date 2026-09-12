import { wordCount } from '../../utils/format.js';
import { cx } from '../../utils/cx.js';

/* ------------------------------------------------------------------ *
 * The letter, on ruled paper. The ruling is a repeating gradient whose
 * pitch matches the line-height of the text sitting on it — 36px in the
 * editor, 32px on the last look, 38px for the recipient.
 *
 * Written out in full rather than generated: Tailwind scans source text,
 * so a class name assembled at runtime would never be emitted.
 * ------------------------------------------------------------------ */

const SHEET = 'rounded-lg bg-card border border-line-paper';
const SALUTATION = 'block font-hand text-ink-faint';

const RULE_EDITOR =
  'bg-[image:repeating-linear-gradient(180deg,transparent_0_35px,var(--color-rule)_35px_36px)]';
const RULE_PREVIEW =
  'bg-[image:repeating-linear-gradient(180deg,transparent_0_31px,var(--color-rule)_31px_32px)]';
const RULE_READER =
  'bg-[image:repeating-linear-gradient(180deg,transparent_0_37px,var(--color-rule)_37px_38px)]';

/** Wizard step four: the letter being written. */
export function LetterEditor({ value, salutation, onChange }) {
  return (
    <div
      className={cx(
        SHEET,
        'w-full max-w-[720px] mx-auto shadow-letter',
        'px-[clamp(18px,4vw,40px)] py-[clamp(20px,4vw,36px)]',
      )}
    >
      <span className={cx(SALUTATION, 'text-[28px] mb-1.5')}>{salutation}</span>
      <textarea
        className={cx(
          'w-full block font-hand text-[27px] leading-[36px] text-ink',
          'p-0 border-none bg-transparent resize-y outline-none',
          'placeholder:text-ink-faint',
          RULE_EDITOR,
        )}
        value={value}
        onChange={onChange}
        rows={9}
        aria-label="Your letter"
        placeholder="say the thing."
      />
      <span className="block text-right text-[12px] text-ink-faint mt-2.5">
        {wordCount(value)} words
      </span>
    </div>
  );
}

/** The last look — no salutation, tighter ruling. */
export function LetterPreview({ text }) {
  return (
    <div className={cx(SHEET, 'px-6 py-[26px] shadow-letter', RULE_PREVIEW)}>
      <p className="font-hand text-[25px] leading-[32px] text-ink whitespace-pre-wrap">
        {text}
      </p>
    </div>
  );
}

/** What the recipient opens. */
export function LetterSheet({ text, salutation }) {
  return (
    <section
      className={cx(
        SHEET,
        'w-full shadow-letter-open animate-rise-slower',
        'px-[clamp(20px,5vw,44px)] py-[clamp(24px,5vw,44px)]',
      )}
    >
      <span className={cx(SALUTATION, 'text-[clamp(26px,5vw,32px)] mb-2')}>
        {salutation}
      </span>
      <p
        className={cx(
          'font-hand text-[clamp(24px,4.6vw,29px)] leading-[38px] text-ink whitespace-pre-wrap',
          RULE_READER,
        )}
      >
        {text}
      </p>
    </section>
  );
}
