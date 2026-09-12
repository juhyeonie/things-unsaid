import { STICKERS } from './stickers.js';
import { daysFrom } from '../utils/format.js';

/**
 * Tapes an existing account appears to already own. Replaced by a real
 * GET /api/tapes response once the backend is wired up.
 */
export const seedTapes = () => [
  {
    id: 101,
    code: '3fK82a',
    title: 'things left unsaid',
    recipient: 'Mara',
    shell: '#A9C6DE',
    stickers: [
      { id: 1, name: 'Heart', paths: STICKERS[0].paths, x: 82, y: 70, rot: -12, size: 15 },
    ],
    tracks: [
      { id: 1, title: 'Nightswimming', artist: 'R.E.M.', len: '4:17' },
      { id: 2, title: 'Pink Rabbits', artist: 'The National', len: '6:44' },
      { id: 3, title: 'Linger', artist: 'The Cranberries', len: '4:34' },
    ],
    letter:
      "You said the drive was too long. I've been thinking about that for two months.",
    status: 'Active',
    created: daysFrom(-2),
    expires: daysFrom(12),
  },
  {
    id: 102,
    code: null,
    title: 'for the drive home',
    recipient: '',
    shell: '#F0D98C',
    stickers: [
      { id: 1, name: 'Sparkle', paths: STICKERS[1].paths, x: 20, y: 72, rot: 10, size: 13 },
    ],
    tracks: [
      { id: 1, title: 'This Must Be the Place', artist: 'Talking Heads', len: '4:56' },
    ],
    letter: '',
    status: 'Draft',
    created: daysFrom(-4),
    expires: null,
  },
  {
    id: 103,
    code: '9pQ41m',
    title: 'august, mostly',
    recipient: 'Jonah',
    shell: '#C3B6DD',
    stickers: [
      { id: 1, name: 'Stamp', paths: STICKERS[6].paths, x: 80, y: 68, rot: 8, size: 14 },
    ],
    tracks: [
      { id: 1, title: 'Song to the Siren', artist: 'This Mortal Coil', len: '3:31' },
    ],
    letter: "It's fine. It really is.",
    status: 'Expired',
    created: daysFrom(-41),
    expires: daysFrom(-27),
  },
];
