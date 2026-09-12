/** The eight tape shells offered in step one of the wizard. */
export const SHELLS = [
  { name: 'Blush Pink', hex: '#F2C7CB' },
  { name: 'Cherry', hex: '#C8443E' },
  { name: 'Butter Yellow', hex: '#F0D98C' },
  { name: 'Sage', hex: '#A9BFA0' },
  { name: 'Baby Blue', hex: '#A9C6DE' },
  { name: 'Lavender', hex: '#C3B6DD' },
  { name: 'Cream', hex: '#F4E9D6' },
  { name: 'Black', hex: '#2A2622' },
];

export const DEFAULT_SHELL = SHELLS[0].hex;

/** Dark shells need a light checkmark when selected. */
const DARK_SHELLS = ['#2A2622', '#C8443E'];

export const checkColorFor = (hex) =>
  DARK_SHELLS.includes(hex) ? '#FFFDF7' : '#241F1B';

export const shellName = (hex) =>
  (SHELLS.find((c) => c.hex === hex) || SHELLS[0]).name;
