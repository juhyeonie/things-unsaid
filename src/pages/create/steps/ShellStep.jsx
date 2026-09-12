import { Field } from '../../../components/ui/Field.jsx';
import { CheckIcon } from '../../../components/ui/Icons.jsx';
import { SHELLS, checkColorFor, shellName } from '../../../data/shells.js';
import { cx } from '../../../utils/cx.js';
import { BLURB, H2, NOTE, SECTION_HEADING } from './stepStyles.js';

const SWATCH =
  'w-[52px] h-[52px] grid place-items-center rounded-[10px] cursor-pointer transition-[transform,box-shadow] duration-[160ms] ease-out-soft';

/** Step one — the shell colour, who it is for, and what the label says. */
export default function ShellStep({ shell, title, recipient, onPatch }) {
  return (
    <section className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-[clamp(24px,4vw,40px)] animate-rise">
      <div className="flex flex-col gap-[18px]">
        <div className={SECTION_HEADING}>
          <h2 className={H2}>Pick a shell</h2>
          <p className={`${BLURB} max-w-[42ch]`}>
            Eight colors, all of them real tape stock. Pick the one that sounds like
            them.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {SHELLS.map((c) => {
            const selected = shell === c.hex;
            return (
              <button
                key={c.hex}
                type="button"
                aria-label={`${c.name} shell`}
                aria-pressed={selected}
                className={cx(
                  SWATCH,
                  selected
                    ? 'border-2 border-ink shadow-[0_0_0_3px_var(--color-paper)_inset]'
                    : 'border border-[rgba(36,31,27,0.14)]',
                )}
                style={{ background: c.hex }}
                onClick={() => onPatch({ shell: c.hex })}
              >
                {selected && <CheckIcon size={18} stroke={checkColorFor(c.hex)} />}
              </button>
            );
          })}
        </div>

        <span className={NOTE}>Selected: {shellName(shell)}</span>
      </div>

      <div className="flex flex-col gap-[18px]">
        <Field
          label="Who is it for"
          placeholder="their name"
          value={recipient}
          onChange={(e) => onPatch({ recipient: e.target.value })}
        />
        <Field
          label="What's written on the label"
          tone="hand"
          maxLength={40}
          placeholder="for when you can't sleep"
          value={title}
          hint={`${title.length} / 40 — it goes on the J-card in your handwriting.`}
          onChange={(e) => onPatch({ title: e.target.value })}
        />
      </div>
    </section>
  );
}
