import { useEffect, useRef } from 'react';

import Button from './Button.jsx';

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Confirmation dialog. Closes on Escape or a backdrop click, keeps Tab inside
 * the panel while it is open, and hands focus back to whatever opened it.
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

    const opener = document.activeElement;
    panel.current?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') {
        onCancel?.();
        return;
      }
      if (e.key !== 'Tab' || !panel.current) return;

      const items = [...panel.current.querySelectorAll(FOCUSABLE)].filter(
        (el) => !el.disabled,
      );

      /* Nothing to land on: hold focus on the panel itself. */
      if (items.length === 0) {
        e.preventDefault();
        panel.current.focus();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || active === panel.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
      /* Return the keyboard to where it was, if that element is still around. */
      if (opener && document.contains(opener)) opener.focus?.();
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="fixed inset-0 z-[60] grid place-items-center p-6 bg-[rgba(36,31,27,0.42)] backdrop-blur-[3px] animate-fade-quick"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel?.();
      }}
    >
      <div
        className="w-full max-w-[420px] bg-card border border-line-strong rounded-2xl p-7 shadow-modal flex flex-col gap-4 animate-rise-panel"
        ref={panel}
        tabIndex={-1}
      >
        <h3 className="text-[22px] font-semibold tracking-[-0.015em]">{title}</h3>
        <p className="text-[15px] leading-[1.6] text-ink-soft">{body}</p>
        <div className="flex gap-2.5 justify-end flex-wrap">
          <Button
            variant="paper"
            className="text-[15px] px-5 py-[13px] min-h-[46px] rounded-[10px]"
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="primary"
            className="text-[15px] px-[22px] py-[13px] min-h-[46px] rounded-[10px]"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
