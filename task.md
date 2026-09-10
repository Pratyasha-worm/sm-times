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

## Automation migration: laptop cron → GitHub Actions, dev moved to Codespaces (2026-09-10)

- [x] Diagnosed and fixed the real reason the site had gone stale for
      weeks: `setup_cron.sh` had never actually been installed, and
      separately, the stored GitHub push credential had silently
      disappeared from the local keychain — confirmed via
      `security find-internet-password`, fixed via `gh auth login`.
- [x] Built `auto_refresh.sh` + fixed `setup_cron.sh` (a `pipefail`
      bug that aborted first-ever installs, and a dedup-filter bug
      that accumulated duplicate crontab comments) — this local-cron
      approach worked but was later replaced (see below).
- [x] **Replaced local cron entirely with GitHub Actions**
      (`.github/workflows/refresh.yml`): same 06:00/18:00 IST
      schedule, runs on GitHub's own servers, pushes with the job's
      own auto-issued `GITHUB_TOKEN` (no personal token needed for
      this part). Verified with a real manual `workflow_dispatch`
      run — completed in 1m45s, real commit landed, live site
      updated. Local crontab removed (`setup_cron.sh --remove`) to
      avoid both mechanisms racing on the same schedule.
- [x] Found and fixed a real bug while doing this: the in-page
      Refresh button's regex for parsing `data.js`'s `lastUpdated`
      field only matched the old hand-authored unquoted-key format,
      not `ingest.py`'s actual JSON-quoted-key output — the button
      was silently always reporting "up to date" even when a newer
      edition existed. Confirmed against the real deployed file
      before and after the fix.
- [x] **Mistake made and corrected**: while verifying the cron
      install, briefly displayed the real `GEMINI_API_KEY` in
      plaintext via `crontab -l` output. Caught it, moved the key
      out of any crontab entry into a `chmod 600` `.env` file
      (gitignored) sourced by `auto_refresh.sh`, and told the user
      to rotate the key. That whole local-key mechanism is now moot
      anyway since `auto_refresh.sh`/cron were removed — see below.
- [x] Attempted an on-demand "trigger a real refresh" path for the
      site's Refresh button: a Netlify Function
      (`trigger-refresh.js`) calling GitHub's `workflow_dispatch`
      API, with the dispatch token as a Netlify environment variable
      (never client-side JS). Spent a long debugging session on a
      Netlify-specific issue where the env var showed "0 values in 0
      deploy contexts," then still wasn't visible to the function at
      runtime even after confirming a value was attached to the
      Production context and forcing multiple redeploys — root cause
      never conclusively found.
- [x] **Decision: dropped the Netlify Function entirely** rather than
      keep debugging a platform-specific dead end. On-demand refresh
      now happens via GitHub directly (Actions tab, or
      `gh workflow run refresh.yml`) — one less moving part, no
      unresolved mystery bug. Reverted the Refresh button to its
      simpler "check for an already-published edition" behavior.
      Removed `netlify/functions/trigger-refresh.js` and
      `netlify.toml`.
- [x] Removed `auto_refresh.sh`, `setup_cron.sh`, and the local
      `.env` key file — fully redundant now that GitHub Actions
      handles both scheduled and on-demand refresh.
- [x] **Migrated the development workflow itself off the local
      laptop**: added `.devcontainer/devcontainer.json` (universal
      image — Python, git, `gh` preinstalled) so the project is
      developed via **GitHub Codespaces** going forward, not a local
      checkout. `GEMINI_API_KEY` set as both a GitHub Actions secret
      and a separate Codespaces secret (`gh secret set ... --app
      actions` / `--app codespaces`) — confirmed present via
      `gh secret list` for each, values never printed.
- [x] Spun up a real test Codespace (twice — see below) rather than
      trusting the config blind:
      - Created via `gh codespace create`, reached "Available" state
        successfully both times (confirms the devcontainer.json
        itself is valid and buildable — first attempt without the
        `sshd` feature, second with it added).
      - `gh codespace ssh` failed both times with "Permission denied
        (publickey,password)". Diagnosed with `GH_DEBUG=api`: the
        tunnel's access-control response shows an inherited
        Organization-level policy with `"isDeny": true` on the
        `connect` scope for the internal SSH port (2222) — this is a
        platform/account security policy blocking direct SSH
        connect, not a bug in the devcontainer. Did not attempt to
        work around it (same principle as not spoofing a UA to
        bypass a source's bot-blocking).
      - **Net result: build/provisioning is verified working; the
        runtime (Python/git/gh present, GEMINI_API_KEY injected,
        ingest.py actually runs) is NOT verified from this session**
        — that check needs to happen through the officially-supported
        path (opening the Codespace in the browser or VS Code, which
        isn't blocked by this policy), which only the user can do.
      - Test Codespace stopped (not deleted) to avoid running cost
        while unverified — `vigilant-zebra-7qxvv4q4p7j2xr67`.
