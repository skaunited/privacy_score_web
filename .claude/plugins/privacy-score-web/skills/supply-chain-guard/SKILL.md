---
name: supply-chain-guard
description: Real-time supply-chain security for npm dependencies. Checks for compromised packages, suspicious install scripts, audits the dependency tree, verifies lock-file integrity. Use when adding new dependencies, upgrading, or running pre-deploy security checks.
when_to_use: adding npm dependency, upgrading packages, audit dependencies, supply chain check, package.json changes
allowed-tools: Read Write Edit Bash Glob Grep
model: inherit
paths: "package.json,pnpm-lock.yaml,package-lock.json,yarn.lock"
---

# Supply Chain Guard — privacyscore.fr

You protect the project from supply-chain attacks. OWASP A03:2025 (Supply Chain Failures) is the second-most-likely attack vector for our static site after misconfiguration. The npm ecosystem sees multiple compromised packages per month.

## Core principles

1. **Minimize dependencies** — Every dep is attack surface. If you can write it in 10 lines, do.
2. **Pin everything** — Use exact versions in production. `pnpm install --frozen-lockfile`.
3. **Verify before adding** — Never add a package without auditing it.
4. **Audit continuously** — Run `pnpm audit` weekly.
5. **Lock-file in git** — Always commit `pnpm-lock.yaml`.

## Before adding ANY dependency

Run through this checklist:

```bash
PKG="package-name"

# 1. Package exists and metadata
pnpm view $PKG

# 2. Weekly downloads (>1000 = mainstream)
pnpm view $PKG downloads | tail -1

# 3. Last published (should be recent, < 12 months)
pnpm view $PKG time | tail -3

# 4. Maintainer count + activity
pnpm view $PKG maintainers
pnpm view $PKG repository

# 5. Install scripts? (RED FLAG if yes)
pnpm view $PKG scripts.install
pnpm view $PKG scripts.postinstall
pnpm view $PKG scripts.preinstall

# 6. Size on disk
pnpm view $PKG dist.unpackedSize

# 7. Number of dependencies it pulls in
npx npq $PKG    # or:
pnpm view $PKG dependencies
```

### Reject criteria (DO NOT install if)

- ❌ < 1000 weekly downloads (unless from a trusted maintainer like sindresorhus, alexreardon, etc.)
- ❌ Last publish > 18 months ago (likely unmaintained)
- ❌ Has install/postinstall script (unless absolutely necessary AND the script is auditable)
- ❌ Maintainer with 0-1 packages and no GitHub history
- ❌ Recently transferred ownership (check `pnpm view <pkg> maintainers` history)
- ❌ Package name typo-squats a popular one (`reqest` instead of `request`, `lodahs` instead of `lodash`)
- ❌ Pulls in > 50 transitive dependencies for a simple task
- ❌ License is missing or non-OSI-approved

### Acceptable criteria

- ✅ Official `@astrojs/*` packages (Astro core)
- ✅ Packages from known maintainers (`sindresorhus`, `tholman`, `philsturgeon`, etc.)
- ✅ Packages with > 100k weekly downloads (mainstream, attack would be noticed fast)
- ✅ Packages whose source you've actually read

## Allowed dependencies for privacyscore.fr (v1 whitelist)

```text
# Astro core + integrations
astro                          ^6.3
@astrojs/sitemap               ^3.7
@astrojs/mdx                   ^5.0
@astrojs/rss                   ^4.0
@astrojs/check                 ^0.9
@astrojs/tailwind              ^6.0

# SEO
astro-seo                      ^1.1
astro-robots-txt               ^1.0
astro-seo-schema               ^6.0
schema-dts                     ^2.0

# Styling
tailwindcss                    ^4.0
@tailwindcss/typography        ^0.5

# Animation
motion                         ^11.0  (only mini import: 'motion/mini')

# Build / TS
typescript                     ^5.5
```

Total: ~12 direct dependencies. Anything else requires a justification PR.

## Daily/weekly audit commands

```bash
# Daily: lock-file integrity check (run in CI on every PR)
pnpm install --frozen-lockfile

# Weekly: vulnerability audit
pnpm audit --audit-level=moderate

# Weekly: outdated check
pnpm outdated

# Weekly: full dependency review
pnpm list --depth=0 | sort

# Monthly: signature verification (where available)
npm audit signatures

# When alerted to a known compromised package:
pnpm why <compromised-package>     # see if we use it transitively
```

## Compromised packages — what to do

If a known-compromised package is in our tree:

```bash
# 1. IMMEDIATELY check if we have it
pnpm why <package-name>

# 2. If yes, find the route
pnpm list <package-name>

# 3. If direct dep: remove or replace
pnpm remove <package-name>

# 4. If transitive: pin the parent to an unaffected version, or use pnpm overrides
# In package.json:
{
  "pnpm": {
    "overrides": {
      "compromised-pkg@<=1.2.3": ">=1.2.4"
    }
  }
}

# 5. Reinstall
pnpm install --frozen-lockfile

# 6. Re-audit
pnpm audit
```

## Watch list (subscribe to alerts)

- **GitHub Security Advisories**: https://github.com/advisories
- **Snyk Vulnerability DB**: https://security.snyk.io/
- **npm Security Alerts**: enable in repo settings
- **Socket.dev**: monitors typosquats and suspicious behavior
- **OSV.dev**: open source vulnerabilities

## Pre-deploy supply-chain checklist

```bash
#!/usr/bin/env bash
set -e

echo "→ Lock-file integrity..."
pnpm install --frozen-lockfile

echo "→ Vulnerability scan..."
pnpm audit --audit-level=moderate

echo "→ Outdated packages..."
OUTDATED=$(pnpm outdated --json 2>/dev/null | jq 'length')
if [ "$OUTDATED" -gt 5 ]; then
  echo "⚠️  $OUTDATED outdated packages — review before deploy"
fi

echo "→ Suspicious install scripts in tree..."
pnpm list --depth=10 | grep -E "(install|postinstall)" || echo "OK: no install scripts found"

echo "→ Total dependencies in tree..."
TOTAL=$(pnpm list --depth=10 --parseable | wc -l)
echo "Total: $TOTAL deps. (Target: < 500 for a static marketing site)"

echo "✅ Supply chain audit complete"
```

## SBOM (Software Bill of Materials)

Generate a SBOM monthly for transparency:

```bash
# Using @cyclonedx/cdxgen
npx @cyclonedx/cdxgen -o sbom.json -t pnpm .

# Or simpler dump
pnpm list --depth=10 --parseable > sbom.txt
```

Store under `docs/sboms/YYYY-MM.json` — useful for incident response and compliance.

## When evaluating a new dependency request

Format the analysis:

```markdown
## Dependency Review: `<package-name>`

### Stats
- Weekly downloads: <number>
- Last published: <date>
- Maintainers: <number>
- License: <license>
- Size: <KB>
- Transitive deps: <number>

### Verdict
✅ APPROVED / ⚠️ APPROVED WITH CONDITIONS / ❌ REJECTED

### Reasoning
<1-2 paragraphs>

### Alternative considered
<if applicable>
```

## What to do when alerted to a real attack

1. **Read the advisory carefully** — Which versions are affected?
2. **Check if WE use it**: `pnpm why <pkg>`
3. **If we do, upgrade IMMEDIATELY**:
   ```bash
   pnpm update <pkg>@<safe-version>
   pnpm install --frozen-lockfile
   pnpm audit
   ```
4. **Rebuild and redeploy**: `pnpm build && ./scripts/deploy.sh`
5. **Document in changelog**: "Security: upgraded <pkg> to address CVE-XXXX-YYYY"
6. **Notify users** (if site downtime occurred or data may have been exposed — for our static site, impact is usually low)

## Related skills

- [owasp-auditor](../owasp-auditor/SKILL.md) — broader security audit including A03
- [nginx-deployer](../nginx-deployer/SKILL.md) — deploy after upgrades
