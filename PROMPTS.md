# Prompts — AI Spend Audit

Documentation of all AI prompt iterations, rationale, and fallback logic.
The AI is used ONLY for narrative summary generation — NOT for financial calculations.

---

## Current Production Prompt (v3)

### System Context
No system prompt is used. All instructions are in the user message to reduce token overhead with Claude 3.5 Haiku.

### User Prompt (v3 — Production)

```
You are an AI spend optimization expert writing a concise audit summary for a startup founder or engineering manager.

IMPORTANT RULES:
- Write exactly 80-110 words
- Use the EXACT numbers provided below — do NOT invent or estimate numbers
- Sound professional but conversational — like a knowledgeable advisor, not a robot
- Do not make up tools, plans, or recommendations not listed below
- End with a clear action-oriented sentence

AUDIT DATA (USE THESE EXACT NUMBERS):
- Team size: {teamSize}
- Primary use case: {primaryUseCase}
- AI tools in use: {toolList}
- Total monthly savings identified: ${totalMonthlySavings}
- Total annual savings identified: ${totalAnnualSavings}
- Number of recommendations: {recommendationCount}
- {topInsight}

Write the summary now:
```

### Why This Structure Works
1. **Role instruction first**: Grounding the model in a specific expert role reduces generic output
2. **Explicit rules block**: Numbered constraints are more reliable than prose instructions
3. **Word count constraint**: Prevents the model from padding with qualifications that introduce errors
4. **"USE THESE EXACT NUMBERS"**: Reduces hallucination — Claude respects explicit data injection
5. **No system prompt**: Haiku performs better with all instructions in the user turn
6. **Ends with action instruction**: Ensures the output has a clear closing CTA

---

## Failed Prompt Attempts

### v1 — Original (Abandoned)
**Problem**: The model kept approximating or rounding the provided numbers. A $347/month savings would become "approximately $350" or sometimes "around $300".

```
You are a financial advisor helping a startup optimize their AI tool spending.
Based on the following audit data, write a 100-word summary:

Tools: {toolList}
Total monthly savings: ${totalMonthlySavings}
Recommendations: {recommendations}

Focus on the most important savings opportunities and give actionable advice.
```

**Root cause**: The prompt didn't explicitly prohibit approximation. Claude defaults to natural language patterns that round numbers. Also, injecting the full recommendations array as JSON caused the model to re-interpret the data.

---

### v2 — Intermediate (Abandoned)
**Problem**: Output was too formal and corporate-sounding. Used phrases like "pursuant to our analysis" and "we strongly recommend implementation of the aforementioned strategies".

```
Role: Expert AI infrastructure cost analyst
Task: Generate a professional audit summary

[AUDIT DATA]
Team: {teamSize} people, {primaryUseCase} use case
Stack: {toolList}
Savings opportunity: ${totalMonthlySavings}/month (${totalAnnualSavings}/year)
Recommendations: {recommendationCount} identified

Write an executive summary in exactly 100 words. Be precise and professional.
```

**Root cause**: The word "executive summary" + "professional" primed Claude for corporate language. Fixed in v3 by adding "like a knowledgeable advisor, not a robot" which significantly improves tone.

---

## Fallback Logic

If the Anthropic API call fails (network error, rate limit, missing API key, empty response), the system falls back to `generateFallbackSummary()` in `aiSummary.js`.

The fallback uses two branches:
1. **Low/zero savings** (< $10/mo): Emphasizes the positive — the stack is well-optimized
2. **Meaningful savings**: Structures output as [savings amount] → [top action] → [total count]

The fallback is deterministic and always accurate — it only uses data already computed by the audit engine.

### Fallback Quality Assessment
The fallback output is about 70% as good as the AI output. It's factually accurate but lacks the personalized tone. For the MVP this is acceptable — we surface the `source: 'fallback'` in the API response for debugging but don't expose this distinction to end users.

---

## Hallucination Prevention Measures

1. **Exact numbers as strings**: Numbers are injected as formatted strings (`$347`), not raw integers that the model might process mathematically
2. **Explicit prohibition**: "do NOT invent or estimate numbers"
3. **Scoped instruction**: "Do not make up tools, plans, or recommendations not listed below"
4. **Word count constraint**: Short outputs have fewer opportunities for creative elaboration
5. **Post-processing validation**: We don't validate the AI output (impractical), but the positioning of the AI summary as "analysis" (not "facts") sets user expectations correctly

---

## Model Selection Rationale

| Model | Pros | Cons | Decision |
|-------|------|------|----------|
| Claude 3.5 Haiku | Fastest, cheapest, great instruction-following | Less nuanced than Sonnet | ✅ **Chosen** |
| Claude 3.5 Sonnet | Better prose quality | 4× more expensive, slower | ❌ Overkill for 100 words |
| GPT-4o mini | Good, cheap | Worse instruction-following than Haiku | ❌ Not chosen |

Haiku at `max_tokens: 256` for a 100-word output costs approximately $0.001 per audit. At 10k audits/day: ~$10/day in API costs — well within unit economics.

---

## Prompt Versioning

| Version | Date | Status | Key Change |
|---------|------|--------|-----------|
| v1 | 2025-05-02 | ❌ Abandoned | Original |
| v2 | 2025-05-03 | ❌ Abandoned | Added role + structure |
| v3 | 2025-05-04 | ✅ Production | "EXACT numbers" + tone instructions |
