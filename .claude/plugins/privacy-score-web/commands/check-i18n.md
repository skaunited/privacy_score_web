---
name: check-i18n
description: Validate i18n setup - check JSON key parity between fr.json and en.json, verify hreflang reciprocity across pages, find hardcoded strings that should be translated.
allowed-tools: Read Bash Glob Grep
---

# /check-i18n command

Validate the multilingual setup of the site.

## Checks performed

### 1. Translation key parity

```bash
echo "→ Checking i18n key parity..."
FR_KEYS=$(jq -r 'paths(scalars) | join(".")' src/i18n/fr.json | sort)
EN_KEYS=$(jq -r 'paths(scalars) | join(".")' src/i18n/en.json | sort)

MISSING_IN_EN=$(comm -23 <(echo "$FR_KEYS") <(echo "$EN_KEYS"))
MISSING_IN_FR=$(comm -13 <(echo "$FR_KEYS") <(echo "$EN_KEYS"))

if [ -n "$MISSING_IN_EN" ]; then
  echo "❌ Keys in FR but missing in EN:"
  echo "$MISSING_IN_EN" | sed 's/^/   /'
fi

if [ -n "$MISSING_IN_FR" ]; then
  echo "❌ Keys in EN but missing in FR:"
  echo "$MISSING_IN_FR" | sed 's/^/   /'
fi

if [ -z "$MISSING_IN_EN" ] && [ -z "$MISSING_IN_FR" ]; then
  echo "✅ All keys present in both locales"
fi
```

### 2. Page parity

```bash
echo "→ Checking page parity..."
FR_PAGES=$(find src/pages/fr -name "*.astro" | sed 's|src/pages/fr/||' | sort)
EN_PAGES=$(find src/pages/en -name "*.astro" | sed 's|src/pages/en/||' | sort)

# Note: file names can DIFFER between locales (good for SEO)
# So we just check that BOTH directories have the same NUMBER of leaf pages
FR_COUNT=$(echo "$FR_PAGES" | wc -l)
EN_COUNT=$(echo "$EN_PAGES" | wc -l)

if [ "$FR_COUNT" -ne "$EN_COUNT" ]; then
  echo "⚠️  Page count mismatch: FR=$FR_COUNT, EN=$EN_COUNT"
else
  echo "✅ Page count matches ($FR_COUNT pages each)"
fi
```

### 3. Hardcoded strings (should be in i18n)

```bash
echo "→ Looking for hardcoded strings in pages..."
# Find FR words in EN pages (often indicates an untranslated copy-paste)
grep -rn "le \|la \|les \|une \|un \|votre \|notre " src/pages/en/ --include="*.astro" \
  && echo "⚠️ FR words found in EN pages — review above" \
  || echo "✅ No FR words in EN pages"

# Find EN words in FR pages
grep -rn "\\bthe \\b\\|\\bof \\b\\|\\bfor \\b\\|\\bwith \\b" src/pages/fr/ --include="*.astro" \
  && echo "⚠️ EN words found in FR pages — review above" \
  || echo "✅ No EN words in FR pages"
```

### 4. hreflang reciprocity

Build the site first, then check:
```bash
pnpm build
echo "→ Checking hreflang reciprocity..."
for page in dist/fr/*.html dist/fr/**/*.html; do
  # Extract hreflang en URL
  EN_URL=$(grep -oP 'hreflang="en" href="\K[^"]+' "$page" || echo "")
  if [ -n "$EN_URL" ]; then
    # Check the EN page links back
    EN_PATH=$(echo "$EN_URL" | sed "s|https://privacyscore.fr||")
    EN_FILE="dist$EN_PATH"
    [ "${EN_FILE: -1}" = "/" ] && EN_FILE="${EN_FILE}index.html"
    [ ! -f "$EN_FILE" ] && [ -f "${EN_FILE}/index.html" ] && EN_FILE="${EN_FILE}/index.html"

    if ! grep -q "hreflang=\"fr\" href=\"https://privacyscore.fr${page#dist}\"" "$EN_FILE" 2>/dev/null; then
      echo "❌ Asymmetric hreflang: $page does not have reciprocal in $EN_FILE"
    fi
  fi
done
echo "✅ hreflang reciprocity check complete"
```

## Output

```
=== i18n Validation Report ===

✅ Translation keys: all match
✅ Page count: 12 FR / 12 EN
⚠️  Hardcoded strings: 2 EN words found in src/pages/fr/about.astro:15
✅ hreflang: all reciprocal

Action required: review src/pages/fr/about.astro line 15
```
