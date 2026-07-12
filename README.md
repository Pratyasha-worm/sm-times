# SM Times — V2

A private, institutional-grade daily financial intelligence newspaper.
Designed for central bankers, investors, finance professionals, and macro analysts.

---

## Quick Start

```bash
open index.html          # macOS — opens the newspaper directly in your browser
```

No server, no build step, no dependencies.

---

## File Structure

```
sm-times/
├── index.html        ← Full newspaper (UI + CSS + JS — all in one file)
├── data.js           ← Current edition content (auto-written by ingest.py)
├── portfolio.js      ← Your portfolio config for relevance tagging (optional)
├── ingest.py         ← Ingestion pipeline — fetches live data, writes data.js
├── setup_cron.sh     ← Installs 12-hour cron job for auto-refresh
└── README.md         ← This file
```

---

## Publishing a New Edition

### Automated (recommended)

Run the ingestion pipeline manually:

```bash
# Rule-based summaries (no API key needed)
python3 ingest.py

# AI-enriched summaries (Gemini 1.5 Flash)
export GEMINI_API_KEY="your-key-here"
python3 ingest.py

# Preview without overwriting data.js
python3 ingest.py --dry-run

# Rebuild only one section
python3 ingest.py --section rbi-watch

# Validate existing data.js structure
python3 ingest.py --validate-only
```

Then reload `index.html` in your browser — the Refresh button will detect the
new timestamp and prompt you to reload.

### Manual (hand-curated editions)

1. Open `data.js`
2. Update `EDITION.date`, `EDITION.dateISO`, `EDITION.lastUpdated`
3. Edit `stories[]` arrays in each section
4. Reload the browser

---

## Auto-Refresh (12-hour cron)

Install a cron job that runs the ingestion pipeline at **06:00 IST** and
**18:00 IST** every day, automatically overwriting `data.js`:

```bash
chmod +x setup_cron.sh
./setup_cron.sh

# To remove the cron job
./setup_cron.sh --remove

# View scheduled jobs
crontab -l

# View ingestion logs
tail -f ingest.log
```

**How the in-page Refresh button works (V2):**
- On page load, the current `EDITION.lastUpdated` timestamp is recorded.
- When you press Refresh, the button fetches `data.js` fresh (cache-busted)
  and compares the `lastUpdated` timestamp.
- If a newer edition exists, it prompts you to reload the page.
- If `data.js` is served via `file://` (direct browser open), the button
  falls back to a simple page reload, which picks up the latest file.

---

## Portfolio Personalization

Create or edit `portfolio.js`:

```js
const PORTFOLIO = {
  equities: ["HDFC Bank", "Infosys", "Reliance"],
  sectors:  ["Banking", "Technology", "Energy"],
  themes:   ["AI", "Payments", "Renewables"]
};
```

Stories matching any tag, headline keyword, or summary keyword from your
portfolio will automatically receive a **⭐ Portfolio Relevant** badge.

### Privacy guarantee (hard constraint):
- Your actual holdings, tickers, and fund names are **never** rendered
  in the DOM as visible text — not even in tooltips or `data-` attributes.
- The badge text is always the generic string "Portfolio Relevant".
- To verify: open DevTools → Elements → search the DOM for any value
  in your `PORTFOLIO` object. None should appear as visible text.
- `portfolio.js` is loaded via `<script onerror>` — the page works
  fully even if the file doesn't exist.

---

## Ingestion Sources

**Status verified 2026-07-12 by live dry-run** (`python3 ingest.py --dry-run --no-ai`) — this table reflects what actually fetches successfully today, not what was originally planned. RBI, SEBI, IMF, BIS, Business Standard, MoneyControl, and Financial Express all returned HTTP errors (403/404/410) in that run — either blocking non-browser requests or the feed no longer exists — and their URLs have been removed from `SOURCES` in `ingest.py` (see the comment above `SOURCES` for the exact list and why). No browser-UA spoofing was used to work around the 403s; that circumvents access controls those sites put up on purpose. Re-adding a source requires an actual working feed URL, not a guess.

| Section | Status | Source |
|---------|--------|--------|
| Global Macro | ⚠️ No working source | ET top-stories fetches but no items pass the editorial keyword filter |
| RBI Watch | ⚠️ No working source | Same as above — RBI's own feeds are 403 |
| Payments & FinTech | ✅ Working | ET FinTech feed; NPCI RSS also configured (confirmed alive) |
| Banking | ✅ Working | ET Banking feed |
| Markets | ✅ Working | ET Markets feed |
| Fixed Income | ✅ Working | Mint (Livemint) markets feed |
| Commodities | ⚠️ No source configured | Previously MoneyControl only — now dead, nothing left |
| Technology | ✅ Working | ET Tech feed |
| Energy | ⚠️ No working source | ET Energy feed fetches but returns no items |
| VC & Startups | ✅ Working | Inc42 |
| Regulation & Law | ⚠️ No source configured | Previously SEBI only — now dead, nothing left |
| Politics That Matters | ⚠️ No working source | ET top-stories fetches but no items pass the filter |
| IMF · World Bank · BIS · OECD | ⚠️ No source configured | Previously IMF + BIS only — both dead |
| Research Corner | Degrades gracefully | Tries BIS + IMF paper feeds (currently dead); falls back to a static pointer to bis.org/imf.org rather than fabricating |
| Executive Intelligence | Degrades gracefully | ET earnings feed; falls back to a static placeholder if nothing matches |

**7 sections currently have no automated path to real content**: Global Macro, RBI Watch, Commodities, Energy, Regulation & Law, Politics That Matters, IMF · World Bank · BIS · OECD. Running the pipeline for real today would omit all seven from the generated edition (the run prints a loud `[SUMMARY]` block listing exactly which ones and why — it never fails silently). Until working feeds are found for these, keep curating them by hand in `data.js`.

### Editorial filters applied automatically:
- ✗ Celebrity news, lifestyle, sports, social media drama
- ✗ Political gossip, cabinet reshuffle speculation
- ✗ Clickbait headlines (shocking, outrage, war of words, viral…)
- ✓ Stories must contain at least one section-relevant keyword
- ✓ If a source is unreachable, section is left shorter — never fabricated

### AI enrichment (optional, Gemini 1.5 Flash):
When `GEMINI_API_KEY` is set, each article is sent to Gemini with a
strict editorial prompt to generate:
- `summary` — one-line, factual, max 160 chars
- `whyItMatters` — 2–3 sentences for finance professionals
- `keyNumbers[]` — figures extracted from the article
- `marketImpact`, `indiaImpact`, `globalImpact` — analytical context
- `tags[]` — topic classification

If Gemini declines a story (signals `skip: true`), it is excluded.

**Without a key, rule-based mode is genuinely basic** — verified by live
dry-run, not just reading the code. `marketImpact`, `indiaImpact`, and
`globalImpact` are the same boilerplate string for every story
(`"Refer to original source for market impact analysis."` etc.) —
there's no real analysis in rule-based mode. `whyItMatters` is just the
headline pasted in front of a summary excerpt, not genuine "why it
matters" reasoning. This is well below the editorial bar of the
hand-written V1 stories in the current `data.js`. `keyNumbers[]`
extraction was fixed 2026-07-12 (the old regex had no word boundary
around `Rs`, so it sometimes matched inside unrelated words and
grabbed 40 characters of trailing prose instead of a real figure —
verified against real fetched articles, not synthetic test cases).
It now only returns a figure if a real number is actually present.

**Bottom line: don't run this pipeline against the live `data.js` without
a `GEMINI_API_KEY`** — the output would be a real quality regression
from the current hand-curated edition.

---

## Sections

| # | Section | Source (verified 2026-07-12) |
|---|---------|--------|
| 01 | Global Macro | ⚠️ Hand-curate — no source clears the editorial filter |
| 02 | RBI Watch | ⚠️ Hand-curate — RBI's own feeds are 403 |
| 03 | Payments & FinTech | ✅ Automated (ET + NPCI RSS) |
| 04 | Banking | ✅ Automated (ET RSS) |
| 05 | Markets | ✅ Automated (ET RSS) |
| 06 | Fixed Income | ✅ Automated (Mint RSS) |
| 07 | Commodities | ⚠️ Hand-curate — no source configured |
| 08 | Technology | ✅ Automated (ET RSS) |
| 09 | Energy | ⚠️ Hand-curate — feed returns no items |
| 10 | VC & Startups | ✅ Automated (Inc42 RSS) |
| 11 | Regulation & Law | ⚠️ Hand-curate — no source configured |
| 12 | Politics That Matters | ⚠️ Hand-curate — no source clears the editorial filter |
| 13 | IMF · World Bank · BIS · OECD | ⚠️ Hand-curate — no source configured |
| 14 | Industry Deep Dive | Rotating placeholder — **hand-curate** |
| 15 | Research Corner | Degrades gracefully (BIS/IMF papers dead → static fallback pointer) |
| 16 | Executive Intelligence | Automated (ET Earnings RSS), static fallback if empty |
| 17 | Book Recommendation | Rotating (3 books in `ingest.py`) |
| 18 | Quote of the Day | Rotating (14 quotes in `ingest.py`) |
| — | Economic Calendar | Static (update monthly in `ingest.py`) |
| — | Glossary | Static (20 terms — edit in `ingest.py`) |
| — | Calculations Reference | Static (6 formulas — edit in `ingest.py`) |

**7 of 18 sections need a working feed before the pipeline can automate
them** (see the Ingestion Sources table above for exactly which and
why). Until then, keep editing those sections' `stories[]` arrays by
hand in `data.js` — running `ingest.py` will correctly leave them out
rather than inventing content, and will print a loud `[SUMMARY]` line
naming every omitted section.

---

## Interactive Features

| Feature | How to use |
|---------|-----------|
| **Search** | Press `/` or click 🔍 — full-text across all sections |
| **Highlighting** | Select any text → toolbar → yellow / blue / green |
| **Annotations** | Select text → ✍️ Note → type → Save |
| **Notes Panel** | Click ✍️ Notes button → view all, export as Markdown |
| **Portfolio Badge** | Stories matching `portfolio.js` show ⭐ badge |
| **Refresh** | Click ↺ Refresh — detects new edition, prompts reload |
| **Print / PDF** | Click 🖨️ or Cmd+P — clean newspaper layout |

---

## Design System

- **Fonts**: Playfair Display (headlines) · Source Serif 4 (body) · JetBrains Mono (numbers)
- **Palette**: Cream `#FAFAF8` · Gold `#9A7523` · Navy `#1E3A5F` · Near-black `#1A1A1A`
- **Layout**: Newspaper-style multi-column · sticky masthead · sidebar TOC

---

## Troubleshooting

**Page loads but shows no stories:**
→ Check browser console for JS errors
→ Verify `data.js` exists and starts with `const EDITION = {`

**Ingest script fails on a section:**
→ That RSS feed may be temporarily down — run again later
→ The section will be omitted rather than showing fabricated content

**Portfolio badges not appearing:**
→ Check `portfolio.js` exists and starts with `const PORTFOLIO = {`
→ Verify story `tags[]` overlap with your portfolio terms
→ Open browser DevTools → Console — no error should appear

**Print layout broken:**
→ In Chrome: Print → More settings → disable "Headers and footers"
→ Set paper to A4, margins to Minimum

---

## Deploying (Netlify / Vercel, private repo)

This repo is hosted from a **private** GitHub repo and deployed via
Netlify or Vercel — not GitHub Pages, since Pages would require the
repo (including `data.js`) to be public. `portfolio.js` is excluded
from git entirely via `.gitignore` and never leaves your machine.

1. Create a **private** repo on GitHub (or GitLab/Bitbucket) and push:
   ```bash
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-private-repo-url>
   git push -u origin main
   ```
2. On [netlify.com](https://netlify.com) or [vercel.com](https://vercel.com):
   "Add new site/project" → "Import an existing project" → authorize
   access to the private repo → select it.
3. Build settings: leave the build command **empty** and set the
   publish/output directory to `.` (repo root) — this is a static
   site with no build step.
4. Deploy. You'll get a `*.netlify.app` or `*.vercel.app` URL
   immediately; both platforms support adding a custom domain for
   free under "Domain settings."
5. After you have a real URL, update the placeholder domain in
   `robots.txt` and `sitemap.xml` (`YOUR-DEPLOYED-DOMAIN`) and push
   again.
6. `portfolio.js` won't exist on the deployed site (it's gitignored)
   — the page works fully without it, per the optional-load guard in
   `index.html`. To personalize your own deployed copy, upload
   `portfolio.js` directly via your host's file manager / dashboard,
   or a separate private mechanism — never commit it.

**Why not GitHub Pages:** Pages serves directly from the repo, so the
repo has to be public unless you pay for GitHub Enterprise. Netlify
and Vercel both deploy from private repos on their free tiers, which
keeps `data.js` and the rest of the source out of public view while
still serving the built page publicly.

---

*SM Times — Institutional-Grade Financial Intelligence*
*V2 — July 2026*
