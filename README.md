# AI Spend Audit

> Find hidden savings in your AI tool stack. Free 3-minute audit for startup founders and engineering managers.

---

## 🎯 Who This Is For

- **Startup founders** paying for multiple AI tools without knowing if the spend is justified
- **Engineering managers** responsible for AI tool budgets across their team
- **CTOs** optimizing developer tooling costs at scale
- **Finance teams** looking to rationalize SaaS spending during budget reviews

---

## 📸 Screenshots

> _[Replace with actual screenshots after first deploy]_

| Landing Page | Audit Form | Results Page | Shared Audit |
|---|---|---|---|
| `screenshots/landing.png` | `screenshots/form.png` | `screenshots/results.png` | `screenshots/share.png` |

---

## 🔗 Deployment Links

| Environment | URL |
|---|---|
| Frontend (Vercel) | `https://aispendaudit.com` _(placeholder)_ |
| Backend (Render) | `https://api.aispendaudit.com` _(placeholder)_ |
| Database (Supabase) | Managed — not public |

---

## ⚡ Quick Start (5 minutes)

```bash
# Clone the repository
git clone https://github.com/your-org/ai-spend-audit
cd ai-spend-audit

# Setup server
cd server
cp .env.example .env
# Edit .env with your Supabase, Anthropic, Resend keys
npm install
npm run db:generate
npm run dev

# In a new terminal, setup client
cd ../client
cp .env.example .env
npm install
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:4000  
Health check: http://localhost:4000/health

---

## 🛠 Local Setup (Detailed)

### Prerequisites
- Node.js 20+
- A Supabase project (free tier works)
- (Optional) Anthropic API key for AI summaries
- (Optional) Resend account for transactional email

### 1. Database Setup (Supabase)
1. Create a project at https://supabase.com
2. Go to **Settings → Database → Connection string**
3. Copy the **Transaction** connection string → `DATABASE_URL` in `.env`
4. Copy the **Session** connection string → `DIRECT_URL` in `.env`
5. Run: `npm run db:push` (from `/server`)

### 2. Server
```bash
cd server
cp .env.example .env   # Fill in your values
npm install
npm run db:generate     # Generate Prisma client
npm run dev             # Starts on port 4000
```

### 3. Client
```bash
cd client
cp .env.example .env   # Set VITE_API_URL=http://localhost:4000
npm install
npm run dev             # Starts on port 5173
```

### 4. Run Tests
```bash
cd server
npm test
```

---

## 🚀 Deployment

### Frontend → Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# From /client directory
vercel --prod
```

**Environment variables to set in Vercel dashboard:**
```
VITE_API_URL=https://your-render-api.onrender.com
```

**Vercel config** (add `vercel.json` in `/client`):
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Backend → Render

1. Create a new **Web Service** on Render
2. Connect your GitHub repository
3. Set **Root Directory** to `server`
4. Set **Build Command**: `npm install && npx prisma generate`
5. Set **Start Command**: `node index.js`
6. Add environment variables from `server/.env.example`

### Database → Supabase

1. Push schema: `npm run db:push` (from `/server`)
2. Or use migrations: `npm run db:migrate`

---

## 🏛 Architecture Summary

```
Frontend (Vite/React) → REST API → Express (Node.js)
                                      ├── Audit Engine (deterministic)
                                      ├── Anthropic API (narrative only)
                                      ├── Prisma ORM → Supabase PostgreSQL
                                      └── Resend (transactional email)
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed diagrams.

---

## ⚖️ Key Engineering & Product Tradeoffs

### 1. Deterministic vs. AI-Based Audit Logic
**Decision**: All financial calculations use hardcoded pricing rules — no AI for math.  
**Rationale**: AI hallucination risk on financial data is unacceptable. A startup founder trusting these numbers to make a $10k/year decision needs precision, not statistical probability. The audit engine is a set of explicit `if/else` rules against verified pricing pages.  
**Tradeoff**: Adding new tools requires manual code updates (acceptable at this scale).

### 2. AI for Narrative Only
**Decision**: Anthropic Claude is called only to generate a ~100-word summary paragraph.  
**Rationale**: AI is genuinely good at turning structured data into readable prose. It's terrible at arithmetic. Separation keeps the product reliable while still using AI where it adds real value.  
**Tradeoff**: Adds ~1-2s to audit generation time. Mitigated by graceful fallback.

### 3. Share URLs via nanoid (Not Slugs)
**Decision**: 10-character random IDs (nanoid) instead of descriptive slugs.  
**Rationale**: Prevents enumeration attacks on audit data. Collision probability at 1M audits is negligible. Also keeps URLs short and Twitter-friendly.  
**Tradeoff**: Not human-memorable — but share URLs aren't meant to be typed by hand.

### 4. Value Before Lead Gate
**Decision**: Show full results before asking for email.  
**Rationale**: SaaS convention of gating results behind email creates friction and distrust for a tool that's trying to demonstrate value. We show everything first, then offer email delivery as a convenience.  
**Tradeoff**: Lower lead capture rate — mitigated by higher quality leads (users who've already seen value).

### 5. localStorage for Form Persistence
**Decision**: Zustand + localStorage for form state, not server-side sessions.  
**Rationale**: Zero backend complexity. Works offline. Users can close the tab and return without losing their tool configuration. Simple, reliable, sufficient for the MVP.  
**Tradeoff**: Doesn't sync across devices. Acceptable for a form that takes 3 minutes.
