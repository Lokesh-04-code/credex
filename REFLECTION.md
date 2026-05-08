# Reflection — AI Spend Audit

---

## 1. Hardest Bug and Debugging Process

**The bug**: The audit engine was returning correct savings calculations in unit tests, but the frontend was showing $0 for certain tool combinations that should have triggered the overspend rule. Specifically, GitHub Copilot Business for 3 seats at $90/month wasn't triggering the overspend recommendation.

**Debugging process**: I added `console.log` statements at every step of the payload chain — the form submission, the API body, and the engine input. I discovered that `monthlySpend` was being sent as a string (`"90"`) from the form's `input[type=number]`, but the arithmetic comparison in the engine used strict greater-than comparison: `90 > 57 * 1.1` vs `"90" > 57 * 1.1`. In JavaScript, `"90" > 62.7` is `true` because of implicit coercion — but the `Math.round` downstream was turning the string into NaN in some edge paths.

The root cause was inconsistent data types across the form → API → engine pipeline. I fixed it by adding `parseFloat(monthlySpend) || 0` at the `getToolsPayload()` function in the Zustand store, ensuring the API always receives numbers, not strings.

**What I learned**: TypeScript would have caught this at compile time. In a JS-only project, you need explicit coercion at every boundary. The lesson reinforced why separating "data entry" (strings from inputs) from "business data" (typed values for computation) with an explicit transformation step matters so much.

---

## 2. Reversed Engineering/Product Decision

**Original decision**: I initially designed the audit form as a multi-step wizard — Step 1: select tools, Step 2: enter plans/spend, Step 3: team context. Each step had a "Next" button.

**Why I reversed it**: After building the wizard, I tested it with 3 different people. All three independently expressed friction at Step 2 — they wanted to see all tools and their options at once, not one step at a time. The mental model for "configuring your tool stack" is more like a dashboard than a checkout flow.

**What I switched to**: A single scrolling page where tool cards expand in-place when selected. The `AnimatePresence` animation makes it feel smooth and progressive without fragmenting the experience across steps. This is a significantly better UX pattern for a form where:
- Users need to compare their selections simultaneously
- The relationship between tools matters (e.g., having both Cursor and Copilot selected informs the consolidation rules)
- The total spend counter at the top gives live feedback

**Outcome**: The single-page form is more compact, less clicky, and still mobile-friendly. It also loads faster because there's no routing between steps.

---

## 3. Week-2 Roadmap

If I had a second week, here's what I'd build in priority order:

**High priority:**
1. **Product Hunt launch prep**: Press kit, GIF demo, community posts in r/startups, r/SaaS, r/EngineeringManagers
2. **Email sequence**: Day 3 follow-up email after lead capture with "have you implemented the recommendations?" CTA
3. **Tool comparison deep-dive pages**: SEO-optimized landing pages like `/compare/cursor-vs-copilot` that drive long-tail organic traffic and link to the audit
4. **Analytics**: Posthog or Amplitude for funnel tracking (form start → form complete → lead submit)

**Medium priority:**
5. **PDF export**: Allow downloading the audit as a professional PDF for budget presentations
6. **More tools**: Add Devin, Continue.dev, Codeium, Perplexity Pro to the supported tools list
7. **Benchmark data**: "Your team spends $X. Teams of similar size spend $Y on average." (Requires accumulating audit data.)
8. **Admin dashboard**: Simple Supabase-based dashboard to see lead volume, avg savings found, and conversion rates

**Stretch:**
9. **API integration**: Connect directly to Stripe or billing APIs to auto-pull AI tool invoices instead of manual entry
10. **Slack bot**: `/audit my-ai-spend` command that walks the team through the audit in Slack

---

## 4. Honest AI Tool Usage

During this project I used AI tools extensively — here's an honest accounting:

**GitHub Copilot (coding autocomplete)**: Used throughout for boilerplate generation — React component scaffolding, Tailwind className suggestions, and Express middleware patterns. Probably saved 2-3 hours of typing. Critically, I did NOT use it for the audit engine logic, which I wrote manually to ensure correctness.

**Claude (design + copy)**: Used to iterate on marketing copy for the landing page. First two attempts at the hero headline were generic. Claude helped me get to "Stop Overpaying for AI Tools" which is sharper. Also used to review the PROMPTS.md documentation for clarity.

**Claude (debugging)**: When I hit the string-vs-number bug described above, I described the problem to Claude and it immediately suggested adding explicit `parseFloat()` at the data boundary. Confirmed my own diagnosis but got there faster.

**What I did NOT use AI for:**
- The audit engine rules (required careful thinking about business logic)
- The Prisma schema design
- Architecture decisions
- Any financial calculations

**Self-rating on AI usage**: I think I used AI where it genuinely accelerates work (boilerplate, copy iteration, debugging rubber duck) without using it as a crutch for thinking. The product's core value proposition — deterministic, financially defensible recommendations — required human judgment throughout.

---

## 5. Self-Ratings

| Dimension | Rating | Notes |
|-----------|--------|-------|
| **Code Quality** | 8/10 | Clean separation of concerns, good naming, could use more inline comments in the audit engine |
| **UX** | 8.5/10 | The tool card expand/collapse UX is smooth. Could improve mobile form on very small screens. |
| **Product Thinking** | 9/10 | Lead-after-value, honest savings, Credex CTA threshold are all defensible product decisions |
| **Architecture** | 8.5/10 | Clean service layer, good error handling, proper rate limiting |
| **Completeness** | 9/10 | All required features built, tested, and documented |
| **Documentation** | 9/10 | 11 docs at root covering business, technical, and product dimensions |
| **Test Coverage** | 7/10 | 10 unit tests covering the audit engine, but no integration tests for the API layer |
| **Deployment Readiness** | 8/10 | Fully configured for Vercel + Render, but needs real API keys to test end-to-end |

**Biggest strength**: The audit engine is genuinely production-quality — deterministic, testable, financially defensible.

**Biggest weakness**: No end-to-end integration tests. The server tests mock Prisma, which means a schema change could break the API without failing tests.
