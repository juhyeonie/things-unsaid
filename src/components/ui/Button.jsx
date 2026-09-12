import { cx } from '../../utils/cx.js';

/**
 * The app's only button element.
 *
 * `variant` owns colour, `lift` the larger hover travel. Everything geometric —
 * padding, type scale, radius, gap — comes from the caller.
 *
 * That split is deliberate. Tailwind resolves two utilities for the same
 * property by stylesheet order, not by their order in the class string, so a
 * shared base that set `rounded-[10px]` would fight every caller that wanted
 * `rounded-xl`. Keeping exactly one source per property removes the question.
 * The prototype uses 21 distinct button footprints; repeated ones are named
 * constants at their call sites.
 */

/* Spelled out for two reasons: the travel eases differently from the colours,
   and Tailwind's translate utilities animate the `translate` property rather
   than `transform`, so naming `transform` here would never fire. */
const TRANSITION =
  '[transition:background_160ms_ease,color_160ms_ease,border-color_160ms_ease,translate_160ms_var(--ease-out-soft),box-shadow_160ms_ease]';

const BASE = cx(
  'inline-flex items-center justify-center font-sans font-medium',
  'border cursor-pointer whitespace-nowrap',
  TRANSITION,
  'disabled:cursor-not-allowed disabled:opacity-40',
);

const VARIANTS = {
  primary:
    'border-accent bg-accent text-card shadow-button enabled:hover:bg-accent-hover enabled:active:bg-accent-active',
  secondary: 'border-line-strong bg-card text-ink enabled:hover:bg-muted',
  ghost:
    'border-transparent bg-transparent text-ink-soft enabled:hover:bg-muted enabled:hover:text-ink',
  /* Quiet button that turns red rather than dark on hover: removing a track. */
  ghostDanger:
    'border-transparent bg-transparent text-ink-soft enabled:hover:bg-muted enabled:hover:text-accent',
  /* Already-here state: the current nav item. */
  soft: 'border-transparent bg-muted text-ink',
  dark: 'border-ink bg-ink text-paper enabled:hover:bg-ink-deep',
  /* Secondary sitting on card-white rather than paper, used inside the modal. */
  paper: 'border-line-strong bg-paper text-ink enabled:hover:bg-muted',
  /* Contributes no colour at all, so the caller can own every state. Used by
     the dashboard filter pills, which swap their whole palette when selected. */
  bare: '',
};

/* Travel is kept separate from colour so the two never emit rival transforms. */
const NUDGE = 'enabled:hover:-translate-y-px enabled:active:translate-y-0';
const LIFT =
  'enabled:hover:-translate-y-0.5 enabled:hover:shadow-lift enabled:active:translate-y-0';

const VARIANT_NUDGE = {
  primary: NUDGE,
  secondary: NUDGE,
  dark: NUDGE,
  paper: NUDGE,
  ghost: '',
  ghostDanger: '',
  soft: '',
  bare: '',
};

export default function Button({
  variant = 'secondary',
  lift = false,
  glow = false,
  className,
  type = 'button',
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      className={cx(
        BASE,
        VARIANTS[variant],
        lift ? LIFT : VARIANT_NUDGE[variant],
        glow && 'enabled:hover:shadow-button-glow',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
