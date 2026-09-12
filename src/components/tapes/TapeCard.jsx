import { fmt } from '../../utils/format.js';
import Cassette from '../Cassette/Cassette.jsx';
import Button from '../ui/Button.jsx';
import StatusPill from '../ui/StatusPill.jsx';
import styles from './TapeCard.module.css';

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
    <article className={styles.card}>
      <div
        className={[styles.stage, tape.status === 'Expired' && styles.faded]
          .filter(Boolean)
          .join(' ')}
      >
        <Cassette shell={tape.shell} label={tape.title} stickers={tape.stickers} />
      </div>

      <div className={styles.meta}>
        <div className={styles.row}>
          <span className={styles.title}>{tape.title}</span>
          <StatusPill status={tape.status} />
        </div>
        <span className={styles.for}>
          {tape.recipient ? `for ${tape.recipient}` : 'no recipient yet'}
        </span>
        <span className={styles.dates}>{datesFor(tape)}</span>
      </div>

      <div className={styles.actions}>
        {actions.map((a) => (
          <Button
            key={a.label}
            variant={a.variant}
            size="xs"
            className={a.variant === 'ghost' ? styles.actionGhost : styles.action}
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
