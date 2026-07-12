#!/usr/bin/env python3
"""
SM Times — Edition Ingestion Pipeline
======================================
Fetches from a curated list of trusted financial sources, optionally
enriches articles with Gemini AI, applies editorial filters, and writes
the result to data.js in the exact format consumed by index.html.

Usage:
    python3 ingest.py                   # full run, Gemini if API key present
    python3 ingest.py --no-ai           # rule-based summaries only
    python3 ingest.py --dry-run         # preview to stdout, don't write data.js
    python3 ingest.py --section rbi-watch  # run only one section

Requirements:
    • Python 3.8+  (no pip installs required in basic mode)
    • Set GEMINI_API_KEY env var for AI-enriched summaries
      export GEMINI_API_KEY="your-key-here"

Principles:
    • Never fabricate a source URL or a statistic.
    • If a source is unreachable, leave that section shorter; don't invent.
    • The output const EDITION = {...} shape must exactly match data.js
      so index.html needs zero changes.
    • lastUpdated is written as ISO-8601 so the in-page refresh button
      can do a lexicographic comparison.
"""

import os
import sys
import json
import time
import re
import datetime
import hashlib
import textwrap
import argparse
import urllib.request
import urllib.error
import urllib.parse
import xml.etree.ElementTree as ET
from typing import Optional, List, Dict, Any

# ─────────────────────────────────────────────────────────────────
# CONFIGURATION
# ─────────────────────────────────────────────────────────────────

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_PATH = os.path.join(SCRIPT_DIR, "data.js")

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
GEMINI_MODEL   = "gemini-1.5-flash-latest"
GEMINI_ENDPOINT = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    f"{GEMINI_MODEL}:generateContent"
)

REQUEST_TIMEOUT  = 12   # seconds per HTTP request
MAX_STORIES_PER_SECTION = 6   # cap to keep page fast
MAX_FEED_ITEMS   = 20   # items to examine per RSS feed before filtering

# Rotating quotes — one chosen per run based on day-of-year
QUOTES = [
    {"text": "Risk comes from not knowing what you're doing.",
     "author": "Warren Buffett",
     "context": "On the nature of investment risk — and why deep knowledge reduces it better than any hedge."},
    {"text": "The first rule of compounding: Never interrupt it unnecessarily.",
     "author": "Charlie Munger",
     "context": "On the most destructive investor behaviour: selling quality compounders too early."},
    {"text": "Markets are constantly in a state of uncertainty and flux, and money is made by discounting the obvious and betting on the unexpected.",
     "author": "George Soros",
     "context": "On contrarian thinking and the pricing of consensus risk."},
    {"text": "The four most dangerous words in investing are: this time it's different.",
     "author": "Sir John Templeton",
     "context": "On the recurring human tendency to rationalise bubbles at their peak."},
    {"text": "The stock market is a device for transferring money from the impatient to the patient.",
     "author": "Warren Buffett",
     "context": "On why time horizon is the most underrated edge in investing."},
    {"text": "In investing, what is comfortable is rarely profitable.",
     "author": "Robert Arnott",
     "context": "On why contrarian positioning, though uncomfortable, drives excess returns."},
    {"text": "It's not whether you're right or wrong, but how much money you make when you're right and how much you lose when you're wrong.",
     "author": "George Soros",
     "context": "On asymmetric payoffs and position sizing."},
    {"text": "The market can stay irrational longer than you can stay solvent.",
     "author": "John Maynard Keynes",
     "context": "On the danger of being right too early — the central lesson of short selling."},
    {"text": "Price is what you pay; value is what you get.",
     "author": "Warren Buffett",
     "context": "The foundational distinction of value investing."},
    {"text": "Volatility is not risk. Loss of purchasing power is risk.",
     "author": "Howard Marks",
     "context": "On why central banks that ignore inflation while targeting stability are making a category error."},
    {"text": "The most important quality for an investor is temperament, not intellect.",
     "author": "Warren Buffett",
     "context": "On why emotional discipline outperforms raw analytical ability over full market cycles."},
    {"text": "An investment in knowledge pays the best interest.",
     "author": "Benjamin Franklin",
     "context": "The oldest and truest compound interest formula."},
    {"text": "I will tell you how to become rich. Close the doors. Be fearful when others are greedy. Be greedy when others are fearful.",
     "author": "Warren Buffett",
     "context": "On contrarian investing and the psychology of market timing."},
    {"text": "Monetary policy is not a panacea.",
     "author": "Raghuram Rajan",
     "context": "Former RBI Governor, on the structural limits of central bank intervention."},
]

BOOK_ROTATION = [
    {"title": "The Price of Time: The Real Story of Interest",
     "author": "Edward Chancellor", "year": 2022,
     "publisher": "Atlantic Monthly Press",
     "category": "Finance / Economic History",
     "summary": "Traces the history of interest rates from Mesopotamia to the present day, arguing that suppression of rates creates misallocation of capital, inflates bubbles, and produces the crises they are meant to prevent.",
     "keyConcept": "Natural Rate of Interest (Wicksellian) — the rate at which savings equal investment. When central banks force rates below this, capital flows to speculation rather than productive investment.",
     "rating": "⭐⭐⭐⭐⭐",
     "buyLink": "https://www.amazon.in/Price-Time-Real-Story-Interest/dp/0802159648"},
    {"title": "Debt: The First 5,000 Years",
     "author": "David Graeber", "year": 2011,
     "publisher": "Melville House",
     "category": "Economic History / Anthropology",
     "summary": "A radical rethinking of debt, money, and markets across human history — arguing that debt has always been a social relationship, not a neutral financial instrument.",
     "keyConcept": "Credit preceded coinage. The first financial instruments were not gold coins but clay tablets recording debts — a fact that upends most textbook monetary history.",
     "rating": "⭐⭐⭐⭐⭐",
     "buyLink": "https://www.amazon.in/Debt-Updated-Expanded-First-Years/dp/1612194192"},
    {"title": "The Intelligent Investor",
     "author": "Benjamin Graham", "year": 1949,
     "publisher": "Harper Business",
     "category": "Investing Classics",
     "summary": "The foundational text of value investing. Graham's concept of Mr. Market and Margin of Safety remain the clearest frameworks for rational capital allocation ever written.",
     "keyConcept": "Margin of Safety — buy securities only when the market price is significantly below intrinsic value. The gap is your protection against being wrong.",
     "rating": "⭐⭐⭐⭐⭐",
     "buyLink": "https://www.amazon.in/Intelligent-Investor-Classic-Text-Revised/dp/0060752610"},
]

# Economic calendar — static for now, update monthly
# (future: pull from investing.com or MOSPI calendar API)
ECONOMIC_CALENDAR = [
    {"date": "Jul 14", "event": "US Retail Sales (Jun)", "country": "US", "importance": "high"},
    {"date": "Jul 15", "event": "China GDP Q2 2026 (Flash)", "country": "CN", "importance": "high"},
    {"date": "Jul 16", "event": "India WPI Inflation (Jun)", "country": "IN", "importance": "medium"},
    {"date": "Jul 17", "event": "Eurozone CPI Final (Jun)", "country": "EU", "importance": "medium"},
    {"date": "Jul 18", "event": "Japan CPI (Jun)", "country": "JP", "importance": "medium"},
    {"date": "Jul 21", "event": "India BSE Options Expiry", "country": "IN", "importance": "medium"},
    {"date": "Jul 23", "event": "HDFC Bank Q1 Detailed Results Call", "country": "IN", "importance": "high"},
    {"date": "Jul 25", "event": "US PCE Deflator (Jun)", "country": "US", "importance": "high"},
    {"date": "Jul 29", "event": "RBI MPC Meeting Begins", "country": "IN", "importance": "critical"},
    {"date": "Aug 1",  "event": "India PMI Manufacturing (Jul)", "country": "IN", "importance": "medium"},
    {"date": "Aug 6",  "event": "RBI MPC Decision + Press Conference", "country": "IN", "importance": "critical"},
    {"date": "Aug 12", "event": "India CPI Inflation (Jul)", "country": "IN", "importance": "high"},
    {"date": "Aug 14", "event": "India IIP (Jun) + WPI (Jul)", "country": "IN", "importance": "high"},
    {"date": "Aug 27", "event": "Fed Jackson Hole Symposium Begins", "country": "US", "importance": "critical"},
    {"date": "Sep 17", "event": "FOMC Meeting (Rate Decision)", "country": "US", "importance": "critical"},
]

# ─────────────────────────────────────────────────────────────────
# SOURCE REGISTRY
# Each entry: (feed_url, source_label, section_ids, keyword_filter)
# keyword_filter: article must contain at least one of these
#   (empty list = accept all from this feed for that section)
# ─────────────────────────────────────────────────────────────────

    # DEAD / BLOCKED SOURCES — pruned 2026-07-12 after a live dry-run showed
    # every one of these returning HTTP errors (not a code bug, the feeds
    # themselves are gone or blocking non-browser requests):
    #   RBI (both circular feeds)  — 403 Forbidden
    #   SEBI rss.xml               — 404 Not Found
    #   Business Standard          — 403 Forbidden
    #   MoneyControl                — 403 Forbidden
    #   Financial Express /feed/    — 410 Gone
    #   IMF news RSS                — 403 Forbidden
    #   BIS working-papers RSS      — 404 Not Found
    # Until a working replacement feed is found for each, rbi-watch,
    # regulation-law, commodities and imf-bis-worldbank will come back
    # empty from fetch_section() and get omitted from the edition — this
    # is surfaced loudly in the end-of-run summary in assemble_edition(),
    # not silently dropped. Do not re-add these URLs without confirming
    # they work again; do not swap in a spoofed browser User-Agent to
    # bypass the 403s — that circumvents access controls the source put
    # up on purpose. Find an actual working, correctly-licensed feed URL
    # for these instead, or leave the sections manually curated.

SOURCES = [
    # ── Economic Times (multiple sections) ───────────────────────
    {
        "url": "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms",
        "label": "Economic Times",
        "source_url": "https://economictimes.indiatimes.com",
        "sections": ["markets"],
        "keywords": ["nifty", "sensex", "fii", "dii", "equity", "stock", "market"],
        "tags": ["Markets", "Equities"],
    },
    {
        "url": "https://economictimes.indiatimes.com/industry/banking/finance/banking/rssfeeds/13358259.cms",
        "label": "Economic Times",
        "source_url": "https://economictimes.indiatimes.com",
        "sections": ["banking"],
        "keywords": ["bank", "npa", "credit", "deposit", "loan", "rbi", "npa", "capital"],
        "tags": ["Banking", "Finance"],
    },
    {
        "url": "https://economictimes.indiatimes.com/industry/banking/finance/rssfeeds/13358259.cms",
        "label": "Economic Times",
        "source_url": "https://economictimes.indiatimes.com",
        "sections": ["payments-fintech"],
        "keywords": ["upi", "npci", "payment", "fintech", "digital", "cbdc", "rupee", "wallet"],
        "tags": ["FinTech", "Payments"],
    },
    # ET Macro/Economy — use the working ET RSS endpoint
    {
        "url": "https://economictimes.indiatimes.com/rssfeedstopstories.cms",
        "label": "Economic Times",
        "source_url": "https://economictimes.indiatimes.com",
        "sections": ["global-macro", "rbi-watch", "politics-matters"],
        "keywords": ["rbi", "inflation", "gdp", "rate", "monetary", "fiscal", "budget", "economy", "reserve bank", "central bank"],
        "tags": ["Macro", "Policy"],
    },
    {
        "url": "https://economictimes.indiatimes.com/tech/technology/rssfeeds/13357270.cms",
        "label": "Economic Times",
        "source_url": "https://economictimes.indiatimes.com",
        "sections": ["technology"],
        "keywords": ["ai", "tech", "cloud", "semiconductor", "software", "startup", "digital"],
        "tags": ["Technology", "AI"],
    },
    {
        "url": "https://economictimes.indiatimes.com/industry/energy/power/rssfeeds/13358286.cms",
        "label": "Economic Times",
        "source_url": "https://economictimes.indiatimes.com",
        "sections": ["energy"],
        "keywords": ["energy", "power", "solar", "wind", "oil", "gas", "renewable", "grid"],
        "tags": ["Energy", "Renewables"],
    },
    # ── Mint ──────────────────────────────────────────────────────
    {
        "url": "https://www.livemint.com/rss/markets",
        "label": "Mint",
        "source_url": "https://www.livemint.com",
        "sections": ["markets", "fixed-income"],
        "keywords": ["market", "bond", "yield", "nifty", "fii", "dii"],
        "tags": ["Markets"],
    },
    # ── Inc42 (India startups) ────────────────────────────────────
    {
        "url": "https://inc42.com/feed/",
        "label": "Inc42",
        "source_url": "https://inc42.com",
        "sections": ["vc-startups"],
        "keywords": ["fund", "raise", "ipo", "startup", "invest", "series", "acquisition", "valuation"],
        "tags": ["Startups", "VC", "India"],
    },
    # ── NPCI ─────────────────────────────────────────────────────
    {
        "url": "https://www.npci.org.in/rss.xml",
        "label": "NPCI",
        "source_url": "https://www.npci.org.in",
        "sections": ["payments-fintech"],
        "keywords": [],
        "tags": ["NPCI", "UPI", "Payments"],
    },
]

# ─────────────────────────────────────────────────────────────────
# EDITORIAL FILTERS
# Articles matching any of these are discarded regardless of source.
# ─────────────────────────────────────────────────────────────────

EDITORIAL_BLOCKLIST = [
    # celebrity / lifestyle
    "bollywood", "celebrity", "wedding", "divorce", "actor", "actress",
    "sports", "cricket", "ipl", "fifa", "olympics",
    # sensationalism
    "shocking", "outrage", "war of words", "slams", "slammed", "blasts",
    "trolled", "viral", "meme", "trends on twitter",
    # politics gossip
    "cabinet reshuffle", "bjp vs congress", "aap vs", "opposition attacks",
    # clickbait patterns
    "you won't believe", "here's why you should", "top 10 reasons",
    "shocking twist", "bombshell",
]

EDITORIAL_REQUIRED_ONE_OF = {
    "global-macro":     ["gdp", "inflation", "rate", "economy", "trade", "fiscal", "monetary", "central bank", "imf", "world bank", "growth", "rbi", "fed", "ecb", "boj"],
    "rbi-watch":        ["rbi", "reserve bank", "mpc", "repo", "monetary policy", "circular", "directive", "payment", "banking regulation", "fsr", "credit policy"],
    "payments-fintech": ["upi", "npci", "payment", "fintech", "cbdc", "digital rupee", "account aggregator", "ondc", "rupay", "iso 20022", "pa", "pg"],
    "banking":          ["bank", "npa", "credit", "deposit", "loan", "capital", "basel", "casa", "nim", "npa", "liquidity"],
    "markets":          ["nifty", "sensex", "equity", "stock", "market", "fii", "dii", "ipo", "sebi", "valuation"],
    "fixed-income":     ["bond", "yield", "gsec", "g-sec", "treasury", "repo", "vrrr", "money market", "debt", "duration", "liquid fund"],
    "commodities":      ["gold", "silver", "oil", "crude", "copper", "commodity", "natural gas", "metal"],
    "technology":       ["ai", "tech", "cloud", "semiconductor", "software", "digital", "automation", "cybersecurity", "openai", "nvidia"],
    "energy":           ["energy", "solar", "wind", "power", "electricity", "oil", "gas", "renewable", "grid", "coal", "hydrogen"],
    "vc-startups":      ["startup", "fund", "raise", "series", "ipo", "valuation", "venture", "acquisition", "unicorn"],
    "regulation-law":   ["sebi", "rbi", "irdai", "regulation", "circular", "law", "court", "nclt", "judgment", "compliance"],
    "politics-matters": ["trade", "tariff", "budget", "fiscal", "economy", "tax", "foreign policy", "trade deal", "investment"],
    "imf-bis-worldbank":["imf", "world bank", "bis", "oecd", "global", "sovereign", "debt", "financial stability"],
}

# ─────────────────────────────────────────────────────────────────
# HTTP UTILITIES
# ─────────────────────────────────────────────────────────────────

def fetch_url(url: str, timeout: int = REQUEST_TIMEOUT) -> Optional[str]:
    """Fetch URL content as text. Returns None on any error — never throws."""
    try:
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": (
                    "SMTimes-Ingest/2.0 "
                    "(institutional financial news aggregator; "
                    "contact: smtimes@example.com)"
                ),
                "Accept": "application/rss+xml, application/xml, text/xml, */*",
            }
        )
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            charset = "utf-8"
            ct = resp.headers.get("Content-Type", "")
            if "charset=" in ct:
                try:
                    charset = ct.split("charset=")[-1].strip().split(";")[0].strip()
                except Exception:
                    pass
            return resp.read().decode(charset, errors="replace")
    except Exception as exc:
        print(f"  [WARN] fetch failed: {url} — {exc}", file=sys.stderr)
        return None


def fetch_rss(url: str) -> List[Dict[str, str]]:
    """
    Parse an RSS/Atom feed URL into a list of dicts:
      {title, description, link, pubDate}
    Returns empty list on any error.
    """
    content = fetch_url(url)
    if not content:
        return []
    try:
        # Strip namespace prefixes that confuse ElementTree
        content_clean = re.sub(r' xmlns[^"]*"[^"]*"', '', content)
        content_clean = re.sub(r'<([a-z]+):[^>]*>', lambda m: f'<{m.group().split(":")[1]}', content_clean)
        root = ET.fromstring(content_clean)
    except ET.ParseError:
        # Try stripping to just ASCII printable range
        content_ascii = re.sub(r'[^\x09\x0A\x0D\x20-\x7E]', '', content)
        try:
            root = ET.fromstring(content_ascii)
        except Exception:
            return []

    items = []
    # RSS 2.0
    for item in root.findall(".//item")[:MAX_FEED_ITEMS]:
        entry = {
            "title":       (item.findtext("title") or "").strip(),
            "description": _clean_html(item.findtext("description") or ""),
            "link":        (item.findtext("link") or "").strip(),
            "pubDate":     (item.findtext("pubDate") or "").strip(),
        }
        if entry["title"]:
            items.append(entry)
    # Atom feeds
    if not items:
        ns = {"atom": "http://www.w3.org/2005/Atom"}
        for entry_el in root.findall("atom:entry", ns)[:MAX_FEED_ITEMS]:
            link_el = entry_el.find("atom:link", ns)
            entry = {
                "title":       (entry_el.findtext("atom:title", namespaces=ns) or "").strip(),
                "description": _clean_html(entry_el.findtext("atom:summary", namespaces=ns) or ""),
                "link":        link_el.get("href", "") if link_el is not None else "",
                "pubDate":     (entry_el.findtext("atom:updated", namespaces=ns) or "").strip(),
            }
            if entry["title"]:
                items.append(entry)
    return items


def _clean_html(text: str) -> str:
    """Strip HTML tags and normalise whitespace."""
    text = re.sub(r'<[^>]+>', ' ', text or '')
    text = re.sub(r'&nbsp;', ' ', text)
    text = re.sub(r'&amp;', '&', text)
    text = re.sub(r'&lt;', '<', text)
    text = re.sub(r'&gt;', '>', text)
    text = re.sub(r'&quot;', '"', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text[:600]   # cap at 600 chars


# ─────────────────────────────────────────────────────────────────
# EDITORIAL FILTER
# ─────────────────────────────────────────────────────────────────

def passes_editorial_filter(item: Dict, section_id: str) -> bool:
    """
    Returns True if the item passes all editorial rules.
    Rules:
    1. Title + description must not contain any blocklist term.
    2. For sections with EDITORIAL_REQUIRED_ONE_OF, at least one
       required term must appear.
    """
    combined = (item.get("title", "") + " " + item.get("description", "")).lower()

    # Block if any blocklist term found
    for block in EDITORIAL_BLOCKLIST:
        if block in combined:
            return False

    # Must match at least one section keyword (if list exists)
    required = EDITORIAL_REQUIRED_ONE_OF.get(section_id, [])
    if required and not any(k in combined for k in required):
        return False

    return True


def story_id_from_url(url: str) -> str:
    """Create a short stable ID from a URL."""
    return hashlib.md5(url.encode()).hexdigest()[:10]


# ─────────────────────────────────────────────────────────────────
# GEMINI AI ENRICHMENT
# ─────────────────────────────────────────────────────────────────

def call_gemini(prompt: str, max_tokens: int = 800) -> Optional[str]:
    """
    Call Gemini API via REST (no SDK dependency).
    Returns the text response or None on failure.
    """
    if not GEMINI_API_KEY:
        return None

    payload = json.dumps({
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "maxOutputTokens": max_tokens,
            "temperature": 0.3,
            "responseMimeType": "application/json"
        }
    }).encode("utf-8")

    url = f"{GEMINI_ENDPOINT}?key={GEMINI_API_KEY}"
    req = urllib.request.Request(
        url,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            text = data["candidates"][0]["content"]["parts"][0]["text"]
            return text.strip()
    except Exception as exc:
        print(f"  [WARN] Gemini call failed: {exc}", file=sys.stderr)
        return None


def enrich_with_gemini(item: Dict, section_title: str) -> Optional[Dict]:
    """
    Use Gemini to generate the full story schema from an RSS item.
    Returns None if Gemini is unavailable or declines the story.
    """
    prompt = f"""
You are an editor for SM Times, an institutional-grade financial newspaper for
central bankers, senior investors, policymakers, and finance professionals.

ARTICLE TO ANALYSE:
Title: {item['title']}
Source: {item.get('source_label', 'Unknown')}
Section: {section_title}
Description: {item['description']}
URL: {item['link']}

EDITORIAL RULES (strict):
- Never include celebrity news, political gossip, social media drama, clickbait,
  or opinion without evidence.
- Only include if the article has long-term consequences, market impact, regulatory
  importance, economic significance, technological disruption, or institutional relevance.
- If the article does NOT meet these standards, set "skip": true and explain why.

OUTPUT: Respond with ONLY a valid JSON object (no markdown, no prose) with these fields:
{{
  "skip": false,
  "skip_reason": "",
  "summary": "One-line summary, max 160 chars — factual, not clickbait",
  "whyItMatters": "2-3 sentences on why a finance professional or investor should care",
  "keyNumbers": [
    {{"label": "Short label", "value": "Number with unit"}}
  ],
  "marketImpact": "How this affects asset prices, sectors, or portfolios — 1-2 sentences",
  "indiaImpact": "India-specific implications — 1-2 sentences",
  "globalImpact": "Global macroeconomic context — 1-2 sentences",
  "tags": ["Tag1", "Tag2", "Tag3"]
}}

If keyNumbers are not available from the description, return an empty array [].
Keep all text fields concise and analytical. Use plain English without jargon where possible.
"""
    raw = call_gemini(prompt)
    if not raw:
        return None

    # Strip markdown code fences if Gemini wraps in ```json ... ```
    raw = re.sub(r'^```json\s*', '', raw.strip())
    raw = re.sub(r'```\s*$', '', raw.strip())

    try:
        result = json.loads(raw)
        if result.get("skip"):
            print(f"  [SKIP-AI] {item['title'][:60]} — {result.get('skip_reason','')}")
            return None
        return result
    except json.JSONDecodeError:
        print(f"  [WARN] Gemini returned invalid JSON for: {item['title'][:60]}", file=sys.stderr)
        return None


# ─────────────────────────────────────────────────────────────────
# RULE-BASED ENRICHMENT (fallback when no Gemini API key)
# ─────────────────────────────────────────────────────────────────

def enrich_rule_based(item: Dict, source: Dict) -> Dict:
    """
    Generate story fields using rule-based extraction from RSS data.
    Less rich than Gemini output but never fabricates facts.
    """
    title = item["title"]
    desc  = item["description"]

    # Extract numbers from the text (heuristic).
    # Every alternative requires an actual digit in the match — the old
    # pattern anchored on the unit keyword and grabbed up to 40 trailing
    # characters of prose, which produced garbage like "rs. The company
    # is also actively..." whenever "Rs" appeared mid-word with no real
    # figure nearby. \b before Rs/USD also stops it matching inside
    # unrelated words (e.g. "Mrs.").
    number_matches = re.findall(
        r'(?:₹|\bRs\.?|\bUSD)\s?\d[\d,]*(?:\.\d+)?(?:\s?(?:billion|million|lakh|crore|trillion|bn|mn))?'
        r'|\$\s?\d[\d,]*(?:\.\d+)?(?:\s?(?:billion|million|lakh|crore|trillion|bn|mn))?'
        r'|\b\d+(?:\.\d+)?\s?(?:%|bps|GW|MW|billion|million|lakh|crore|trillion)',
        desc, re.IGNORECASE
    )
    key_numbers = []
    for i, match in enumerate(number_matches[:4]):
        key_numbers.append({"label": f"Figure {i+1}", "value": match.strip()})

    # Tags from source + keywords found in content
    tags = list(source.get("tags", []))
    for kw in ["RBI", "Fed", "GDP", "Inflation", "UPI", "AI", "SEBI", "Gold", "Oil"]:
        if kw.lower() in (title + desc).lower() and kw not in tags:
            tags.append(kw)
    tags = tags[:5]

    return {
        "summary": desc[:160] if desc else title[:160],
        "whyItMatters": (
            f"{title}. "
            + (desc[:300] if desc else "See original source for full context.")
        ),
        "keyNumbers": key_numbers,
        "marketImpact": "Refer to original source for market impact analysis.",
        "indiaImpact":  "Refer to original source for India-specific implications.",
        "globalImpact": "Refer to original source for global context.",
        "tags": tags,
    }


# ─────────────────────────────────────────────────────────────────
# STORY BUILDER
# ─────────────────────────────────────────────────────────────────

def build_story(item: Dict, source: Dict, section_id: str, use_ai: bool) -> Optional[Dict]:
    """
    Turn an RSS item into a story dict matching the exact schema
    expected by renderStoryCard() in index.html.
    Returns None if the story should be skipped.
    """
    item["source_label"] = source["label"]

    enriched = None
    if use_ai and GEMINI_API_KEY:
        enriched = enrich_with_gemini(item, section_id)

    if enriched is None:
        enriched = enrich_rule_based(item, source)

    story = {
        "id":           story_id_from_url(item["link"]),
        "headline":     item["title"].strip(),
        "summary":      enriched.get("summary", item["description"][:160]),
        "whyItMatters": enriched.get("whyItMatters", ""),
        "keyNumbers":   enriched.get("keyNumbers", []),
        "marketImpact": enriched.get("marketImpact", ""),
        "indiaImpact":  enriched.get("indiaImpact", ""),
        "globalImpact": enriched.get("globalImpact", ""),
        "source":       source["label"],
        "sourceUrl":    source.get("source_url", item["link"]),
        "readMoreUrl":  item["link"],
        "tags":         enriched.get("tags", source.get("tags", [])),
    }
    return story


# ─────────────────────────────────────────────────────────────────
# SECTION BUILDER
# ─────────────────────────────────────────────────────────────────

SECTION_META = {
    "global-macro":      {"number": "01", "title": "Global Macro",          "icon": "🌐"},
    "rbi-watch":         {"number": "02", "title": "RBI Watch",             "icon": "🏦"},
    "payments-fintech":  {"number": "03", "title": "Payments & FinTech",    "icon": "💳"},
    "banking":           {"number": "04", "title": "Banking",               "icon": "🏛️"},
    "markets":           {"number": "05", "title": "Markets",               "icon": "📈"},
    "fixed-income":      {"number": "06", "title": "Fixed Income",          "icon": "📊"},
    "commodities":       {"number": "07", "title": "Commodities",           "icon": "🥇"},
    "technology":        {"number": "08", "title": "Technology",            "icon": "💻"},
    "energy":            {"number": "09", "title": "Energy",                "icon": "⚡"},
    "vc-startups":       {"number": "10", "title": "VC & Startups",         "icon": "🚀"},
    "regulation-law":    {"number": "11", "title": "Regulation & Law",      "icon": "⚖️"},
    "politics-matters":  {"number": "12", "title": "Politics That Matters", "icon": "🏛️"},
    "imf-bis-worldbank": {"number": "13", "title": "IMF · World Bank · BIS · OECD", "icon": "🌍"},
}

# These sections are compiled from static/curated data, not RSS feeds
STATIC_SECTION_IDS = {
    "industry-deep-dive", "research-corner",
    "executive-intelligence", "book-recommendation", "quote-of-day"
}


def fetch_section(section_id: str, use_ai: bool) -> List[Dict]:
    """
    Fetch and filter stories for a given section.
    Returns list of story dicts (may be empty if all sources fail).
    """
    relevant_sources = [s for s in SOURCES if section_id in s.get("sections", [])]
    if not relevant_sources:
        print(f"  [INFO] No sources configured for section: {section_id}")
        return []

    stories = []
    seen_titles = set()

    for source in relevant_sources:
        print(f"  Fetching: {source['url']}")
        items = fetch_rss(source["url"])
        if not items:
            print(f"  [WARN] No items from: {source['url']}")
            continue

        for item in items:
            if len(stories) >= MAX_STORIES_PER_SECTION:
                break

            title_key = item["title"].lower().strip()[:80]
            if title_key in seen_titles:
                continue   # deduplicate

            if not passes_editorial_filter(item, section_id):
                continue

            story = build_story(item, source, section_id, use_ai)
            if story:
                stories.append(story)
                seen_titles.add(title_key)
                print(f"  [OK] {story['headline'][:70]}")

        if len(stories) >= MAX_STORIES_PER_SECTION:
            break

        time.sleep(0.3)  # polite crawl delay

    return stories


# ─────────────────────────────────────────────────────────────────
# STATIC SECTION BUILDERS
# These produce the curated content that can't be RSS-driven.
# ─────────────────────────────────────────────────────────────────

def build_research_corner() -> Dict:
    """Pull BIS and IMF working papers from their RSS feeds."""
    reads = []
    feeds = [
        ("https://www.bis.org/rss/research.rss",    "Bank for International Settlements"),
        ("https://www.imf.org/en/Publications/rss.aspx", "International Monetary Fund"),
    ]
    for url, publisher in feeds:
        items = fetch_rss(url)
        for item in items[:2]:
            if len(reads) >= 3:
                break
            reads.append({
                "title":     item["title"],
                "publisher": publisher,
                "summary":   item["description"][:300],
                "whyRead":   "See full paper for methodology and implications.",
                "pages":     None,
                "url":       item["link"],
                "tags":      ["Research"],
            })
        if len(reads) >= 3:
            break

    if not reads:
        # Fallback static entry rather than empty section
        reads = [{
            "title":     "No new working papers fetched this run",
            "publisher": "SM Times",
            "summary":   "Check BIS (bis.org/research) and IMF (imf.org/research) directly for the latest working papers.",
            "whyRead":   "Bookmark these sources for essential institutional research.",
            "pages":     None,
            "url":       "https://www.bis.org/research/",
            "tags":      ["Research"],
        }]

    return {
        "id": "research-corner",
        "number": "15",
        "title": "Research Corner",
        "icon": "📚",
        "reads": reads,
    }


def build_quote_of_day(edition_date: datetime.date) -> Dict:
    idx = edition_date.timetuple().tm_yday % len(QUOTES)
    q = QUOTES[idx]
    return {
        "id": "quote-of-day",
        "number": "18",
        "title": "Quote of the Day",
        "icon": "💬",
        "quote": q,
    }


def build_book_recommendation(edition_date: datetime.date) -> Dict:
    idx = (edition_date.isocalendar()[1]) % len(BOOK_ROTATION)
    book = BOOK_ROTATION[idx]
    return {
        "id": "book-recommendation",
        "number": "17",
        "title": "Book Recommendation",
        "icon": "📖",
        "book": book,
    }


def build_industry_deep_dive() -> Dict:
    """
    Rotate the industry deep dive by week number.
    Content is curated text since this requires domain synthesis.
    """
    week = datetime.date.today().isocalendar()[1]
    industries = ["Insurance", "Capital Markets", "EV & Mobility", "Healthcare",
                  "Telecom", "Infrastructure", "Chemicals", "Defence", "Real Estate", "Fintech"]
    industry = industries[week % len(industries)]
    return {
        "id": "industry-deep-dive",
        "number": "14",
        "title": "Industry Deep Dive",
        "icon": "🔬",
        "subtitle": f"This Edition: {industry}",
        "stories": [{
            "id":           f"deep-dive-{industry.lower().replace(' ','-')}",
            "headline":     f"{industry}: Sector Overview — Edition {datetime.date.today().strftime('%b %d, %Y')}",
            "summary":      f"This edition's deep dive covers the {industry} sector. Full curated content to be added by the editor for this edition.",
            "whyItMatters": f"The {industry} sector has significant implications for institutional investors, policymakers, and finance professionals tracking India's structural growth story.",
            "keyNumbers":   [],
            "marketImpact": "See curated edition notes.",
            "indiaImpact":  "See curated edition notes.",
            "globalImpact": "See curated edition notes.",
            "source":       "SM Times Editorial",
            "sourceUrl":    "#",
            "readMoreUrl":  "#",
            "tags":         [industry, "Deep Dive"],
        }],
    }


def build_executive_intelligence() -> Dict:
    """Pull recent earnings/CEO news from ET corporate feed."""
    items = fetch_rss("https://economictimes.indiatimes.com/markets/earnings/rssfeeds/2143429.cms")
    stories = []
    for item in items[:3]:
        kw_check = (item["title"] + item["description"]).lower()
        if any(k in kw_check for k in ["earnings", "ceo", "cfo", "profit", "revenue", "result", "quarter"]):
            stories.append({
                "id":           story_id_from_url(item["link"]),
                "headline":     item["title"],
                "summary":      item["description"][:200],
                "whyItMatters": "See original source for strategic insight.",
                "keyNumbers":   [],
                "marketImpact": item["description"][:100],
                "indiaImpact":  "",
                "globalImpact": "",
                "source":       "Economic Times",
                "sourceUrl":    "https://economictimes.indiatimes.com",
                "readMoreUrl":  item["link"],
                "tags":         ["Earnings", "Corporate", "Executive Intelligence"],
            })
        if len(stories) >= 2:
            break

    if not stories:
        stories = [{
            "id":           "exec-intel-placeholder",
            "headline":     "Executive Intelligence — Curated Edition Required",
            "summary":      "Add earnings call highlights, CEO interview excerpts, or shareholder letter summaries for this section.",
            "whyItMatters": "Earnings calls and shareholder letters contain the most candid strategic signals from corporate leadership.",
            "keyNumbers":   [],
            "marketImpact": "",
            "indiaImpact":  "",
            "globalImpact": "",
            "source":       "SM Times Editorial",
            "sourceUrl":    "#",
            "readMoreUrl":  "#",
            "tags":         ["Executive Intelligence", "Earnings"],
        }]

    return {
        "id": "executive-intelligence",
        "number": "16",
        "title": "Executive Intelligence",
        "icon": "🎯",
        "stories": stories,
    }


# ─────────────────────────────────────────────────────────────────
# GLOSSARY (static — lives in data.js, rarely changes)
# ─────────────────────────────────────────────────────────────────

GLOSSARY = [
    {"term": "Repo Rate", "category": "Monetary Policy",
     "definition": "The rate at which the RBI lends short-term funds to commercial banks against government securities.",
     "formula": "Cost of overnight borrowing from RBI",
     "example": "If Repo Rate = 6.25%, banks borrowing ₹100 Cr overnight repay ₹100 Cr + ~₹17,123 interest the next day.",
     "whyItMatters": "The foundational rate anchoring all Indian interest rates. A cut eventually reduces home loan, auto loan, and corporate loan rates."},
    {"term": "SDF", "fullForm": "Standing Deposit Facility", "category": "Monetary Policy",
     "definition": "The rate at which the RBI absorbs excess liquidity from banks overnight. The floor of the rate corridor.",
     "formula": "SDF Rate = Repo Rate − 25bps",
     "example": "Banks park surplus cash with RBI at SDF rate (currently 6.00%) overnight.",
     "whyItMatters": "Replaced the Reverse Repo Rate as the effective floor. Determines the minimum return banks earn on overnight surplus funds."},
    {"term": "CRR", "fullForm": "Cash Reserve Ratio", "category": "Banking / Monetary Policy",
     "definition": "Minimum % of a bank's Net Demand and Time Liabilities (NDTL) held as cash with the RBI.",
     "formula": "CRR = (Cash with RBI / Total NDTL) × 100",
     "example": "NDTL ₹1,000 Cr, CRR 4% → ₹40 Cr must be kept with RBI earning zero interest.",
     "whyItMatters": "Direct money supply control. A 50bps CRR cut injects ~₹1.1 lakh crore into the banking system."},
    {"term": "SLR", "fullForm": "Statutory Liquidity Ratio", "category": "Banking / Monetary Policy",
     "definition": "Minimum % of NDTL a bank must maintain in liquid assets: cash, gold, or G-Secs.",
     "formula": "SLR = (Liquid Assets / NDTL) × 100",
     "example": "NDTL ₹1,000 Cr, SLR 18% → ₹180 Cr must be held in G-Secs/gold/cash.",
     "whyItMatters": "Creates captive buyer for G-Secs, suppressing yields. Enables government to finance deficit at lower rates."},
    {"term": "VRRR", "fullForm": "Variable Rate Reverse Repo", "category": "Monetary Policy / Liquidity",
     "definition": "Auction mechanism through which RBI absorbs excess liquidity from banks for a specified tenor at variable rates.",
     "formula": "Banks bid the rate at which they lend to RBI. Lowest bidders get priority.",
     "example": "In a ₹1 lakh crore VRRR auction, banks compete to park surplus. RBI cutoff at 6.22% accepts only bids at or below that rate.",
     "whyItMatters": "Primary tool for absorbing surplus liquidity. Critically important for understanding money market rates."},
    {"term": "Yield Curve", "category": "Fixed Income",
     "definition": "Graph showing relationship between bond yields and their maturities for securities of similar credit quality.",
     "formula": "Plot: Yield (Y-axis) vs. Maturity (X-axis)",
     "example": "Normal: 3M T-Bill 6.65%, 5Y G-Sec 6.82%, 10Y G-Sec 6.98%. Inverted: short rates > long (recession signal).",
     "whyItMatters": "Most reliable predictor of economic conditions. Inverted US curve has preceded every US recession for 50 years."},
    {"term": "Duration", "category": "Fixed Income",
     "definition": "Measure of a bond's sensitivity to interest rate changes, expressed in years.",
     "formula": "Modified Duration = Macaulay Duration / (1 + YTM/n)",
     "example": "Modified Duration 7 years → bond falls ~7% if rates rise 1%, gains ~7% if rates fall 1%.",
     "whyItMatters": "Most important metric for managing interest rate risk in bond portfolios."},
    {"term": "NPA", "fullForm": "Non-Performing Asset", "category": "Banking",
     "definition": "Loan or advance where borrower has not paid interest or principal for 90 days or more.",
     "formula": "GNPA Ratio = Gross NPA / Gross Advances × 100",
     "example": "₹1,000 Cr loans, ₹28 Cr not repaid 90+ days → GNPA = 2.8%.",
     "whyItMatters": "Primary measure of bank asset quality. High NPAs reduce profitability, erode capital, constrain new lending."},
    {"term": "CASA", "fullForm": "Current Account Savings Account", "category": "Banking",
     "definition": "Proportion of a bank's deposits held in current and savings accounts (low/zero cost for the bank).",
     "formula": "CASA Ratio = (Current + Savings Deposits) / Total Deposits × 100",
     "example": "Total deposits ₹100 Cr, current/savings ₹44 Cr → CASA = 44%.",
     "whyItMatters": "High CASA = lower cost of funds = higher NIM = more profitable bank."},
    {"term": "NIM", "fullForm": "Net Interest Margin", "category": "Banking",
     "definition": "Difference between interest income earned on loans and interest paid on deposits, as % of earning assets.",
     "formula": "NIM = (Interest Income – Interest Expense) / Average Earning Assets × 100",
     "example": "Earns 9% on loans, pays 5% on deposits, ₹500 Cr assets → NIM = 4%.",
     "whyItMatters": "Core profitability metric for banks. Rising NIMs signal improving margins; falling NIMs signal margin pressure."},
    {"term": "Basis Point (bps)", "category": "Finance",
     "definition": "One hundredth of one percentage point (0.01%). Used for interest rate, bond yield, and spread changes.",
     "formula": "1 bps = 0.01% = 0.0001",
     "example": "RBI cuts repo by 25bps → rate drops from 6.25% to 6.00%.",
     "whyItMatters": "Standard unit avoiding ambiguity in rate change descriptions."},
    {"term": "G-Sec", "fullForm": "Government Security", "category": "Fixed Income",
     "definition": "Debt instruments issued by Government of India with fixed tenure, coupon, and face value. The risk-free benchmark.",
     "formula": "Yield = Coupon / Price × 100 (simplified)",
     "example": "10Y G-Sec: face ₹100, coupon 7%, trading at ₹100 → yield 7%. Price rises to ₹102 → yield falls below 7%.",
     "whyItMatters": "Foundation of all Indian interest rates. Corporate bonds, FDs, and loans priced relative to G-Sec yields."},
    {"term": "PCR", "fullForm": "Provision Coverage Ratio", "category": "Banking",
     "definition": "Percentage of NPAs for which the bank has set aside provisions from profits.",
     "formula": "PCR = Provisions / Gross NPA × 100",
     "example": "GNPA ₹100 Cr, Provisions ₹78 Cr → PCR 78%.",
     "whyItMatters": "Higher PCR = better prepared bank. PCR above 70% considered healthy. Low PCR + high NPA = future earnings shock."},
    {"term": "CET-1", "fullForm": "Common Equity Tier 1 Capital", "category": "Banking / Basel",
     "definition": "Highest quality bank capital — paid-up equity + retained earnings. Primary loss-absorbing buffer under Basel III.",
     "formula": "CET-1 Ratio = CET-1 Capital / Risk-Weighted Assets × 100",
     "example": "CET-1 ₹10,000 Cr, RWA ₹100,000 Cr → CET-1 10% (above Basel minimum of 6%).",
     "whyItMatters": "Ultimate measure of bank strength. Below 8% triggers regulatory scrutiny."},
    {"term": "OMO", "fullForm": "Open Market Operations", "category": "Monetary Policy",
     "definition": "RBI purchase or sale of G-Secs to inject or absorb banking system liquidity.",
     "formula": "OMO Buy → injects liquidity → yields fall. OMO Sell → absorbs liquidity → yields rise.",
     "example": "RBI buys ₹25,000 Cr G-Secs → banks receive cash → rates ease.",
     "whyItMatters": "Most powerful tool for managing liquidity AND long-term bond yields simultaneously."},
    {"term": "YTM", "fullForm": "Yield to Maturity", "category": "Fixed Income",
     "definition": "Total expected return on a bond held until maturity, accounting for coupons and price discount/premium.",
     "formula": "YTM ≈ [C + (F−P)/n] / [(F+P)/2] where C=coupon, F=face, P=price, n=years",
     "example": "Bond: Face ₹1000, Coupon 7% (₹70/yr), Price ₹950, 5Y → YTM ≈ 8.2%.",
     "whyItMatters": "Single most important metric for comparing bonds. Bond at discount has YTM > coupon rate."},
    {"term": "FII / FPI", "fullForm": "Foreign Institutional Investor / Foreign Portfolio Investor", "category": "Markets",
     "definition": "Foreign entities registered with SEBI to invest in Indian securities markets.",
     "formula": "Net FPI Flow = Purchases – Sales",
     "example": "FPI buys ₹15,000 Cr, sells ₹6,760 Cr → net +₹8,240 Cr (net buyers).",
     "whyItMatters": "Most influential short-term driver of Indian market direction."},
    {"term": "CAD", "fullForm": "Current Account Deficit", "category": "Macroeconomics",
     "definition": "When a country's imports of goods, services, and transfers exceed its exports.",
     "formula": "CAD = (Imports − Exports) + Net Transfer + Net Income",
     "example": "India imports ₹5,00,000 Cr, exports ₹4,60,000 Cr → CAD ₹40,000 Cr.",
     "whyItMatters": "Driven primarily by oil and gold imports. Lower oil → lower CAD → lower INR depreciation pressure."},
    {"term": "UPI", "fullForm": "Unified Payments Interface", "category": "Payments",
     "definition": "Real-time payment system by NPCI enabling instant fund transfers between bank accounts, 24/7.",
     "formula": "Payer's bank debits → NPCI routes → Payee's bank credits (within seconds)",
     "example": "Scanning QR at grocery, paying ₹500 from savings account — settled instantly.",
     "whyItMatters": "18 billion monthly transactions. Zero cost for users. The global template for real-time payment systems."},
    {"term": "CBDC", "fullForm": "Central Bank Digital Currency", "category": "Payments / Monetary Policy",
     "definition": "Digital form of sovereign currency issued directly by a central bank.",
     "formula": "Legal tender issued as digital token/account by central bank",
     "example": "India's e-Rupee: ₹1,000 in a digital wallet backed directly by RBI — not a bank deposit.",
     "whyItMatters": "Enables programmable money, reduces costs, improves monetary policy transmission, expands financial inclusion."},
]

CALCULATIONS = [
    {"name": "Bond Yield (Current Yield)",
     "formula": "Current Yield = Annual Coupon / Current Market Price × 100",
     "example": "Bond: ₹1,000 face, 7% coupon (₹70/yr), trading at ₹950 → Current Yield = 70/950 × 100 = 7.37%",
     "interpretation": "Bond at discount (price < face) has current yield > coupon rate. Ignores capital gain/loss at maturity."},
    {"name": "Modified Duration",
     "formula": "Modified Duration = Macaulay Duration / (1 + YTM/m), where m = coupon payments per year",
     "example": "Macaulay Duration 7.5yr, YTM 7.0%, annual coupons → Modified Duration = 7.5 / 1.07 = 7.01yr",
     "interpretation": "Rates rise 1% → bond falls ~7.01%. Rates fall 1% → bond gains ~7.01%. Core metric for bond fund risk."},
    {"name": "Capital Adequacy Ratio (CRAR)",
     "formula": "CRAR = (Tier 1 Capital + Tier 2 Capital) / Risk-Weighted Assets × 100",
     "example": "Tier 1 ₹8,000 Cr + Tier 2 ₹2,000 Cr, RWA ₹58,800 Cr → CRAR = 17.0%",
     "interpretation": "RBI minimum 11.5% (inc. conservation buffer). Higher = safer bank. Current system avg: 16.9%."},
    {"name": "Return on Equity (ROE)",
     "formula": "ROE = Net Profit / Average Shareholders' Equity × 100",
     "example": "Net Profit ₹16,175 Cr, Avg Equity ₹1,20,000 Cr → ROE = 13.5%",
     "interpretation": "RoE > Cost of Equity = value creation. Private banks target 15–18%; PSU banks 8–12%."},
    {"name": "Price-to-Earnings (P/E) Ratio",
     "formula": "P/E = Market Price per Share / Earnings per Share (EPS)",
     "example": "Price ₹1,800, EPS ₹82.5 → P/E = 21.8x (investors pay ₹21.80 per ₹1 of earnings)",
     "interpretation": "Compare to historical average (Nifty: ~20.5x) to assess relative valuation."},
    {"name": "CAGR (Compound Annual Growth Rate)",
     "formula": "CAGR = (Ending Value / Beginning Value)^(1/Years) − 1",
     "example": "UPI 4.57B → 18.04B in 5 years: CAGR = (18.04/4.57)^(1/5) − 1 = 31.7%",
     "interpretation": "Smooths year-to-year volatility. More meaningful than absolute growth % for multi-year comparisons."},
]


# ─────────────────────────────────────────────────────────────────
# EDITION ASSEMBLER
# ─────────────────────────────────────────────────────────────────

def assemble_edition(
    target_sections: Optional[List[str]] = None,
    use_ai: bool = True
) -> Dict:
    """
    Fetch and compile all sections into the EDITION object.
    target_sections: if set, only rebuild those section IDs.
    """
    now    = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=5, minutes=30)))
    today  = now.date()
    day_str = today.strftime("%A, %B %-d, %Y")

    # Compute next refresh (12h from now)
    next_refresh = now + datetime.timedelta(hours=12)

    # Load existing data.js to preserve sections we're not refreshing
    existing_sections = {}
    if target_sections and os.path.exists(OUTPUT_PATH):
        try:
            with open(OUTPUT_PATH, encoding="utf-8") as f:
                existing_js = f.read()
            # We can't safely eval the JS, but we can note that partial
            # updates exist. For now, we still rebuild all requested sections
            # and keep static ones from V1 edition as-is.
        except Exception:
            pass

    sections = []
    omitted_sections = []

    # ── RSS-driven sections ───────────────────────────────────────
    for section_id, meta in SECTION_META.items():
        if target_sections and section_id not in target_sections:
            continue
        print(f"\n[SECTION] {meta['title']}")
        stories = fetch_section(section_id, use_ai)
        if stories:
            sections.append({
                "id":      section_id,
                "number":  meta["number"],
                "title":   meta["title"],
                "icon":    meta["icon"],
                "stories": stories,
            })
        else:
            print(f"  [WARN] Section {section_id} produced 0 stories — omitting.")
            omitted_sections.append(meta["title"])

    # ── Static / curated sections ─────────────────────────────────
    if not target_sections or "industry-deep-dive" in target_sections:
        print("\n[SECTION] Industry Deep Dive (rotating)")
        sections.append(build_industry_deep_dive())

    if not target_sections or "research-corner" in target_sections:
        print("\n[SECTION] Research Corner")
        sections.append(build_research_corner())

    if not target_sections or "executive-intelligence" in target_sections:
        print("\n[SECTION] Executive Intelligence")
        sections.append(build_executive_intelligence())

    if not target_sections or "book-recommendation" in target_sections:
        print("\n[SECTION] Book Recommendation (rotating)")
        sections.append(build_book_recommendation(today))

    if not target_sections or "quote-of-day" in target_sections:
        print("\n[SECTION] Quote of the Day (rotating)")
        sections.append(build_quote_of_day(today))

    # Weekly recap (simple static structure, editor fills in)
    week_recap = {
        "active": True,
        "headline": f"Week in Review: {today.strftime('%b %-d, %Y')}",
        "points": [
            "Edition generated by SM Times ingest pipeline — curate key weekly takeaways here.",
            "Edit the weeklyRecap.points array in data.js to add your hand-curated weekly bullets.",
        ]
    }

    if omitted_sections:
        print(
            f"\n[SUMMARY] {len(omitted_sections)} section(s) omitted entirely "
            f"(no working source produced any stories): {', '.join(omitted_sections)}"
        )
        print(
            "[SUMMARY] These sections will NOT appear in the generated edition "
            "until a working trusted feed is configured for them."
        )

    return {
        "date":      day_str,
        "dateISO":   today.isoformat(),
        "volume":    f"Vol. 2, No. {today.timetuple().tm_yday}",
        # ISO-8601 timestamp — used by in-page refresh button for comparison
        "lastUpdated": now.strftime("%Y-%m-%dT%H:%M:%S%z"),
        "nextRefresh": next_refresh.strftime("%Y-%m-%dT%H:%M:%S%z"),
        "breakingNews": {
            "active": False,
            "text":   "",
            "link":   "#",
        },
        "weeklyRecap": week_recap,
        "sections": sections,
        "economicCalendar": ECONOMIC_CALENDAR,
        "glossary": GLOSSARY,
        "calculations": CALCULATIONS,
    }


# ─────────────────────────────────────────────────────────────────
# OUTPUT WRITER
# ─────────────────────────────────────────────────────────────────

def write_data_js(edition: Dict, path: str = OUTPUT_PATH) -> None:
    """
    Serialise the EDITION object to data.js in the exact format
    expected by index.html:  const EDITION = {...};
    Never overwrites with an empty/broken edition.
    """
    if not edition.get("sections"):
        print("[ERROR] Edition has no sections — refusing to overwrite data.js.", file=sys.stderr)
        sys.exit(1)

    # Pretty-print JSON with 2-space indent for human readability
    json_body = json.dumps(edition, ensure_ascii=False, indent=2)

    # Build the JS file with a header comment
    header = textwrap.dedent(f"""\
        // SM Times — Edition Data
        // Generated: {edition['lastUpdated']}
        // Sections:  {len(edition['sections'])}
        // Pipeline:  ingest.py v2
        // DO NOT EDIT this file by hand if you are running the pipeline.
        // Hand-edit is fine for one-off curated editions.
        //
        // To regenerate:  python3 ingest.py
        // To set AI mode: GEMINI_API_KEY=<key> python3 ingest.py

        const EDITION = """)

    content = header + json_body + ";\n"

    # Atomic write: write to temp file first, then rename
    tmp_path = path + ".tmp"
    with open(tmp_path, "w", encoding="utf-8") as f:
        f.write(content)
    os.replace(tmp_path, path)
    print(f"\n[DONE] Written to {path} ({os.path.getsize(path):,} bytes)")


# ─────────────────────────────────────────────────────────────────
# VALIDATION
# ─────────────────────────────────────────────────────────────────

def validate_output(path: str) -> bool:
    """
    Run the same structural checks as V1 task.md described.
    Returns True if all checks pass.
    """
    with open(path, encoding="utf-8") as f:
        content = f.read()

    checks = [
        ("const EDITION declaration", "const EDITION = "),
        ("Breaking news field",       '"breakingNews"'),
        ("Weekly recap field",        '"weeklyRecap"'),
        ("Sections array",            '"sections"'),
        ("Glossary present",          '"glossary"'),
        ("Calculations present",      '"calculations"'),
        ("Economic calendar present", '"economicCalendar"'),
        ("lastUpdated field",         '"lastUpdated"'),
        ("dateISO field",             '"dateISO"'),
        ("At least one story",        '"headline"'),
        ("Story source field",        '"source"'),
        ("Story readMoreUrl field",   '"readMoreUrl"'),
    ]

    failed = 0
    for label, pattern in checks:
        found = pattern in content
        print(f"  {'✓' if found else '✗'} {label}")
        if not found:
            failed += 1

    print(f"\n  Checks: {len(checks) - failed}/{len(checks)} passed")
    return failed == 0


# ─────────────────────────────────────────────────────────────────
# CLI ENTRY POINT
# ─────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="SM Times ingestion pipeline — generates data.js for index.html"
    )
    parser.add_argument(
        "--no-ai", action="store_true",
        help="Disable Gemini AI enrichment (rule-based summaries only)"
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Preview output to stdout; do not write data.js"
    )
    parser.add_argument(
        "--section", metavar="SECTION_ID",
        help="Only rebuild a specific section (e.g. rbi-watch)"
    )
    parser.add_argument(
        "--validate-only", action="store_true",
        help="Only run validation checks on existing data.js"
    )
    args = parser.parse_args()

    if args.validate_only:
        print(f"\n[VALIDATE] Checking {OUTPUT_PATH}")
        ok = validate_output(OUTPUT_PATH)
        sys.exit(0 if ok else 1)

    use_ai = not args.no_ai
    if use_ai and not GEMINI_API_KEY:
        print("[INFO] GEMINI_API_KEY not set — running in rule-based mode.")
        print("       Set GEMINI_API_KEY env var for AI-enriched summaries.\n")
        use_ai = False
    elif use_ai:
        print("[INFO] Gemini AI enrichment enabled.\n")

    target_sections = [args.section] if args.section else None

    print(f"[START] SM Times ingestion pipeline")
    print(f"        Target: {'all sections' if not target_sections else target_sections}")
    print(f"        AI:     {'enabled' if use_ai else 'disabled (rule-based)'}")
    print(f"        Output: {OUTPUT_PATH}")
    print()

    start = time.time()
    edition = assemble_edition(target_sections=target_sections, use_ai=use_ai)
    elapsed = time.time() - start

    print(f"\n[STATS] Sections: {len(edition['sections'])}")
    total_stories = sum(
        len(s.get("stories", [])) + len(s.get("reads", []))
        for s in edition["sections"]
    )
    print(f"[STATS] Stories/pieces: {total_stories}")
    print(f"[STATS] Time: {elapsed:.1f}s")

    if args.dry_run:
        print("\n[DRY RUN] Output preview (first 2000 chars):")
        preview = json.dumps(edition, ensure_ascii=False, indent=2)[:2000]
        print(preview + "\n...")
        print("\n[DRY RUN] No file written.")
        return

    write_data_js(edition)

    print("\n[VALIDATE] Running output checks…")
    validate_output(OUTPUT_PATH)


if __name__ == "__main__":
    main()
