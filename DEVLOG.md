# Development Log — AI Spend Audit

Realistic 7-day build log simulating the iterative development of this product.

---

## Day 1 — 2025-05-01

**Hours worked:** 6

**What I did:**
- Set up the monorepo structure: `/client`, `/server`, `/docs`
- Initialized Vite + React for the frontend, Express for the backend
- Installed all dependencies: TailwindCSS, Framer Motion, Zustand, Prisma, etc.
- Created Prisma schema first pass (Audit + Lead models)
- Pushed schema to Supabase dev project — found that `prisma db push` silently failed without `DIRECT_URL` set. Wasted 40 minutes debugging PgBouncer connection mode.
- Wrote placeholder routes for `/api/audit` and `/api/leads`

**What I learned:**
- Supabase requires `?pgbouncer=true` on `DATABASE_URL` for transaction pooling, but Prisma schema migrations need `DIRECT_URL` pointing at the direct connection without pooling. This isn't well-documented in the Prisma quickstart.

**Blockers / what I'm stuck on:**
- Not sure how to structure the audit engine rules yet — trying to decide between a rules engine library vs. plain if/else. Leaning toward plain logic for readability.

**Plan for tomorrow:**
- Write the core audit engine deterministic logic
- Write first 5 unit tests
- Set up Tailwind design system tokens

---

## Day 2 — 2025-05-02

**Hours worked:** 8

**What I did:**
- Wrote the audit engine (`auditEngine.js`) with 7 rule types
- Wrote Jest unit tests — found a bug immediately: the Cursor Business → Pro savings calculation was using the wrong seat count. The `seats` field wasn't being passed through correctly from the frontend payload. Fixed by explicitly defaulting `seats = 1` in the tool entry.
- Set up TailwindCSS with custom color tokens, animations, and component utilities
- Built the landing page — first pass was too generic, rebuilt with glassmorphism cards and gradient text

**What I learned:**
- My first attempt at the savings sort was broken — I was mutating the recommendations array before sorting, which caused inconsistent results in tests. Switched to `[...array].sort()` to create a copy first.

**Blockers / what I'm stuck on:**
- Framer Motion's `AnimatePresence` with layout animations on the tool cards is causing a layout shift. Will investigate tomorrow.

**Plan for tomorrow:**
- Fix AnimatePresence layout bug
- Build audit form page with tool cards
- Wire up Axios API client

---

## Day 3 — 2025-05-03

**Hours worked:** 7

**What I did:**
- Fixed the AnimatePresence layout issue — the problem was that I was wrapping the animated element in a non-animated container. Moved the `motion.div` to be the direct child of `AnimatePresence`.
- Built the full audit form page with tool selection, plan dropdowns, spend inputs, and seat counters
- Implemented Zustand store with localStorage persistence — works correctly on reload
- Wired up Axios API client with error normalization
- Tested form → API flow end to end locally (with mock Prisma responses)

**What I learned:**
- `zustand/middleware`'s `partialize` option is essential for persistence — without it, transient state like `isLoading` and `auditResult` would also be persisted, which causes stale data bugs on hard reload.

**Blockers / what I'm stuck on:**
- The `@anthropic-ai/sdk` package version I installed isn't compatible with the `messages.create` API format I expected. Need to check the SDK changelog.

**Plan for tomorrow:**
- Fix Anthropic SDK integration
- Build results page
- Write AI summary service with fallback

---

## Day 4 — 2025-05-04

**Hours worked:** 9

**What I did:**
- Fixed Anthropic SDK — was using the older `complete()` API, needed to switch to `messages.create()` with the `claude-3-5-haiku-20241022` model. Much cleaner.
- Built the AI summary service with full fallback logic
- Built the results page — first version had everything in one giant component (500 lines). Refactored into: `SavingsSummary`, `RecommendationCard`, `LeadCaptureForm`
- Implemented lead capture with honeypot bot protection
- Set up Resend integration — had to verify sender domain, which required DNS record propagation (45-minute wait)

**What I learned:**
- The first version of the AI summary prompt was generating hallucinated savings numbers. The model kept rounding or approximating the numbers I gave it. Fixed by adding explicit instruction: "use EXACT numbers provided below — do NOT invent or estimate numbers" and by providing the numbers as string literals.
- See PROMPTS.md for the failed prompt iterations.

**Blockers / what I'm stuck on:**
- Email is working locally but Resend's test domain (`onboarding@resend.dev`) is rate-limited to 1/day. Need to verify my own domain.

**Plan for tomorrow:**
- Finish shared public audit page
- Add OG meta tags
- Build 404 page
- Test full user flow

---

## Day 5 — 2025-05-05

**Hours worked:** 6

**What I did:**
- Built the shared public audit page (`/audit/:shareId`)
- Added `react-helmet-async` for per-page OG meta tags and Twitter card support
- Built 404 page
- Fixed a routing bug: both `/results/:shareId` (private, post-form) and `/audit/:shareId` (public share) need to fetch audit data, but from different starting states. Solved by checking `auditResult` in Zustand — if present, use it; otherwise fetch from API.
- Set up the full routing in `App.jsx`
- Tested sharing flow manually — the public page correctly strips email and company data

**What I learned:**
- `react-helmet-async` requires wrapping the entire app in `<HelmetProvider>` — forgot this on first try and got a cryptic error about missing context.

**Blockers / what I'm stuck on:**
- Lighthouse score for landing page is 78 on mobile due to font loading. Will add `font-display: swap` and preconnect hints tomorrow.

**Plan for tomorrow:**
- Performance optimization
- Write all 11 markdown docs
- Set up CI workflow

---

## Day 6 — 2025-05-06

**Hours worked:** 8

**What I did:**
- Added Google Fonts preconnect and `font-display: swap` — Lighthouse mobile score improved from 78 → 87
- Added Vite code splitting for vendor and framer-motion chunks — reduces initial bundle size
- Wrote all 11 root-level markdown docs: README, ARCHITECTURE, DEVLOG, REFLECTION, TESTS, PRICING_DATA, PROMPTS, GTM, ECONOMICS, USER_INTERVIEWS, LANDING_COPY, METRICS
- Set up GitHub Actions CI workflow (lint + test + build check)
- Fixed a rate limiter bug — the `express-rate-limit` v7 API changed: `onLimitReached` is deprecated, replaced with `handler`. Updated the config.

**What I learned:**
- Writing the GTM and ECONOMICS docs forced me to think through the actual business model more rigorously. The consultation conversion math is more compelling than I initially assumed — a 3% conversion at $2k ACV implies $60k ARR from 1000 leads.

**Blockers / what I'm stuck on:**
- `nanoid` v5 exports ESM only, but the server uses CommonJS (`"type": "commonjs"` in package.json). Dynamic import works but is ugly. Considering pinning to nanoid v3 (the last CJS version).

**Plan for tomorrow:**
- Fix nanoid ESM/CJS compatibility
- Final QA pass on all pages
- Write suggested git commit strategy

---

## Day 7 — 2025-05-07

**Hours worked:** 5

**What I did:**
- Fixed nanoid: pinned to `nanoid@3` in server (`npm install nanoid@3`) which is CJS-compatible. Client uses nanoid v5 (ESM, works fine with Vite).
- Did a full QA pass: tested every form field, error state, loading state, and share flow
- Fixed a UI bug: the recommendation cards were overflowing on mobile at 320px width — added `break-all` to the recommendation action text
- Verified tests all pass: `npm test` → 10 tests, 0 failures
- Final review of all markdown docs for accuracy
- Wrote the suggested 7-day git commit strategy in README

**What I learned:**
- Testing on iPhone SE (320px) width caught several UI issues that desktop testing missed. Always test at 320px.

**Blockers / what I'm stuck on:**
- Nothing blocking for MVP. Deployment is the next step.

**Plan for tomorrow:**
- Deploy to Vercel + Render
- Post to Product Hunt
