import { LetterPreview } from '../../../components/letter/Letter.jsx';
import TrackList from '../../../components/tracks/TrackList.jsx';
import { H2, SECTION_HEADING_CENTERED } from './stepStyles.js';

/** Step five — the last look before the link exists. */
export default function PreviewStep({ tracks, letterText, recipient }) {
  return (
    <section className="flex flex-col gap-7 animate-rise">
      <div className={SECTION_HEADING_CENTERED}>
        <span className="text-[12px] tracking-[0.18em] uppercase text-ink-faint font-medium">
          Last look
        </span>
        <h2 className={H2}>
          {recipient.trim()
            ? `This is what ${recipient.trim()} will see`
            : "This is what they'll see"}
        </h2>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-6">
        <TrackList tracks={tracks} variant="compact" />
        <LetterPreview text={letterText} />
      </div>
    </section>
  );
}
