import { LetterEditor } from '../../../components/letter/Letter.jsx';
import { salutationFor } from '../../../utils/format.js';
import { BLURB, H2, SECTION_HEADING_CENTERED } from './stepStyles.js';

/** Step four — the letter itself. */
export default function LetterStep({ letter, recipient, onPatch }) {
  return (
    <section className="flex flex-col gap-5 animate-rise">
      <div className={SECTION_HEADING_CENTERED}>
        <h2 className={H2}>The letter</h2>
        <p className={`${BLURB} max-w-[44ch]`}>
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
