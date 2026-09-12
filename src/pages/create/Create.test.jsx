import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';

import { AppRoutes } from '../../App.jsx';
import Toast from '../../components/ui/Toast.jsx';
import { AppProvider } from '../../context/AppProvider.jsx';
import { ToastProvider } from '../../context/ToastProvider.jsx';

const renderApp = () =>
  render(
    <MemoryRouter initialEntries={['/login']}>
      <ToastProvider>
        <AppProvider>
          <AppRoutes />
          <Toast />
        </AppProvider>
      </ToastProvider>
    </MemoryRouter>,
  );

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

const click = (name) => fireEvent.click(screen.getByRole('button', { name }));

/** Walks the wizard as far as the tracklist. */
const openWizardAtSongs = async () => {
  click('Make a mixtape');
  await screen.findByText('Pick a shell');
  click('Continue');
  await screen.findByText('Cover it in stickers');
  click('Continue');
  await screen.findByText('The songs, in order');
};

beforeEach(async () => {
  renderApp();
  await logIn();
});

describe('walking the steps', () => {
  it('moves through the five steps and back again', async () => {
    click('Make a mixtape');

    await screen.findByText('Pick a shell');
    expect(screen.getByText('Step 1 of 4')).toBeTruthy();

    click('Continue');
    await screen.findByText('Cover it in stickers');

    click('Continue');
    await screen.findByText('The songs, in order');

    click('Continue');
    await screen.findByText('The letter');

    click('See it whole');
    await screen.findByText('Last look');

    click('Back');
    expect(await screen.findByText('The letter')).toBeTruthy();
  });

  it('names the chosen shell', async () => {
    click('Make a mixtape');
    await screen.findByText('Pick a shell');
    expect(screen.getByText('Selected: Blush Pink')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Sage shell' }));
    expect(await screen.findByText('Selected: Sage')).toBeTruthy();
  });

  it('counts the label towards its forty characters', async () => {
    click('Make a mixtape');
    const label = await screen.findByLabelText(/What's written on the label/);

    fireEvent.change(label, { target: { value: 'the long way round' } });
    expect(await screen.findByText(/^18 \/ 40/)).toBeTruthy();
  });
});

describe('side A gates the wizard', () => {
  it('refuses to continue with an empty tracklist, and says why', async () => {
    await openWizardAtSongs();

    fireEvent.click(screen.getByRole('button', { name: 'Remove About You' }));
    fireEvent.click(screen.getByRole('button', { name: 'Remove Dreams' }));
    expect(await screen.findByText('side a is empty')).toBeTruthy();

    click('Continue');

    expect(await screen.findByText('Add at least one song first.')).toBeTruthy();
    expect(screen.getByText('The songs, in order')).toBeTruthy();
  });

  it('rejects a link that is not from a supported service', async () => {
    await openWizardAtSongs();

    fireEvent.change(screen.getByLabelText('Song link'), {
      target: { value: 'https://example.com/song' },
    });
    click('Add');

    expect(
      await screen.findByText('Paste a Spotify or Apple Music track link.'),
    ).toBeTruthy();
  });

  it('accepts a resolved link and then lets the wizard continue', async () => {
    await openWizardAtSongs();

    fireEvent.click(screen.getByRole('button', { name: 'Remove About You' }));
    fireEvent.click(screen.getByRole('button', { name: 'Remove Dreams' }));
    await screen.findByText('side a is empty');

    fireEvent.change(screen.getByLabelText('Song link'), {
      target: { value: 'https://open.spotify.com/track/x' },
    });
    click('Add');

    await screen.findByText('Added to side A.', {}, { timeout: 3000 });
    click('Continue');
    expect(await screen.findByText('The letter')).toBeTruthy();
  });
});

describe('sending', () => {
  const reachTheLastLook = async () => {
    await openWizardAtSongs();
    click('Continue');
    await screen.findByText('The letter');
    click('See it whole');
    await screen.findByText('Last look');
  };

  it('asks before generating a link, and takes no for an answer', async () => {
    await reachTheLastLook();

    click('Create mixtape');
    expect(await screen.findByRole('dialog')).toBeTruthy();
    expect(screen.getByText('Create the mixtape?')).toBeTruthy();

    click('Not yet');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(screen.getByText('Last look')).toBeTruthy();
  });

  it('generates the link once confirmed', async () => {
    await reachTheLastLook();

    click('Create mixtape');
    await screen.findByRole('dialog');
    click('Create it');

    expect(await screen.findByText('You made something worth saying.')).toBeTruthy();
    expect(screen.getByText(/^thingsunsaid\.app\/m\/[a-zA-Z0-9]{6}$/)).toBeTruthy();
  });

  it('saves a draft and returns to the shelf', async () => {
    click('Make a mixtape');
    await screen.findByText('Pick a shell');

    fireEvent.change(screen.getByLabelText('Who is it for'), {
      target: { value: 'Mara' },
    });
    click('Save draft');

    await screen.findByText('Your mixtapes');
    expect(await screen.findByText('Draft saved.')).toBeTruthy();
    expect(screen.getAllByText('for Mara').length).toBeGreaterThan(0);
  });
});
