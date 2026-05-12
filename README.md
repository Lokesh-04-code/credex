# AI Spend Audit

> **AI Spend Audit** is a free, 3-minute tool that audits your team's AI tool subscriptions (Cursor, GitHub Copilot, Claude, ChatGPT, and more) and identifies overspend, downgrade opportunities, and consolidation savings — built for startup founders and engineering managers who are paying for AI tools but not tracking whether the spend is justified. It generates a shareable public URL for each audit result, serving as a lead-generation tool for Credex's AI infrastructure consulting services.

---

## 🔗 Deployed URL

| Environment | URL |
|---|---|
| **Live App** | https://credex-ashen.vercel.app |
| Backend API | https://credex-api.onrender.com |
| Health Check | https://credex-api.onrender.com/health |

---

## 📸 Screenshots

| Landing Page | Audit Form | Results Page |
|---|---|---|
| ![Landing](./screenshots/landing.png) | ![Form](./screenshots/form.png) | ![Results](./screenshots/results.png) |

---

## ⚡ Quick Start

```bash
# Clone the repository
git clone https://github.com/Lokesh-04/credex
cd credex

# Setup server
cd server
cp .env.example .env
# Edit .env with your Supabase, Anthropic/Groq, Resend keys
npm install
npm run db:generate
npm run dev

# In a new terminal, setup client
cd ../client
cp .env.example .env
# Set VITE_API_URL=http://localhost:4000
npm install
npm run dev
```

**Frontend:** http://localhost:5173  
**Backend:** http://localhost:4000  
**Health check:** http://localhost:4000/health

### Prerequisites
- Node.js 20+
- A Supabase project (free tier works)
- Anthropic or Groq API key (for AI summaries; optional — falls back to deterministic template)
- Resend account (for transactional email; optional)

### Run Tests
```bash
cd server
npm test
```

---

## 🚀 Deploy

### Frontend → Vercel
```bash
# From /client directory
npx vercel --prod
# Set env var in Vercel dashboard: VITE_API_URL=https://your-api.onrender.com
```

Add `client/vercel.json`:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

### Backend → Render
1. New Web Service → connect repo → Root Directory: `server`
2. Build: `npm install && npx prisma generate`
3. Start: `node index.js`
4. Add all env vars from `server/.env.example`

### Database → Supabase
```bash
cd server && npm run db:push
```

---

## 🏛 Architecture Summary

```
Frontend (Vite/React) → REST API → Express (Node.js)
                                      ├── Audit Engine (deterministic rules)
                                      ├── AI Summary (Groq/Anthropic, or fallback)
                                      ├── Prisma ORM → Supabase PostgreSQL
                                      └── Resend (transactional email)
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for full system diagram.

---

## ⚖️ Decisions — 5 Key Trade-offs

### 1. Deterministic Audit Engine (No AI for Math)
**Decision:** All savings calculations use hardcoded pricing rules — no LLM involvement in financial logic.  
**Rationale:** LLM hallucination on financial data is unacceptable. A founder using these numbers to make a $10k/year budget decision needs precision. The engine is pure `if/else` against verified pricing constants.  
**Trade-off:** Adding new tools requires a code change and redeploy. Acceptable at MVP scale; would automate with a pricing admin panel at Series A.

### 2. AI Used Only for Narrative Summary
**Decision:** The LLM (Groq/Anthropic) generates only the ~100-word prose paragraph, never the numbers.  
**Rationale:** LLMs excel at turning structured data into readable prose. They're unreliable at arithmetic. Separating concerns gives reliability + personality.  
**Trade-off:** Adds ~1–2s latency on audit generation. Mitigated by graceful deterministic fallback if the API call fails.

### 3. Value Before Lead Gate
**Decision:** Full audit results are shown before asking for email.  
**Rationale:** Gating results behind email creates friction and distrust before the user has seen any value. Showing results first demonstrates competence; the lead capture follows naturally.  
**Trade-off:** Lower raw lead capture rate — offset by dramatically higher lead quality (users who've seen their own savings are pre-sold).

### 4. Share URLs via nanoid (Not UUIDs)
**Decision:** 10-character nanoid (`xK9mPqR2wE`) instead of full UUIDs.  
**Rationale:** Prevents enumeration attacks while keeping URLs short and Twitter-friendly. Collision probability at 1M audits is negligible (~0.000001%).  
**Trade-off:** Not human-memorable — acceptable since share URLs aren't meant to be typed by hand.

### 5. localStorage for Form State (Not Server Sessions)
**Decision:** Zustand + localStorage for persisting the audit form, not server-side sessions.  
**Rationale:** Zero backend complexity. Works offline. Users can close the tab and return without losing their tool configuration.  
**Trade-off:** Doesn't sync across devices. Acceptable for a 3-minute form that's typically completed in one sitting.
