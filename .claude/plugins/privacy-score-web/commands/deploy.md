---
name: deploy
description: Build and deploy the site to production (user's own server). Runs security audit + SEO check + build + rsync. Aborts if any critical issue is found.
allowed-tools: Read Bash Agent
---

# /deploy command

Full production deploy workflow.

## Pre-flight checks (BLOCKING)

1. **Security audit** (delegate to security-auditor):
   ```
   Agent(subagent_type: 'security-auditor', prompt: 'Pre-deploy audit')
   ```
   If CRITICAL or HIGH findings → ABORT, ask user to fix first.

2. **SEO sanity check**:
   ```
   Agent(subagent_type: 'seo-specialist', prompt: 'Quick check: any obvious SEO breakage?')
   ```

## Build

```bash
pnpm install --frozen-lockfile
pnpm astro check
pnpm build
```

If any step fails → ABORT.

## Verify build

```bash
test -f dist/sitemap-index.xml || { echo "❌ sitemap missing"; exit 1; }
test -f dist/robots.txt || { echo "❌ robots.txt missing"; exit 1; }
test -f dist/fr/index.html || { echo "❌ FR homepage missing"; exit 1; }
test -f dist/en/index.html || { echo "❌ EN homepage missing"; exit 1; }
echo "✅ Build artifacts present"
```

## Confirm with user

Before pushing to the server, ask the user:
- "Deploy to production (privacyscore.fr)? Type 'yes' to confirm."

## Deploy

```bash
./scripts/deploy.sh
```

(Script is documented in [nginx-deployer](../skills/nginx-deployer/SKILL.md).)

## Post-deploy verification

```bash
# 1. Status code
curl -I https://privacyscore.fr/fr/

# 2. Security headers
curl -I https://privacyscore.fr/fr/ | grep -E "Strict-Transport|Content-Security|X-Content-Type"

# 3. Lighthouse on production (mobile)
npx lighthouse https://privacyscore.fr/fr/ \
  --output=json --quiet \
  --form-factor=mobile \
  --throttling-method=simulate | jq '.categories | { perf: .performance.score, seo: .seo.score, a11y: .accessibility.score }'
```

## Report to user

```
✅ Deploy complete
URL: https://privacyscore.fr/fr/

Verified:
- Status 200
- All security headers present
- Lighthouse: perf XX, SEO XX, a11y XX

Reminder: submit sitemap to Google Search Console if not done:
https://search.google.com/search-console
```
