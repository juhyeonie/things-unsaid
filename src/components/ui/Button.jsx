import styles from './Button.module.css';

/**
 * The app's only button element.
 *
 * `variant` sets colour and hover behaviour, `size` sets padding and type
 * scale. A handful of buttons in the prototype use one-off padding; those
 * pass `style`, which wins over the size preset.
 */
export default function Button({
  variant = 'secondary',
  size = 'md',
  soft = false,
  pill = false,
  block = false,
  glow = false,
  lift = false,
  className = '',
  type = 'button',
  children,
  ...rest
}) {
  const classes = [
    styles.btn,
    styles[variant],
    styles[size],
    soft && styles.soft,
    pill && styles.pill,
    block && styles.block,
    glow && styles.glow,
    lift && styles.lift,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
