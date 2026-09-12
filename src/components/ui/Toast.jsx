import { useToast } from '../../context/ToastContext.js';
import { CheckIcon } from './Icons.jsx';

/** Single confirmation toast, anchored above the wizard's sticky footer. */
export default function Toast() {
  const { toast } = useToast();
  if (!toast) return null;

  return (
    <div
      role="status"
      className={
        'fixed left-1/2 bottom-[92px] z-[70] flex items-center gap-2.5 ' +
        'px-[18px] py-[13px] rounded-xl bg-ink text-paper shadow-toast ' +
        'max-w-[calc(100vw-32px)] ' +
        /* Centred here as well as in the keyframes so it never depends on fill-mode. */
        '-translate-x-1/2 animate-toast'
      }
    >
      <CheckIcon size={17} stroke="#A9BFA0" strokeWidth={2} />
      <span className="text-[14px]">{toast}</span>
    </div>
  );
}
