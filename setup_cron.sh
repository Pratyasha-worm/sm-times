#!/usr/bin/env bash
# SM Times — Auto-refresh Setup Script
# ─────────────────────────────────────────────────────────────────
# Installs a cron job that runs the ingestion pipeline every 12 hours
# and overwrites data.js. The browser tab picks up the new edition
# on the next page reload (or when the in-page Refresh button detects
# a timestamp change).
#
# Usage:
#   chmod +x setup_cron.sh
#   ./setup_cron.sh
#
# To remove the cron job:
#   ./setup_cron.sh --remove
#
# Tested on: macOS 13+, Ubuntu 22.04
# Requires: python3 (standard library only for basic mode)
# ─────────────────────────────────────────────────────────────────

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INGEST_PY="${SCRIPT_DIR}/ingest.py"
LOG_FILE="${SCRIPT_DIR}/ingest.log"
PYTHON="$(which python3 2>/dev/null || echo python)"

# Cron schedule: run at 06:00 and 18:00 IST (00:30 and 12:30 UTC)
CRON_ENTRY_1="30 0 * * * cd \"${SCRIPT_DIR}\" && ${PYTHON} \"${INGEST_PY}\" --no-ai >> \"${LOG_FILE}\" 2>&1"
CRON_ENTRY_2="30 12 * * * cd \"${SCRIPT_DIR}\" && ${PYTHON} \"${INGEST_PY}\" --no-ai >> \"${LOG_FILE}\" 2>&1"

# If GEMINI_API_KEY is set in your env, pass it to the cron job
if [ -n "${GEMINI_API_KEY:-}" ]; then
    CRON_ENTRY_1="30 0 * * * GEMINI_API_KEY=${GEMINI_API_KEY} cd \"${SCRIPT_DIR}\" && ${PYTHON} \"${INGEST_PY}\" >> \"${LOG_FILE}\" 2>&1"
    CRON_ENTRY_2="30 12 * * * GEMINI_API_KEY=${GEMINI_API_KEY} cd \"${SCRIPT_DIR}\" && ${PYTHON} \"${INGEST_PY}\" >> \"${LOG_FILE}\" 2>&1"
    echo "✓ Gemini AI enrichment enabled (GEMINI_API_KEY is set)"
else
    echo "ℹ  Gemini API key not set — cron will run in rule-based mode."
    echo "   To enable AI enrichment: export GEMINI_API_KEY=<your-key> before running this script."
fi

if [ "${1:-}" = "--remove" ]; then
    echo "Removing SM Times cron jobs…"
    crontab -l 2>/dev/null | grep -v "sm-times\|ingest.py" | crontab -
    echo "✓ Removed."
    exit 0
fi

# Check python3 available
if ! command -v python3 &>/dev/null; then
    echo "✗ python3 not found. Install Python 3.8+ to use the ingestion pipeline."
    exit 1
fi

# Verify ingest.py exists
if [ ! -f "${INGEST_PY}" ]; then
    echo "✗ ingest.py not found at ${INGEST_PY}"
    exit 1
fi

echo ""
echo "Installing cron jobs for SM Times (12-hour cadence):"
echo "  06:00 IST and 18:00 IST daily"
echo "  Logs → ${LOG_FILE}"
echo ""

# Append cron entries (avoid duplicates)
( crontab -l 2>/dev/null | grep -v "sm-times\|ingest.py"; \
  echo "# SM Times — morning edition (06:00 IST)"; \
  echo "${CRON_ENTRY_1}"; \
  echo "# SM Times — evening edition (18:00 IST)"; \
  echo "${CRON_ENTRY_2}" \
) | crontab -

echo "✓ Cron installed. Verify with: crontab -l"
echo ""
echo "Next steps:"
echo "  1. Test manually:  python3 ingest.py --dry-run"
echo "  2. Full run:       python3 ingest.py"
echo "  3. View logs:      tail -f ${LOG_FILE}"
echo "  4. Remove cron:    ./setup_cron.sh --remove"
