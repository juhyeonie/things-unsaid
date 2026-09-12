import { useNavigate } from 'react-router-dom';

import { useApp } from '../../context/AppContext.js';
import Button from '../ui/Button.jsx';
import { ChevronLeftIcon } from '../ui/Icons.jsx';
import styles from './AppHeader.module.css';

/** Signed-in chrome: logo, section nav, the user's name and a way out. */
export function AppHeader({ current }) {
  const navigate = useNavigate();
  const { user, signOut, startNewDraft } = useApp();

  const goCreate = () => {
    startNewDraft();
    navigate('/create');
  };

  // Clearing the session is enough: the route guard returns the visitor to
  // the landing page on the next render.
  const handleSignOut = () => signOut();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <img src="/logo.png" alt="Things Unsaid" className={styles.logo} />
        <nav className={styles.nav}>
          <Button
            variant="ghost"
            size="xs"
            className={[
              styles.navItem,
              current === 'dashboard' && styles.navActive,
            ]
              .filter(Boolean)
              .join(' ')}
            aria-current={current === 'dashboard' ? 'page' : undefined}
            onClick={() => navigate('/dashboard')}
          >
            My mixtapes
          </Button>
          <Button
            variant="ghost"
            size="xs"
            className={[styles.navItem, current === 'create' && styles.navActive]
              .filter(Boolean)
              .join(' ')}
            aria-current={current === 'create' ? 'page' : undefined}
            onClick={goCreate}
          >
            Create
          </Button>
        </nav>
      </div>

      <div className={styles.right}>
        <span className={styles.user}>{user?.name}</span>
        <Button
          variant="ghost"
          size="xs"
          className={styles.navItem}
          onClick={handleSignOut}
        >
          Log out
        </Button>
      </div>
    </header>
  );
}

/** A back chevron paired with the logo, used on auth and the wizard. */
export function BackLogo({ onClick, selfStart = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Back to start"
      className={[styles.backLink, selfStart && styles.backStart]
        .filter(Boolean)
        .join(' ')}
    >
      <ChevronLeftIcon size={16} />
      <img src="/logo.png" alt="Things Unsaid" className={styles.backLogo} />
    </button>
  );
}
