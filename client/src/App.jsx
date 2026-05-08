import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

import LandingPage from './pages/LandingPage';
import AuditFormPage from './pages/AuditFormPage';
import ResultsPage from './pages/ResultsPage';
import SharedAuditPage from './pages/SharedAuditPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <HelmetProvider>
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
