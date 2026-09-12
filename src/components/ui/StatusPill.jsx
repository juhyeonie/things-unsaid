import { cx } from '../../utils/cx.js';

const PILL =
  'inline-flex items-center gap-1.5 flex-none text-[11px] font-semibold ' +
  'tracking-[0.08em] uppercase px-2.5 py-[5px] rounded-full whitespace-nowrap border';

const DOT = 'w-[7px] h-[7px] rounded-full flex-none';

const TONES = {
  Draft: {
    pill: 'bg-muted text-ink border-line-strong',
    dot: 'border-[1.5px] border-dashed border-ink-faint bg-transparent',
  },
  Active: {
    pill: 'bg-sage-bg text-sage-ink border-sage',
    dot: 'bg-sage-deep',
  },
  Expired: {
    pill: 'bg-paper text-ink-soft border-line-strong',
    dot: 'border-[1.5px] border-solid border-ink-mute bg-transparent',
  },
};

/** Draft / Active / Expired badge shown on every dashboard card. */
export default function StatusPill({ status }) {
  const tone = TONES[status];

  return (
    <span className={cx(PILL, tone.pill)}>
      <span className={cx(DOT, tone.dot)} />
      {status}
    </span>
  );
}
