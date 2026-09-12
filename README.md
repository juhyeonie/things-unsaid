# Things Unsaid — frontend

React implementation of the *Things Unsaid* prototype: make one mixtape, send it
once, and let it fade after fourteen days.

This is the **client half of a planned MERN app**. There is no Express server, no
MongoDB, and no real authentication yet — every call that will eventually hit the
backend goes through one mock module so it can be swapped in later.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

| Command | Does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm test` | Runs the suite once |
| `npm run test:watch` | Reruns on change |
| `npm run lint` | oxlint |
| `npm run build` | Production bundle |

Stack for this phase: React 19, React Router and Tailwind CSS v4 on Vite. Nothing else.

## Screens

| Route | Screen |
| --- | --- |
| `/` | Landing — the pitch, the hero cassette, and the way in |
| `/login`, `/register` | Account screens; the illustrated panel appears at 900px and up |
| `/dashboard` | Your mixtapes, filtered by Draft / Active / Expired |
| `/create` | The five-step wizard: shell → stickers → songs → letter → last look |
| `/done` | The share link, right after a tape becomes real |
| `/m/:code` | What the recipient opens; an unresolvable code redirects to `/expired`. `/m/demo` shows the tape in the editor |
| `/expired` | A link that has passed its fourteen days |

Account screens are guarded by `RequireAccount` in `src/App.jsx`; without a session
it returns the visitor to the landing page.

An `ErrorBoundary` wraps the whole app. A render error anywhere below it shows a
recovery screen rather than a blank page, and the error message itself is printed only
in development. It sits outside the router deliberately: recovery reloads rather than
navigates, because whatever state produced the error is the state worth discarding.

## Layout

```
src/
  App.jsx                  routes, guards, providers
  index.css                design tokens (colours, type, motion) + baseline
  context/
    AppContext.js          context object + useApp()
    AppProvider.jsx        user, tapes, and the draft being edited
    ToastContext.js        context object + useToast()
    ToastProvider.jsx      the single confirmation message
  services/mockApi.js      ← the backend seam (see below)
  data/                    shells, stickers, track catalog, seeded tapes
  utils/format.js          dates, word counts, salutations, share URLs
  utils/cx.js              conditional class joining
  hooks/useViewportWidth.js
  test/setup.js            jsdom gaps the app touches on mount
  components/
    ErrorBoundary.jsx      catches a render error and offers a way out
    Cassette/              the tape itself: shell, J-card, reels, stickers
    layout/AppHeader.jsx   signed-in chrome and the back-chevron logo
    letter/                the letter, on ruled paper
    tapes/TapeCard.jsx     one dashboard card
    tracks/TrackList.jsx   side A in its editable, compact and reader shapes
    ui/                    Button, Field, Modal, Toast, StatusPill, Icons
  pages/
    Landing, Auth, Dashboard, Done, Recipient, Expired
    create/                the wizard and its five steps
```

## Styling

Tailwind CSS v4, wired up through `@tailwindcss/vite` — no `tailwind.config.js` and no
PostCSS file. The prototype's palette, typefaces, easing curves, shadows and keyframes
are declared once as tokens in the `@theme` block of `src/index.css`, which turns each
one into a utility: `bg-paper`, `text-ink-soft`, `font-hand`, `ease-out-soft`,
`shadow-letter`, `animate-reel`.

Exact prototype values are kept with arbitrary utilities — `py-[17px]`,
`min-h-[54px]`, `text-[clamp(42px,13.4cqi,76px)]` — rather than rounded to Tailwind's
default scale, which would shift the design.

Hand-written CSS survives in one place only: the `@layer base` block at the bottom of
`index.css`, for the rules that cannot be utilities — the page background, the global
`*:focus-visible` ring, the `prefers-reduced-motion` override and link defaults.

Three things are worth knowing before editing the classes:

- **One utility per property.** Tailwind resolves two utilities for the same property
  by stylesheet order, not by their order in the class string. `Button` therefore owns
  colour only; padding, type scale, radius and gap all come from the caller, and states
  that swap palettes (the filter pills, the active nav item) are whole alternatives
  rather than a base plus an override.
- **Translate and rotate are their own CSS properties in v4,** not `transform`. A
  transition must name `translate` for a hover lift to ease instead of jump.
- **Class names must appear in the source as complete strings.** Tailwind scans text,
  so a class assembled at runtime is never generated. The letter's three ruled-paper
  gradients are written out in full in `components/letter/Letter.jsx` for that reason.

Dynamic values that Tailwind cannot express — sticker positions, the chosen shell
colour, the step-dot widths — stay as inline `style`.

## Tests

Vitest, with Testing Library for anything that renders. 83 tests in seven files, about
ten seconds.

| File | Covers |
| --- | --- |
| `services/mockApi.test.js` | The contract the Express routes will have to honour — validation branches, share codes, and `buildTapeRecord` as both a POST and a PATCH body. Runs in the node environment, no DOM. |
| `utils/format.test.js` | Dates, word counts, salutations, share URLs, and that the placeholder letter is preview-only. |
| `context/AppProvider.test.jsx` | The state layer through `useApp`: signing in and out, storing, sending, deleting, the tracklist and the stickers. |
| `pages/Recipient.test.jsx` | The share route end to end, including every way a link can fail to resolve. |
| `pages/create/Create.test.jsx` | The wizard: stepping, the tracklist gate, and the send confirmation. |
| `components/ErrorBoundary.test.jsx` | The fallback renders, reports, and reloads. |
| `components/ui/Modal.test.jsx` | Dismissal, and that the keyboard cannot leave an open dialog. |

The point of the first one is that it should keep passing when the mock bodies become
`fetch` calls. The rest lock in behaviour that was wrong once already — each of those
tests carries a comment saying which regression it guards.

Component tests drive the real router and the real providers rather than mocking them,
so they exercise the same code paths as the browser.

## Where the backend plugs in

`src/services/mockApi.js` is the only file that pretends to be a server. Each function
is already promise-based, so swapping it for `fetch('/api/…')` needs no component
changes:

| Function | Becomes |
| --- | --- |
| `register`, `login` | `POST /api/auth/register`, `POST /api/auth/login` |
| `buildTapeRecord` | the body of `POST /api/tapes` / `PATCH /api/tapes/:id` |
| `resolveTrack` | `GET /api/tracks/resolve?url=…` (Spotify / Apple Music lookup) |
| `makeCode` | server-side, so share codes are unique |

State lives in `AppProvider` for the page session only — reloading signs you out and
clears your tapes. Persistence is the backend's job.

Because of that, `/m/:code` currently sends every cold-loaded link to the faded-away
screen: with no store to read from, the tape genuinely cannot be resolved. That is the
honest answer until `GET /api/tapes/:code` exists, and it is where the loading and
not-found branches belong once it does.

### Mocked on purpose

- **Accounts.** Any valid-looking email with an 8+ character password signs in.
  Logging in loads three seeded tapes; registering starts you empty.
- **Track links.** Any Spotify or Apple Music URL resolves, in order, to an entry in
  `src/data/catalog.js` after a short delay.
- **Share links.** Codes are generated in the browser and the fourteen-day expiry is
  displayed but never enforced.
- **Playback.** The play buttons on a recipient's side A raise a toast saying so.
- **Forgot password.** Raises a toast saying as much.

## Deviations from the prototype

Three, all of them fixes rather than redesigns:

1. **Logo.** The prototype's `logo.png` is a bad crop showing only "THINGS". This uses
   the full wordmark from the source artwork, trimmed to its bounds.
2. **Mobile overflow.** The landing and wizard headers scrolled sideways below about
   400px. Both now wrap, the way the signed-in header already did.
3. **Grid minimums.** `minmax(480px, 1fr)` and friends became
   `minmax(min(480px, 100%), 1fr)`, which keeps the desktop layout identical but stops
   narrow screens overflowing.
