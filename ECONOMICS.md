# Economics — AI Spend Audit

## Business Model Overview

AI Spend Audit is a **free lead-generation tool** for Credex's consulting and AI infrastructure optimization services.

The tool generates value by:
1. Demonstrating Credex's expertise in AI cost optimization
2. Capturing warm, pre-qualified leads (users who've seen their savings potential)
3. Surfacing high-value consultation opportunities for users with >$500/month in savings

---

## Infrastructure Costs (Monthly, at MVP scale)

| Service | Plan | Cost |
|---------|------|------|
| Vercel (Frontend) | Hobby (free) | $0 |
| Render (Backend) | Starter ($7/mo) | $7 |
| Supabase (Database) | Free tier | $0 |
| Anthropic API | ~$0.001/audit × 1,000 audits | ~$1 |
| Resend (Email) | Free (3,000 emails/mo) | $0 |
| **Total** | | **~$8/mo** |

At 10,000 audits/month:

| Service | Plan | Cost |
|---------|------|------|
| Vercel | Pro ($20/mo) | $20 |
| Render | Standard ($25/mo) | $25 |
| Supabase | Pro ($25/mo) | $25 |
| Anthropic API | ~$0.001 × 10,000 | $10 |
| Resend | Starter ($20/mo) | $20 |
| **Total** | | **~$100/mo** |

**Unit economics**: $100/month infrastructure to run 10,000 audits = $0.01 per audit. Excellent.

---

## Conversion Funnel

```
Visitors                     1,000/month
  ↓ (50% completion rate)
Audits Completed               500/month
  ↓ (40% lead capture rate)
Leads Captured                 200/month
  ↓ (50% qualify for CTA — >$500/mo savings)
High-Savings Leads             100/month
  ↓ (5% Credex consultation booking rate)
Consultations Booked           5/month
  ↓ (40% close rate)
New Customers                  2/month
```

---

## Revenue Math

### Credex Consultation Model

**Assumptions**:
- Average consultation deal: $3,000 one-time (AI infrastructure audit + implementation guide)
- Or recurring retainer: $1,500/month for ongoing AI tooling advisory

**Monthly revenue from audit tool at 1,000 visitors/month**:
- 2 new customers × $3,000 = **$6,000/month gross revenue**
- Infrastructure cost: $8/month
- **Gross margin**: 99.9%

**Scaling to 5,000 visitors/month** (post-Product Hunt + SEO):
- ~10 new customers × $3,000 = **$30,000/month**

### Lead Value Calculation

```
Monthly leads captured:        200
× Conversion to consultation:  5% = 10 consultations booked
× Close rate:                  40% = 4 customers
× Average deal:                $3,000
= Revenue attributed to tool:  $12,000/month

Revenue per lead:              $12,000 / 200 = $60/lead
Revenue per audit:             $12,000 / 500 = $24/audit
```

**A single lead is worth ~$60 to Credex in expected revenue.** The free tool is extremely ROI-positive at any realistic traffic level.

---

## CAC Assumptions

| Channel | CAC |
|---------|-----|
| Product Hunt (organic) | ~$0 (time cost only) |
| SEO content (blog + compare pages) | $0 (build cost amortized) |
| Paid social (Twitter/LinkedIn) | $50–$150/audit submitted |
| Direct outreach to r/SaaS | ~$0 (time only) |

**Blended CAC for organic channels**: <$5/audit (founder time + infrastructure)

---

## ARR Projection (12 months)

| Month | Visitors | Audits | Leads | Customers | Monthly Rev |
|-------|---------|--------|-------|-----------|-------------|
| 1–2 (launch) | 500 | 250 | 100 | 1 | $3,000 |
| 3–4 (SEO ramp) | 1,000 | 500 | 200 | 2 | $6,000 |
| 5–8 (steady state) | 2,000 | 1,000 | 400 | 4 | $12,000 |
| 9–12 (scale) | 5,000 | 2,500 | 1,000 | 10 | $30,000 |

**Year 1 ARR run rate**: ~$360,000 (at month 12 trajectory)

---

## Pivot Thresholds

If after 3 months:
- **Lead capture rate < 10%**: Problem with value perception — the savings numbers aren't compelling enough or the UX is losing people before the lead form
- **Consultation booking rate < 2%**: Problem with CTA or email nurture — leads aren't converting to conversations
- **Audit completion rate < 30%**: Problem with form — too complex, too long, or unclear instructions

If the free tool isn't driving consultation bookings, pivot consideration: **Freemium SaaS** with a $29/month "Pro" plan that adds:
- PDF export of audit results
- Monthly re-audit reminders
- Team sharing and collaboration
- Historical spend tracking

At $29/month with 100 paying users: $2,900 MRR — still significant.

---

## Key Assumption That Could Be Wrong

The consultation conversion rate (5%) is an educated guess based on typical B2B SaaS top-of-funnel metrics. If the actual rate is 1%, revenue is 5× lower. Validate this within the first 30 days by looking at email open rates, CTA click-through rates, and consultation bookings.
