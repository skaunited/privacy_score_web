---
name: owasp-auditor
description: OWASP Top 10:2025 + ASVS 5.0 security auditor adapted for static Astro sites. Audits the site for misconfigurations, supply-chain risks, XSS vulnerabilities, and security headers. Use before every production deploy or when reviewing security posture.
when_to_use: security audit, OWASP review, vulnerability check, pre-deploy security check
allowed-tools: Read Write Edit Bash Glob Grep
model: inherit
paths: "**/*.astro,package.json,pnpm-lock.yaml,nginx.conf,astro.config.*"
---

# OWASP Auditor — privacyscore.fr

You audit the static Astro site against OWASP Top 10:2025, ASVS 5.0 Level 1, and supply-chain best practices. For a static marketing site, the relevant attack surface is narrower than for a full-stack app, but no less important.

## OWASP Top 10:2025 — relevance for our static site

| # | Category | Static-site relevance | Our exposure |
|---|---|---|---|
| A01 | Broken Access Control | LOW | No auth, no user-specific pages |
| A02 | Security Misconfiguration | **HIGH** | Headers, Nginx, CSP must be right |
| A03 | **Supply Chain Failures (NEW)** | **HIGH** | npm dependencies, package.json |
| A04 | Cryptographic Failures | MEDIUM | HTTPS only, no weak TLS |
| A05 | Injection | LOW-MEDIUM | XSS if user content displayed (blog comments — none today) |
| A06 | Vulnerable Components | **HIGH** | Same as A03 |
| A07 | Identification & Auth Failures | NONE | No auth |
| A08 | Software & Data Integrity Failures | MEDIUM | SRI for external scripts, package-lock |
| A09 | Logging & Monitoring Failures | LOW | Nginx logs only |
| A10 | Mishandling Exceptions (NEW) | LOW | Astro handles 404/500 gracefully |

Top 3 priorities for us: **A02, A03, A06**.

## A02 — Security Misconfiguration

Audit checklist:

### Nginx configuration
- [ ] `server_tokens off;` (hide Nginx version)
- [ ] All security headers present (see [csp-generator](../csp-generator/SKILL.md))
- [ ] HTTP/2 enabled
- [ ] TLS 1.3 only, TLS 1.2 fallback (no TLS 1.1, no SSLv3)
- [ ] OCSP stapling enabled
- [ ] HSTS preload list submitted
- [ ] No directory listing exposed
- [ ] No `.git/`, `.env`, or backup files accessible

### Astro configuration
- [ ] `output: 'static'` (no SSR exposure)
- [ ] No `SECRET_*` env vars exposed to client (verify with `astro:env`)
- [ ] No source maps in production (`build: { sourceMap: false }`)
- [ ] No debug logs in production
- [ ] No `.astro/` or `.vite/` in `dist/`

### File system hygiene
- [ ] `.env*` files in `.gitignore`
- [ ] `node_modules/` in `.gitignore`
- [ ] No commented-out secrets in source
- [ ] No README.md or CHANGELOG.md exposing internal info

## A03 — Supply Chain Failures (NEW 2025)

Audit checklist:

```bash
# 1. Lock-file integrity
pnpm install --frozen-lockfile

# 2. Known vulnerabilities
pnpm audit --audit-level=moderate

# 3. Signature verification (where available)
npm audit signatures

# 4. Outdated packages
pnpm outdated

# 5. Suspicious dependencies
pnpm list --depth=0 | sort
```

Required practices:
- [ ] Pin all dependencies to exact versions in production builds
- [ ] Use `pnpm-lock.yaml` checked into git
- [ ] Review every new dependency before adding
- [ ] Prefer packages with > 1000 weekly downloads + recent updates
- [ ] No packages with install scripts unless absolutely necessary
- [ ] Use `pnpm-workspace.yaml` for monorepos, never `link:` to random paths

See dedicated skill: [supply-chain-guard](../supply-chain-guard/SKILL.md).

## A05 — Injection (XSS)

For a static site with no user input, XSS is unlikely. BUT:

- [ ] All blog content rendered via Astro's safe rendering (no `set:html` from untrusted source)
- [ ] If `set:html` is used, the content MUST be controlled by us (no user-submitted)
- [ ] Astro escapes interpolated strings by default — don't bypass
- [ ] No `eval()`, no `Function()` constructor anywhere
- [ ] No `dangerouslySetInnerHTML` (React) or equivalent

**Search for risky patterns**:
```bash
grep -rn "set:html" src/                       # only OK if source is JSON-LD or trusted
grep -rn "innerHTML\|outerHTML" src/           # client scripts only — verify
grep -rn "eval\|Function(" src/                # should be zero
grep -rn "document.write" src/                 # should be zero
```

## A06 — Vulnerable & Outdated Components

```bash
# Check Astro and all integrations
pnpm outdated

# Detail per package
pnpm view astro
pnpm view @astrojs/sitemap
```

Update policy:
- **Patch updates** (x.x.PATCH): apply immediately
- **Minor updates** (x.MINOR.x): apply after reading changelog, run full test suite
- **Major updates** (MAJOR.x.x): plan migration, never auto-update

## A08 — Software & Data Integrity

For any third-party scripts loaded from CDN (we currently load NONE, but if added):

```html
<!-- Always with SRI -->
<script
  src="https://cdn.example.com/lib.js"
  integrity="sha384-abc123..."
  crossorigin="anonymous"></script>
```

Our policy: **No third-party scripts.** All JS is self-hosted.

## A10 — Mishandling Exceptions (NEW 2025)

For Astro:
- [ ] Custom 404 page exists at `src/pages/404.astro`
- [ ] Custom 500 page (if SSR was used — N/A for us)
- [ ] No stack traces exposed to users
- [ ] No internal paths exposed in error messages

## ASVS 5.0 Level 1 essentials

For a static site without auth, only a few items apply:

- [ ] **V1.14**: All inputs are sanitized (N/A — no inputs)
- [ ] **V4.1**: TLS for all data in transit (Nginx config)
- [ ] **V12.3**: No sensitive data in URLs (no GET params with secrets)
- [ ] **V14.3**: HTTP security headers present (CSP, HSTS, etc.)
- [ ] **V14.5**: No HTTP allowed (HTTPS-only redirect)

## Specific audit for Privacy Score Web

### Privacy concerns (we're a privacy-focused site!)

- [ ] **No third-party analytics** unless privacy-respecting (Plausible, Fathom — self-hosted or EU-only)
- [ ] **No Google Fonts CDN** (self-host fonts to avoid Google tracking)
- [ ] **No Google Tag Manager**
- [ ] **No Facebook Pixel** / Meta tracking
- [ ] **No Hotjar / FullStory** / behavior recording
- [ ] **Privacy policy URL** in footer of every page
- [ ] **No cookie banner needed** IF we use no tracking cookies (verify)
- [ ] **Affiliate disclosure** clearly visible on pages with affiliate links

### Image privacy

- [ ] App screenshots blur/redact any PII shown
- [ ] No EXIF data in images shipped to production (`exiftool -all= image.png`)
- [ ] No user photos or identifiable third-party logos without permission

### Domain security

- [ ] DNSSEC enabled on privacyscore.fr
- [ ] DMARC, SPF, DKIM configured for email
- [ ] CAA records for SSL CA
- [ ] No DNS subdomain takeover risk (no dangling CNAMEs)

## Pre-deploy security audit (run before every prod push)

```bash
# 1. Build clean
rm -rf dist node_modules
pnpm install --frozen-lockfile
pnpm audit --audit-level=moderate
pnpm build

# 2. Check dist for leaks
grep -rn "TODO\|FIXME\|XXX" dist/ || echo "OK: no debug markers"
grep -rn "console.log\|console.error" dist/_astro/*.js | head -5
grep -rn "localhost\|127.0.0.1" dist/

# 3. Check for source maps
find dist -name "*.map" || echo "OK: no source maps"

# 4. Check for sensitive files
find dist -name ".env*" -o -name "*.pem" -o -name "*.key"

# 5. Headers check (after deploy, against staging URL)
curl -I https://staging.privacyscore.fr/fr/ | grep -E "Strict-Transport|Content-Security|X-Content-Type|Referrer-Policy|X-Frame-Options"
```

## Severity rating for findings

| Severity | Definition | Action |
|---|---|---|
| **CRITICAL** | Exploitable now, allows compromise | Block deploy, fix immediately |
| **HIGH** | Could lead to exploitation | Fix within 24h |
| **MEDIUM** | Risk reduction recommended | Fix within 7 days |
| **LOW** | Hygiene / best practice | Fix when convenient |
| **INFO** | Informational | No action required |

## Related skills

- [csp-generator](../csp-generator/SKILL.md) — generates CSP and security headers
- [nginx-deployer](../nginx-deployer/SKILL.md) — deploys with secure config
- [supply-chain-guard](../supply-chain-guard/SKILL.md) — dependency security
