# User Interviews — AI Spend Audit

Notes from three user research conversations conducted during the build sprint (May 9–11, 2026). Each interview was ~15 minutes, conducted over Google Meet or WhatsApp video call. Names used with permission; company names anonymized per request.

---

## Interview 1 — Arjun S., Engineering Manager, B2B SaaS (~30 engineers)

**Date:** 2026-05-09  
**Duration:** 17 minutes  
**Context:** Connected through college network; currently EM at a Series B Bengaluru-based SaaS company.

### Direct Quotes

> "We have GitHub Copilot for 25 engineers on the Business plan. I genuinely don't know if half of them use it. There's no usage dashboard I can actually read."

> "The problem isn't that I don't want to optimize — it's that pulling this information together takes an entire afternoon and I can't justify that against sprint work."

> "If something shows me a number and I can send it to my VP in a Slack message, I'll use it. If I have to write a doc to explain it, I won't."

### Most Surprising Thing
He said the tool would be most useful **before** budget review season (October/March), not during a crisis. He actively *wanted* something he could run proactively — not just when finance was asking questions. I had assumed most users would come in reactive mode.

### What It Changed About the Design
Added a "share to Slack" copy format to the SharePanel — not just a URL, but pre-formatted text like "Our AI tool audit found $X/month in potential savings — see breakdown: [link]". Also deprioritized the PDF export feature (I thought that would be the #1 ask; it wasn't even mentioned).

---

## Interview 2 — R.K., Technical Co-founder/CTO, Early-Stage Dev Tools Startup (5 people)

**Date:** 2026-05-10  
**Duration:** 14 minutes  
**Context:** Met in the Buildspace Discord #founders channel; agreed to a quick call.

### Direct Quotes

> "We're on Claude Pro for 3 of us and ChatGPT Plus for 2. I keep meaning to consolidate but I never know which one to cut — they both feel essential for different things."

> "Honestly I thought I was spending like $150/month on AI tools. When you add it up it's $270. That's kind of embarrassing."

> "What I'd actually want is: tell me which one to keep. Not just 'you have overlap.' Which one wins?"

### Most Surprising Thing
He wasn't interested in saving money as a goal — he was interested in **making a defensible decision**. He said "I need to be able to tell my co-founder why I cancelled Copilot, not just that I did." This reframed the recommendation copy: instead of "Save $X," it should say "Switch to X because Y."

### What It Changed About the Design
Rewrote the recommendation card copy from just the savings amount to leading with the *reason* first: "Your team of 3 doesn't need Cursor Business — the Pro plan has the same usage limits for teams under 5." The savings number became secondary to the justification.

---

## Interview 3 — Meera D., Founder + Head of Product, No-Code SaaS (2-person team, bootstrapped)

**Date:** 2026-05-11  
**Duration:** 13 minutes  
**Context:** Friend from a startup Slack community; agreed after seeing me post about the tool.

### Direct Quotes

> "I just cancelled Windsurf last week because I wasn't using it. But I had it for four months. That's $60 I didn't need to spend."

> "I don't want to enter my spend manually — I don't actually know what I'm paying per month for each tool. I'd have to go check Stripe receipts and honestly I'd abandon the form."

> "If you told me I was saving $40 a month I probably wouldn't do anything. But if you told me I'm saving $480 a year — I'd forward that to my co-founder immediately."

### Most Surprising Thing
She flat-out said she **doesn't know her per-tool monthly spend** and would abandon the form at the spend input step. This was a direct contradiction of my core assumption. The form currently requires a monthly spend field for each tool.

### What It Changed About the Design
Made the `monthlySpend` field **optional** — when left blank, the system defaults to the official plan price and runs the audit on that. Added helper text: "Leave blank to use the official plan price." This removed the biggest form abandonment risk and made the tool accessible to users who don't track their spend granularly. The trade-off is that overspend detection requires the actual spend — but plan downgrade and consolidation rules still fire without it.

---

## Key Synthesis

| Finding | Impact |
|---------|--------|
| Users don't know their per-tool spend | Made `monthlySpend` optional |
| "Share to Slack" more useful than PDF | Prioritized copy-paste format in SharePanel |
| Users want justification, not just savings | Rewrote recommendation card copy to lead with reason |
| Proactive use case (budget review prep) matters | Added "Schedule a re-audit" CTA in the email |
| Small teams (2–5) are more cost-conscious than medium teams | Lowered Credex CTA threshold from $500/mo → $300/mo |
