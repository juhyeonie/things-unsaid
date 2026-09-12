import { createContext, useContext } from 'react';

export const ToastContext = createContext(null);

/** Read the current toast and the `flash` function that raises one. */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
