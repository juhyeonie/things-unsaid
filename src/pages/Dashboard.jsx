import { useNavigate } from 'react-router-dom';

import { AppHeader } from '../components/layout/AppHeader.jsx';
import TapeCard from '../components/tapes/TapeCard.jsx';
import Button from '../components/ui/Button.jsx';
import { PlusIcon } from '../components/ui/Icons.jsx';
import { useApp } from '../context/AppContext.js';
import { useToast } from '../context/ToastContext.js';
import { copyToClipboard } from '../services/mockApi.js';
import { shareUrlFor } from '../utils/format.js';

const FILTERS = ['All', 'Draft', 'Active', 'Expired'];

/* Selected and unselected pills are whole alternatives rather than a base
   plus an override, so no two background utilities ever compete. */
const FILTER_BASE = 'text-[14px] px-4 py-2.5 min-h-[44px] rounded-full';
const FILTER_ON = 'border-ink bg-ink text-paper';
const FILTER_OFF =
  'border-line-strong bg-transparent text-ink-soft enabled:hover:bg-muted enabled:hover:text-ink';

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
    <div className="flex flex-col min-h-screen">
      <AppHeader current="dashboard" />

      <main className="flex-1 w-full max-w-[1180px] mx-auto px-[clamp(16px,4vw,40px)] pt-[clamp(28px,4vw,56px)] pb-20 flex flex-col gap-7">
        <div className="flex items-end justify-between gap-5 flex-wrap">
          <div className="flex flex-col gap-1">
            <span className="font-hand text-[30px] leading-none text-accent">
              {user ? `hi ${user.name.split(' ')[0].toLowerCase()}` : 'hi'}
            </span>
            <h1 className="text-[clamp(32px,5vw,46px)] leading-none tracking-[-0.03em] font-semibold">
              Your mixtapes
            </h1>
          </div>
          <Button
            variant="primary"
            className="text-[16px] px-6 py-[15px] min-h-[50px] gap-[9px] rounded-[10px]"
            onClick={startCreate}
          >
            <PlusIcon />
            Make a mixtape
          </Button>
        </div>

        {tapes.length > 0 && (
          <div className="flex gap-2 flex-wrap border-b border-line pb-4">
            {FILTERS.map((f) => {
              const on = dashFilter === f;
              return (
                <Button
                  key={f}
                  variant="bare"
                  className={`${FILTER_BASE} ${on ? FILTER_ON : FILTER_OFF}`}
                  aria-pressed={on}
                  onClick={() => setDashFilter(f)}
                >
                  {f === 'All' ? 'All' : `${f}s`}
                </Button>
              );
            })}
          </div>
        )}

        {visible.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(290px,100%),1fr))] gap-5">
            {visible.map((tape) => (
              <TapeCard key={tape.id} tape={tape} {...handlers} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3.5 px-6 py-[clamp(48px,9vw,96px)] border border-dashed border-line-strong rounded-2xl bg-card text-center">
            <span className="font-hand text-[clamp(32px,6vw,44px)] leading-none text-ink-faint">
              {tapes.length === 0 ? 'nothing here yet' : 'nothing in this pile'}
            </span>
            <p className="text-[15px] leading-[1.6] text-ink-soft max-w-[34ch]">
              {tapes.length === 0
                ? 'One tape, one person, one link. Start when you know what you want to say.'
                : 'Try another filter, or start something new.'}
            </p>
            <Button
              variant="primary"
              className="text-[16px] px-[26px] py-[15px] min-h-[50px] mt-1.5 rounded-[10px]"
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
