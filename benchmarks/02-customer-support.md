# Benchmark 2: Customer Support Response

## Prompt

```
You're a customer support agent for Numin, an AI employee platform.

A customer emails you:

"Hi, I'm on the Solo plan ($50/mo). I just got my credit usage alert that I'm at 80% of my monthly credits
and it's only the 15th of the month. This is way faster than I expected. I'm using Numin for inbox triage
mostly. Is there a way to either (a) get more credits this month without upgrading to Pro, or (b) reduce my
credit usage without losing the agent functionality I rely on? I'd really rather not pay $200/mo for Pro
right now but the agent is genuinely useful for my workflow. Please help."

Write a customer support email response that:
- Acknowledges their concern
- Gives them 2-3 concrete options (not just one)
- Explains each option's tradeoff honestly
- Includes pricing or credit info where relevant
- Doesn't oversell or pressure them
- Sounds like a real person, not a chatbot
- Stays under 250 words
```

## Outputs

### Numin (Zora / Hermes Agent Stack)

Subject: Re: Credit usage — a few options

Hey,

Thanks for reaching out, and totally get the frustration — you signed up for a specific use case and shouldn't feel like you're burning through credits faster than expected.

A few options, in order of effort:

1. **Optimize your inbox triage prompts.** Solo customers running heavy email workflows often see big savings by adding explicit constraints like "only flag emails from these 5 senders" or "summarize low-priority items into a daily digest instead of replying individually." Most users cut 30-40% of credit use just by tightening the prompt.

2. **Top up with a credit pack.** $20 gets you another 500K tokens that roll over 12 months. No upgrade, no commitment. Use it as a buffer while you optimize.

3. **Switch to off-hours mode.** You can configure Numin to only run inbox triage on a schedule (e.g., 9am, 12pm, 4pm) instead of real-time. Drops usage significantly without losing the daily summary.

If none of that fits, happy to hop on a 10-min call to look at your specific usage and find the actual culprit. We don't want you paying for credits you're not getting value from.

— Numin support

### Claude Code

Subject: Re: Credit usage

A few things you can do:

1. Top up: $20 for 500K extra tokens, no plan change.
2. Optimize prompts: tighter triage rules reduce credit use ~30%.
3. Schedule runs: set inbox triage to specific times instead of real-time.

If usage stays high after these, the Pro plan ($200/mo) gives 500K credits included.

Reply if you want a 1:1 audit of your current usage.

### ChatGPT / GPT-4

Subject: Happy to help with your credit usage!

Hi there,

Thank you so much for reaching out — and I completely understand your concern! Running out of credits earlier than expected can definitely be frustrating, especially when you're getting real value from the platform.

I'd love to help you explore a few different options that might work for your situation:

**Option 1: Credit Top-Up** — You can purchase additional credits à la carte for $20 (500K tokens). These credits roll over for 12 months, so you won't lose them!

**Option 2: Workflow Optimization** — Many of our Solo customers find that refining their agent's prompts can dramatically reduce credit consumption. For inbox triage specifically, batching operations or using digest modes can cut usage by 30-50%.

**Option 3: Plan Discussion** — While I understand the Pro plan ($200/mo) may not fit your current budget, I'd be happy to walk you through exactly what additional value it provides for someone with your specific use case.

Please let me know which direction you'd like to explore, and I'm here to help every step of the way!

Warm regards,
Numin Support Team

## Evaluation rubric

| Criterion | Weight | Description |
|---|---|---|
| Acknowledges concern | 10% | Validates their frustration before pitching |
| Multiple concrete options | 20% | 2-3 real options, not just upsell |
| Honest tradeoffs | 20% | Doesn't hide downsides of each option |
| Concrete details (price/credit numbers) | 15% | Specific numbers, not vague |
| Anti-pressure tone | 15% | Doesn't oversell or hard-sell Pro |
| Human voice | 10% | Sounds like a real person, not template |
| Word count constraint | 10% | Stays under 250 words |
