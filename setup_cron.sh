#!/usr/bin/env bash
# SM Times — Auto-refresh Setup Script
# ─────────────────────────────────────────────────────────────────
# Installs a cron job that runs auto_refresh.sh every 12 hours, which
# regenerates data.js via ingest.py AND commits + pushes it straight
# to main if it changed — no manual step needed for the live site
# (Netlify) to pick up the new edition. Never opens a PR.
#
# Usage:
#   chmod +x setup_cron.sh
#   ./setup_cron.sh
#
# To remove the cron job:
#   ./setup_cron.sh --remove
#
# Requires: a working GitHub credential for push (see README's
# "Auto-refresh" section — this is a one-time interactive setup step
# via `gh auth login`; cron cannot do this part for you).
#
# Tested on: macOS 13+
# Requires: python3 (standard library only for basic mode)
# ─────────────────────────────────────────────────────────────────

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AUTO_REFRESH="${SCRIPT_DIR}/auto_refresh.sh"
LOG_FILE="${SCRIPT_DIR}/ingest.log"

# Cron schedule: run at 06:00 and 18:00 IST (00:30 and 12:30 UTC).
# No key material goes in these entries — crontab -l and `ps` while the
# job runs would both leak an inline key in plaintext. auto_refresh.sh
# sources ${SCRIPT_DIR}/.env itself instead (written below, chmod 600).
CRON_ENTRY_1="30 0 * * * cd \"${SCRIPT_DIR}\" && \"${AUTO_REFRESH}\" >> \"${LOG_FILE}\" 2>&1"
CRON_ENTRY_2="30 12 * * * cd \"${SCRIPT_DIR}\" && \"${AUTO_REFRESH}\" >> \"${LOG_FILE}\" 2>&1"

# If GEMINI_API_KEY is set in your env right now, persist it to .env
# (gitignored, chmod 600) so auto_refresh.sh can pick it up under cron,
# which doesn't source .zshrc and wouldn't otherwise see it at all.
if [ -n "${GEMINI_API_KEY:-}" ]; then
    ENV_FILE="${SCRIPT_DIR}/.env"
    printf 'GEMINI_API_KEY=%s\n' "${GEMINI_API_KEY}" > "${ENV_FILE}"
    chmod 600 "${ENV_FILE}"
    echo "✓ Gemini AI enrichment enabled (key saved to .env, chmod 600)"
else
    echo "ℹ  Gemini API key not set — cron will run in rule-based mode."
    echo "   To enable AI enrichment: export GEMINI_API_KEY=<your-key> before running this script."
fi

if [ "${1:-}" = "--remove" ]; then
    echo "Removing SM Times cron jobs…"
    REMAINING_CRON="$(crontab -l 2>/dev/null | grep -v "sm-times\|ingest.py\|auto_refresh.sh\|SM Times —" || true)"
    if [ -n "${REMAINING_CRON}" ]; then
        echo "${REMAINING_CRON}" | crontab -
    else
        crontab -r 2>/dev/null || true
    fi
    echo "✓ Removed."
    exit 0
fi

# Check python3 available
if ! command -v python3 &>/dev/null; then
    echo "✗ python3 not found. Install Python 3.8+ to use the ingestion pipeline."
    exit 1
fi

# Verify auto_refresh.sh exists and is executable
if [ ! -f "${AUTO_REFRESH}" ]; then
    echo "✗ auto_refresh.sh not found at ${AUTO_REFRESH}"
    exit 1
fi
chmod +x "${AUTO_REFRESH}"

# Verify a GitHub push credential actually works right now — cron
# can't do interactive auth, so if this fails, install anyway but
# warn loudly rather than silently installing a job that will fail
# every single run.
if git -C "${SCRIPT_DIR}" ls-remote origin &>/dev/null; then
    echo "✓ GitHub push credential verified working"
else
    echo "⚠  Could not verify a working GitHub credential for this repo."
    echo "   The cron job will regenerate data.js locally but its 'git push'"
    echo "   step will likely fail until you run 'gh auth login' once."
    echo "   Installing anyway — check ${LOG_FILE} after the first run."
fi

echo ""
echo "Installing cron jobs for SM Times (12-hour cadence):"
echo "  06:00 IST and 18:00 IST daily — regenerates data.js AND pushes to main"
echo "  Logs → ${LOG_FILE}"
echo ""

# Append cron entries (avoid duplicates). Both `crontab -l` (exits 1 when
# no crontab exists yet) and `grep -v` (exits 1 when nothing matches, which
# happens on that same empty input) are expected to "fail" on a first-ever
# install — under `set -o pipefail` that would otherwise abort the whole
# script right here, before ever writing an entry. The `|| true` makes that
# expected case non-fatal without hiding a real crontab(1) error, since a
# real failure there would just mean zero existing lines to preserve either.
EXISTING_CRON="$(crontab -l 2>/dev/null | grep -v "sm-times\|ingest.py\|auto_refresh.sh\|SM Times —" || true)"
( [ -n "${EXISTING_CRON}" ] && echo "${EXISTING_CRON}"; \
  echo "# SM Times — morning edition (06:00 IST)"; \
  echo "${CRON_ENTRY_1}"; \
  echo "# SM Times — evening edition (18:00 IST)"; \
  echo "${CRON_ENTRY_2}" \
) | crontab -

echo "✓ Cron installed. Verify with: crontab -l"
echo ""
echo "Next steps:"
echo "  1. Test manually:  ./auto_refresh.sh"
echo "  2. Dry run only:   python3 ingest.py --dry-run"
echo "  3. View logs:      tail -f ${LOG_FILE}"
echo "  4. Remove cron:    ./setup_cron.sh --remove"
