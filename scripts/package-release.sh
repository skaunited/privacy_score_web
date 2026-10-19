#!/usr/bin/env bash
# Build and validate a static release. Does not connect to or change any server.
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ARCHIVE_PATH="${1:?Usage: bash scripts/package-release.sh /absolute/path/privacy-score-release.tar.gz}"
case "$ARCHIVE_PATH" in
  /*) ;;
  *) echo 'Provide an absolute archive path outside dist/.' >&2; exit 1 ;;
esac
case "$ARCHIVE_PATH" in
  "$REPO_ROOT/dist/"*) echo 'Archive must be outside dist/.' >&2; exit 1 ;;
esac
if [[ -e "$ARCHIVE_PATH" || -e "$ARCHIVE_PATH.sha256" ]]; then
  echo "Refusing to overwrite an existing release archive: $ARCHIVE_PATH" >&2
  exit 1
fi
cd "$REPO_ROOT"
node scripts/generate-redirects.mjs
node scripts/check-redirects.mjs
pnpm build
python3 scripts/check-seo.py
node scripts/generate-redirects.mjs --check
mkdir -p "$(dirname "$ARCHIVE_PATH")"
# Including '.' preserves .well-known/security.txt. Only built public files ship.
tar -czf "$ARCHIVE_PATH" -C dist .
if command -v sha256sum >/dev/null 2>&1; then
  sha256sum "$ARCHIVE_PATH" > "$ARCHIVE_PATH.sha256"
else
  shasum -a 256 "$ARCHIVE_PATH" > "$ARCHIVE_PATH.sha256"
fi
printf 'Validated static release: %s\nChecksum: %s.sha256\n' "$ARCHIVE_PATH" "$ARCHIVE_PATH"
printf 'Deploy the reviewed nginx snippets separately, outside the public document root.\n'
