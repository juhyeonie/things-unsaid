import { useNavigate } from 'react-router-dom';

import { useApp } from '../../context/AppContext.js';
import { cx } from '../../utils/cx.js';
import Button from '../ui/Button.jsx';
import { ChevronLeftIcon } from '../ui/Icons.jsx';

const HEADER = cx(
  'flex items-center gap-3.5 flex-wrap justify-between',
  'px-[clamp(16px,4vw,40px)] py-3 border-b border-line bg-paper',
);

const NAV_ITEM = 'text-[14px] px-[14px] py-[11px] min-h-[44px] rounded-[10px]';

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
    <header className={HEADER}>
      <div className="flex items-center gap-5 flex-wrap">
        <img src="/logo.png" alt="Things Unsaid" className="h-9 w-auto block" />
        <nav className="flex items-center gap-0.5">
          <Button
            variant={current === 'dashboard' ? 'soft' : 'ghost'}
            className={NAV_ITEM}
            aria-current={current === 'dashboard' ? 'page' : undefined}
            onClick={() => navigate('/dashboard')}
          >
            My mixtapes
          </Button>
          <Button
            variant={current === 'create' ? 'soft' : 'ghost'}
            className={NAV_ITEM}
            aria-current={current === 'create' ? 'page' : undefined}
            onClick={goCreate}
          >
            Create
          </Button>
        </nav>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-[13px] text-ink-soft whitespace-nowrap">{user?.name}</span>
        <Button variant="ghost" className={NAV_ITEM} onClick={handleSignOut}>
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
      className={cx(
        'flex items-center gap-2.5 font-sans bg-none border-none cursor-pointer',
        'whitespace-nowrap px-1 py-2 text-ink',
        selfStart && 'self-start',
      )}
    >
      <ChevronLeftIcon size={16} />
      <img src="/logo.png" alt="Things Unsaid" className="h-9 w-auto block" />
    </button>
  );
}
