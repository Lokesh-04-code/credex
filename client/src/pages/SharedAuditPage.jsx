import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  TrendingDown, Zap, AlertTriangle, CheckCircle,
  Share2, Copy, ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

import { auditApi } from '../services/api';
import {
  formatCurrency, buildShareUrl, formatDate, getToolName, getSavingsSeverity
} from '../utils/formatters';
import { SEVERITY_CONFIG, RECOMMENDATION_TYPE_LABELS, HIGH_SAVINGS_THRESHOLD } from '../constants/tools';
import StackSaverLogo from '../components/StackSaverLogo';

/**
 * Public Shared Audit Page
 *
 * Loaded via /audit/:shareId - strips all private data.
 * Only shows: tools, savings totals, and recommendations.
 * Optimized for sharing with OG tags.
 */
export default function SharedAuditPage() {
  const { shareId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!shareId) return;
    auditApi.getAudit(shareId)
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [shareId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildShareUrl(shareId));
      setCopied(true);
      toast.success('Link copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen hero-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Loading audit...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen hero-bg flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">Audit not found</h1>
          <p className="text-slate-400 text-sm mb-6">{error || 'This audit link may have expired.'}</p>
          <Link to="/audit" className="btn-primary">Run Your Own Audit</Link>
        </div>
      </div>
    );
  }

  const { recommendations = [], totalMonthlySavings = 0, totalAnnualSavings = 0, aiSummary, createdAt, tools = [] } = data;
  const shareUrl = buildShareUrl(shareId);
  const severity = getSavingsSeverity(totalMonthlySavings);
  const isHighSavings = totalMonthlySavings >= HIGH_SAVINGS_THRESHOLD;

  const ogTitle = `Stack Saver - ${formatCurrency(totalMonthlySavings)}/mo savings identified`;
  const ogDescription = `${recommendations.length} optimization recommendations across ${tools.length} AI tool${tools.length !== 1 ? 's' : ''}. ${formatCurrency(totalAnnualSavings)}/year potential savings.`;

  return (
    <>
      <Helmet>
        <title>{ogTitle}</title>
        <meta name="description" content={ogDescription} />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={ogDescription} />
        {/* Canonical URL */}
        <link rel="canonical" href={shareUrl} />
      </Helmet>

      <div className="min-h-screen hero-bg">
        {/* Header */}
        <nav className="flex items-center justify-between px-6 py-5 max-w-4xl mx-auto border-b border-white/5">
          <Link to="/" className="flex items-center gap-2">
            <StackSaverLogo size="sm" />
          </Link>

          <div className="flex items-center gap-3">
            <button id="shared-copy-btn" onClick={handleCopy} className="btn-ghost text-sm py-2 px-4">
              {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <Link to="/audit" id="shared-run-own-btn" className="btn-primary text-sm py-2 px-4">
              Run Your Audit <Zap className="w-4 h-4" />
            </Link>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Shared indicator */}
          <div className="flex items-center gap-2 mb-6">
            <Share2 className="w-4 h-4 text-slate-500" />
            <span className="text-slate-500 text-sm">
              Shared audit · {createdAt ? formatDate(createdAt) : ''}
            </span>
          </div>

          {/* Hero savings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-10 text-center mb-8 shadow-glow"
          >
            <div className="text-slate-400 text-sm mb-3 flex items-center justify-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Stack Saver Results
            </div>
            <div className={`text-7xl font-black mb-2 ${severity.color}`}>
              {formatCurrency(totalMonthlySavings)}
            </div>
            <div className="text-slate-400 text-lg mb-2">per month in potential savings</div>
            <div className="text-slate-600 text-sm">
              {formatCurrency(totalAnnualSavings)}/year · {tools.length} tools audited · {recommendations.length} recommendations
            </div>
          </motion.div>

          {/* Tools audited */}
          <div className="glass-card p-5 mb-6">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Tools Audited</h2>
            <div className="flex flex-wrap gap-2">
              {tools.map((tool, i) => (
                <span key={i} className="badge badge-purple">
                  {getToolName(tool.toolId)} · {tool.plan}
                </span>
              ))}
            </div>
          </div>

          {/* AI Summary */}
          {aiSummary && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass-card p-6 mb-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">AI Analysis</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{aiSummary}</p>
            </motion.div>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="space-y-4 mb-8">
              <h2 className="text-lg font-semibold text-white">
                Recommendations
              </h2>
              {recommendations.map((rec, i) => {
                const severityConfig = SEVERITY_CONFIG[rec.severity] || SEVERITY_CONFIG.low;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="glass-card p-5"
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`badge ${severityConfig.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${severityConfig.dot}`} />
                        {severityConfig.label}
                      </span>
                      <span className="text-xs text-slate-500">{getToolName(rec.tool)}</span>
                    </div>
                    <p className="font-semibold text-white text-sm mb-1">{rec.recommendedAction}</p>
                    {rec.estimatedMonthlySavings > 0 && (
                      <p className="text-emerald-400 text-sm font-medium">
                        Save {formatCurrency(rec.estimatedMonthlySavings)}/mo · {formatCurrency(rec.estimatedAnnualSavings)}/yr
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* CTA */}
          <div className="glass-card p-8 text-center">
            {isHighSavings ? (
              <>
                <h3 className="text-xl font-bold text-white mb-2">
                  This team could save {formatCurrency(totalAnnualSavings)}/year
                </h3>
                <p className="text-slate-400 mb-6 text-sm">
                  Audit your own AI tool stack - free, takes 3 minutes.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/audit" id="shared-cta-audit" className="btn-primary">
                    Audit My Stack <Zap className="w-4 h-4" />
                  </Link>
                  <a
                    href="https://credex.ai?ref=ai-spend-audit-share"
                    target="_blank"
                    rel="noopener noreferrer"
                    id="shared-cta-credex"
                    className="btn-ghost"
                  >
                    Talk to Credex <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </>
            ) : (
              <>
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">Already well optimized!</h3>
                <p className="text-slate-400 mb-6 text-sm">
                  Run your own Stack Saver - it's free and takes 3 minutes.
                </p>
                <Link to="/audit" id="shared-cta-own-audit" className="btn-primary">
                  Audit My Team's Stack <Zap className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}


