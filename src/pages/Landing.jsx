import { useNavigate } from 'react-router-dom';

import Cassette from '../components/Cassette/Cassette.jsx';
import Button from '../components/ui/Button.jsx';
import { useApp } from '../context/AppContext.js';
import { HERO_STICKERS } from '../data/stickers.js';
import styles from './Landing.module.css';

const LANDING_STEPS = [
  {
    no: '01',
    t: 'Pick a shell',
    d: 'Eight colors, then stickers until it looks like yours.',
  },
  {
    no: '02',
    t: 'Line up the songs',
    d: 'Paste links. Order them the way you’d want them heard.',
  },
  {
    no: '03',
    t: 'Write the letter',
    d: 'It arrives under the tracklist. No edits after sending.',
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const { user, startNewDraft } = useApp();

  const startCreate = () => {
    if (!user) {
      navigate('/register');
      return;
    }
    startNewDraft();
    navigate('/create');
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <img src="/logo.png" alt="Things Unsaid" className={styles.logo} />
        <div className={styles.actions}>
          <Button variant="ghost" size="sm" onClick={() => navigate('/m/demo')}>
            See one that was sent
          </Button>
          <Button
            variant="secondary"
            size="sm"
            style={{ padding: '11px 18px' }}
            onClick={() => navigate(user ? '/dashboard' : '/login')}
          >
            {user ? 'My mixtapes' : 'Log in'}
          </Button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.copy}>
          <span className={styles.kicker}>the thing you didn&apos;t say out loud</span>
          <h1 className={styles.heading}>
            Make one tape.
            <br />
            Send it once.
          </h1>
          <p className={styles.lede}>
            Choose a shell, cover it in stickers, line up the songs, and write the
            letter you&apos;ve been carrying around. They get all of it at the same
            time, on one page, the way it used to arrive in a jacket pocket.
          </p>

          <div className={styles.cta}>
            <Button variant="primary" size="xl" glow onClick={startCreate}>
              Start a tape
            </Button>
            <span className={styles.ctaNote}>
              Takes about ten minutes. Longer if you mean it.
            </span>
          </div>

          <div className={styles.steps}>
            {LANDING_STEPS.map((s) => (
              <div key={s.no} className={styles.step}>
                <span className={styles.stepNo}>{s.no}</span>
                <span className={styles.stepTitle}>{s.t}</span>
                <span className={styles.stepBody}>{s.d}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.stage}>
          <div className={styles.tape}>
            <Cassette
              shell="#F2C7CB"
              label="for when you can't sleep"
              stickers={HERO_STICKERS}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
