import { LetterPreview } from '../../../components/letter/Letter.jsx';
import TrackList from '../../../components/tracks/TrackList.jsx';
import styles from '../Create.module.css';

/** Step five — the last look before the link exists. */
export default function PreviewStep({ tracks, letterText, recipient }) {
  return (
    <section className={`${styles.previewSection} tu-rise`}>
      <div className={`${styles.stepHeading} ${styles.stepHeadingCentered}`}>
        <span className={styles.previewKicker}>Last look</span>
        <h2 className={styles.h2}>
          {recipient.trim()
            ? `This is what ${recipient.trim()} will see`
            : "This is what they'll see"}
        </h2>
      </div>

      <div className={styles.previewGrid}>
        <TrackList tracks={tracks} variant="compact" />
        <LetterPreview text={letterText} />
      </div>
    </section>
  );
}
