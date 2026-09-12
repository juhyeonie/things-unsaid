import { useToast } from '../../context/ToastContext.js';
import { CheckIcon } from './Icons.jsx';
import styles from './Toast.module.css';

/** Single confirmation toast, anchored above the wizard's sticky footer. */
export default function Toast() {
  const { toast } = useToast();
  if (!toast) return null;

  return (
    <div role="status" className={styles.toast}>
      <CheckIcon size={17} stroke="#A9BFA0" strokeWidth={2} />
      <span className={styles.text}>{toast}</span>
    </div>
  );
}
