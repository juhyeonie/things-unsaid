import { Component } from 'react';

/**
 * Catches a render error anywhere below it and shows a way out, rather than
 * leaving the viewer with a blank page.
 *
 * A class because that is still the only way to implement a boundary — there
 * is no hook equivalent. It sits outside the router, so recovery reloads the
 * page instead of navigating: whatever state produced the error is exactly
 * what should not be kept.
 */
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    /* Once there is a backend this is where reporting would go. */
    console.error('Things Unsaid hit a render error:', error, info?.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div
        role="alert"
        className="min-h-screen flex flex-col items-center justify-center gap-[30px] text-center px-[clamp(20px,5vw,40px)] py-[clamp(40px,8vw,96px)]"
      >
        <div className="flex flex-col gap-3 items-center">
          <h1 className="text-[clamp(30px,5.4vw,42px)] leading-[1.05] tracking-[-0.03em] font-semibold">
            Something came loose.
          </h1>
          <p className="font-hand text-[clamp(26px,4.6vw,32px)] leading-[1.25] text-ink-soft max-w-[28ch]">
            Not your doing. The page got tangled on its way in.
          </p>
        </div>

        {/* The message is for whoever is building this, not for a visitor. */}
        {import.meta.env.DEV && (
          <pre className="max-w-[70ch] overflow-x-auto text-left font-mono text-[12px] leading-[1.6] text-ink-faint bg-card border border-line-strong rounded-[10px] px-4 py-3">
            {String(error?.message || error)}
          </pre>
        )}

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center font-sans font-medium border border-line-strong bg-card text-ink cursor-pointer whitespace-nowrap text-[16px] px-7 py-4 min-h-[52px] rounded-xl transition-[background] duration-[160ms] hover:bg-muted"
        >
          Reload the page
        </button>

        <img
          src="/logo.png"
          alt="Things Unsaid"
          className="h-[30px] w-auto block opacity-50"
        />
      </div>
    );
  }
}
