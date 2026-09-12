import { trackNo } from '../../utils/format.js';
import Button from '../ui/Button.jsx';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CloseIcon,
  PlayIcon,
} from '../ui/Icons.jsx';
import styles from './TrackList.module.css';

/**
 * One song. Three shapes:
 *   editable — wizard step three, with reordering and removal
 *   compact  — the last look and the share screen, read only
 *   reader   — what the recipient sees, with a play control
 */
function TrackRow({ track, index, variant, onMove, onRemove }) {
  const isReader = variant === 'reader';
  const isCompact = variant === 'compact';

  return (
    <div
      className={
        isReader
          ? styles.readerRow
          : `${styles.row} ${variant === 'editable' ? styles.editable : ''}`
      }
    >
      <span className={styles.no}>{trackNo(index)}</span>

      <div className={`${styles.meta} ${isCompact ? styles.metaTight : ''}`}>
        <span
          className={[
            styles.title,
            isCompact && styles.titleCompact,
            isReader && styles.titleReader,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {track.title}
        </span>
        <span
          className={[styles.artist, isReader && styles.artistReader]
            .filter(Boolean)
            .join(' ')}
        >
          {track.artist}
        </span>
      </div>

      <span className={styles.len}>{track.len}</span>

      {variant === 'editable' && (
        <div className={styles.controls}>
          <Button
            variant="ghost"
            size="icon"
            className={styles.control}
            aria-label={`Move ${track.title} earlier`}
            onClick={() => onMove(index, -1)}
          >
            <ChevronUpIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={styles.control}
            aria-label={`Move ${track.title} later`}
            onClick={() => onMove(index, 1)}
          >
            <ChevronDownIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={styles.remove}
            aria-label={`Remove ${track.title}`}
            onClick={() => onRemove(track.id)}
          >
            <CloseIcon />
          </Button>
        </div>
      )}

      {isReader && (
        <Button variant="secondary" size="icon" aria-label={`Play ${track.title}`}>
          <PlayIcon />
        </Button>
      )}
    </div>
  );
}

export default function TrackList({ tracks, variant = 'compact', onMove, onRemove }) {
  const isReader = variant === 'reader';

  return (
    <div className={isReader ? styles.plain : styles.panel}>
      {tracks.map((track, index) => (
        <TrackRow
          key={track.id}
          track={track}
          index={index}
          variant={variant}
          onMove={onMove}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

/** Shown in the wizard when no songs have been added yet. */
export function EmptyTracks() {
  return (
    <div className={styles.empty}>
      <span className={styles.emptyTitle}>side a is empty</span>
      <span className={styles.emptyBody}>
        Start with the song you&apos;d want them to hear first.
      </span>
    </div>
  );
}
