import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Plus, Minus, ChevronLeft, ArrowRight, Info } from 'lucide-react';
import toast from 'react-hot-toast';

import useAuditStore from '../store/auditStore';
import { TOOL_LIST, USE_CASES } from '../constants/tools';
import { auditApi } from '../services/api';
import StackSaverLogo from '../components/StackSaverLogo';

// â”€â”€â”€ Tool Card Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function ToolCard({ tool, isSelected, onToggle, entry, onUpdate }) {
  return (
    <div
      className={`glass-card transition-all duration-200 overflow-hidden ${
        isSelected ? 'border-brand-500/50 shadow-glow-sm' : 'hover:border-white/20'
      }`}
    >
      <button
        type="button"
        id={`tool-toggle-${tool.id}`}
        onClick={() => onToggle(tool.id)}
        className="w-full flex items-center justify-between p-4 text-left"
        aria-pressed={isSelected}
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg font-bold transition-colors ${
            isSelected ? 'bg-brand-600 text-white' : 'bg-white/8 text-slate-400'
          }`}>
            {isSelected ? 'âœ“' : tool.logo}
          </div>
          <div>
            <div className="font-semibold text-white text-sm">{tool.name}</div>
            <div className="text-xs text-slate-500 capitalize">{tool.category}</div>
          </div>
        </div>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
          isSelected ? 'border-brand-500 bg-brand-500' : 'border-slate-600'
        }`}>
          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
      </button>

      {/* Plan + Spend fields â€” shown when selected */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 pb-4 space-y-3"
          >
            {/* Plan selector */}
            <div>
              <label htmlFor={`plan-${tool.id}`} className="form-label">Plan</label>
              <select
                id={`plan-${tool.id}`}
                value={entry?.plan || ''}
                onChange={(e) => onUpdate(tool.id, 'plan', e.target.value)}
                className="form-input bg-surface-900"
                required={isSelected}
              >
                <option value="">Select planâ€¦</option>
                {tool.plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.label}{plan.price > 0 ? ` â€” $${plan.price}/seat/mo` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Monthly spend */}
            <div>
              <label htmlFor={`spend-${tool.id}`} className="form-label">
                Monthly Spend (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                <input
                  type="number"
                  id={`spend-${tool.id}`}
                  value={entry?.monthlySpend || ''}
                  onChange={(e) => onUpdate(tool.id, 'monthlySpend', e.target.value)}
                  placeholder="0"
                  min="0"
                  max="100000"
                  className="form-input pl-7"
                />
              </div>
            </div>

            {/* Seats */}
            <div>
              <label htmlFor={`seats-${tool.id}`} className="form-label">
                Seats / Users
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  id={`seats-dec-${tool.id}`}
                  onClick={() => onUpdate(tool.id, 'seats', Math.max(1, (entry?.seats || 1) - 1))}
                  className="w-9 h-9 rounded-lg bg-white/8 hover:bg-white/12 flex items-center justify-center text-slate-300 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  id={`seats-${tool.id}`}
                  value={entry?.seats || 1}
                  onChange={(e) => onUpdate(tool.id, 'seats', parseInt(e.target.value) || 1)}
                  min="1"
                  max="10000"
                  className="form-input text-center w-20"
                />
                <button
                  type="button"
                  id={`seats-inc-${tool.id}`}
                  onClick={() => onUpdate(tool.id, 'seats', (entry?.seats || 1) + 1)}
                  className="w-9 h-9 rounded-lg bg-white/8 hover:bg-white/12 flex items-center justify-center text-slate-300 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// â”€â”€â”€ Audit Form Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function AuditFormPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    selectedTools,
    toolEntries,
    teamSize,
    primaryUseCase,
    toggleTool,
    updateToolEntry,
    setTeamSize,
    setPrimaryUseCase,
    getToolsPayload,
    setAuditResult,
    setAuditError,
  } = useAuditStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tools = getToolsPayload();

    if (tools.length === 0) {
      toast.error('Please select at least one AI tool and set a plan.');
      return;
    }

    // Validate each selected tool has a plan
    const missingPlan = selectedTools.find((id) => !toolEntries[id]?.plan);
    if (missingPlan) {
      const toolName = TOOL_LIST.find((t) => t.id === missingPlan)?.name || missingPlan;
      toast.error(`Please select a plan for ${toolName}.`);
      return;
    }

    setSubmitting(true);

    try {
      const result = await auditApi.createAudit({
        tools,
        teamSize: teamSize ? parseInt(teamSize) : undefined,
        primaryUseCase: primaryUseCase || undefined,
      });

      setAuditResult(result);
      navigate(`/results/${result.shareId}`);
    } catch (error) {
      setAuditError(error.message);
      toast.error(error.message || 'Audit failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const totalSelectedWithPlan = selectedTools.filter((id) => toolEntries[id]?.plan).length;
  const estimatedMonthly = selectedTools.reduce((sum, id) => {
    const entry = toolEntries[id];
    return sum + (parseFloat(entry?.monthlySpend) || 0);
  }, 0);

  return (
    <>
      <Helmet>
        <title>Audit Form - Stack Saver</title>
        <meta name="description" content="Enter your AI tools, plans, and spend to get a personalized savings audit." />
      </Helmet>

      <div className="min-h-screen hero-bg">
        {/* Header */}
        <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto border-b border-white/5">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            id="back-to-home"
          >
            <ChevronLeft className="w-4 h-4" />
            <StackSaverLogo size="sm" />
          </button>

          {/* Live counter */}
          {estimatedMonthly > 0 && (
            <div className="text-sm text-slate-400">
              Reporting <span className="text-white font-semibold">${estimatedMonthly.toFixed(0)}/mo</span>
            </div>
          )}
        </nav>

        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Which AI tools does your team use?
            </h1>
            <p className="text-slate-400">
              Select all tools, set the plan and spend. We'll identify savings opportunities.
            </p>
          </motion.div>

          {/* Info banner */}
          <div className="flex items-start gap-3 glass-card p-4 mb-8 text-sm text-slate-400">
            <Info className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
            <p>Your data is saved locally as you type. Audit results are stored server-side with a shareable link.</p>
          </div>

          {/* Tool Grid */}
          <div className="grid md:grid-cols-2 gap-4 mb-10">
            {TOOL_LIST.map((tool, i) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ToolCard
                  tool={tool}
                  isSelected={selectedTools.includes(tool.id)}
                  onToggle={toggleTool}
                  entry={toolEntries[tool.id]}
                  onUpdate={updateToolEntry}
                />
              </motion.div>
            ))}
          </div>

          {/* Team Context */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6 mb-8"
          >
            <h2 className="text-lg font-semibold text-white mb-5">About Your Team</h2>
            <div className="grid md:grid-cols-2 gap-5">
              {/* Team size */}
              <div>
                <label htmlFor="team-size" className="form-label">
                  Team Size <span className="text-slate-600">(optional)</span>
                </label>
                <input
                  type="number"
                  id="team-size"
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  placeholder="e.g. 5"
                  min="1"
                  max="100000"
                  className="form-input"
                />
              </div>

              {/* Primary use case */}
              <div>
                <label htmlFor="use-case" className="form-label">
                  Primary Use Case <span className="text-slate-600">(optional)</span>
                </label>
                <select
                  id="use-case"
                  value={primaryUseCase}
                  onChange={(e) => setPrimaryUseCase(e.target.value)}
                  className="form-input bg-surface-900"
                >
                  <option value="">Select use caseâ€¦</option>
                  {USE_CASES.map((uc) => (
                    <option key={uc.id} value={uc.id}>{uc.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Submit */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <button
              type="submit"
              id="submit-audit-btn"
              disabled={submitting || totalSelectedWithPlan === 0}
              className="btn-primary text-lg py-4 px-10 w-full sm:w-auto shadow-glow"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Running Auditâ€¦
                </>
              ) : (
                <>
                  Run My Audit <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {totalSelectedWithPlan === 0 && (
              <p className="text-slate-500 text-sm">
                Select at least one tool and choose a plan to continue
              </p>
            )}
          </motion.div>
        </form>
      </div>
    </>
  );
}

