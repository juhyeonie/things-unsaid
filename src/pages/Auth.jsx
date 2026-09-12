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
import styles from './Auth.module.css';

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
    <div className={styles.page}>
      <div className={styles.form}>
        <BackLogo selfStart onClick={() => navigate('/')} />

        <div className={styles.intro}>
          <span className={styles.kicker}>{copy.kicker}</span>
          <h1 className={styles.heading}>{copy.heading}</h1>
          <p className={styles.blurb}>{copy.blurb}</p>
        </div>

        <div className={styles.fields}>
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
            <div className={styles.options}>
              <label className={styles.remember}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span className={styles.rememberLabel}>
                  Keep me signed in on this device
                </span>
              </label>
              <button type="button" className={styles.forgot} onClick={forgotPassword}>
                Forgot password?
              </button>
            </div>
          )}

          <Button
            variant="primary"
            size="lg"
            style={{ fontSize: 16, padding: '16px 26px', minHeight: 52 }}
            onClick={submit}
          >
            {copy.submit}
          </Button>

          <div className={styles.switch}>
            <span className={styles.switchPrompt}>{copy.switchPrompt}</span>
            <button type="button" className={styles.switchLink} onClick={switchMode}>
              {copy.switchLabel}
            </button>
          </div>
        </div>
      </div>

      {isWide && (
        <aside className={styles.aside}>
          <div className={styles.asideTape}>
            <Cassette
              shell="#F0D98C"
              label="side a, for later"
              stickers={HERO_STICKERS}
            />
          </div>
          <p className={styles.asideNote}>
            the account is only so your tapes have somewhere to live. they still only
            go to one person.
          </p>
        </aside>
      )}
    </div>
  );
}
