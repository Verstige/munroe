# Skill Rewrite Spec — crawl4ai Migration

**Author:** Zora · **Date:** July 15, 2026 · **Status:** Awaiting Julylan approval

---

## Goal

Replace paid-API / custom-scraper implementations in 4 web-facing skills with **crawl4ai**, the open-source crawler that ships in every Munro Code box. Result: zero per-fetch API cost, no rate limits, JS rendering, anti-bot handling.

**Affected skills:**

| # | Skill | Today's likely implementation | What we're changing |
|---|---|---|---|
| 1 | `summarize` | Paid summarizer API (or fragile curl + LLM) | crawl4ai fetch → markdown → local LLM summary |
| 2 | `feed-diet` | Custom RSS parser + HTML strip | crawl4ai crawler with RSS feed list as seed |
| 3 | `youtube-watcher` | YouTube transcript API (third-party paid) | crawl4ai fetches transcript page + parses |
| 4 | `listing-swarm` | Custom form filler | crawl4ai as engine for fetch + JS form handling |

---

## Shared infrastructure

All 4 skills use the same wrapper:

```python
# ~/hermes/skills/_common/crawl4ai_helper.py
import asyncio
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig

DEFAULT_BROWSER = BrowserConfig(
    browser_type="chromium",
    headless=True,
    enable_stealth=True,  # required for protected sites
)

DEFAULT_CRAWL = CrawlerRunConfig(
    page_timeout=20000,
    delay_before_return_html=1.5,
    remove_overlay_elements=True,  # cookie banners, popups
)

async def fetch_markdown(url: str, **overrides) -> str:
    """Fetch a URL and return clean markdown. Raises on failure."""
    config = CrawlerRunConfig(**{**DEFAULT_CRAWL.dict(), **overrides})
    async with AsyncWebCrawler(config=DEFAULT_BROWSER) as crawler:
        result = await crawler.arun(url=url, config=config)
        if not result.success:
            raise FetchError(result.error_message or "unknown")
        return result.markdown

async def fetch_many(urls: list[str], **overrides) -> list[dict]:
    """Fetch multiple URLs in parallel. Returns [{url, markdown, success}]."""
    config = CrawlerRunConfig(**{**DEFAULT_CRAWL.dict(), **overrides})
    async with AsyncWebCrawler(config=DEFAULT_BROWSER) as crawler:
        results = await crawler.arun_many(urls=urls, config=config)
        return [
            {"url": r.url, "markdown": r.markdown, "success": r.success}
            for r in results
        ]

def fetch_sync(url: str, **overrides) -> str:
    """Synchronous wrapper for skills that don't use async."""
    return asyncio.run(fetch_markdown(url, **overrides))
```

---

## Skill 1: `summarize`

### Today's spec (probably)

- Accepts a URL, file path, or local path
- Calls a paid summarizer API (e.g., Anthropic's prompt caching, OpenAI, or a hosted service like Smmry)
- Returns a 2-3 sentence summary

### Rewrite

```python
# summarize/SKILL.md updated trigger:
# When user provides a URL → fetch with crawl4ai → summarize with local LLM
# When user provides a file path → read locally (unchanged)
# When user provides local file or PDF → use existing converters

import sys
sys.path.insert(0, '~/hermes/skills/_common')
from crawl4ai_helper import fetch_sync

def summarize_url(url: str, max_words: int = 200) -> str:
    """Fetch URL via crawl4ai, then summarize via local LLM."""
    md = fetch_sync(url)
    # Strip markdown for token efficiency
    text = re.sub(r'[#*`>\[\]]', '', md)
    text = re.sub(r'\n{3,}', '\n\n', text).strip()
    # Truncate to ~6K tokens to fit local LLM context
    text = text[:24000]
    return call_local_llm(
        f"Summarize the following content in {max_words} words or less. "
        f"Lead with the main claim, then the 3 most important facts, "
        f"then what's actionable:\n\n{text}"
    )
```

### What changes

- **Cost:** paid API call → $0 (crawl4ai + local LLM)
- **Latency:** unchanged (crawl4ai is ~1s, local LLM is comparable)
- **Coverage:** JS-rendered pages now work
- **API:** same input/output contract

### Migration risk

Low. Pure replacement, same skill behavior, just cheaper.

---

## Skill 2: `feed-diet`

### Today's spec

- Audits the user's HN + RSS reading
- Custom HTML stripping
- Categorizes by topic
- Generates ASCII charts

### Rewrite

```python
# Use crawl4ai's deep-crawl mode to visit each feed entry's source page,
# extract category metadata from the rendered DOM, then aggregate.

from crawl4ai_helper import fetch_many
import feedparser

def audit_feeds(rss_urls: list[str]) -> dict:
    # Step 1: parse RSS to get article URLs (existing feedparser)
    articles = []
    for url in rss_urls:
        feed = feedparser.parse(url)
        for entry in feed.entries[:20]:  # cap per feed
            articles.append({"title": entry.title, "url": entry.link})

    # Step 2: deep-fetch each article's page for category metadata
    article_urls = [a["url"] for a in articles]
    fetched = fetch_many(article_urls)
    
    # Step 3: extract categories from rendered content (existing logic)
    # ...
    return aggregated_report
```

### What changes

- **Cost:** $0 (was free or had rate limits from RSS proxy)
- **Quality:** better category extraction because we get the rendered DOM, not stripped RSS text
- **API:** same input/output contract

### Migration risk

Low. Pure replacement.

---

## Skill 3: `youtube-watcher`

### Today's spec

- Fetches YouTube video transcripts
- Today's implementation likely uses a paid transcript API (e.g., youtube-transcript-api which has rate limits, or a hosted service)

### Rewrite

```python
# YouTube's transcript page is server-rendered HTML with a JSON blob
# containing the timed transcript. crawl4ai handles the render,
# we parse the JSON blob from the markdown.

from crawl4ai_helper import fetch_sync
import re, json

def fetch_youtube_transcript(video_url: str) -> str:
    md = fetch_sync(video_url)
    # Extract ytInitialPlayerResponse JSON from the markdown
    match = re.search(r'ytInitialPlayerResponse\s*=\s*(\{.+?\});', md, re.DOTALL)
    if not match:
        # Fallback: get the video description and treat it as the transcript
        match = re.search(r'"shortDescription":"([^"]+)"', md)
        if match:
            return match.group(1).replace('\\n', '\n')
        raise FetchError("Could not extract transcript")
    
    data = json.loads(match.group(1))
    captions = data.get('captions', {}).get('playerCaptionsTracklistRenderer', {}).get('captionTracks', [])
    if not captions:
        raise FetchError("No captions available for this video")
    
    # Fetch the actual caption track (URL-based, no JS needed)
    caption_url = captions[0]['baseUrl']
    caption_xml = requests.get(caption_url).text
    # Parse the timed text into a flat transcript
    return parse_caption_xml(caption_xml)
```

### What changes

- **Cost:** $0 (was a paid or rate-limited third-party API)
- **Reliability:** more reliable for JS-required pages
- **API:** same input/output contract

### Migration risk

Medium. The YouTube transcript extraction is fragile; if YouTube changes their HTML structure, this breaks. **Mitigation:** keep a fallback to the existing implementation behind a feature flag (`MUNRO_USE_CRAWL4AI_TRANSCRIPT=1`).

---

## Skill 4: `listing-swarm`

### Today's spec

- Submits the user's product to 70+ AI directories
- Form-filling automation
- Likely uses a custom form-filling script + 2captcha for captchas

### Rewrite

```python
# Use crawl4ai for navigation + JS form interaction,
# chrome-relay when the user's browser session is needed (e.g., for login).

from crawl4ai_helper import fetch_sync

async def submit_to_directory(directory_url: str, product_data: dict) -> bool:
    # Step 1: fetch the submission page (crawl4ai renders JS)
    config = CrawlerRunConfig(
        js_code=["document.querySelectorAll('button, a').forEach(b => b.click())"],
        wait_for="js:() => document.querySelector('form') !== null",
    )
    page = await fetch_markdown(directory_url, config=config)
    
    # Step 2: identify form fields from rendered DOM
    fields = parse_form_fields(page)
    
    # Step 3: fill them in (this is the hard part — still needs custom code)
    # For captcha-protected forms, fall back to chrome-relay for human-in-loop
    # ...
```

### What changes

- **Cost:** $0 (was 2captcha per-submission)
- **Coverage:** more directories supported because crawl4ai handles modern SPAs
- **API:** same input/output contract

### Migration risk

High. The form-filling logic itself is the hard part; crawl4ai helps with rendering but the actual filling is still custom. **Mitigation:** keep the old implementation as a fallback, gate behind `MUNRO_USE_CRAWL4AI_LISTING=1`, ship to 10 customers first, expand if stable.

---

## Migration order

Recommended sequencing based on risk × impact:

1. **`summarize`** — lowest risk, highest impact (used daily by every customer). **Ship first.**
2. **`feed-diet`** — low risk, low-medium impact (newer skill, fewer users). **Ship second.**
3. **`youtube-watcher`** — medium risk, high impact (everyone watches YouTube). **Ship third with feature flag.**
4. **`listing-swarm`** — high risk, medium impact (niche use case). **Ship fourth, gated behind flag, expand gradually.**

---

## What I need from Julylan to start

For each skill:
- [ ] Read the current SKILL.md
- [ ] Confirm the current implementation matches my assumption (paid API vs. custom scraper)
- [ ] Approve the rewrite spec
- [ ] If the current implementation differs significantly, share the relevant code

For the rollout:
- [ ] Confirm the rollout order (summarize → feed-diet → youtube-watcher → listing-swarm)
- [ ] Confirm feature-flag approach for the medium/high-risk rewrites
- [ ] Approve the test plan (run on a real customer box before pushing to all)

---

## What this saves

**Per customer per month, assuming average usage:**

| Skill | Today (per-call cost) | After (cost) | Monthly saving |
|---|---|---|---|
| `summarize` | ~$0.005 × 200 calls = $1 | $0 | **$1** |
| `feed-diet` | $0 (free) | $0 | — |
| `youtube-watcher` | ~$0.01 × 50 calls = $0.50 | $0 | **$0.50** |
| `listing-swarm` | ~$0.05 × 30 submissions = $1.50 | $0 | **$1.50** |

**Per customer per month:** ~$3 saved in API costs.

**At 100 customers:** $300/month in margin.
**At 1,000 customers:** $3,000/month in margin.

Plus the strategic unlock: new skills (competitor monitor, lead enrichment, research digest) become practical without per-call costs. **These become tier differentiators** for the Scale and Enterprise plans.

---

_Last updated: July 15, 2026. Awaiting approval._