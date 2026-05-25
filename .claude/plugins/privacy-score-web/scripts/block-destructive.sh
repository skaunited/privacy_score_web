#!/usr/bin/env bash
# Pre-tool-use hook for destructive bash commands
# Exit code 2 = BLOCK the action, message printed to stderr is shown to Claude.

set -e

# Read input from stdin
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // ""')

# Check for dangerous patterns
if echo "$COMMAND" | grep -qE "rm -rf (/|~|\.|\*)"; then
  echo "🛑 BLOCKED: dangerous rm -rf command detected. Be more specific." >&2
  exit 2
fi

if echo "$COMMAND" | grep -qE "git push --force.*\b(main|master|production)\b"; then
  echo "🛑 BLOCKED: force-push to main/master/production branch is not allowed." >&2
  exit 2
fi

if echo "$COMMAND" | grep -qE "git reset --hard.*HEAD~[0-9]"; then
  echo "⚠️  CAUTION: git reset --hard removes commits permanently. Please confirm." >&2
  # Don't block, just warn
fi

exit 0
