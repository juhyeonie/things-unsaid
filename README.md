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

Then open http://localhost:5173. `npm run build` produces the production bundle and
`npm run lint` runs oxlint.

## Screens

| Route | Screen |
| --- | --- |
| `/` | Landing — the pitch, the hero cassette, and the way in |
| `/login`, `/register` | Account screens; the illustrated panel appears at 900px and up |
| `/dashboard` | Your mixtapes, filtered by Draft / Active / Expired |
| `/create` | The five-step wizard: shell → stickers → songs → letter → last look |
| `/done` | The share link, right after a tape becomes real |
| `/m/:code` | What the recipient opens. `/m/demo` shows the tape in the editor |
| `/expired` | A link that has passed its fourteen days |

Account screens are guarded by `RequireAccount` in `src/App.jsx`; without a session
it returns the visitor to the landing page.

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
  hooks/useViewportWidth.js
  components/
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

Styling is CSS Modules over the custom properties defined in `src/index.css`.
Nothing is hard-coded twice: colours, fonts, shadows and easing all come from tokens.

> Note: CSS Modules rewrites `animation-name`, so a module can only use keyframes it
> declares itself. That is why `tuRise`, `tuFade`, `tuToast` and `tuSpin` appear at the
> top of the module files that use them, alongside the global copies in `index.css`
> that back the `.tu-rise` / `.tu-fade` utility classes.

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

### Mocked on purpose

- **Accounts.** Any valid-looking email with an 8+ character password signs in.
  Logging in loads three seeded tapes; registering starts you empty.
- **Track links.** Any Spotify or Apple Music URL resolves, in order, to an entry in
  `src/data/catalog.js` after a short delay.
- **Share links.** Codes are generated in the browser and the fourteen-day expiry is
  displayed but never enforced.
- **Playback.** The play buttons on a recipient's side A are inert.
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
