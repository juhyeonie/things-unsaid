import { afterEach } from 'vitest';

/* The pure-logic suites run in the node environment, where there is no DOM
   to prepare or tear down. */
const hasDom = typeof window !== 'undefined';

if (hasDom) {
  /* jsdom has neither of these, and the app touches both on mount. */
  if (!globalThis.ResizeObserver) {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }

  window.scrollTo = () => {};

  const { cleanup } = await import('@testing-library/react');
  afterEach(cleanup);
}
