import { useNavigate } from 'react-router-dom';

import Cassette from '../components/Cassette/Cassette.jsx';
import Button from '../components/ui/Button.jsx';
import { useApp } from '../context/AppContext.js';

/** A link that has passed its fourteen days. */
export default function Expired() {
  const navigate = useNavigate();
  const { user } = useApp();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-[30px] text-center px-[clamp(20px,5vw,40px)] py-[clamp(40px,8vw,96px)]">
      <div className="w-full max-w-[320px] opacity-[0.32] saturate-[0.35] animate-fade-slow">
        <Cassette shell="#E9E2D6" label=" " />
      </div>

      <div className="flex flex-col gap-3 items-center animate-rise-slower-late">
        <h1 className="text-[clamp(30px,5.4vw,42px)] leading-[1.05] tracking-[-0.03em] font-semibold">
          This mixtape has faded away.
        </h1>
        <p className="font-hand text-[clamp(26px,4.6vw,32px)] leading-[1.25] text-ink-soft max-w-[26ch]">
          Some things are only meant to stay for a little while.
        </p>
      </div>

      <Button
        variant="secondary"
        className="text-[16px] px-7 py-4 min-h-[52px] rounded-xl"
        onClick={() => navigate(user ? '/dashboard' : '/')}
      >
        Back to Things Unsaid
      </Button>

      <img
        src="/logo.png"
        alt="Things Unsaid"
        className="h-[30px] w-auto block opacity-50"
      />
    </div>
  );
}
