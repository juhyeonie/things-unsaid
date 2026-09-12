import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Cassette from '../components/Cassette/Cassette.jsx';
import { BackLogo } from '../components/layout/AppHeader.jsx';
import Button from '../components/ui/Button.jsx';
import { Field, FieldError } from '../components/ui/Field.jsx';
import { useApp } from '../context/AppContext.js';
import { useToast } from '../context/ToastContext.js';
import { HERO_STICKERS } from '../data/stickers.js';
import { useViewportWidth } from '../hooks/useViewportWidth.js';

const FIELDS = {
  login: [
    ['email', 'Email', 'email', 'email', 'you@somewhere.com'],
    ['password', 'Password', 'password', 'current-password', '••••••••'],
  ],
  register: [
    ['name', 'Name', 'text', 'name', 'what they call you'],
    ['email', 'Email', 'email', 'email', 'you@somewhere.com'],
    ['password', 'Password', 'password', 'new-password', 'at least 8 characters'],
    ['confirm', 'Confirm password', 'password', 'new-password', 'again, to be sure'],
  ],
};

const COPY = {
  login: {
    kicker: 'welcome back',
    heading: 'Log in',
    blurb: 'Your drafts are where you left them.',
    submit: 'Log in',
    switchPrompt: 'No account yet?',
    switchLabel: 'Create an account',
  },
  register: {
    kicker: 'hello, you',
    heading: 'Create an account',
    blurb:
      'So your tapes have somewhere to live between drafts. Nothing is public, ever.',
    submit: 'Create account',
    switchPrompt: 'Already have an account?',
    switchLabel: 'Log in',
  },
};

const EMPTY = { name: '', email: '', password: '', confirm: '' };

const TEXT_LINK =
  'text-[14px] font-sans cursor-pointer bg-none border-0 pb-px transition-[color,border-color] duration-[160ms]';

export default function Auth({ mode }) {
  const navigate = useNavigate();
  const { signIn, remember, setRemember } = useApp();
  const { flash } = useToast();
  const { isWide } = useViewportWidth();

  const [values, setValues] = useState(EMPTY);
  const [error, setError] = useState('');

  const copy = COPY[mode];
  const isLogin = mode === 'login';

  const submit = async () => {
    const result = await signIn(mode, values);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate('/dashboard');
  };

  const switchMode = () => {
    setValues(EMPTY);
    setError('');
    navigate(isLogin ? '/register' : '/login');
  };

  const forgotPassword = () => flash("We'd send a reset link. Mocked here.");

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(440px,100%),1fr))] min-h-screen">
      <div className="flex flex-col justify-center gap-[26px] w-full max-w-[520px] mx-auto px-[clamp(20px,5vw,56px)] py-[clamp(28px,5vw,64px)]">
        <BackLogo selfStart onClick={() => navigate('/')} />

        <div className="flex flex-col gap-2">
          <span className="font-hand text-[28px] leading-none text-accent">
            {copy.kicker}
          </span>
          <h1 className="text-[clamp(34px,5vw,44px)] leading-[1.02] tracking-[-0.03em] font-semibold">
            {copy.heading}
          </h1>
          <p className="text-[15px] leading-[1.6] text-ink-soft max-w-[42ch]">
            {copy.blurb}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {FIELDS[mode].map(([key, label, type, auto, placeholder]) => (
            <Field
              key={key}
              label={label}
              type={type}
              autoComplete={auto}
              placeholder={placeholder}
              tall
              invalid={!!error}
              value={values[key]}
              onChange={(e) => {
                const v = e.target.value;
                setValues((prev) => ({ ...prev, [key]: v }));
                setError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submit();
              }}
            />
          ))}

          {error && <FieldError>{error}</FieldError>}

          {isLogin && (
            <div className="flex items-center gap-3.5 flex-wrap justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer min-h-[44px]">
                <input
                  type="checkbox"
                  className="w-[18px] h-[18px] accent-accent cursor-pointer m-0"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span className="text-[14px] text-ink-soft">
                  Keep me signed in on this device
                </span>
              </label>
              <button
                type="button"
                className={`${TEXT_LINK} font-medium text-ink-soft border-b border-line-strong hover:text-ink hover:border-ink`}
                onClick={forgotPassword}
              >
                Forgot password?
              </button>
            </div>
          )}

          <Button
            variant="primary"
            className="text-[16px] px-[26px] py-4 min-h-[52px] rounded-[10px]"
            onClick={submit}
          >
            {copy.submit}
          </Button>

          <div className="flex gap-1.5 flex-wrap border-t border-line pt-4 self-center">
            <span className="text-[14px] text-ink-soft">{copy.switchPrompt}</span>
            <button
              type="button"
              className={`${TEXT_LINK} font-semibold text-accent border-b border-[rgba(200,68,62,0.4)] hover:text-accent-active hover:border-accent-active`}
              onClick={switchMode}
            >
              {copy.switchLabel}
            </button>
          </div>
        </div>
      </div>

      {isWide && (
        <aside className="bg-muted border-l border-line flex flex-col items-center justify-center gap-8 p-[clamp(32px,5vw,72px)]">
          <div className="w-full max-w-[420px] rotate-[-4deg]">
            <Cassette
              shell="#F0D98C"
              label="side a, for later"
              stickers={HERO_STICKERS}
            />
          </div>
          <p className="max-w-[34ch] text-center font-hand text-[30px] leading-[1.25] text-ink">
            the account is only so your tapes have somewhere to live. they still only
            go to one person.
          </p>
        </aside>
      )}
    </div>
  );
}
