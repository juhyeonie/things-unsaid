import { useEffect, useState } from 'react';

/**
 * Width of the app shell, used for the two layout switches the prototype
 * makes in JavaScript rather than in CSS: the horizontally scrolling
 * sticker tray (narrow) and the auth page's illustration panel (wide).
 */
export function useViewportWidth() {
  const [width, setWidth] = useState(() =>
    typeof window === 'undefined' ? 1200 : window.innerWidth,
  );

  useEffect(() => {
    const el = document.documentElement;

    if (window.ResizeObserver) {
      const ro = new ResizeObserver((entries) => {
        const w = Math.round(entries[0].contentRect.width);
        if (w) setWidth(w);
      });
      ro.observe(el);
      return () => ro.disconnect();
    }

    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return {
    width,
    isNarrow: width < 620,
    isWide: width >= 900,
  };
}
