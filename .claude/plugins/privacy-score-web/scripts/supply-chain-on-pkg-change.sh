#!/usr/bin/env bash
# Runs after modifying package.json or pnpm-lock.yaml
# Triggers a quick vulnerability audit. Non-blocking warning.

set -e

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$PROJECT_DIR"

if [ ! -f "package.json" ]; then
  exit 0
fi

if ! command -v pnpm &>/dev/null; then
  exit 0
fi

# Quick audit
AUDIT_OUTPUT=$(pnpm audit --audit-level=high --json 2>/dev/null || echo '{}')
HIGH_VULNS=$(echo "$AUDIT_OUTPUT" | jq -r '.metadata.vulnerabilities.high // 0' 2>/dev/null || echo "0")
CRIT_VULNS=$(echo "$AUDIT_OUTPUT" | jq -r '.metadata.vulnerabilities.critical // 0' 2>/dev/null || echo "0")

if [ "$CRIT_VULNS" -gt 0 ] || [ "$HIGH_VULNS" -gt 0 ]; then
  echo "🔴 Dependency change introduced vulnerabilities:" >&2
  echo "   CRITICAL: $CRIT_VULNS" >&2
  echo "   HIGH:     $HIGH_VULNS" >&2
  echo "   Run: pnpm audit" >&2
fi

exit 0
