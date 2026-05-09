import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import LandingPage from './pages/LandingPage';
import AuditFormPage from './pages/AuditFormPage';
import ResultsPage from './pages/ResultsPage';
import SharedAuditPage from './pages/SharedAuditPage';
import NotFoundPage from './pages/NotFoundPage';
import SplashScreen from './components/SplashScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSplash(false), 3000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <HelmetProvider>
      <AnimatePresence>
        {showSplash && <SplashScreen />}
      </AnimatePresence>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/audit" element={<AuditFormPage />} />
        <Route path="/results/:shareId" element={<ResultsPage />} />
        <Route path="/audit/:shareId" element={<SharedAuditPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1a1b2e',
            color: '#e2e8f0',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#34d399', secondary: '#1a1b2e' },
          },
          error: {
            iconTheme: { primary: '#f87171', secondary: '#1a1b2e' },
          },
        }}
      />
    </HelmetProvider>
  );
}
