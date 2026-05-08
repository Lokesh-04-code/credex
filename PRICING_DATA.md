# Pricing Data — AI Spend Audit

All pricing verified from official vendor pages. Last audit: 2025-05-01.

---

## Cursor

| Plan | Price | Source | Verified |
|------|-------|--------|---------|
| Hobby | $0/mo | https://cursor.com/pricing | 2025-05-01 |
| Pro | $20/seat/mo | https://cursor.com/pricing | 2025-05-01 |
| Business | $40/seat/mo | https://cursor.com/pricing | 2025-05-01 |
| Enterprise | Custom (~$40+/seat/mo) | https://cursor.com/pricing | 2025-05-01 |

**Notes**: Pro includes 500 fast requests/mo + unlimited slow requests. Business adds admin controls, SSO, zero data retention.

---

## GitHub Copilot

| Plan | Price | Source | Verified |
|------|-------|--------|---------|
| Individual | $10/mo or $100/yr | https://github.com/features/copilot | 2025-05-01 |
| Business | $19/seat/mo | https://github.com/features/copilot | 2025-05-01 |
| Enterprise | $39/seat/mo | https://github.com/features/copilot | 2025-05-01 |

**Notes**: Individual plan now free for verified students and open source maintainers. Business includes organization-wide management, IP indemnity, public code filter.

---

## Claude (Anthropic)

| Plan | Price | Source | Verified |
|------|-------|--------|---------|
| Free | $0/mo | https://claude.ai/pricing | 2025-05-01 |
| Pro | $20/seat/mo | https://claude.ai/pricing | 2025-05-01 |
| Max | $100/seat/mo | https://claude.ai/pricing | 2025-05-01 |
| Team | $30/seat/mo (5-seat minimum) | https://claude.ai/pricing | 2025-05-01 |
| Enterprise | Custom (~$60+/seat/mo, est.) | https://www.anthropic.com/pricing | 2025-05-01 |
| API Direct | Usage-based | https://www.anthropic.com/pricing | 2025-05-01 |

**Notes**: Max plan provides 5× more usage than Pro. Team plan billed for minimum 5 seats. Enterprise includes SSO, admin console, compliance features.

---

## ChatGPT (OpenAI)

| Plan | Price | Source | Verified |
|------|-------|--------|---------|
| Plus | $20/seat/mo | https://openai.com/chatgpt/pricing | 2025-05-01 |
| Team | $30/seat/mo (min 2 seats) | https://openai.com/chatgpt/pricing | 2025-05-01 |
| Enterprise | Custom (~$60+/seat/mo, est.) | https://openai.com/chatgpt/pricing | 2025-05-01 |
| API Direct | Usage-based (per token) | https://openai.com/api/pricing | 2025-05-01 |

**Notes**: Team includes GPT-4o, higher message limits, no training on data, admin workspace. Enterprise adds SSO, advanced analytics.

---

## Anthropic API (Direct)

| Model | Input | Output | Source | Verified |
|-------|-------|--------|--------|---------|
| Claude 3.5 Haiku | $0.80/M tokens | $4/M tokens | https://www.anthropic.com/pricing | 2025-05-01 |
| Claude 3.5 Sonnet | $3/M tokens | $15/M tokens | https://www.anthropic.com/pricing | 2025-05-01 |
| Claude 3 Opus | $15/M tokens | $75/M tokens | https://www.anthropic.com/pricing | 2025-05-01 |

---

## OpenAI API (Direct)

| Model | Input | Output | Source | Verified |
|-------|-------|--------|--------|---------|
| GPT-4o | $2.50/M tokens | $10/M tokens | https://openai.com/api/pricing | 2025-05-01 |
| GPT-4o mini | $0.15/M tokens | $0.60/M tokens | https://openai.com/api/pricing | 2025-05-01 |
| o1 | $15/M tokens | $60/M tokens | https://openai.com/api/pricing | 2025-05-01 |

---

## Gemini (Google)

| Plan | Price | Source | Verified |
|------|-------|--------|---------|
| Gemini Advanced | $19.99/mo | https://one.google.com/about/plans | 2025-05-01 |
| API Direct | Usage-based | https://ai.google.dev/pricing | 2025-05-01 |

**Notes**: Gemini Advanced is bundled with Google One AI Premium plan. Free tier available via Google AI Studio.

---

## Windsurf (Codeium)

| Plan | Price | Source | Verified |
|------|-------|--------|---------|
| Free | $0/mo | https://windsurf.com/pricing | 2025-05-01 |
| Pro | $15/seat/mo | https://windsurf.com/pricing | 2025-05-01 |
| Team | $35/seat/mo | https://windsurf.com/pricing | 2025-05-01 |

**Notes**: Windsurf is the AI-native IDE from Codeium. v0 (Vercel's generative UI tool) has separate pricing — treated as same category here.

---

## Maintenance Note

Pricing changes frequently. This file should be verified monthly.
Set a calendar reminder: **First Thursday of each month — verify pricing**.

When updating: change prices in both this file AND `server/src/services/auditEngine.js` PRICING constants, then re-run tests.
