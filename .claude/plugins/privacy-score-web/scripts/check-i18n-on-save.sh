#!/usr/bin/env bash
# Runs after writing/editing src/i18n/*.json
# Checks key parity between fr.json and en.json. Non-blocking warning.

set -e

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
FR="$PROJECT_DIR/src/i18n/fr.json"
EN="$PROJECT_DIR/src/i18n/en.json"

if [ ! -f "$FR" ] || [ ! -f "$EN" ]; then
  exit 0
fi

if ! command -v jq &>/dev/null; then
  exit 0
fi

FR_KEYS=$(jq -r 'paths(scalars) | join(".")' "$FR" 2>/dev/null | sort)
EN_KEYS=$(jq -r 'paths(scalars) | join(".")' "$EN" 2>/dev/null | sort)

MISSING_IN_EN=$(comm -23 <(echo "$FR_KEYS") <(echo "$EN_KEYS"))
MISSING_IN_FR=$(comm -13 <(echo "$FR_KEYS") <(echo "$EN_KEYS"))

if [ -n "$MISSING_IN_EN" ] || [ -n "$MISSING_IN_FR" ]; then
  echo "⚠️  i18n key mismatch detected:" >&2
  [ -n "$MISSING_IN_EN" ] && echo "  Missing in EN:" >&2 && echo "$MISSING_IN_EN" | sed 's/^/    /' >&2
  [ -n "$MISSING_IN_FR" ] && echo "  Missing in FR:" >&2 && echo "$MISSING_IN_FR" | sed 's/^/    /' >&2
fi

exit 0
