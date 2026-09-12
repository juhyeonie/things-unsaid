import { useNavigate } from 'react-router-dom';

import Cassette from '../components/Cassette/Cassette.jsx';
import Button from '../components/ui/Button.jsx';
import { useApp } from '../context/AppContext.js';
import { HERO_STICKERS } from '../data/stickers.js';

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
    <div className="flex flex-col min-h-screen">
      {/* Wraps rather than overflowing once the logo and both actions
          stop fitting on one line, as the signed-in header does. */}
      <header className="flex items-center justify-between gap-4 flex-wrap px-[clamp(20px,5vw,56px)] py-5">
        <img src="/logo.png" alt="Things Unsaid" className="h-[46px] w-auto block" />
        <div className="flex items-center flex-wrap gap-1.5">
          <Button
            variant="ghost"
            className="text-[14px] px-4 py-[11px] min-h-[44px] rounded-[10px]"
            onClick={() => navigate('/m/demo')}
          >
            See one that was sent
          </Button>
          <Button
            variant="secondary"
            className="text-[14px] px-[18px] py-[11px] min-h-[44px] rounded-[10px]"
            onClick={() => navigate(user ? '/dashboard' : '/login')}
          >
            {user ? 'My mixtapes' : 'Log in'}
          </Button>
        </div>
      </header>

      {/* min() keeps the two columns on desktop without overflowing a phone. */}
      <main className="flex-1 grid grid-cols-[repeat(auto-fit,minmax(min(480px,100%),1fr))] gap-[clamp(32px,5vw,72px)] items-center max-w-[1280px] w-full mx-auto px-[clamp(20px,5vw,56px)] pt-[clamp(24px,4vw,56px)] pb-[72px]">
        <div className="flex flex-col gap-7 max-w-[560px] @container">
          <span className="font-hand text-[30px] leading-none text-accent">
            the thing you didn&apos;t say out loud
          </span>
          <h1 className="text-[clamp(42px,13.4cqi,76px)] leading-[0.95] tracking-[-0.04em] font-semibold">
            Make one tape.
            <br />
            Send it once.
          </h1>
          <p className="text-[18px] leading-[1.65] text-ink-soft max-w-[46ch] text-pretty">
            Choose a shell, cover it in stickers, line up the songs, and write the
            letter you&apos;ve been carrying around. They get all of it at the same
            time, on one page, the way it used to arrive in a jacket pocket.
          </p>

          <div className="flex flex-wrap gap-3 items-center">
            <Button
              variant="primary"
              glow
              className="text-[17px] px-8 py-[17px] min-h-[54px] rounded-xl"
              onClick={startCreate}
            >
              Start a tape
            </Button>
            <span className="text-[14px] text-ink-faint">
              Takes about ten minutes. Longer if you mean it.
            </span>
          </div>

          <div className="flex flex-wrap gap-6 border-t border-line pt-6 mt-2">
            {LANDING_STEPS.map((s) => (
              <div key={s.no} className="flex flex-col gap-1 min-w-[140px] flex-1">
                <span className="text-[11px] font-mono text-accent">{s.no}</span>
                <span className="text-[15px] font-medium">{s.t}</span>
                <span className="text-[13px] leading-[1.5] text-ink-soft">{s.d}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid place-items-center p-[clamp(8px,3vw,32px)]">
          <div className="w-full max-w-[480px] rotate-[-3deg] animate-rise-hero">
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
