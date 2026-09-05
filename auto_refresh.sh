#!/usr/bin/env bash
# SM Times — Auto-refresh + publish
# ─────────────────────────────────────────────────────────────────
# Run by cron twice daily (see setup_cron.sh). Regenerates data.js via
# ingest.py, then commits and pushes it directly to main if — and only
# if — it actually changed. Never opens a PR; this is meant to run
# completely unattended.
#
# Why this exists as its own file instead of a crontab one-liner:
# cron's environment is minimal (no .zshrc sourced, no Homebrew on
# PATH, no interactive TTY), and a multi-step git flow crammed into a
# single crontab line is exactly how a shell-quoting mistake turns
# into a silently-stuck commit — which already happened once by hand.
# A real script gets normal quoting rules and clear logging instead.
# ─────────────────────────────────────────────────────────────────

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}" || exit 1

# GEMINI_API_KEY lives in .env (chmod 600, gitignored), not inline in the
# crontab entry — crontab -l and `ps` while this runs would both leak an
# inline key in plaintext otherwise. .env is optional: without it, this
# just falls back to --no-ai further down.
if [ -f "${SCRIPT_DIR}/.env" ]; then
    set -a
    # shellcheck disable=SC1091
    source "${SCRIPT_DIR}/.env"
    set +a
fi

# cron's PATH typically doesn't include Homebrew — resolve full paths
# now (falling back to the standard Apple Silicon Homebrew prefix)
# rather than relying on PATH at run time.
PYTHON="$(command -v python3 || echo /opt/homebrew/bin/python3)"
GIT="$(command -v git || echo /opt/homebrew/bin/git)"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S %z')] $1"; }

echo "───────────────────────────────────────────────"
log "Starting auto-refresh"

if [ -n "${GEMINI_API_KEY:-}" ]; then
    "${PYTHON}" ingest.py
else
    "${PYTHON}" ingest.py --no-ai
fi
INGEST_EXIT=$?

if [ "${INGEST_EXIT}" -ne 0 ]; then
    log "ingest.py exited with code ${INGEST_EXIT} — not committing."
    exit 1
fi

"${GIT}" add data.js

if "${GIT}" diff --cached --quiet -- data.js; then
    log "No changes to data.js — nothing to commit."
    exit 0
fi

COMMIT_MSG="Auto-refresh edition for $(date '+%B %-d, %Y %H:%M %Z')"
if ! "${GIT}" commit -m "${COMMIT_MSG}"; then
    log "ERROR: git commit failed unexpectedly after diff check passed."
    exit 1
fi

if "${GIT}" push origin main; then
    log "Pushed: ${COMMIT_MSG}"
else
    log "ERROR: git push failed — the commit exists locally but was NOT published."
    log "Most likely cause: the stored GitHub credential (osxkeychain) is missing or"
    log "invalid — this has happened before. Fix: run 'gh auth login' interactively"
    log "once (HTTPS protocol, paste-a-token or browser auth), which re-caches a"
    log "working credential for both manual and cron pushes. See README.md."
    exit 1
fi
