import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import Modal from './Modal.jsx';

const props = {
  label: 'Send this tape',
  title: 'Create the mixtape?',
  body: "We'll generate the link now.",
  cancelLabel: 'Not yet',
  confirmLabel: 'Create it',
};

const cancel = () => screen.getByRole('button', { name: 'Not yet' });
const confirm = () => screen.getByRole('button', { name: 'Create it' });

/** A trigger plus the dialog, so focus has somewhere to come from and go back to. */
function Harness() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Create mixtape
      </button>
      <Modal {...props} open={open} onCancel={() => setOpen(false)} onConfirm={() => setOpen(false)} />
    </>
  );
}

describe('rendering', () => {
  it('stays out of the tree until it is opened', () => {
    render(<Modal {...props} open={false} />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('announces itself as a modal dialog', () => {
    render(<Modal {...props} open />);
    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-label')).toBe('Send this tape');
  });
});

describe('dismissing', () => {
  it('cancels on Escape', () => {
    const onCancel = vi.fn();
    render(<Modal {...props} open onCancel={onCancel} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onCancel).toHaveBeenCalled();
  });

  it('cancels on a backdrop click but not on a click inside the panel', () => {
    const onCancel = vi.fn();
    render(<Modal {...props} open onCancel={onCancel} />);

    fireEvent.mouseDown(screen.getByText('Create the mixtape?'));
    expect(onCancel).not.toHaveBeenCalled();

    fireEvent.mouseDown(screen.getByRole('dialog'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('passes the two answers along separately', () => {
    const onCancel = vi.fn();
    const onConfirm = vi.fn();
    render(<Modal {...props} open onCancel={onCancel} onConfirm={onConfirm} />);

    fireEvent.click(confirm());
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
  });
});

describe('keyboard focus', () => {
  it('moves focus into the panel when it opens', () => {
    render(<Modal {...props} open />);
    expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true);
  });

  it('keeps Tab inside the dialog', () => {
    render(<Modal {...props} open />);

    /* Forwards off the last control wraps to the first. */
    confirm().focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(cancel());

    /* Backwards off the first wraps to the last. */
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(confirm());
  });

  it('wraps backwards from the panel itself', () => {
    render(<Modal {...props} open />);
    screen.getByRole('dialog').firstElementChild.focus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(confirm());
  });

  it('leaves ordinary Tab moves between the two controls alone', () => {
    render(<Modal {...props} open />);
    cancel().focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    /* Not intercepted, so the browser would move focus on naturally. */
    expect(document.activeElement).toBe(cancel());
  });

  it('hands focus back to whatever opened it', async () => {
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'Create mixtape' });

    trigger.focus();
    fireEvent.click(trigger);
    await screen.findByRole('dialog');
    expect(document.activeElement).not.toBe(trigger);

    fireEvent.click(cancel());
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });
});
