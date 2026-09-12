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

const BLOCK = 'w-full max-w-[460px] flex flex-col gap-2.5';
const ALT_BTN = 'w-full text-[16px] px-[26px] py-4 min-h-[52px] rounded-xl';

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
    <div className="flex flex-col min-h-screen">
      <AppHeader />

      <main className="flex-1 flex flex-col items-center gap-[clamp(28px,4vw,44px)] w-full max-w-[620px] mx-auto px-[clamp(20px,5vw,40px)] pt-[clamp(32px,6vw,64px)] pb-[90px]">
        <div className="flex flex-col items-center gap-2.5 text-center animate-rise-slow">
          <span className="text-[12px] tracking-[0.2em] uppercase text-ink-faint font-medium">
            Your mixtape is ready
          </span>
          <h1 className="text-[clamp(34px,6vw,48px)] leading-[1.02] tracking-[-0.03em] font-semibold text-balance">
            You made something worth saying.
          </h1>
        </div>

        <div className="w-full max-w-[440px] animate-rise-tape">
          <Cassette shell={draft.shell} label={draft.title} stickers={draft.placed} />
        </div>

        <div className={BLOCK}>
          <span className="text-[12px] tracking-[0.12em] uppercase text-ink-soft font-medium">
            Their link
          </span>
          <div className="flex items-center gap-3 px-[18px] py-4 rounded-xl bg-card border border-line-strong shadow-link">
            <LinkIcon />
            <span className="font-mono text-[15px] text-ink overflow-hidden text-ellipsis whitespace-nowrap flex-1">
              {url}
            </span>
          </div>
          <span className="text-[13px] text-ink-faint">
            Anyone with this link can open it — no account needed. It fades on{' '}
            {fmt(daysFrom(14))}.
          </span>
        </div>

        <div className={BLOCK}>
          <Button
            variant="primary"
            className="w-full text-[17px] px-[26px] py-[17px] min-h-[54px] rounded-xl gap-2.5"
            onClick={copy}
          >
            <CopyIcon />
            {copied ? 'Link copied' : 'Copy link'}
          </Button>

          {canNativeShare() && (
            <Button variant="secondary" className={`${ALT_BTN} gap-2.5`} onClick={share}>
              <ShareIcon />
              Share mixtape
            </Button>
          )}

          <Button
            variant="secondary"
            className={ALT_BTN}
            onClick={() => navigate(`/m/${draft.activeCode || 'preview'}`)}
          >
            Open mixtape
          </Button>

          <Button
            variant="ghost"
            className="w-full text-[15px] px-[26px] py-[15px] min-h-[50px] rounded-xl"
            onClick={() => navigate('/dashboard')}
          >
            Back to my mixtapes
          </Button>
        </div>
      </main>
    </div>
  );
}
