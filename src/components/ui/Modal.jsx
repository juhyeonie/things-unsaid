import { useEffect, useRef } from 'react';

import Button from './Button.jsx';

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
