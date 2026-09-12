import { fmt } from '../../utils/format.js';
import { cx } from '../../utils/cx.js';
import Cassette from '../Cassette/Cassette.jsx';
import Button from '../ui/Button.jsx';
import StatusPill from '../ui/StatusPill.jsx';

const CARD = cx(
  'flex flex-col gap-3.5 p-3.5 bg-card border border-line-strong rounded-2xl',
  '[transition:translate_180ms_var(--ease-out-soft),box-shadow_180ms_ease]',
  'hover:-translate-y-0.5 hover:shadow-card',
);

const ACTION = 'text-[14px] px-[15px] py-[11px] min-h-[44px] rounded-[10px]';
const ACTION_GHOST = 'text-[14px] px-[13px] py-[11px] min-h-[44px] rounded-[10px]';

/** "made Sep 10 · fades Sep 24", phrased for the tape's status. */
function datesFor(tape) {
  if (tape.status === 'Active')
    return `made ${fmt(tape.created)} · fades ${fmt(tape.expires)}`;
  if (tape.status === 'Expired')
    return `made ${fmt(tape.created)} · faded ${fmt(tape.expires)}`;
  return `started ${fmt(tape.created)}`;
}

/** The actions available depend on where the tape is in its life. */
function actionsFor(tape, handlers) {
  if (tape.status === 'Draft') {
    return [
      {
        label: 'Continue',
        aria: `Continue editing ${tape.title}`,
        variant: 'dark',
        onDo: () => handlers.onContinue(tape),
      },
      {
        label: 'Preview',
        aria: `Preview ${tape.title}`,
        variant: 'secondary',
        onDo: () => handlers.onPreview(tape),
      },
      {
        label: 'Delete',
        aria: `Delete draft ${tape.title}`,
        variant: 'ghost',
        onDo: () => handlers.onDelete(tape),
      },
    ];
  }

  if (tape.status === 'Active') {
    return [
      {
        label: 'Open',
        aria: `Open ${tape.title}`,
        variant: 'dark',
        onDo: () => handlers.onOpen(tape),
      },
      {
        label: 'Copy link',
        aria: `Copy link for ${tape.title}`,
        variant: 'secondary',
        onDo: () => handlers.onCopy(tape),
      },
    ];
  }

  return [
    {
      label: 'Open link',
      aria: `Open expired link for ${tape.title}`,
      variant: 'secondary',
      onDo: () => handlers.onExpired(tape),
    },
    {
      label: 'Delete',
      aria: `Delete ${tape.title}`,
      variant: 'ghost',
      onDo: () => handlers.onDelete(tape),
    },
  ];
}

export default function TapeCard({ tape, ...handlers }) {
  const actions = actionsFor(tape, handlers);

  return (
    <article className={CARD}>
      <div
        className={cx(
          'p-3.5 rounded-[10px] bg-muted',
          /* Expired tapes sit back a little. */
          tape.status === 'Expired' && 'opacity-45',
        )}
      >
        <Cassette shell={tape.shell} label={tape.title} stickers={tape.stickers} />
      </div>

      <div className="flex flex-col gap-2 px-1">
        <div className="flex items-center gap-2 justify-between">
          <span className="font-hand text-[26px] leading-[1.25] text-ink [overflow-wrap:anywhere]">
            {tape.title}
          </span>
          <StatusPill status={tape.status} />
        </div>
        <span className="text-[14px] text-ink-soft">
          {tape.recipient ? `for ${tape.recipient}` : 'no recipient yet'}
        </span>
        <span className="text-[12px] font-mono text-ink-faint">{datesFor(tape)}</span>
      </div>

      <div className="flex gap-2 flex-wrap px-1 pb-1">
        {actions.map((a) => (
          <Button
            key={a.label}
            variant={a.variant}
            className={a.variant === 'ghost' ? ACTION_GHOST : ACTION}
            aria-label={a.aria}
            onClick={a.onDo}
          >
            {a.label}
          </Button>
        ))}
      </div>
    </article>
  );
}
