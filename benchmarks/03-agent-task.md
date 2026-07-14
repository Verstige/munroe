# Benchmark 3: Agent Task — Research + Outreach

## Prompt

```
You're an agent operating on behalf of a Numin customer (a B2B SaaS founder).
Your job is to research a prospect and draft personalized outreach.

Prospect info:
- Name: Sarah Chen
- Company: Bloomloop (a content operations platform for marketing teams, 12-person company, Series A)
- LinkedIn summary: "Building the content engine marketing teams actually want. Previously: Head of Growth at Calendly."
- Recent LinkedIn post (2 days ago): "Hot take: most B2B SaaS onboarding fails not because the product is bad, but because the first 24 hours don't have a human in the loop. The companies winning right now are the ones that automate the product, not the relationship."

Your task — execute these steps and report results:
1. Identify 2-3 specific reasons WHY Numin would resonate with Sarah based on her post + her company's stage
2. Draft a 3-sentence cold outreach DM (NOT an email — a DM) referencing her post specifically
3. Suggest 3 follow-up angles if she doesn't respond in 7 days
4. Flag any concerns or risks about reaching out to her

Output as a structured report.
```

## Outputs

### Numin (Zora / Hermes Agent Stack)

# Outreach Plan: Sarah Chen @ Bloomloop

## Why Numin resonates

1. **Direct match to her "human in the loop" thesis.** Sarah literally just published that the first 24h of onboarding needs a human touch. Numin is exactly that: agents that handle product operations (inbox, scheduling, ticket routing) but the relationship layer (calls, follow-ups) stays human. We automate the "automatable" so her team doesn't have to.

2. **12-person company = peak Numin tier.** Her headcount is exactly the Solo/Pro zone where we're most cost-effective. Hiring a dedicated CS/onboarding person is $80K+ loaded. Numin Pro at $200/mo is 1/40th of that, and it works 24/7.

3. **Calendly pedigree.** She scaled Calendly's growth. She knows the operational pain of trying to support a fast-growing user base with a small team. Numin solves the same problem they solved internally with better tooling.

## Cold DM (3 sentences, references her post)

"Hey Sarah — your point about the first 24h needing a human really resonated. We built Numin so that the 24h is handled by AI agents (inbox triage, ticket routing, onboarding flows) while your team focuses on the high-touch moments. Want me to show you what that looks like for a 12-person content team?"

## Follow-up angles (if no response in 7 days)

1. **Share a result from a similar founder** — "Just closed a Series A?" "We helped [similar founder] cut their onboarding response time from 4 hours to 8 minutes. Happy to share how."

2. **Tag her post** — "Wrote a longer take on this if useful: [link]"

3. **Reach out via mutual connection** — Find a Calendly or Numin mutual and ask for an intro

## Risks / concerns

- **Timing**: She just posted 2 days ago, so the topic is fresh in her mind — GOOD window
- **Saturation risk**: If she's getting 50 DMs reacting to that post, we need a hook that's NOT just "agreed with your post" — our DM should land on the operational specifics
- **Don't lead with AI replacing humans** — her whole thesis is the opposite. Lead with "amplifying humans in the critical moments"
- **No clear trigger event**: She didn't announce a raise, hire, or pivot. We're interrupting based on a LinkedIn post, which has lower conversion than trigger-based outreach

### Claude Code

# Research Report: Sarah Chen

## Reasons Numin may resonate
1. 12-person team at Series A stage — typical fit for our Pro tier
2. Background in growth/scaling — understands operational pain
3. Recent post discusses onboarding challenges

## Cold DM
"Saw your LinkedIn post about onboarding. Numin does AI-driven onboarding. Want a 15-min demo?"

## Follow-up angles
1. Follow up with a relevant case study
2. Engage with her next LinkedIn post
3. Try a different channel (email, Twitter)

## Risks
- Low response rate on cold DMs in general
- No warm intro available
- Timing unclear

### ChatGPT / GPT-4

# Research and Outreach Report: Sarah Chen

## Executive Summary
Sarah Chen is the founder/leader of Bloomloop, a Series A content operations platform. Her recent LinkedIn activity suggests she's actively thinking about onboarding and the role of human touch in B2B SaaS. This represents a strong potential opportunity for Numin.

## Why Numin Resonates with Sarah

### Alignment with Public Statements
Sarah's recent post about "the first 24 hours" of onboarding is highly relevant to Numin's value proposition. Our AI employee platform is specifically designed to handle the operational heavy lifting during critical early-customer moments.

### Company Stage Considerations
At 12 people, Bloomloop is in the size range that benefits most from Numin's Pro tier, which provides comprehensive agent coverage without requiring additional headcount.

### Background and Experience
Her experience at Calendly gives her insight into the operational challenges of scaling a SaaS business.

## Cold DM Draft (3 sentences)

"Hi Sarah! Loved your recent post about the importance of human-in-the-loop onboarding. At Numin, we've built AI agents specifically designed to handle the operational aspects of onboarding while preserving the human moments that matter. Would love to share how some similar Series A companies are using Numin to scale without scaling headcount. 15 minutes next week?"

## Follow-up Strategy

### Day 3 Follow-up
If no response, send a brief follow-up that adds value — perhaps a relevant case study or a comment on a new post of hers.

### Day 7 Follow-up
Try a different angle — perhaps a light comment on a recent LinkedIn post, then re-engage with a different value proposition.

### Day 14 Final Outreach
A more direct ask, possibly via email if her email is findable, or via a mutual connection.

## Risk Assessment

- **Response Rate Risk**: Cold LinkedIn DMs typically have low response rates (1-5%)
- **Competition Risk**: She may be in active conversations with competitors
- **Timing Risk**: Her post was 2 days ago, which may be past the optimal engagement window
- **Fit Risk**: Despite alignment, Numin's pricing may not match her current budget cycle

## Recommended Next Steps

1. Send the cold DM as drafted
2. Set up tracking for response within 7 days
3. If no response, execute the follow-up sequence
4. Update CRM with all engagement data

## Evaluation rubric

| Criterion | Weight | Description |
|---|---|---|
| Insight quality (reasons WHY) | 25% | Specific to her, not generic |
| DM quality (3 sentences, references post) | 20% | Specific, personalized, on-brief |
| Follow-up angles | 20% | Real strategies, not template |
| Risk flagging | 25% | Catches genuine risks about the approach |
| Output structure | 10% | Clear, scannable, professional |
