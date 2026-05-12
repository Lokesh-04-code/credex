# Reflection — AI Spend Audit

---

## 1. Hardest Bug and How I Debugged It

**The bug**: The audit engine was returning correct savings in unit tests, but the frontend was showing $0 for certain tool combinations — specifically, GitHub Copilot Business for 3 seats at $90/month wasn't triggering the overspend rule.

**Hypotheses I formed:**
1. The API endpoint wasn't receiving the correct payload (network layer issue)
2. The audit engine's comparison logic had a precedence bug
3. The data types coming from the React form were wrong

**What I tried:**
- First, I used Chrome DevTools → Network tab to inspect the raw `POST /api/audit` request body. The payload looked correct visually: `"monthlySpend": "90"`. But I noticed it was a string, not a number.
- Added `console.log(typeof payload.tools[0].monthlySpend)` in the controller — confirmed: `"string"`.
- Checked the comparison in `auditEngine.js`: `monthlySpend > officialPrice * seats * 1.1`. In JavaScript, `"90" > 62.7` evaluates to `true` due to implicit coercion — so that wasn't the issue.
- Dug deeper: the `Math.round()` call downstream was the culprit. `Math.round("90" - 62.7)` was producing `NaN` in a specific code path where the string subtraction returned `NaN` (not the coercion path I assumed).
- Root cause confirmed: inconsistent types at the form → API → engine boundary.

**What worked:**
Added `parseFloat(tool.monthlySpend) || 0` at the `getToolsPayload()` function in the Zustand store. This meant the API always receives typed numbers. Re-ran the affected test — passed immediately. All 10 tests green.

**Lesson:** TypeScript would have caught this at compile time. In a JS codebase, you need explicit coercion at every data boundary, not just where you think the data flows. I now add a `// validated: number` comment at every boundary as a forcing function.

---

## 2. A Decision I Reversed Mid-Week

**Original decision:** I designed the audit form as a multi-step wizard — Step 1: select tools, Step 2: configure each tool (plan + spend), Step 3: team context. Each step had a "Next →" button.

**Why I built it that way:** Wizards reduce cognitive load by scoping the decision surface. Every SaaS onboarding guide recommends them. I was also worried a long form would feel overwhelming.

**What made me reverse it:**
I shared a prototype with 3 people informally (not the formal interviews — this was a group call with developer friends). All three independently got confused at Step 2, where they'd already selected tools in Step 1 but couldn't see them simultaneously while configuring plans. One person said: "Wait, did I pick Copilot? Let me go back." The multi-step flow created an artificial memory burden — users had to remember their Step 1 selections to make Step 2 decisions.

The mental model for "configuring your tool stack" is more like a dashboard than a checkout flow. You want to see everything at once.

**What I switched to:** A single scrolling page where tool cards expand in-place when selected. The `AnimatePresence` animation makes expansion feel smooth and progressive. The live "Total Monthly Spend" counter at the top gives immediate feedback as tools are added. This is a significantly better UX for a form where users need to compare selections simultaneously — knowing you have both Cursor and Copilot selected is what triggers the "wait, do I need both?" realization.

**Outcome:** The single-page form is more compact, faster to fill, and the consolidation recommendations became more obvious because users could see their full stack at a glance before submitting.

---

## 3. What I'd Build in Week 2

**High priority (week 2):**

1. **PDF export** — The #1 ask from the user interviews wasn't there initially, but came up repeatedly in the Buildspace Discord when I shared early screenshots. An audit PDF that can be attached to a budget proposal email is a legitimate B2B use case.

2. **Email nurture sequence** — Right now the lead email is a one-shot "here are your results" email. A 3-email sequence (Day 0: results, Day 3: "did you implement the changes?", Day 7: "most teams save $X in the first month") would significantly improve Credex consultation conversion.

3. **More tools** — The current engine covers 5 tool families. Week 2 would add: Devin, Continue.dev, Codeium, Perplexity Pro, Notion AI, Linear. Every new tool expands the TAM and gives more reasons for a broader ICP to run an audit.

4. **Posthog analytics** — I need real funnel data: where are users dropping off, which tools appear most often, what's the distribution of savings amounts. Without this, every product decision is guessing.

5. **SEO landing pages** — `/compare/cursor-vs-copilot`, `/audit/github-copilot-pricing`, etc. These are genuinely useful pages that rank for long-tail queries and feed the top of the funnel with zero ongoing cost.

**Medium priority:**
- Admin dashboard to see lead volume and quality without querying the database directly
- Benchmark data ("teams of your size spend $Y on average")
- Slack bot integration (`/audit-my-ai-spend` command)

---

## 4. How I Used AI Tools

**GitHub Copilot (autocomplete throughout):** Used for boilerplate — React component scaffolding, Tailwind className suggestions, Express middleware patterns, repetitive Prisma query structures. Saved approximately 2–3 hours of typing. I did NOT use it for the audit engine rules, which I wrote manually to ensure correctness and traceability to pricing sources.

**Claude (copy + documentation):** Used to iterate on landing page copy. The first two hero headline attempts were generic ("Optimize Your AI Tool Budget"). Claude helped me pressure-test alternatives and get to "Stop Overpaying for AI Tools" — sharper, anxiety-inducing in the right way. Also used Claude to draft the PROMPTS.md documentation for structural clarity.

**Claude (debugging rubber duck):** When I hit the `NaN` bug described in question 1, I described the problem to Claude before I'd fully diagnosed it. Claude immediately suggested "check if monthlySpend is arriving as a string" — which confirmed my hypothesis faster than continuing to add console.logs. I still validated it myself rather than applying Claude's suggested fix blindly.

**What I didn't trust AI for:**
- The audit engine rules (requires careful business logic decisions)
- The Prisma schema design (requires understanding of the data relationships)
- Any financial calculation or pricing number (risk of hallucination)
- Architecture decisions (requires understanding of the deployment constraints)

**One specific time the AI was wrong:**
I asked Claude to suggest the correct Anthropic API model name for the cheapest fast model. It suggested `claude-3-haiku-20240307`. When I tested this, the API returned a 404 model-not-found error. The correct model ID was `claude-3-5-haiku-20241022`. Claude had hallucinated a plausible-but-wrong model identifier — easy mistake to make since model IDs follow a consistent naming pattern. I verified by checking the Anthropic API docs directly. Now I always verify model names against the official docs, never trust them from memory or from AI suggestions.

---

## 5. Self-Ratings

| Dimension | Rating | One-Sentence Reason |
|-----------|--------|---------------------|
| **Discipline** | 7/10 | I stuck to the daily build schedule but lost ~2 hours on Day 2 debugging a proxy misconfiguration that better upfront planning would have avoided. |
| **Code Quality** | 8/10 | Clean separation of concerns, explicit data validation at boundaries, good naming — the audit engine is production-quality — but the frontend has no component-level tests and a few hardcoded magic numbers I'd refactor given another day. |
| **Design Sense** | 8/10 | The glassmorphism dark-mode aesthetic is genuinely premium and the tool card expand/collapse UX is smooth, but the mobile experience on screens under 375px still has minor overflow issues. |
| **Problem-Solving** | 8/10 | I diagnosed the NaN/type-coercion bug systematically using hypothesis testing rather than shotgun-debugging, and reversed the wizard UX decision quickly when user feedback contradicted my assumption. |
| **Entrepreneurial Thinking** | 8.5/10 | The lead-after-value model, the Credex CTA threshold at $300/month, and the shared audit URL as a viral loop are all defensible product decisions grounded in B2B conversion logic — though I would rate higher if I had real traction data to validate rather than projected funnels. |
