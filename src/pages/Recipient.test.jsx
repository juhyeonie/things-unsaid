import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { AppRoutes } from '../App.jsx';
import Toast from '../components/ui/Toast.jsx';
import { AppProvider } from '../context/AppProvider.jsx';
import { ToastProvider } from '../context/ToastProvider.jsx';

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <ToastProvider>
        <AppProvider>
          <AppRoutes />
          <Toast />
        </AppProvider>
      </ToastProvider>
    </MemoryRouter>,
  );

/** Signs in through the form, the way a visitor would. */
const logIn = async () => {
  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'wren@somewhere.com' },
  });
  fireEvent.change(screen.getByLabelText('Password'), {
    target: { value: 'longenough1' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Log in' }));
  await screen.findByText('Your mixtapes');
};

describe('a link that cannot be resolved', () => {
  /* Regression: these used to fall through to whatever tape was in the
     editor, so a stranger saw the sender's draft. */
  it('sends an unknown code to the faded-away screen', async () => {
    renderAt('/m/zzzzzz');
    expect(await screen.findByText('This mixtape has faded away.')).toBeTruthy();
  });

  it('sends a valid code opened cold to the faded-away screen', async () => {
    renderAt('/m/3fK82a');
    expect(await screen.findByText('This mixtape has faded away.')).toBeTruthy();
  });

  it('never shows the editor contents under a stranger’s link', async () => {
    renderAt('/m/zzzzzz');
    await screen.findByText('This mixtape has faded away.');
    expect(screen.queryByText('Someone made you a tape')).toBeNull();
    expect(screen.queryByText("for when you can't sleep")).toBeNull();
  });

  it('sends an expired tape to the faded-away screen', async () => {
    renderAt('/login');
    await logIn();

    fireEvent.click(screen.getByRole('button', { name: 'Open expired link for august, mostly' }));
    expect(await screen.findByText('This mixtape has faded away.')).toBeTruthy();
  });
});

describe('the demo tape', () => {
  it('opens sealed, then plays side A', async () => {
    renderAt('/m/demo');

    expect(await screen.findByText('Someone made you a tape')).toBeTruthy();
    expect(screen.getByText('Somewhere quiet is better.')).toBeTruthy();
    expect(screen.queryByText('Side A')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Open the mixtape' }));

    expect(await screen.findByText('Side A')).toBeTruthy();
    expect(screen.getByText('About You')).toBeTruthy();
  });

  /* Regression: an unwritten letter used to be filled in with placeholder
     prose, which read as the sender's own words. */
  it('offers no letter when none was written', async () => {
    renderAt('/m/demo');
    fireEvent.click(await screen.findByRole('button', { name: 'Open the mixtape' }));
    await screen.findByText('Side A');

    expect(screen.queryByText("there's a letter too")).toBeNull();
    expect(screen.queryByText(/I've started this six times/)).toBeNull();
  });

  it('still gives the reader a way onward', async () => {
    renderAt('/m/demo');
    fireEvent.click(await screen.findByRole('button', { name: 'Open the mixtape' }));
    expect(await screen.findByRole('button', { name: 'Make one back' })).toBeTruthy();
  });

  /* Regression: the play controls were enabled buttons with no handler. */
  it('says so when playback is pressed', async () => {
    renderAt('/m/demo');
    fireEvent.click(await screen.findByRole('button', { name: 'Open the mixtape' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Play About You' }));

    expect(await screen.findByText('Playback arrives with the backend.')).toBeTruthy();
  });
});

describe('a tape opened from the dashboard', () => {
  it('shows the sender’s own words, and only after they are asked for', async () => {
    renderAt('/login');
    await logIn();

    fireEvent.click(screen.getByRole('button', { name: 'Open things left unsaid' }));

    expect(await screen.findByText('for Mara')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Open the mixtape' }));

    await screen.findByText('Side A');
    expect(screen.getByText('Nightswimming')).toBeTruthy();
    expect(screen.queryByText(/You said the drive was too long/)).toBeNull();

    fireEvent.click(screen.getByText("there's a letter too"));

    await waitFor(() =>
      expect(screen.getByText(/You said the drive was too long/)).toBeTruthy(),
    );
    expect(screen.getByText('dear Mara,')).toBeTruthy();
  });

  it('opens sealed again on a second visit', async () => {
    renderAt('/login');
    await logIn();

    fireEvent.click(screen.getByRole('button', { name: 'Open things left unsaid' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Open the mixtape' }));
    await screen.findByText('Side A');

    /* The way back arrives with the letter, as it does in the prototype. */
    fireEvent.click(screen.getByText("there's a letter too"));
    fireEvent.click(await screen.findByRole('button', { name: 'Back to my mixtapes' }));
    await screen.findByText('Your mixtapes');
    fireEvent.click(screen.getByRole('button', { name: 'Open things left unsaid' }));

    expect(await screen.findByRole('button', { name: 'Open the mixtape' })).toBeTruthy();
  });
});
