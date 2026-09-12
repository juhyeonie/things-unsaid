import { useState } from 'react';

import TrackList, { EmptyTracks } from '../../../components/tracks/TrackList.jsx';
import Button from '../../../components/ui/Button.jsx';
import { FieldError, TextInput } from '../../../components/ui/Field.jsx';
import { BLURB, H2, SECTION_HEADING } from './stepStyles.js';

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
    <section className="flex flex-col gap-6 animate-rise">
      <div className={SECTION_HEADING}>
        <h2 className={H2}>The songs, in order</h2>
        <p className={`${BLURB} max-w-[50ch]`}>
          Paste a Spotify or Apple Music link and we&apos;ll fill in the rest. Order
          matters more than you think.
        </p>
      </div>

      <div className="flex flex-wrap gap-2.5 items-start">
        <div className="flex-[1_1_260px] flex flex-col gap-1.5">
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
          className="text-[15px] px-6 py-3.5 min-h-[48px] rounded-[10px]"
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
