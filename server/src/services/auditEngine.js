/**
 * AI Spend Audit Engine
 *
 * This is the CORE business logic of the product.
 * All pricing math is deterministic — NO AI is used here.
 *
 * Pricing data verified against official vendor pages.
 * See PRICING_DATA.md for sources and verification dates.
 */

// ─── Official Pricing Constants (USD/month) ──────────────────────────────────
// Last verified: 2025-01-01
// Sources documented in PRICING_DATA.md

const PRICING = {
  cursor: {
    hobby: { price: 0, label: 'Hobby (Free)' },
    pro: { price: 20, label: 'Pro' },
    business: { price: 40, label: 'Business' },
    enterprise: { price: 40, label: 'Enterprise', note: 'Custom pricing, ~$40+ per seat' },
  },
  github_copilot: {
    individual: { price: 10, label: 'Individual' },
    business: { price: 19, label: 'Business' },
    enterprise: { price: 39, label: 'Enterprise' },
  },
  claude: {
    free: { price: 0, label: 'Free' },
    pro: { price: 20, label: 'Pro' },
    max: { price: 100, label: 'Max' },
    team: { price: 30, label: 'Team', minSeats: 5 },
    enterprise: { price: 60, label: 'Enterprise', note: 'Approximate; custom pricing' },
    api: { price: 0, label: 'API Direct', note: 'Usage-based' },
  },
  chatgpt: {
    plus: { price: 20, label: 'Plus' },
    team: { price: 30, label: 'Team', minSeats: 2 },
    enterprise: { price: 60, label: 'Enterprise', note: 'Approximate; custom pricing' },
    api: { price: 0, label: 'API Direct', note: 'Usage-based' },
  },
  anthropic_api: {
    api: { price: 0, label: 'API Direct', note: 'Usage-based' },
  },
  openai_api: {
    api: { price: 0, label: 'API Direct', note: 'Usage-based' },
  },
  gemini: {
    pro: { price: 19.99, label: 'Gemini Advanced (Pro)' },
    ultra: { price: 19.99, label: 'Gemini Advanced' },
    api: { price: 0, label: 'API Direct', note: 'Usage-based' },
  },
  windsurf: {
    free: { price: 0, label: 'Free' },
    pro: { price: 15, label: 'Pro' },
    team: { price: 35, label: 'Team' },
  },
};

// ─── Audit Rules ─────────────────────────────────────────────────────────────

/**
 * Analyzes a single tool entry and returns recommendations.
 * @param {Object} tool - { toolId, plan, monthlySpend, seats }
 * @param {Object} context - { teamSize, primaryUseCase, allTools }
 * @returns {Array} recommendations
 */
function auditTool(tool, context) {
  const { toolId, plan, monthlySpend, seats } = tool;
  const { teamSize, primaryUseCase, allTools } = context;
  const recommendations = [];

  const actualSeats = seats || 1;
  const pricing = PRICING[toolId];
  if (!pricing) return recommendations;

  const planData = pricing[plan];
  if (!planData) return recommendations;

  const officialPricePerSeat = planData.price;
  const expectedMonthly = officialPricePerSeat * actualSeats;

  // ── Rule 1: Overspending vs official pricing ──────────────────────────────
  if (officialPricePerSeat > 0 && monthlySpend > expectedMonthly * 1.1) {
    const savings = monthlySpend - expectedMonthly;
    recommendations.push({
      type: 'overspend',
      severity: 'high',
      tool: toolId,
      plan,
      currentSpend: monthlySpend,
      recommendedAction: `Reconcile billing — you're paying $${monthlySpend}/mo but the ${planData.label} plan for ${actualSeats} seat(s) should cost $${expectedMonthly}/mo`,
      estimatedMonthlySavings: Math.round(savings),
      estimatedAnnualSavings: Math.round(savings * 12),
      explanation: `Your reported spend ($${monthlySpend}/mo) exceeds the official ${planData.label} plan price ($${officialPricePerSeat}/seat/mo × ${actualSeats} seats = $${expectedMonthly}/mo). Audit your billing for unused seats or unexpected add-ons.`,
    });
  }

  // ── Rule 2: Cursor Business for small team (downgrade to Pro) ────────────
  if (toolId === 'cursor' && plan === 'business' && actualSeats <= 3) {
    const proMonthly = PRICING.cursor.pro.price * actualSeats;
    const savings = monthlySpend - proMonthly;
    if (savings > 0) {
      recommendations.push({
        type: 'downgrade',
        severity: 'medium',
        tool: toolId,
        plan,
        currentSpend: monthlySpend,
        recommendedAction: `Downgrade to Cursor Pro — saves $${Math.round(savings)}/mo for your ${actualSeats}-person team`,
        estimatedMonthlySavings: Math.round(savings),
        estimatedAnnualSavings: Math.round(savings * 12),
        explanation: `Cursor Business ($${PRICING.cursor.business.price}/seat) is designed for larger teams with admin controls. For ${actualSeats} seats, Cursor Pro ($${PRICING.cursor.pro.price}/seat) provides the same coding assistance at half the price.`,
      });
    }
  }

  // ── Rule 3: GitHub Copilot Enterprise for small team ─────────────────────
  if (toolId === 'github_copilot' && plan === 'enterprise' && actualSeats < 10) {
    const businessMonthly = PRICING.github_copilot.business.price * actualSeats;
    const savings = monthlySpend - businessMonthly;
    if (savings > 5) {
      recommendations.push({
        type: 'downgrade',
        severity: 'medium',
        tool: toolId,
        plan,
        currentSpend: monthlySpend,
        recommendedAction: `Downgrade to GitHub Copilot Business — saves $${Math.round(savings)}/mo`,
        estimatedMonthlySavings: Math.round(savings),
        estimatedAnnualSavings: Math.round(savings * 12),
        explanation: `GitHub Copilot Enterprise ($${PRICING.github_copilot.enterprise.price}/seat) includes custom models and enterprise SSO — features rarely needed by teams under 10. Business plan ($${PRICING.github_copilot.business.price}/seat) covers policy controls and organization-level features for most teams.`,
      });
    }
  }

  // ── Rule 4: Claude Team with very few users ───────────────────────────────
  if (toolId === 'claude' && plan === 'team' && actualSeats < 3) {
    const proMonthly = PRICING.claude.pro.price * actualSeats;
    const teamMonthly = PRICING.claude.team.price * actualSeats;
    const savings = teamMonthly - proMonthly;
    if (savings > 0) {
      recommendations.push({
        type: 'downgrade',
        severity: 'low',
        tool: toolId,
        plan,
        currentSpend: monthlySpend,
        recommendedAction: `Switch to individual Claude Pro plans — saves $${Math.round(savings)}/mo`,
        estimatedMonthlySavings: Math.round(savings),
        estimatedAnnualSavings: Math.round(savings * 12),
        explanation: `Claude Team ($${PRICING.claude.team.price}/seat/mo, 5-seat minimum billing) is designed for collaborative teams needing shared usage and admin controls. With ${actualSeats} user(s), individual Pro plans ($${PRICING.claude.pro.price}/seat/mo) are more cost-effective.`,
      });
    }
  }

  // ── Rule 5: ChatGPT + Claude Pro — likely overlapping for same use case ───
  const hasChatGPT = allTools.some((t) => t.toolId === 'chatgpt');
  const hasClaude = allTools.some((t) => t.toolId === 'claude' && t.plan !== 'api');

  if (toolId === 'chatgpt' && hasClaude && primaryUseCase === 'writing') {
    recommendations.push({
      type: 'consolidation',
      severity: 'medium',
      tool: toolId,
      plan,
      currentSpend: monthlySpend,
      recommendedAction: `Consider consolidating to one AI writing assistant`,
      estimatedMonthlySavings: Math.round(monthlySpend * 0.5),
      estimatedAnnualSavings: Math.round(monthlySpend * 0.5 * 12),
      explanation: `You're paying for both ChatGPT and Claude for writing tasks. Both tools have similar capabilities for content creation. Consider running a 2-week trial with just one to identify your team's preferred tool before renewing both subscriptions.`,
    });
  }

  // ── Rule 6: Multiple AI coding tools for the same team ───────────────────
  const codingTools = allTools.filter((t) =>
    ['cursor', 'github_copilot', 'windsurf'].includes(t.toolId)
  );
  if (
    codingTools.length > 1 &&
    toolId === codingTools[codingTools.length - 1].toolId &&
    primaryUseCase === 'coding'
  ) {
    const secondaryCostEstimate = codingTools
      .slice(1)
      .reduce((sum, t) => sum + (t.monthlySpend || 0), 0);
    if (secondaryCostEstimate > 5) {
      recommendations.push({
        type: 'consolidation',
        severity: 'high',
        tool: toolId,
        plan,
        currentSpend: monthlySpend,
        recommendedAction: `Consolidate to one AI coding tool`,
        estimatedMonthlySavings: Math.round(secondaryCostEstimate),
        estimatedAnnualSavings: Math.round(secondaryCostEstimate * 12),
        explanation: `You're running ${codingTools.length} AI coding assistants simultaneously. Most engineers use only one at a time. Pick your primary tool (Cursor, Copilot, or Windsurf) and cancel the rest — typical teams save 60-70% of their coding AI spend this way.`,
      });
    }
  }

  // ── Rule 7: Claude Max for low-usage teams ────────────────────────────────
  if (toolId === 'claude' && plan === 'max' && actualSeats <= 2) {
    const proMonthly = PRICING.claude.pro.price * actualSeats;
    const maxMonthly = PRICING.claude.max.price * actualSeats;
    const savings = maxMonthly - proMonthly;
    if (savings > 0) {
      recommendations.push({
        type: 'downgrade',
        severity: 'medium',
        tool: toolId,
        plan,
        currentSpend: monthlySpend,
        recommendedAction: `Downgrade from Claude Max to Claude Pro — saves $${Math.round(savings)}/mo`,
        estimatedMonthlySavings: Math.round(savings),
        estimatedAnnualSavings: Math.round(savings * 12),
        explanation: `Claude Max ($${PRICING.claude.max.price}/seat/mo) provides 5× more usage than Pro — justified only for power users who hit Pro's limits daily. For ${actualSeats} user(s), Claude Pro ($${PRICING.claude.pro.price}/seat/mo) is likely sufficient unless you're doing intensive research or document analysis.`,
      });
    }
  }

  // ── Rule 8: API direct vs subscription for low-volume API users ──────────
  if (
    (toolId === 'anthropic_api' || toolId === 'openai_api') &&
    monthlySpend > 0 &&
    monthlySpend < 15
  ) {
    recommendations.push({
      type: 'efficiency',
      severity: 'low',
      tool: toolId,
      plan,
      currentSpend: monthlySpend,
      recommendedAction: `Your API usage is very low — consider whether you need a subscription plan instead`,
      estimatedMonthlySavings: 0,
      estimatedAnnualSavings: 0,
      explanation: `At $${monthlySpend}/mo on direct API usage, you may be paying for cold-start overhead or inefficient prompt patterns. Review your API call volumes and consider batching requests or caching responses to optimize cost.`,
    });
  }

  return recommendations;
}

/**
 * Main audit function — runs all tools through the audit engine.
 * @param {Object} payload - { tools, teamSize, primaryUseCase }
 * @returns {Object} - { recommendations, totalMonthlySavings, totalAnnualSavings }
 */
function runAudit(payload) {
  const { tools = [], teamSize, primaryUseCase } = payload;

  if (!tools.length) {
    return {
      recommendations: [],
      totalMonthlySavings: 0,
      totalAnnualSavings: 0,
    };
  }

  const context = { teamSize, primaryUseCase, allTools: tools };
  const allRecommendations = [];

  for (const tool of tools) {
    const recs = auditTool(tool, context);
    allRecommendations.push(...recs);
  }

  // Deduplicate by tool + type to avoid double-counting
  const seen = new Set();
  const uniqueRecommendations = allRecommendations.filter((rec) => {
    const key = `${rec.tool}-${rec.type}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort by savings descending
  uniqueRecommendations.sort(
    (a, b) => b.estimatedMonthlySavings - a.estimatedMonthlySavings
  );

  const totalMonthlySavings = uniqueRecommendations.reduce(
    (sum, r) => sum + r.estimatedMonthlySavings,
    0
  );
  const totalAnnualSavings = totalMonthlySavings * 12;

  return {
    recommendations: uniqueRecommendations,
    totalMonthlySavings: Math.round(totalMonthlySavings),
    totalAnnualSavings: Math.round(totalAnnualSavings),
  };
}

module.exports = { runAudit, PRICING };
