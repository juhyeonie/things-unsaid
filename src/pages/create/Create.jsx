import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Cassette from '../../components/Cassette/Cassette.jsx';
import { BackLogo } from '../../components/layout/AppHeader.jsx';
import Button from '../../components/ui/Button.jsx';
import { ChevronLeftIcon, ChevronRightIcon } from '../../components/ui/Icons.jsx';
import Modal from '../../components/ui/Modal.jsx';
import { useApp } from '../../context/AppContext.js';
import { useToast } from '../../context/ToastContext.js';
import { useViewportWidth } from '../../hooks/useViewportWidth.js';
import { cx } from '../../utils/cx.js';
import { letterTextFor } from '../../utils/format.js';
import LetterStep from './steps/LetterStep.jsx';
import PreviewStep from './steps/PreviewStep.jsx';
import ShellStep from './steps/ShellStep.jsx';
import SongsStep from './steps/SongsStep.jsx';
import StickerStep from './steps/StickerStep.jsx';

const LAST_STEP = 4;

/* The step indicator drops below the logo rather than overflowing on phones. */
const HEADER = cx(
  'sticky top-0 z-20 flex items-center justify-between gap-4 flex-wrap',
  'px-[clamp(16px,4vw,40px)] py-3.5 bg-[rgba(250,247,242,0.92)] backdrop-blur-[10px]',
  'border-b border-line',
);

const FOOTER = cx(
  'sticky bottom-0 z-20 flex items-center justify-between gap-3',
  'px-[clamp(16px,4vw,40px)] pt-3 pb-[max(12px,env(safe-area-inset-bottom))]',
  'bg-[rgba(250,247,242,0.94)] backdrop-blur-[10px] border-t border-line',
);

/** How wide the cassette sits at each step. */
function stageWidth(step, isNarrow) {
  if (step >= 3) return '300px';
  if (isNarrow) return '100%';
  return step === 2 ? '400px' : '520px';
}

export default function Create() {
  const navigate = useNavigate();
  const { flash } = useToast();
  const { isNarrow } = useViewportWidth();
  const {
    user,
    draft,
    patchDraft,
    storeTape,
    addSticker,
    moveSticker,
    setStickerDragging,
    removeSticker,
    clearStickers,
    addTrackFromLink,
    removeTrack,
    moveTrack,
  } = useApp();

  const [step, setStep] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);

  /* Dragging a sticker is tracked outside React state so pointermove stays cheap. */
  const bodyRef = useRef(null);
  const dragId = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      const id = dragId.current;
      if (id == null || !bodyRef.current) return;

      const r = bodyRef.current.getBoundingClientRect();
      const x = Math.min(94, Math.max(6, ((e.clientX - r.left) / r.width) * 100));
      const y = Math.min(92, Math.max(8, ((e.clientY - r.top) / r.height) * 100));
      moveSticker(id, x, y);
    };

    const onUp = () => {
      if (dragId.current == null) return;
      dragId.current = null;
      setStickerDragging(null);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [moveSticker, setStickerDragging]);

  const grabSticker = (id, e) => {
    e.preventDefault();
    dragId.current = id;
    setStickerDragging(id);
  };

  const canNext = step === 2 ? draft.tracks.length > 0 : true;

  const next = () => {
    if (!canNext) {
      flash('Add at least one song first.');
      return;
    }
    if (step === LAST_STEP) {
      setConfirmOpen(true);
      return;
    }
    setStep(step + 1);
  };

  const back = () => {
    if (step === 0) {
      navigate(user ? '/dashboard' : '/');
      return;
    }
    setStep(step - 1);
  };

  const confirmSend = () => {
    setConfirmOpen(false);
    storeTape('Active');
    navigate('/done');
  };

  const saveDraft = () => {
    storeTape('Draft');
    navigate('/dashboard');
  };

  const nextLabel =
    step === LAST_STEP ? 'Create mixtape' : step === 3 ? 'See it whole' : 'Continue';

  return (
    <div className="flex flex-col min-h-screen">
      <header className={HEADER}>
        <BackLogo onClick={() => navigate(user ? '/dashboard' : '/')} />

        <div className="flex items-center flex-wrap justify-end gap-3">
          {user && (
            <Button
              variant="secondary"
              className="text-[14px] px-[14px] py-[11px] min-h-[44px] rounded-[10px]"
              onClick={saveDraft}
            >
              Save draft
            </Button>
          )}
          <span className="text-[12px] tracking-[0.1em] uppercase text-ink-soft font-medium whitespace-nowrap">
            Step {Math.min(step + 1, 4)} of 4
          </span>
          <div className="flex items-center gap-1.5" role="presentation">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="h-2 rounded-[4px] [transition:width_240ms_var(--ease-out-soft),background_240ms_ease]"
                style={{
                  width: i === step ? 22 : 8,
                  background:
                    i < step
                      ? 'var(--color-ink)'
                      : i === step
                        ? 'var(--color-accent)'
                        : 'var(--color-line-strong)',
                }}
              />
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1180px] mx-auto px-[clamp(16px,4vw,40px)] pt-[clamp(24px,4vw,48px)] pb-10 flex flex-col gap-[clamp(28px,4vw,48px)]">
        <div className="grid place-items-center">
          <div
            className="w-full transition-[max-width] duration-[320ms] ease-out-soft"
            style={{ maxWidth: stageWidth(step, isNarrow) }}
          >
            <Cassette
              shell={draft.shell}
              label={draft.title}
              stickers={draft.placed}
              interactive
              bodyRef={bodyRef}
              spinning={step === LAST_STEP}
              onStickerGrab={grabSticker}
              onStickerPeel={removeSticker}
            />
          </div>
        </div>

        {step === 0 && (
          <ShellStep
            shell={draft.shell}
            title={draft.title}
            recipient={draft.recipient}
            onPatch={patchDraft}
          />
        )}

        {step === 1 && (
          <StickerStep
            placed={draft.placed}
            isNarrow={isNarrow}
            onAdd={addSticker}
            onClear={clearStickers}
          />
        )}

        {step === 2 && (
          <SongsStep
            tracks={draft.tracks}
            onAdd={addTrackFromLink}
            onMove={moveTrack}
            onRemove={removeTrack}
          />
        )}

        {step === 3 && (
          <LetterStep
            letter={draft.letter}
            recipient={draft.recipient}
            onPatch={patchDraft}
          />
        )}

        {step === LAST_STEP && (
          <PreviewStep
            tracks={draft.tracks}
            recipient={draft.recipient}
            letterText={letterTextFor(draft.letter)}
          />
        )}
      </main>

      <footer className={FOOTER}>
        <Button
          variant="ghost"
          className="text-[15px] px-[18px] py-3.5 min-h-[48px] rounded-[10px] gap-2"
          onClick={back}
        >
          <ChevronLeftIcon />
          Back
        </Button>
        <Button
          variant="primary"
          className={cx(
            'text-[16px] px-[26px] py-3.5 min-h-[48px] rounded-[10px] gap-2',
            /* A blocked Next still reacts to clicks so it can explain itself. */
            !canNext && 'opacity-40 cursor-not-allowed',
          )}
          onClick={next}
        >
          {nextLabel}
          <ChevronRightIcon />
        </Button>
      </footer>

      <Modal
        open={confirmOpen}
        label="Send this tape"
        title="Create the mixtape?"
        body={`We'll generate the link now. Once it exists you can't change the letter${
          draft.recipient.trim()
            ? `, and ${draft.recipient.trim()} can open it the moment you send it`
            : ''
        }. That's rather the point.`}
        cancelLabel="Not yet"
        confirmLabel="Create it"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmSend}
      />
    </div>
  );
}
