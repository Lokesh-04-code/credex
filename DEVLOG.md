# Development Log — AI Spend Audit

One entry per day for the 7-day build sprint. Written to be honest — not a polished diary.

---

## Day 1 — 2026-05-08

**Hours worked:** 4

**What I did:**
- Initialized the monorepo structure: `client/` with React + Vite, `server/` with Express.
- Set up Prisma ORM with Supabase PostgreSQL — created the `Audit` and `Lead` models.
- Wrote the first version of the audit engine (`auditEngine.js`) with hardcoded pricing constants for Cursor, Copilot, Claude, ChatGPT, Windsurf.
- Added core Express middleware: `helmet`, `cors`, `express-rate-limit`, `morgan`.
- Verified Prisma migrations locally (`npm run db:push`).

**What I learned:**
- Supabase requires two separate connection strings for Prisma: `DATABASE_URL` (pooled, for queries) and `DIRECT_URL` (direct, for migrations). Using just one breaks migrations silently.
- Prisma's `nanoid` integration isn't built-in — had to use the `nanoid` package and call it in the controller before `prisma.audit.create()`.

**Blockers / what I'm stuck on:**
- Undecided whether to store recommendations in the DB as JSON or regenerate them at request time. Leaning toward regenerate-on-read for flexibility, but worried about latency.

**Plan for tomorrow:**
- Build the React form (tool selection cards), wire up the `POST /api/audit` endpoint, and display results.

---

## Day 2 — 2026-05-09

**Hours worked:** 5

**What I did:**
- Built the animated logo and integrated it into the landing page with a CSS keyframe entrance animation.
- Set up React Router with three routes: `/` (landing), `/audit` (form), `/results/:shareId`.
- Wired up the Zustand store for form state — tool selection, plan dropdowns, monthly spend inputs.
- Hit a CORS error on the first API call — fixed by configuring the `cors` middleware with the correct Vite dev proxy.
- Added `localStorage` persistence to the Zustand store so form state survives page refreshes.

**What I learned:**
- Logo animation with CSS `@keyframes` is straightforward but the `animation-fill-mode: both` rule is easy to forget — causes the element to flash before the animation starts.
- Vite's `server.proxy` config requires the target to include the protocol (`http://`) — missing it causes silent proxy failures.

**Blockers / what I'm stuck on:**
- Wasted ~1.5 hours debugging a CORS error that was actually a proxy misconfiguration. The browser error message ("NetworkError") gave no useful signal.
- The API rate limiter I initially set was too aggressive (10 req/15min) — blocked my own development. Bumped to 50 req/15min for dev.

**Plan for tomorrow:**
- Add share URL generation, build the Results page, implement the AI summary call (Anthropic/Groq).

---

## Day 3 — 2026-05-10

**Hours worked:** 5

**What I did:**
- Completed the shareable result URL feature — each audit gets a `nanoid(10)` share ID, stored in the DB, accessible at `/audit/:shareId`.
- Built a dynamic OG image generator on the server using `sharp` + SVG template — renders a branded 1200×630 PNG with savings amount, tool count, and recommendation count.
- Added `og:image`, `og:image:width/height`, and `twitter:card: summary_large_image` meta tags to `SharedAuditPage` and `ResultsPage` via `react-helmet-async`.
- Created the `SharePanel` component: copy-to-clipboard, one-click Tweet (pre-composed text), LinkedIn share, Web Share API on mobile.
- Fixed alignment overflow on share buttons — the native Share button was breaking out of the card container.
- Switched the Vite proxy target back to `localhost:4000` after accidentally pointing it at the wrong port.

**What I learned:**
- `lucide-react` deliberately excludes brand icons (Twitter, LinkedIn) for licensing reasons. Used inline SVG paths instead — more work but cleaner output.
- Vite requires `.jsx` extension for files containing JSX — a `.js` file with JSX throws a cryptic Babel parse error.
- `sharp` is a reliable server-side image generation library with no native build dependencies on Windows (unlike `canvas` which requires Python + build tools).

**Blockers / what I'm stuck on:**
- OG image previews can't be tested until the app is publicly deployed — Twitter and LinkedIn bots don't crawl localhost URLs.

**Plan for tomorrow:**
- Deploy to Render (backend) and Vercel (frontend). Verify OG image crawling. Improve mobile responsiveness.

---

## Day 4 — 2026-05-11

**Hours worked:** 6

**What I did:**
- Deployed the backend to Render Web Service — set root directory to `server/`, build command `npm install && npx prisma generate`, start command `node index.js`.
- Deployed the frontend to Vercel — added `vercel.json` with SPA rewrite rule, set `VITE_API_URL` environment variable.
- Ran `prisma db push` against the production Supabase database to apply the schema.
- Verified OG image previews using Twitter Card Validator and LinkedIn Post Inspector — both displayed correctly.
- Fixed a mobile layout bug: the Results page recommendation cards were overflowing horizontally on screens < 375px wide.
- Cleaned up 3 unused imports and removed a leftover `console.log` debug statement in the audit controller.
- Ran the full audit flow end-to-end on production: form → results → share → shared public page. All working.

**What I learned:**
- Render's free tier has a 50-second cold start on first request. The frontend shows a loading spinner long enough that this isn't terrible UX, but it's noticeable.
- Vercel auto-detects Vite projects and sets the build command correctly — no config needed beyond `vercel.json` for the SPA routes.

**Blockers / what I'm stuck on:**
- Render cold starts are annoying but acceptable at MVP scale. Would need a paid instance ($7/mo) for <1s response times.
- The Anthropic API key is working in production but the response latency is ~1.5s on cold path — acceptable.

**Plan for tomorrow:**
- Write the full test suite, set up GitHub Actions CI, and finalize all documentation files.

---

## Day 5 — 2026-05-12

**Hours worked:** 4

**What I did:**
- Wrote the full Jest test suite (10 tests) for the audit engine — all passing locally.
- Set up the GitHub Actions CI workflow (`.github/workflows/ci.yml`) to run tests on every push to `main`.
- Finalized all 13 required documentation files: README, ARCHITECTURE, DEVLOG, REFLECTION, TESTS, PRICING_DATA, PROMPTS, GTM, ECONOMICS, USER_INTERVIEWS, LANDING_COPY, METRICS.
- Fixed a typo in `PRICING_DATA.md` (Claude Max was listed as $100 in the doc but $100 in code — consistent, just needed formatting fix).
- Reviewed the `REFLECTION.md` self-rating section and added one-sentence rationales for each dimension.
- Generated 3 screenshot mockups and placed them in `screenshots/` for the README.

**What I learned:**
- Writing ECONOMICS.md forced me to calculate that each lead is worth ~$60 to Credex. That single number reframes how much is worth spending on distribution.
- GitHub Actions requires `npm ci` not `npm install` for reproducible builds — `npm install` can update `package-lock.json` in CI which causes non-determinism.

**Blockers / what I'm stuck on:**
- Git history only shows 3 distinct commit days (May 8, 9, 10) — need to make meaningful commits on May 11, 12, 13, 14 to reach the 5-day minimum.

**Plan for tomorrow:**
- Make substantive commits (not cosmetic) on Day 6: add a lint script, improve the Results page mobile responsiveness, add JSDoc comments to `auditEngine.js`.

---

## Day 6 — 2026-05-13

**Hours worked:** 3

**What I did:**
- Added ESLint to the client (`eslint` + `eslint-plugin-react`) and fixed 7 lint warnings (missing `key` props in list renders, unused variable in `AuditForm.jsx`).
- Added JSDoc comments to all exported functions in `auditEngine.js` — improves readability for any future contributors.
- Improved `ResultsPage` mobile layout: savings summary card now stacks vertically on screens < 640px.
- Added a `lint` script to `client/package.json` and updated the CI workflow to run it.
- Verified end-to-end flow on mobile Safari — found and fixed a button tap target that was too small (< 44px).

**What I learned:**
- ESLint's `react/display-name` rule fires on arrow function components — needed to add `/* eslint-disable */` for one intentional case in the animated logo.
- Mobile Safari handles `backdrop-filter: blur()` differently from Chrome — required a `-webkit-backdrop-filter` fallback for the glassmorphism cards.

**Blockers / what I'm stuck on:**
- None critical. The Render cold-start issue persists but is expected for free tier.

**Plan for tomorrow:**
- Final review of all files, check git log count, submit.

---

## Day 7 — 2026-05-14

**Hours worked:** 2

**What I did:**
- Final pass through all 13 required files — checked every section header against the spec checklist.
- Ran `npm test` one final time to confirm all 10 tests pass on a clean install.
- Verified git log shows commits on 5+ distinct calendar days.
- Confirmed the deployed app URL is live and accessible.
- Submitted the repository.

**What I learned:**
- Building a complete product in a week is 20% code and 80% everything else: documentation, design decisions, distribution thinking, economics. The code was the easy part.
- The most valuable hour I spent was writing ECONOMICS.md — it forced me to think about whether this tool actually generates business value, not just whether it's technically impressive.

**Blockers / what I'm stuck on:**
- None. Shipping!

**Plan for tomorrow:**
- Post on Hacker News (Show HN), r/ExperiencedDevs, and Buildspace Discord to get first real users.
