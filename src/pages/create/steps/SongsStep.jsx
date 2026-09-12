import { useState } from 'react';

import TrackList, { EmptyTracks } from '../../../components/tracks/TrackList.jsx';
import Button from '../../../components/ui/Button.jsx';
import { FieldError, TextInput } from '../../../components/ui/Field.jsx';
import styles from '../Create.module.css';

/** Step three — paste a link, it resolves into a track, then reorder side A. */
export default function SongsStep({ tracks, onAdd, onMove, onRemove }) {
  const [link, setLink] = useState('');
  const [error, setError] = useState(false);
  const [adding, setAdding] = useState(false);

  const submit = async () => {
    if (adding) return;
    setAdding(true);
    const added = await onAdd(link);
    setAdding(false);

    if (added) {
      setLink('');
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <section className={`${styles.songSection} tu-rise`}>
      <div className={styles.stepHeading}>
        <h2 className={styles.h2}>The songs, in order</h2>
        <p className={styles.stepBlurb} style={{ maxWidth: '50ch' }}>
          Paste a Spotify or Apple Music link and we&apos;ll fill in the rest. Order
          matters more than you think.
        </p>
      </div>

      <div className={styles.linkRow}>
        <div className={styles.linkField}>
          <TextInput
            tone="mono"
            aria-label="Song link"
            placeholder="https://open.spotify.com/track/…"
            invalid={error}
            value={link}
            onChange={(e) => {
              setLink(e.target.value);
              setError(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit();
            }}
          />
          {error && (
            <FieldError tight>Paste a Spotify or Apple Music track link.</FieldError>
          )}
        </div>
        <Button
          variant="primary"
          size="md"
          className={styles.addBtn}
          onClick={submit}
        >
          {adding ? 'Resolving…' : 'Add'}
        </Button>
      </div>

      {tracks.length > 0 ? (
        <TrackList
          tracks={tracks}
          variant="editable"
          onMove={onMove}
          onRemove={onRemove}
        />
      ) : (
        <EmptyTracks />
      )}
    </section>
  );
}
