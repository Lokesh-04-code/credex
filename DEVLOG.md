# Development Log — AI Spend Audit

Realistic 7-day build log simulating the iterative development of this product.

---
## Note:
## Initial DEVLOG entries were added together after I reconstructed my work from notes/local progress. 
## Going forward, entries are being updated daily alongside development commits.

## Day 1 — 2026-05-08

**Hours worked:** 4

**What I did:**
- Initialized the monorepo structure using React + Vite for the frontend and Express for the backend.
- Configured Prisma with Supabase PostgreSQL and verified migrations locally.
- Added initial environment configuration and backend middleware setup.
- also developed the audit engine rules.
- built the basic level project

**What I learned:**
- Supabase connection pooling requires separate DATABASE_URL and DIRECT_URL values when using Prisma migrations.
- Spent time understanding Prisma relation handling for future audit/lead relationships.

**Blockers / what I'm stuck on:**
- Still deciding whether recommendations should be stored fully in the database or generated dynamically at request time.

**Plan for tomorrow:**
- implementing the logo  designa and animations

---
## Day 2 — 2026-05-09

**Hours worked:** 5

**What I did:**
-logo design completed with adding the text and animation effects
-set up 

**What I learned:**
-logo adding to the website  with some waiting time.

**Blockers / what I'm stuck on:**
- i wasted a lot time  today on logo integration.
- intially i kept the limit in apis this where i stuck. 

**Plan for tomorrow:**
- make website more responsive
- add more features.
- try to implement better audit engine

---

## Day 3 — 2026-05-10

**Hours worked:** 5

**What I did:**
- Completed the shareable result URL feature — each audit now gets a unique public URL with PII stripped.
- Built a dynamic OG image generator on the server (`sharp` + SVG template) that renders a branded 1200×630 PNG with the savings amount, tool count, and recommendation count.
- Added `og:image`, `og:image:width/height`, and `twitter:card: summary_large_image` meta tags to both `SharedAuditPage` and `ResultsPage` for rich link previews on Twitter, LinkedIn, Slack, etc.
- Created a new `SharePanel` component with OG image preview, copy-to-clipboard, one-click Tweet button (pre-composed text), LinkedIn share button, and native Web Share API support on mobile.
- Fixed the share buttons alignment issue where the native Share button was overflowing outside the card.
- Switched the Vite proxy target back to `localhost:4000` for local development.

**What I learned:**
- `lucide-react` does not export brand icons (Twitter, LinkedIn) — had to use inline SVGs instead.
- Vite requires `.jsx` extension for files containing JSX syntax — a `.js` file with JSX will fail with a parse error.
- `sharp` is a reliable cross-platform alternative to `canvas` for server-side image generation — converts SVG to PNG with no native build dependencies on Windows.

**Blockers / what I'm stuck on:**
- OG image previews won't be crawled by social platforms until the app is deployed to a public URL (Twitter/LinkedIn bots can't reach localhost).

**Plan for tomorrow:**
- Deploy the latest build to Render and verify OG image previews work on Twitter and LinkedIn.
- Improve the audit engine with more granular pricing rules.
- Make the UI more responsive on mobile devices.

---
## Day 4 — 2026-05-11

**Hours worked:** 6

**What I did:**
- Deployed frontend and backend to Render.
- Connected production APIs and database.
- Verified shareable links and OG previews.
- Improved UI responsiveness and fixed final bugs.
- Cleaned unused code and tested full audit flow.

**What I learned:**
- OG previews require public deployment URLs.
- Render cache may require redeployment for updates.

**Blockers / what I'm stuck on:**
- Minor backend cold start delay on Render free tier.
- Need better pricing detection logic in audit engine.

**Plan for tomorrow:**
- Collect user feedback.

## Day 5 — 2026-05-12

**Hours worked:** 2

**What I did:**
- i taken the interview regarding this website.i went to his office to meet him after the exam.
- i made some changes to the  .md files
**Blockers / what I'm stuck on:**
- i need more users to collect data.and also i have exam so i not able to
