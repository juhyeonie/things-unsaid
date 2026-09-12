/**
 * Line icons used across the app, traced from the prototype. Each takes a
 * size and inherits `currentColor` unless a stroke is passed explicitly.
 */

const base = (size, extra = {}) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  ...extra,
});

export const PlusIcon = ({ size = 17 }) => (
  <svg {...base(size, { strokeWidth: 1.9 })}>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

export const ChevronLeftIcon = ({ size = 16 }) => (
  <svg {...base(size, { strokeWidth: 1.75 })}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export const ChevronRightIcon = ({ size = 16 }) => (
  <svg {...base(size, { strokeWidth: 1.75 })}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export const ChevronUpIcon = ({ size = 16 }) => (
  <svg {...base(size, { strokeWidth: 1.75 })}>
    <path d="m18 15-6-6-6 6" />
  </svg>
);

export const ChevronDownIcon = ({ size = 16 }) => (
  <svg {...base(size, { strokeWidth: 1.75 })}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const CloseIcon = ({ size = 16 }) => (
  <svg {...base(size, { strokeWidth: 1.75 })}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

export const CheckIcon = ({ size = 18, stroke = 'currentColor', strokeWidth = 2.5 }) => (
  <svg {...base(size, { strokeWidth, stroke })}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const LinkIcon = ({ size = 18, stroke = '#7A6F63' }) => (
  <svg {...base(size, { strokeWidth: 1.7, stroke })} className="flex-none">
    <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.8 1.7" />
    <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.8-1.7" />
  </svg>
);

export const CopyIcon = ({ size = 18 }) => (
  <svg {...base(size, { strokeWidth: 1.8 })}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
  </svg>
);

export const ShareIcon = ({ size = 18 }) => (
  <svg {...base(size, { strokeWidth: 1.8 })}>
    <path d="M12 3v13" />
    <path d="m7 8 5-5 5 5" />
    <path d="M5 15v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
  </svg>
);

export const AlertIcon = ({ size = 14 }) => (
  <svg {...base(size, { strokeWidth: 2 })}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v5" />
    <path d="M12 16.5v.01" />
  </svg>
);

export const ArrowDownIcon = ({ size = 20 }) => (
  <svg {...base(size, { strokeWidth: 1.5 })}>
    <path d="M12 5v14" />
    <path d="m19 12-7 7-7-7" />
  </svg>
);

export const PlayIcon = ({ size = 15 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <polygon points="7 4 19 12 7 20 7 4" />
  </svg>
);
