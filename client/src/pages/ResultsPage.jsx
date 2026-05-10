import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  TrendingDown, Share2, Copy, CheckCircle, AlertTriangle,
  Zap, ArrowRight, Mail, ExternalLink, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

import useAuditStore from '../store/auditStore';
import { auditApi, leadsApi } from '../services/api';
import {
  formatCurrency, buildShareUrl, buildOgImageUrl, getSavingsSeverity,
  getToolName, formatDate
} from '../utils/formatters';
import {
  SEVERITY_CONFIG, RECOMMENDATION_TYPE_LABELS, HIGH_SAVINGS_THRESHOLD
} from '../constants/tools';
import GlassCard from '../components/GlassCard';
import StackSaverLogo from '../components/StackSaverLogo';
import SharePanel from '../components/SharePanel';

// Savings Summary Card

function SavingsSummary({ monthly, annual, recommendationCount }) {
  const severity = getSavingsSeverity(monthly);

  return (
    <GlassCard className="p-8 text-center mb-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-500/5 to-transparent pointer-events-none" />
      <div className="relative">
        <div className="text-sm font-medium text-slate-400 mb-2">Potential Monthly Savings</div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className={`text-6xl md:text-7xl font-black mb-2 ${severity.color}`}
        >
          {formatCurrency(monthly)}
        </motion.div>
        <div className="text-slate-400 text-lg mb-4">
          {formatCurrency(annual)}<span className="text-slate-600">/year</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
          {recommendationCount} recommendation{recommendationCount !== 1 ? 's' : ''} found
        </div>
      </div>
    </GlassCard>
  );
}

// Recommendation Card

function RecommendationCard({ rec, index }) {
  const severityConfig = SEVERITY_CONFIG[rec.severity] || SEVERITY_CONFIG.low;
  const typeLabel = RECOMMENDATION_TYPE_LABELS[rec.type] || rec.type;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="glass-card-hover p-6"
    >
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className={`badge ${severityConfig.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${severityConfig.dot}`} />
          {severityConfig.label}
        </span>
        <span className="badge badge-purple">{typeLabel}</span>
        <span className="text-xs text-slate-500 capitalize">{getToolName(rec.tool)}</span>
      </div>

      <h3 className="font-semibold text-white mb-2 leading-snug">{rec.recommendedAction}</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">{rec.explanation}</p>

      <div className="flex flex-wrap gap-4 pt-4 border-t border-white/8">
        <div>
          <div className="text-xs text-slate-600 mb-1">Current Spend</div>
          <div className="font-semibold text-slate-300">{formatCurrency(rec.currentSpend)}/mo</div>
        </div>
        <div>
          <div className="text-xs text-slate-600 mb-1">Monthly Savings</div>
          <div className="font-semibold text-emerald-400">
            {rec.estimatedMonthlySavings > 0 ? `-${formatCurrency(rec.estimatedMonthlySavings)}` : '-'}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-600 mb-1">Annual Savings</div>
          <div className="font-semibold text-emerald-400">
            {rec.estimatedAnnualSavings > 0 ? `-${formatCurrency(rec.estimatedAnnualSavings)}` : '-'}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Lead Capture Form

function LeadCaptureForm({ auditId, onSuccess }) {
  const [formData, setFormData] = useState({ email: '', company: '', role: '', teamSize: '' });
  const [submitting, setSubmitting] = useState(false);
  const { setLeadCaptured } = useAuditStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) return;

    setSubmitting(true);
    try {
      await leadsApi.createLead({ ...formData, auditId, website: '' }); // website = honeypot
      setLeadCaptured();
      onSuccess();
      toast.success('Results sent to your email!');
    } catch (error) {
      toast.error('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <GlassCard className="p-6 border-brand-500/30">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-brand-600/20 flex items-center justify-center">
          <Mail className="w-5 h-5 text-brand-400" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Notify me when new optimizations apply to my stack</h3>
          <p className="text-xs text-slate-500">We'll email you if better options become available</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Honeypot - hidden from real users */}
        <input type="text" name="website" tabIndex="-1" aria-hidden="true" className="sr-only" />

        <div>
          <label htmlFor="lead-email" className="form-label">Work Email *</label>
          <input
            type="email"
            id="lead-email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="you@company.com"
            className="form-input"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="lead-company" className="form-label">Company <span className="text-slate-600">(optional)</span></label>
            <input
              type="text"
              id="lead-company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Acme Inc"
              className="form-input"
            />
          </div>
          <div>
            <label htmlFor="lead-role" className="form-label">Role <span className="text-slate-600">(optional)</span></label>
            <input
              type="text"
              id="lead-role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="CTO / EM"
              className="form-input"
            />
          </div>
        </div>

        <button
          type="submit"
          id="lead-submit-btn"
          disabled={submitting || !formData.email}
          className="btn-primary w-full"
        >
          {submitting ? (
            <><div className="spinner w-4 h-4" /> Sending...</>
          ) : (
            <><Mail className="w-4 h-4" /> Notify Me</>
          )}
        </button>

        <p className="text-xs text-slate-600 text-center">
          No spam. Unsubscribe anytime. We use Resend for delivery.
        </p>
      </form>
    </GlassCard>
  );
}

// Results Page

export default function ResultsPage() {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const { auditResult, leadCaptured } = useAuditStore();

  const [data, setData] = useState(auditResult);
  const [loading, setLoading] = useState(!auditResult);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(!leadCaptured);

  // If no in-memory result, fetch from API (e.g., direct URL visit)
  useEffect(() => {
    if (!auditResult && shareId) {
      auditApi.getAudit(shareId)
        .then((result) => {
          setData(result);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [shareId, auditResult]);

  const handleCopyShare = async () => {
    try {
      await navigator.clipboard.writeText(buildShareUrl(shareId));
      setCopied(true);
      toast.success('Share link copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy link.');
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen hero-bg flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-12 h-12 mx-auto mb-4" />
          <p className="text-slate-400">Loading your audit results...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen hero-bg flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">Audit not found</h1>
          <p className="text-slate-400 mb-6 text-sm">{error}</p>
          <Link to="/audit" className="btn-primary">Start New Audit</Link>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { recommendations = [], totalMonthlySavings = 0, totalAnnualSavings = 0, aiSummary, createdAt } = data;
  const isHighSavings = totalMonthlySavings >= HIGH_SAVINGS_THRESHOLD;
  const isLowSavings = totalMonthlySavings < 100;
  const shareUrl = buildShareUrl(shareId);

  return (
    <>
      <Helmet>
        <title>Stack Saver Results - {formatCurrency(totalMonthlySavings)}/mo in savings found</title>
        <meta name="description" content={`Stack Saver found ${formatCurrency(totalMonthlySavings)}/month in potential savings (${formatCurrency(totalAnnualSavings)}/year).`} />
        <meta property="og:title" content={`Stack Saver - ${formatCurrency(totalMonthlySavings)}/mo savings identified`} />
        <meta property="og:description" content={`${recommendations.length} recommendations found. ${formatCurrency(totalAnnualSavings)}/year potential savings.`} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:image" content={buildOgImageUrl(shareId)} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={buildOgImageUrl(shareId)} />
      </Helmet>

      <div className="min-h-screen hero-bg">
        {/* Header */}
        <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto border-b border-white/5">
          <Link to="/" className="flex items-center gap-2">
            <StackSaverLogo size="sm" />
          </Link>

          <div className="flex items-center gap-3">
            <motion.button
              id="copy-share-btn"
              onClick={handleCopyShare}
              whileTap={{ scale: 0.95 }}
              animate={copied ? { scale: [1, 1.04, 1], rotate: [0, -1, 1, 0] } : { scale: 1, rotate: 0 }}
              transition={{ duration: 0.28 }}
              className="btn-ghost text-sm py-2 px-4"
            >
              {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Share'}
            </motion.button>
            <Link
              to="/audit"
              id="new-audit-btn"
              className="btn-ghost text-sm py-2 px-4"
            >
              <RefreshCw className="w-4 h-4" /> New Audit
            </Link>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-6 py-12">
          {/* Page Title */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="w-5 h-5 text-brand-400" />
              <span className="text-slate-400 text-sm">
                Audit completed{createdAt ? ` · ${formatDate(createdAt)}` : ''}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {isLowSavings
                ? 'Your AI stack is already well optimized'
                : `We found ${formatCurrency(totalMonthlySavings)}/month in savings`}
            </h1>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Savings summary */}
              <SavingsSummary
                monthly={totalMonthlySavings}
                annual={totalAnnualSavings}
                recommendationCount={recommendations.length}
              />

              {/* AI Summary */}
              {aiSummary && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-card p-6"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded bg-violet-600/30 flex items-center justify-center">
                      <Zap className="w-3 h-3 text-violet-400" />
                    </div>
                    <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">AI Analysis</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{aiSummary}</p>
                </motion.div>
              )}

              {/* Recommendations */}
              {recommendations.length > 0 ? (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-white">
                    Recommendations ({recommendations.length})
                  </h2>
                  {recommendations.map((rec, i) => (
                    <RecommendationCard key={i} rec={rec} index={i} />
                  ))}
                </div>
              ) : (
                <GlassCard className="p-8 text-center">
                  <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">Already well-optimized!</h3>
                  <p className="text-slate-400 text-sm">
                    Based on your reported plans and spend, your AI tool stack is appropriately configured.
                    Revisit this audit when your team size or tool usage changes.
                  </p>
                </GlassCard>
              )}

              {/* High savings Credex CTA */}
              {isHighSavings && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="glass-card p-6 border-violet-500/30 bg-gradient-to-r from-violet-500/10 to-brand-500/10"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-600/20 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-violet-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">
                        {formatCurrency(totalMonthlySavings)}/mo is significant savings
                      </h3>
                      <p className="text-slate-400 text-sm mb-4">
                        Teams with this level of AI spend benefit from a dedicated infrastructure review.
                        The Credex team can help implement these changes and negotiate enterprise pricing.
                      </p>
                      <a
                        href="https://credex.ai?ref=ai-spend-audit-high"
                        id="credex-high-savings-cta"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary text-sm py-2.5"
                      >
                        Talk to Credex <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Lead capture */}
              <AnimatePresence>
                {showLeadForm && !leadCaptured && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <LeadCaptureForm
                      auditId={data.auditId}
                      onSuccess={() => setShowLeadForm(false)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {leadCaptured && (
                <GlassCard className="p-5 text-center">
                  <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-300 font-medium">Report sent!</p>
                  <p className="text-xs text-slate-500">Check your inbox</p>
                </GlassCard>
              )}

              {/* Share Panel — OG preview + copy + social buttons */}
              <SharePanel
                shareId={shareId}
                monthlySavings={totalMonthlySavings}
                toolCount={data.tools ? data.tools.length : 0}
              />

              {/* Start over */}
              <Link to="/audit" className="btn-ghost w-full text-sm py-2.5 block text-center">
                <RefreshCw className="w-4 h-4 inline mr-2" /> Start New Audit
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


