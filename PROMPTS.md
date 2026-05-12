# Prompts — AI Spend Audit

Documentation of all AI prompt iterations, rationale, and fallback logic.  
The AI is used ONLY for narrative summary generation — NOT for financial calculations.

---

## Current Production Prompt (v3)

### AI Provider
The project uses Antigravity AI tools for prompt testing and AI-generated audit summaries.

### User Prompt (v3 — Production)

```txt
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
1. Role-based prompting improves consistency and relevance
2. Explicit rules reduce hallucinations and number changes
3. Word count limits keep responses concise
4. Conversational tone instructions improve readability
5. Action-oriented endings make summaries more useful

---

## Failed Prompt Attempts

### v1 — Original (Abandoned)

**Problem:**  
The AI rounded savings values and sometimes generated unnecessary text or inconsistent recommendations.

```txt
You are a financial advisor helping a startup optimize AI tool spending.

Write a short summary using this audit data:

Tools: {toolList}
Savings: ${totalMonthlySavings}
Recommendations: {recommendations}
```

**Root cause:**  
- No restriction against approximating numbers
- Prompt was too generic
- Passing recommendation arrays caused inconsistent outputs

---

### v2 — Intermediate (Abandoned)

**Problem:**  
Responses sounded too formal and corporate.

```txt
Role: AI infrastructure analyst

Generate an executive summary using:
- Team size
- Savings opportunity
- Recommendations
```

**Root cause:**  
- The phrase "executive summary" encouraged overly corporate language
- Missing conversational tone instructions

---

## Fallback Logic

If the AI request fails because of:
- Network issues
- API failures
- Rate limits
- Empty responses

the backend switches to a fallback summary generator.

### Fallback Behavior
1. Low savings → explains the stack is already optimized
2. Higher savings → highlights key optimization opportunities

The fallback summary is deterministic and uses only audit-engine-generated values.

### Fallback Quality
The fallback output is less personalized than the AI version but remains factually accurate and reliable for production usage.

---

## Hallucination Prevention Measures

1. Exact-number instructions
2. Structured audit input formatting
3. Restricted recommendation scope
4. Short response length
5. Backend-generated savings calculations
6. Explicit instruction not to invent tools or pricing

---

## Model Selection Rationale

| Tool | Reason |
|------|--------|
| Antigravity AI Tools | Fast prompt testing and reliable summary generation |

---

## Prompt Versioning

| Version | Date | Status | Key Change |
|---------|------|--------|-----------|
| v1 | 2026-05-02 | ❌ Abandoned | Basic summary prompt |
| v2 | 2026-05-03 | ❌ Abandoned | Added role-based prompting |
| v3 | 2026-05-04 | ✅ Production | Added exact-number and tone constraints |