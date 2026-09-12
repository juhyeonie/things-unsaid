import { trackNo } from '../../utils/format.js';
import { cx } from '../../utils/cx.js';
import Button from '../ui/Button.jsx';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CloseIcon,
  PlayIcon,
} from '../ui/Icons.jsx';

const PANEL = 'flex flex-col p-2.5 bg-card border border-line-strong rounded-2xl';

const ROW = 'flex items-center gap-3 flex-wrap p-3 rounded-[10px] transition-[background] duration-[160ms]';
const READER_ROW = 'flex items-center gap-3.5 flex-wrap px-2 py-3.5 border-b border-line-song';

const ICON_BTN = 'w-11 h-11 min-h-[44px] p-0 flex-none rounded-[10px]';

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
        isReader ? READER_ROW : cx(ROW, variant === 'editable' && 'hover:bg-paper')
      }
    >
      <span className="text-[12px] font-mono text-ink-faint w-[22px] flex-none">
        {trackNo(index)}
      </span>

      <div
        className={cx(
          'flex flex-col gap-0.5 min-w-0',
          isCompact ? 'flex-1' : 'flex-[1_1_150px]',
        )}
      >
        <span
          className={cx(
            'font-medium overflow-hidden text-ellipsis whitespace-nowrap',
            isReader ? 'text-[17px]' : isCompact ? 'text-[15px]' : 'text-[16px]',
          )}
        >
          {track.title}
        </span>
        <span
          className={cx(
            'text-ink-soft overflow-hidden text-ellipsis whitespace-nowrap',
            isReader ? 'text-[14px]' : 'text-[13px]',
          )}
        >
          {track.artist}
        </span>
      </div>

      <span className="text-[13px] font-mono text-ink-faint">{track.len}</span>

      {variant === 'editable' && (
        <div className="flex gap-1 flex-none">
          <Button
            variant="ghost"
            className={ICON_BTN}
            aria-label={`Move ${track.title} earlier`}
            onClick={() => onMove(index, -1)}
          >
            <ChevronUpIcon />
          </Button>
          <Button
            variant="ghost"
            className={ICON_BTN}
            aria-label={`Move ${track.title} later`}
            onClick={() => onMove(index, 1)}
          >
            <ChevronDownIcon />
          </Button>
          <Button
            variant="ghostDanger"
            className={ICON_BTN}
            aria-label={`Remove ${track.title}`}
            onClick={() => onRemove(track.id)}
          >
            <CloseIcon />
          </Button>
        </div>
      )}

      {isReader && (
        <Button variant="secondary" className={ICON_BTN} aria-label={`Play ${track.title}`}>
          <PlayIcon />
        </Button>
      )}
    </div>
  );
}

export default function TrackList({ tracks, variant = 'compact', onMove, onRemove }) {
  const isReader = variant === 'reader';

  return (
    <div className={isReader ? 'flex flex-col' : PANEL}>
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
    <div className="flex flex-col items-center gap-2 px-6 py-12 border border-dashed border-line-strong rounded-2xl bg-card">
      <span className="font-hand text-[30px] text-ink-faint">side a is empty</span>
      <span className="text-[14px] text-ink-soft text-center">
        Start with the song you&apos;d want them to hear first.
      </span>
    </div>
  );
}
