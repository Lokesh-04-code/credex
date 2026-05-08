import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Home, Zap, ArrowRight } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>404 — Page Not Found · AI Spend Audit</title>
        <meta name="description" content="This page doesn't exist. Run a free AI spend audit instead." />
      </Helmet>

      <div className="min-h-screen hero-bg flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md"
        >
          <div className="text-8xl font-black gradient-text mb-4">404</div>
          <h1 className="text-2xl font-bold text-white mb-3">Page not found</h1>
          <p className="text-slate-400 mb-8 leading-relaxed">
            This page doesn't exist or was removed. Perhaps you were looking for an audit report
            that has expired?
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" id="404-home-btn" className="btn-ghost">
              <Home className="w-4 h-4" /> Go Home
            </Link>
            <Link to="/audit" id="404-audit-btn" className="btn-primary">
              Start Free Audit <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Subtle brand link */}
        <div className="mt-16 flex items-center gap-2 text-slate-600">
          <div className="w-5 h-5 rounded bg-brand-600/50 flex items-center justify-center">
            <Zap className="w-3 h-3 text-white/70" />
          </div>
          <span className="text-sm">AI Spend Audit</span>
        </div>
      </div>
    </>
  );
}
