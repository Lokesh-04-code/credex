# Metrics — AI Spend Audit

## North Star Metric

**Qualified Leads with >$500/month Savings Identified**

*Why this metric*: This is the leading indicator for Credex consultation revenue. A "qualified lead" is defined as: a user who completed an audit, found ≥$500/mo in savings, and submitted their email. This directly measures the tool's ability to generate business value for Credex.

*Target*: 50 qualified leads/month by month 3

---

## Supporting Metrics

### Funnel Metrics (ordered by importance)

| Metric | Definition | Target (Month 3) |
|--------|-----------|-----------------|
| **Audits Completed** | Users who submitted the audit form and received results | 500/month |
| **Lead Capture Rate** | % of completed audits where user submits email | >35% |
| **Qualified Lead Rate** | % of leads with savings >$500/mo | >40% |
| **Consultation Booking Rate** | % of qualified leads who book a Credex call | >5% |
| **Consultation Close Rate** | % of calls that convert to a paid engagement | >35% |

### Engagement Metrics

| Metric | Definition | Target |
|--------|-----------|--------|
| **Audit Completion Rate** | Visitors who finish the form / visitors who start it | >45% |
| **Share Rate** | Audits with share URL visited by someone else / total audits | >15% |
| **Return Visit Rate** | Users who complete >1 audit (different tool sets) | >5% |

### Content/SEO Metrics (Month 3+)

| Metric | Definition |
|--------|-----------|
| **Organic Search Traffic** | Monthly visitors from Google/Bing |
| **Referral Traffic** | Sessions from shared audit URLs |
| **Top Acquisition Sources** | Which channels drive completing audits |

---

## Instrumentation Plan

### Frontend (Posthog or Amplitude)

Events to track:
```javascript
// Landing page
posthog.capture('landing_page_viewed')
posthog.capture('hero_cta_clicked', { button: 'audit_my_ai_spend' })

// Audit form
posthog.capture('audit_form_started')
posthog.capture('tool_selected', { toolId })
posthog.capture('tool_deselected', { toolId })
posthog.capture('audit_form_submitted', { toolCount, totalSpend })

// Results page
posthog.capture('results_viewed', { shareId, monthlySavings, recommendationCount })
posthog.capture('share_link_copied', { shareId })
posthog.capture('credex_cta_clicked', { monthlySavings })

// Lead capture
posthog.capture('lead_form_viewed')
posthog.capture('lead_form_submitted', { auditId })
```

### Backend (Server logs → Supabase or Datadog)

Log these events:
- `audit.created` — with shareId, totalMonthlySavings, toolCount
- `audit.fetched_by_share` — tracks share URL views
- `lead.created` — with auditId, savings bracket
- `email.sent` / `email.failed`

### Key Dashboards to Build (Week 2)

1. **Daily funnel**: Visitors → Form starts → Completions → Leads → Qualified leads
2. **Savings distribution**: Histogram of audit savings amounts (are most audits <$100 or >$500?)
3. **Top tools in audits**: Which AI tools appear most frequently
4. **Share URL conversion**: Do shared audit URLs generate new audits?

---

## Pivot Thresholds

If after 90 days:

| Metric | Threshold | Action |
|--------|-----------|--------|
| Audit completion rate | <20% | Simplify the form — likely too many required fields |
| Lead capture rate | <15% | Problem with value delivery — savings may not be compelling |
| Qualified lead rate | <20% | ICP mismatch — most users' savings are <$500 (consider lowering threshold) |
| Consultation booking | <2% | Email nurture problem — need better follow-up sequence |
| Total audits | <200/mo | GTM problem — not reaching the ICP effectively |

**Pivot option**: If lead quality is high but consultation bookings are low, add a **self-serve PDF download** and schedule link prominently in the results email instead of relying on CTA clicks.

---

## Week-1 Success Definition

By end of week 1 post-launch:
- ≥ 100 audits completed
- ≥ 30 emails captured  
- ≥ 5 audits shared publicly (share URL used)
- ≥ 1 Credex consultation inquiry

If these targets are not hit, debug the top-of-funnel problem first (traffic → audit starts) before optimizing conversion.
