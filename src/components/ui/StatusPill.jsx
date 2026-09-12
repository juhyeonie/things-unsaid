import styles from './StatusPill.module.css';

/** Draft / Active / Expired badge shown on every dashboard card. */
export default function StatusPill({ status }) {
  return (
    <span className={`${styles.pill} ${styles[status]}`}>
      <span className={styles.dot} />
      {status}
    </span>
  );
}
