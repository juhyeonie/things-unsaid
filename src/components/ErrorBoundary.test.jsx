import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import ErrorBoundary from './ErrorBoundary.jsx';

const Boom = () => {
  throw new Error('the reel snapped');
};

/* React logs caught errors itself; the suite does not need the noise. */
beforeEach(() => vi.spyOn(console, 'error').mockImplementation(() => {}));
afterEach(() => vi.restoreAllMocks());

describe('ErrorBoundary', () => {
  it('renders its children when nothing goes wrong', () => {
    render(
      <ErrorBoundary>
        <p>side a</p>
      </ErrorBoundary>,
    );
    expect(screen.getByText('side a')).toBeTruthy();
  });

  it('shows a way out instead of a blank page when a child throws', () => {
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('alert')).toBeTruthy();
    expect(screen.getByText('Something came loose.')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Reload the page' })).toBeTruthy();
  });

  it('reports the failure so it is not swallowed', () => {
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    );

    expect(console.error).toHaveBeenCalledWith(
      'Things Unsaid hit a render error:',
      expect.objectContaining({ message: 'the reel snapped' }),
      expect.anything(),
    );
  });

  it('reloads when asked to', () => {
    const reload = vi.fn();
    const original = window.location;
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...original, reload },
    });

    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    );
    screen.getByRole('button', { name: 'Reload the page' }).click();
    expect(reload).toHaveBeenCalled();

    Object.defineProperty(window, 'location', { configurable: true, value: original });
  });
});
