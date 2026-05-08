/**
 * AI Summary Service
 *
 * Generates a personalized ~100-word narrative summary using Anthropic Claude.
 * Falls back to a deterministic template if the API call fails.
 *
 * The AI is used ONLY for narrative copy — never for calculations.
 * All numbers passed to the prompt are pre-computed by the audit engine.
 *
 * See PROMPTS.md for full prompt history, rationale, and fallback logic.
 */

const Anthropic = require('@anthropic-ai/sdk');

let anthropic = null;

function getClient() {
  if (!anthropic && process.env.ANTHROPIC_API_KEY) {
    anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return anthropic;
}

/**
 * Builds the prompt for the AI summary.
 * Structured to minimize hallucination risk by providing exact numbers.
 */
function buildPrompt(auditData) {
  const { tools, recommendations, totalMonthlySavings, totalAnnualSavings, teamSize, primaryUseCase } =
    auditData;

  const toolList = tools
    .map((t) => `${t.toolId} (${t.plan}, $${t.monthlySpend}/mo, ${t.seats || 1} seat(s))`)
    .join(', ');

  const topRec = recommendations[0];
  const topInsight = topRec
    ? `The biggest opportunity is: ${topRec.recommendedAction} ($${topRec.estimatedMonthlySavings}/mo savings).`
    : 'Spending appears to be reasonably optimized.';

  return `You are an AI spend optimization expert writing a concise audit summary for a startup founder or engineering manager.

IMPORTANT RULES:
- Write exactly 80-110 words
- Use the EXACT numbers provided below — do NOT invent or estimate numbers
- Sound professional but conversational — like a knowledgeable advisor, not a robot
- Do not make up tools, plans, or recommendations not listed below
- End with a clear action-oriented sentence

AUDIT DATA (USE THESE EXACT NUMBERS):
- Team size: ${teamSize || 'unknown'}
- Primary use case: ${primaryUseCase || 'mixed'}
- AI tools in use: ${toolList}
- Total monthly savings identified: $${totalMonthlySavings}
- Total annual savings identified: $${totalAnnualSavings}
- Number of recommendations: ${recommendations.length}
- ${topInsight}

Write the summary now:`;
}

/**
 * Template-based fallback summary — used when Anthropic API is unavailable.
 * Deterministic, no AI required.
 */
function generateFallbackSummary(auditData) {
  const { tools, totalMonthlySavings, totalAnnualSavings, recommendations, primaryUseCase } = auditData;

  if (totalMonthlySavings < 10) {
    return `Your AI tool stack of ${tools.length} tool(s) is already well-optimized for ${primaryUseCase || 'your primary use case'}. With minimal savings identified, your current spend reflects appropriate plan selection for your team's needs. Continue monitoring usage as your team grows — pricing tiers that fit today may become inefficient at scale. We recommend revisiting this audit quarterly.`;
  }

  const topRec = recommendations[0];
  const topAction = topRec ? topRec.recommendedAction.toLowerCase() : 'consolidate overlapping subscriptions';

  return `Your AI tool audit identified $${totalMonthlySavings}/month ($${totalAnnualSavings}/year) in potential savings across ${tools.length} tool(s). The highest-impact opportunity is to ${topAction}. ${recommendations.length > 1 ? `${recommendations.length - 1} additional optimization(s) were identified.` : ''} These recommendations are based on official vendor pricing and your reported usage patterns. Implementing them could meaningfully reduce your AI infrastructure costs without impacting team productivity.`;
}

/**
 * Main function — attempts Anthropic, falls back to template.
 */
async function generateAiSummary(auditData) {
  const client = getClient();

  if (!client) {
    console.warn('[aiSummary] Anthropic API key not configured — using fallback template');
    return {
      summary: generateFallbackSummary(auditData),
      source: 'fallback',
    };
  }

  try {
    const prompt = buildPrompt(auditData);

    const message = await client.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 256,
      messages: [{ role: 'user', content: prompt }],
    });

    const summary = message.content[0]?.text?.trim();

    if (!summary) throw new Error('Empty response from Anthropic');

    return { summary, source: 'anthropic' };
  } catch (error) {
    console.error('[aiSummary] Anthropic API error:', error.message);
    return {
      summary: generateFallbackSummary(auditData),
      source: 'fallback',
    };
  }
}

module.exports = { generateAiSummary, generateFallbackSummary, buildPrompt };
