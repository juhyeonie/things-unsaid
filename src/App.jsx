import { useEffect } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom';

import ErrorBoundary from './components/ErrorBoundary.jsx';
import Toast from './components/ui/Toast.jsx';
import { useApp } from './context/AppContext.js';
import { AppProvider } from './context/AppProvider.jsx';
import { ToastProvider } from './context/ToastProvider.jsx';
import Auth from './pages/Auth.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Done from './pages/Done.jsx';
import Expired from './pages/Expired.jsx';
import Landing from './pages/Landing.jsx';
import Recipient from './pages/Recipient.jsx';
import Create from './pages/create/Create.jsx';

/** Each screen starts at the top, the way a fresh page would. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/**
 * Screens that belong to an account. With no real session yet this only
 * checks the mocked user; it becomes a token check once auth is built.
 */
function RequireAccount({ children, fallback = '/' }) {
  const { user } = useApp();
  return user ? children : <Navigate to={fallback} replace />;
}

/** Keying by share code remounts the page, so each tape opens sealed. */
function RecipientRoute() {
  const { code } = useParams();
  return <Recipient key={code} />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Auth mode="login" />} />
      <Route path="/register" element={<Auth mode="register" />} />

      <Route
        path="/dashboard"
        element={
          <RequireAccount>
            <Dashboard />
          </RequireAccount>
        }
      />
      <Route
        path="/create"
        element={
          <RequireAccount fallback="/register">
            <Create />
          </RequireAccount>
        }
      />
      <Route
        path="/done"
        element={
          <RequireAccount>
            <Done />
          </RequireAccount>
        }
      />

      {/* Public: anyone with the link can open a tape. */}
      <Route path="/m/:code" element={<RecipientRoute />} />
      <Route path="/expired" element={<Expired />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ToastProvider>
          <AppProvider>
            <ScrollToTop />
            <AppRoutes />
            <Toast />
          </AppProvider>
        </ToastProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
