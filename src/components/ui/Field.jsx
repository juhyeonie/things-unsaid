import { cx } from '../../utils/cx.js';
import { AlertIcon } from './Icons.jsx';

/* Everything except type scale and padding, which the tone supplies so the
   two never emit rival utilities for the same property. */
const INPUT_BASE = cx(
  'w-full text-ink rounded-[10px] border bg-card',
  'transition-[border-color] duration-[160ms]',
  'placeholder:text-ink-faint placeholder:opacity-85 focus:border-accent',
);

const TONES = {
  default: 'font-sans text-[16px] px-[15px] py-[14px]',
  /* The J-card label is typed in the same hand it will be printed in. */
  hand: 'font-hand text-[26px] px-[15px] py-[12px]',
  /* Pasted track links read as code. */
  mono: 'font-mono text-[14px] p-[15px] min-h-[48px]',
};

const LABEL = 'text-[12px] tracking-[0.12em] uppercase text-ink-soft font-medium';

const inputClass = (tone, tall, invalid, className) =>
  cx(
    INPUT_BASE,
    TONES[tone] || TONES.default,
    invalid ? 'border-accent' : 'border-line-strong',
    tall && 'min-h-[50px]',
    className,
  );

/** A labelled text input. `tone` picks the typeface: default, hand or mono. */
export function Field({ label, hint, tone, tall = false, invalid = false, ...rest }) {
  return (
    <label className="flex flex-col gap-2">
      {label && <span className={LABEL}>{label}</span>}
      <input className={inputClass(tone, tall, invalid)} {...rest} />
      {hint && <span className="text-[12px] text-ink-faint">{hint}</span>}
    </label>
  );
}

/** Bare input without a label, for the track-link row. */
export function TextInput({ tone, tall = false, invalid = false, className, ...rest }) {
  return <input className={inputClass(tone, tall, invalid, className)} {...rest} />;
}

/** Inline validation message with its warning icon. */
export function FieldError({ children, tight = false }) {
  return (
    <span
      className={cx(
        'flex items-center text-[13px] text-accent',
        tight ? 'gap-1.5' : 'gap-2',
      )}
    >
      <AlertIcon size={tight ? 14 : 15} />
      {children}
    </span>
  );
}
