import { useNavigate } from 'react-router-dom';

import { AppHeader } from '../components/layout/AppHeader.jsx';
import TapeCard from '../components/tapes/TapeCard.jsx';
import Button from '../components/ui/Button.jsx';
import { PlusIcon } from '../components/ui/Icons.jsx';
import { useApp } from '../context/AppContext.js';
import { useToast } from '../context/ToastContext.js';
import { copyToClipboard } from '../services/mockApi.js';
import { shareUrlFor } from '../utils/format.js';
import styles from './Dashboard.module.css';

const FILTERS = ['All', 'Draft', 'Active', 'Expired'];

export default function Dashboard() {
  const navigate = useNavigate();
  const { flash } = useToast();
  const {
    user,
    tapes,
    dashFilter,
    setDashFilter,
    startNewDraft,
    loadTape,
    deleteTape,
  } = useApp();

  const visible =
    dashFilter === 'All' ? tapes : tapes.filter((t) => t.status === dashFilter);

  const startCreate = () => {
    startNewDraft();
    navigate('/create');
  };

  const handlers = {
    onContinue: (tape) => {
      loadTape(tape);
      navigate('/create');
    },
    onPreview: (tape) => {
      loadTape(tape);
      navigate('/m/preview');
    },
    onOpen: (tape) => {
      loadTape(tape);
      navigate(`/m/${tape.code}`);
    },
    onCopy: async (tape) => {
      await copyToClipboard(shareUrlFor(tape.code));
      flash('Link copied.');
    },
    onExpired: () => navigate('/expired'),
    onDelete: (tape) => deleteTape(tape.id),
  };

  return (
    <div className={styles.page}>
      <AppHeader current="dashboard" />

      <main className={styles.main}>
        <div className={styles.top}>
          <div className={styles.titleBlock}>
            <span className={styles.greeting}>
              {user ? `hi ${user.name.split(' ')[0].toLowerCase()}` : 'hi'}
            </span>
            <h1 className={styles.heading}>Your mixtapes</h1>
          </div>
          <Button variant="primary" size="lg" onClick={startCreate}>
            <PlusIcon />
            Make a mixtape
          </Button>
        </div>

        {tapes.length > 0 && (
          <div className={styles.filters}>
            {FILTERS.map((f) => (
              <Button
                key={f}
                pill
                variant="ghost"
                size="xs"
                className={`${styles.filter} ${
                  dashFilter === f ? styles.filterOn : styles.filterOff
                }`}
                aria-pressed={dashFilter === f}
                onClick={() => setDashFilter(f)}
              >
                {f === 'All' ? 'All' : `${f}s`}
              </Button>
            ))}
          </div>
        )}

        {visible.length > 0 ? (
          <div className={styles.grid}>
            {visible.map((tape) => (
              <TapeCard key={tape.id} tape={tape} {...handlers} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <span className={styles.emptyLine}>
              {tapes.length === 0 ? 'nothing here yet' : 'nothing in this pile'}
            </span>
            <p className={styles.emptyBlurb}>
              {tapes.length === 0
                ? 'One tape, one person, one link. Start when you know what you want to say.'
                : 'Try another filter, or start something new.'}
            </p>
            <Button
              variant="primary"
              size="lg"
              className={styles.emptyCta}
              style={{ fontSize: 16, padding: '15px 26px' }}
              onClick={startCreate}
            >
              Make your first one
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
