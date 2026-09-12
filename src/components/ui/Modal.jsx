import { useEffect, useRef } from 'react';

import Button from './Button.jsx';
import styles from './Modal.module.css';

/**
 * Confirmation dialog. Closes on Escape or a backdrop click, and moves
 * focus into the panel so keyboard users land inside it.
 */
export default function Modal({
  open,
  label,
  title,
  body,
  cancelLabel = 'Not yet',
  confirmLabel = 'Confirm',
  onCancel,
  onConfirm,
}) {
  const panel = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const onKey = (e) => {
      if (e.key === 'Escape') onCancel?.();
    };
    window.addEventListener('keydown', onKey);
    panel.current?.focus();

    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className={styles.backdrop}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel?.();
      }}
    >
      <div className={styles.panel} ref={panel} tabIndex={-1}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.body}>{body}</p>
        <div className={styles.actions}>
          <Button
            variant="secondary"
            size="xs"
            className={styles.cancel}
            style={{ fontSize: 15, padding: '13px 20px', minHeight: 46 }}
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="primary"
            size="xs"
            style={{ fontSize: 15, padding: '13px 22px', minHeight: 46 }}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
