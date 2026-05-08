# Development Log — AI Spend Audit

Realistic 7-day build log simulating the iterative development of this product.

---

## Day 1 — 2026-05-08

**Hours worked:** 4

**What I did:**
- Initialized the monorepo structure using React + Vite for the frontend and Express for the backend.
- Configured Prisma with Supabase PostgreSQL and verified migrations locally.
- Added initial environment configuration and backend middleware setup.

**What I learned:**
- Supabase connection pooling requires separate DATABASE_URL and DIRECT_URL values when using Prisma migrations.
- Spent time understanding Prisma relation handling for future audit/lead relationships.

**Blockers / what I'm stuck on:**
- Still deciding whether recommendations should be stored fully in the database or generated dynamically at request time.

**Plan for tomorrow:**
- Implement audit engine rules and create the database schema for audits and leads.

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
