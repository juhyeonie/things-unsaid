/**
 * Sticker artwork. Each sticker is a list of raw SVG paths drawn on a
 * 24x24 viewBox so it can be rendered at any size on the cassette shell.
 */

/** Build a circle as a path so every sticker part shares one shape type. */
const circle = (cx, cy, r, f) => ({
  d: `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0`,
  f,
  s: 'none',
  w: 0,
});

export const STICKERS = [
  {
    name: 'Heart',
    paths: [
      {
        d: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z',
        f: '#C8443E',
        s: 'none',
        w: 0,
      },
    ],
  },
  {
    name: 'Sparkle',
    paths: [
      {
        d: 'M12 2c.6 4.7 2.7 7 7.6 8-4.9 1-7 3.3-7.6 8-.6-4.7-2.7-7-7.6-8 4.9-1 7-3.3 7.6-8Z',
        f: '#F0D98C',
        s: 'none',
        w: 0,
      },
    ],
  },
  {
    name: 'Star',
    paths: [
      {
        d: 'M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.4l6-.8Z',
        f: '#A9C6DE',
        s: 'none',
        w: 0,
      },
    ],
  },
  {
    name: 'Flower',
    paths: [
      circle(12, 6, 4, '#F2C7CB'),
      circle(12, 18, 4, '#F2C7CB'),
      circle(6, 12, 4, '#F2C7CB'),
      circle(18, 12, 4, '#F2C7CB'),
      circle(12, 12, 3.2, '#F0D98C'),
    ],
  },
  {
    name: 'Smiley',
    paths: [
      circle(12, 12, 9.5, '#F0D98C'),
      circle(9, 10, 1.3, '#2A2622'),
      circle(15, 10, 1.3, '#2A2622'),
      {
        d: 'M8 14.5c1.1 1.6 2.4 2.4 4 2.4s2.9-.8 4-2.4',
        f: 'none',
        s: '#2A2622',
        w: 1.6,
      },
    ],
  },
  {
    name: 'Postmark',
    paths: [
      { d: 'M3 6h18v12H3z', f: '#A9BFA0', s: 'none', w: 0 },
      { d: 'M6 9h7M6 12h9M6 15h5', f: 'none', s: '#FFFDF7', w: 1.4 },
      circle(18, 12, 1.6, '#FFFDF7'),
    ],
  },
  {
    name: 'Stamp',
    paths: [
      { d: 'M5 4h14v16H5z', f: '#C3B6DD', s: 'none', w: 0 },
      { d: 'M8 8h8v8H8z', f: '#FFFDF7', s: 'none', w: 0 },
      circle(12, 12, 2.4, '#C3B6DD'),
    ],
  },
  {
    name: 'Word',
    paths: [
      {
        d: 'M2.5 6h19a1.6 1.6 0 0 1 1.6 1.6v8.8a1.6 1.6 0 0 1-1.6 1.6h-19A1.6 1.6 0 0 1 .9 16.4V7.6A1.6 1.6 0 0 1 2.5 6Z',
        f: '#2A2622',
        s: 'none',
        w: 0,
      },
      circle(7.6, 9.6, 0.8, '#FFFDF7'),
      {
        d: 'M7.6 11.4v3.7M11.1 8.4v6.7M13.8 11.4l1.8 3.4M17.6 11.4l-3.2 5.9',
        f: 'none',
        s: '#FFFDF7',
        w: 1.5,
      },
    ],
  },
];

/** Where each newly added sticker lands, in order, as a percentage of the shell. */
export const SPOTS = [
  { x: 16, y: 70 },
  { x: 84, y: 70 },
  { x: 50, y: 84 },
  { x: 12, y: 55 },
  { x: 88, y: 55 },
  { x: 32, y: 88 },
  { x: 68, y: 88 },
  { x: 50, y: 62 },
];

/** Stickers shown on the decorative cassettes (landing hero, auth aside). */
export const HERO_STICKERS = [
  { id: 1, name: 'Heart', paths: STICKERS[0].paths, x: 80, y: 72, rot: -12, size: 15 },
  { id: 2, name: 'Sparkle', paths: STICKERS[1].paths, x: 16, y: 74, rot: 14, size: 12 },
];
