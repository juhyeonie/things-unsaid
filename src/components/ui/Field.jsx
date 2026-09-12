import { AlertIcon } from './Icons.jsx';
import styles from './Field.module.css';

/** A labelled text input. `tone` picks the typeface: default, hand or mono. */
export function Field({ label, hint, tone, tall = false, invalid = false, ...rest }) {
  return (
    <label className={styles.field}>
      {label && <span className={styles.label}>{label}</span>}
      <input
        className={[
          styles.input,
          tone && styles[tone],
          tall && styles.tall,
          invalid && styles.invalid,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      />
      {hint && <span className={styles.hint}>{hint}</span>}
    </label>
  );
}

/** Bare input without a label, for the track-link row. */
export function TextInput({ tone, tall = false, invalid = false, className = '', ...rest }) {
  return (
    <input
      className={[
        styles.input,
        tone && styles[tone],
        tall && styles.tall,
        invalid && styles.invalid,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    />
  );
}

/** Inline validation message with its warning icon. */
export function FieldError({ children, tight = false }) {
  return (
    <span className={[styles.error, tight && styles.errorTight].filter(Boolean).join(' ')}>
      <AlertIcon size={tight ? 14 : 15} />
      {children}
    </span>
  );
}
