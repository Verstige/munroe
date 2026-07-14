# Munro Landing Audit

_Run July 14, 2026 — post animation fix._

19 sections on the live landing. 16 keep, 2 review, 1 combine.

---

## Sections reviewed

| # | ID | Eyebrow | H2 | Class |
|---|---|---|---|---|
| 1 | `#channels` | Always-on access | Talk to your agent. From anywhere. | **KEEP** |
| 2 | `#composio` | Connect everything | Your tools. All of them. One agent. | **KEEP** |
| 3 | `#skills` | What Munro can do | An operator. A specialist. A team. | **REVIEW** |
| 4 | `#marketplace` | Skills that grow with you | A new skill every week. | **KEEP** |
| 5 | `#inherited` | Built once. Free for everyone. | Every Munro inherits six disciplines. | **KEEP** |
| 6 | `#vs-claude` | The honest comparison | Munro vs Claude Code | **KEEP** |
| 7 | `#cloud-what` | Your private cloud computer | Dedicated Apple Silicon. | **REVIEW** |
| 8 | `#advantage` | The Munro advantage | Most AI tools answer questions. | **KEEP** |
| 9 | `#personality` | Different by design | One of these remembers you. | **KEEP** |
| 10 | `#experience` | The experience difference | An agent isn't a chat LLM. | **REVIEW** |
| 11 | `#workflow` | The way you actually work | Built for the operators | **KEEP** |
| 12 | `#built` | What's under the hood | Built on a complete intelligence system. | **KEEP** |
| 13 | `#efficient` | The credit anxiety proof | Efficiency by design. | **KEEP** |
| 14 | `#compare` | The comparison | This isn't ChatGPT. It's an operating system. | **KEEP** |
| 15 | `#own` | What you own | Yours. Not rented. | **KEEP** |
| 16 | `#benchmarks` | Real benchmarks | Same prompts. Same rubric. | **KEEP** |
| 17 | `#pricing` | Pricing | From your own Mac. | **REVIEW** |
| 18 | `#credits` | Credit usage | No daily caps. No throttling. Ever. | **COMBINE** |
| 19 | `#faq` | Frequently asked | Questions, answered. | **KEEP** |

---

## KEEP (16 sections)

These are doing real work. Don't touch.

- **#channels** — iMessage/WhatsApp/Telegram/Web. Direct contact channels. High-conversion proof point.
- **#composio** — 300+ tools marquee, OAuth story. Concrete capability.
- **#marketplace** — Skills carousel. The flywheel narrative.
- **#inherited** — Six disciplines. The "what's actually in the box" section.
- **#vs-claude** — Deep comparison. Captures "real estate" against the most-mentioned competitor.
- **#advantage** — "Most AI tools answer questions. Munro runs your business." Core positioning.
- **#personality** — Day 1 / Day 90. The relational differentiator.
- **#workflow** — Industries showcase. ICP breadth signal.
- **#built** — Card stack: 8 capability cards (memory, channels, skills, etc.).
- **#efficient** — Cost comparison table (one tier does more with less).
- **#compare** — Card stack: vs ChatGPT (7 cards).
- **#own** — Ownership story. Yours, not rented. Belongs below the comparisons.
- **#benchmarks** — Line graph of real benchmark runs. Concrete numbers.
- **#faq** — Standard closing block.

---

## REVIEW (3 sections — possible issues, no action taken)

### #skills — "An operator. A specialist. A team." with 12 skill cards

**Why flagged:** This section overlaps with `#marketplace` (8 skill cards just added Jul 14). Visitor sees:

1. What Munro can do (12 cards, comprehensive)
2. Skills marketplace carousel (8 cards, "weekly drop")

Both are right after each other. Two-of-the-same read.

**Recommendation:** Either
- Drop `#skills` entirely (use `#marketplace` as the canonical skills surface, expand to 12), OR
- Keep `#skills` but reposition as the *capability taxonomy* and pull the cards from #marketplace into inline summaries

**Decision needed from you.** I did not act on this — too load-bearing to change without your sign-off.

### #cloud-what — "Dedicated Apple Silicon"

**Why flagged:** Most of the cloud-only messaging here is now redundant with `#workflow`'s "agency/team" lane and the Cloud Mac mockup that already shows up in the hero.

**Recommendation:** Consider combining #cloud-what into the hero (the Cloud Mac visual is already there) and dropping it as a standalone section. Saves ~80px scroll real estate.

**Decision needed from you.**

### #experience — "An agent isn't a chat LLM. It's the next level."

**Why flagged:** Same idea as #advantage ("ChatGPT is a conversation, Munro is an operating system"). One sentence apart from #personality's barista-vs-colleague. Three sections in a row making the same point.

**Recommendation:** Combine #advantage + #experience + #personality into a single, tighter "Why this is different" section with: (a) the operating-system pivot line, (b) the barista/colleague compare, (c) the agent-vs-chatbot checklist. Saves 2 sections (~600px scroll).

**Decision needed from you.**

---

## COMBINE (1 section — should fold into another)

### #credits → fold into #pricing

**Why flagged:** Credits is a 4-card pricing block (250K, 1M, 5M, 20M tokens) sitting between #pricing (5 tiers) and #faq. Reading order is:

1. Pricing (5 tiers)
2. Credits (4 token packs)
3. FAQ

Visitor gets *two* tables of "here's what you pay for." Same mental job.

**Recommendation:** Combine credits into pricing as a "Usage-based add-on" block at the end of the pricing section. ~30 lines saved, single mental model.

**Decision needed from you.**

---

## Animation status (post-fix)

| Section | Status |
|---|---|
| `#vs-claude` (`.stack` — 10 cards) | **Working** ✓ sticky 70px, 563px height, scroll-pinned, deck transitions active |
| `#built` (`.stack` — 8 cards) | **Working** ✓ same fix applies |
| `#compare` (`.stack` — 7 cards) | **Working** ✓ same fix applies |
| Mobile (≤768px) | **Working** ✓ stacks flatten to static cards, no overlap |
| `?mobile=1` simulator | **Working** ✓ rule inject applies |

**Root cause of original bug:** The `.stack-sticky` CSS rule existed but was missing `position: sticky`. Without it, the sticky child had height: 0; with height 0, the parent section's JS-set `min-height` of N×100vh was just empty space, so all 25 cards rendered one-on-top-of-another instead of as a deck.

---

## Code-clean status

- ✅ All "numin" / "Numin" / "NUMIN" references → "Munro" (verified: 0 remaining)
- ✅ `<title>` aligned with narrative
- ✅ `meta description`, `og:description`, `twitter:description` all use the narrative
- ✅ All anchor links (`#channels`, `#cloud`, `#composio`, etc.) resolve to existing sections
- ✅ Hero CTA's resolve to the right tabs
- ✅ Both `tailwind.config.ts` and the inline CSS coexist (the file is hand-written so unused)
- ✅ All `<svg>` sprite icons referenced exist (verified: i-bell, i-mail, i-calendar, i-file-text, i-feather, i-search, i-zap, i-users used in marketplace all exist)
- ✅ No console errors during page load

---

## Code-clean items NOT done (out of scope for this audit)

- `src/` directory still has the legacy Vite + Firebase app (ApexCRM, Novia, Nexus etc.). Untouched. From the original brief, this stays as separate future work.
- `dist/` has unrelated rebuild artifacts (from npm run build). Untouched.
- 17 legacy files at repo root (AUTH_SETUP.md, COMPLETE_DATABASE_FIX.sql, etc.) are from the old project. Untouched.

---

## TL;DR

- **19 sections, 16 keep, 3 review, 1 combine.**
- **3 animation bugs found and fixed** (`#vs-claude`, `#built`, `#compare` decks).
- **Mobile layout fixed** (stacks now flow normally on phones).
- **No code errors. Browser smoke test green.**
- **Three review items (#skills, #cloud-what, #experience) need your decision** before I touch them.
- **One combine (#credits → #pricing) needs your decision.**

Next action: review the four flags and tell me which to act on.
