import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Cassette from '../components/Cassette/Cassette.jsx';
import { AppHeader } from '../components/layout/AppHeader.jsx';
import Button from '../components/ui/Button.jsx';
import { CopyIcon, LinkIcon, ShareIcon } from '../components/ui/Icons.jsx';
import { useApp } from '../context/AppContext.js';
import { useToast } from '../context/ToastContext.js';
import { canNativeShare, copyToClipboard, nativeShare } from '../services/mockApi.js';
import { daysFrom, fmt, shareUrlFor } from '../utils/format.js';
import styles from './Done.module.css';

/** The screen right after a tape becomes real and gets its link. */
export default function Done() {
  const navigate = useNavigate();
  const { flash } = useToast();
  const { draft } = useApp();

  const [copied, setCopied] = useState(false);
  const resetTimer = useRef(null);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const url = shareUrlFor(draft.activeCode);

  const copy = async () => {
    await copyToClipboard(url);
    setCopied(true);
    flash('Link copied.');
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied(false), 2200);
  };

  const share = async () => {
    const fullUrl = `https://${url}`;
    if (canNativeShare()) {
      await nativeShare({ title: 'A mixtape for you', text: draft.title, url: fullUrl });
      return;
    }
    copy();
  };

  return (
    <div className={styles.page}>
      <AppHeader />

      <main className={styles.main}>
        <div className={styles.intro}>
          <span className={styles.kicker}>Your mixtape is ready</span>
          <h1 className={styles.heading}>You made something worth saying.</h1>
        </div>

        <div className={styles.tape}>
          <Cassette shell={draft.shell} label={draft.title} stickers={draft.placed} />
        </div>

        <div className={styles.block}>
          <span className={styles.blockLabel}>Their link</span>
          <div className={styles.linkBox}>
            <LinkIcon />
            <span className={styles.url}>{url}</span>
          </div>
          <span className={styles.expiry}>
            Anyone with this link can open it — no account needed. It fades on{' '}
            {fmt(daysFrom(14))}.
          </span>
        </div>

        <div className={styles.block}>
          <Button
            variant="primary"
            size="xl"
            soft
            block
            className={styles.copyBtn}
            onClick={copy}
          >
            <CopyIcon />
            {copied ? 'Link copied' : 'Copy link'}
          </Button>

          {canNativeShare() && (
            <Button
              variant="secondary"
              size="lg"
              soft
              block
              className={styles.altBtn}
              onClick={share}
            >
              <ShareIcon />
              Share mixtape
            </Button>
          )}

          <Button
            variant="secondary"
            size="lg"
            soft
            block
            className={styles.altBtn}
            onClick={() => navigate(`/m/${draft.activeCode || 'preview'}`)}
          >
            Open mixtape
          </Button>

          <Button
            variant="ghost"
            size="md"
            soft
            block
            className={styles.backBtn}
            onClick={() => navigate('/dashboard')}
          >
            Back to my mixtapes
          </Button>
        </div>
      </main>
    </div>
  );
}
