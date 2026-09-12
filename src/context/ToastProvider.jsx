import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { ToastContext } from './ToastContext.js';

const TOAST_MS = 2200;

/** Holds the single confirmation message the app shows at a time. */
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  const flash = useCallback((message) => {
    clearTimeout(timer.current);
    setToast(message);
    timer.current = setTimeout(() => setToast(null), TOAST_MS);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  const value = useMemo(() => ({ toast, flash }), [toast, flash]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}
