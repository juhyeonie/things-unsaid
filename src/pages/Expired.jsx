import { useNavigate } from 'react-router-dom';

import Cassette from '../components/Cassette/Cassette.jsx';
import Button from '../components/ui/Button.jsx';
import { useApp } from '../context/AppContext.js';
import styles from './Expired.module.css';

/** A link that has passed its fourteen days. */
export default function Expired() {
  const navigate = useNavigate();
  const { user } = useApp();

  return (
    <div className={styles.page}>
      <div className={styles.tape}>
        <Cassette shell="#E9E2D6" label=" " />
      </div>

      <div className={styles.copy}>
        <h1 className={styles.heading}>This mixtape has faded away.</h1>
        <p className={styles.sub}>
          Some things are only meant to stay for a little while.
        </p>
      </div>

      <Button
        variant="secondary"
        size="lg"
        soft
        className={styles.backBtn}
        onClick={() => navigate(user ? '/dashboard' : '/')}
      >
        Back to Things Unsaid
      </Button>

      <img src="/logo.png" alt="Things Unsaid" className={styles.logo} />
    </div>
  );
}
