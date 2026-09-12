import { createContext, useContext } from 'react';

export const AppContext = createContext(null);

/** The signed-in user, their tapes, the draft being edited, and the actions. */
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
