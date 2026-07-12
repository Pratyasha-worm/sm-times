# SM Times Build Tasks

- [x] Create project directory structure
- [x] Write data.js (curated sample edition content — 89KB, 33 stories)
- [x] Write index.html (full newspaper with embedded CSS + JS — 83KB)
  - [x] Design system & CSS variables (cream/gold/navy palette, Playfair + Source Serif 4)
  - [x] Masthead & sticky navigation with section nav bar
  - [x] All 18 sections rendered dynamically from data.js
  - [x] Story cards with headline, summary, why it matters, key numbers, impact grid
  - [x] Research corner (read cards with paper links)
  - [x] Book recommendation card with spine design
  - [x] Quote of the Day with large decorative quote mark
  - [x] JavaScript: annotations, highlighting (yellow/blue/green), tooltips
  - [x] JavaScript: search (full-text, keyboard shortcut /)
  - [x] JavaScript: scroll spy, reading progress bar
  - [x] JavaScript: economic calendar, print, share link
  - [x] Print CSS (@media print — clean newspaper layout)
  - [x] Mobile responsive CSS (768px, 480px breakpoints)
- [x] Write README.md (edition update guide, features, portfolio hook)
- [x] Verified: 31/31 HTML checks pass, 24/24 data checks pass

## V2 verification pass (2026-07-12)

- [x] Ran `verify_v2.py` fresh — all pattern checks pass (annotation
      try/catch, portfolio wiring, refresh logic, ingest.py structure)
- [x] Reproduced the highlighting bug live in a browser (it was NOT
      fixed by V2 despite passing code checks). Root cause:
      `applyHighlight()` called `range.surroundContents(span)` directly,
      which throws `InvalidStateError` whenever a selection crosses an
      element boundary (e.g. dragging across two paragraphs) — silently
      swallowed by try/catch, so nothing visibly happened. Fixed in
      index.html by wrapping each intersecting text node individually.
      Also fixed `deleteAnnotation()`, which only unwrapped one span
      per annotation (would've orphaned multi-element highlights).
- [x] Fixed section-nav overflow: at 1440px, nav needed 2712px but had
      1360px available — over a third of sections (Industry Deep Dive
      through Quote of the Day) were unreachable with no scroll
      affordance. Added fade-edge gradients + click-to-scroll arrows,
      plus auto-centering the active section as you scroll the page.
- [x] Verified ingest.py end-to-end via live dry-run (not just reading
      the code). Found and fixed real bugs:
      - `keyNumbers` regex had no word boundary around `Rs`, matched
        inside unrelated words, grabbed 40 chars of trailing prose
        instead of a real figure. Fixed — now requires an actual digit.
      - 7 of 18 sections (Global Macro, RBI Watch, Commodities, Energy,
        Regulation & Law, Politics That Matters, IMF·World Bank·BIS·
        OECD) come back with zero stories because their trusted feeds
        (RBI, SEBI, IMF, BIS, Business Standard, MoneyControl,
        Financial Express) are dead or blocking non-browser requests.
        Pruned those dead URLs from `SOURCES`, added a loud end-of-run
        `[SUMMARY]` so this is never silently missed.
      - Rule-based (no `GEMINI_API_KEY`) content quality is genuinely
        below the hand-written V1 bar — boilerplate impact text,
        headline-echo "why it matters". **Do not run the pipeline
        against the live data.js without a Gemini key** — documented
        in README.md.
      - `validate_output()` checks quoted JSON-style keys, which is
        why it scores 1/12 against the current hand-authored data.js
        (which correctly uses plain JS keys) — a validator format
        mismatch, not a problem with data.js.
- [x] Substack promotion added: masthead byline ("From the writer of
      Sike! Markets Classroom"), footer subscribe block, single
      end-of-edition CTA card. All three link to
      https://pratyashaverma.substack.com/ with target="_blank"
      rel="noopener" — verified via accessibility tree + rendered
      page text, all three present and correctly wired.
- [x] Public deployment prep done:
      - Removed `noindex, nofollow`; updated title/description/OG
        tags and masthead/footer copy to a public personal-project
        framing (verified no leftover "Private Edition" /
        "Private & Confidential" strings anywhere).
      - `git init`, branch renamed to `main`.
      - `.gitignore` added — confirmed via `git status` that
        `portfolio.js` and `.DS_Store` don't even appear as
        untracked (correctly ignored) before any commit was made.
      - Re-verified the portfolio-badge privacy guarantee against
        the code that will actually ship: the badge always renders
        fixed generic text/title, never interpolates a matched
        PORTFOLIO value — confirmed by reading the render logic,
        not just the earlier pattern check.
      - Added `robots.txt` and `sitemap.xml` (domain is a
        placeholder — update after the real deploy URL exists).
      - **User chose Netlify/Vercel from a private repo over GitHub
        Pages** (Pages would force `data.js` and the rest of the
        source to be public). Documented exact deploy steps in
        README.md.
      - Not yet done (needs the user's own account access): actually
        creating the GitHub repo, pushing, and connecting
        Netlify/Vercel. No commit has been made yet either — ask
        before committing.
