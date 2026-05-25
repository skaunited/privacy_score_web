---
name: csp-generator
description: Generates and maintains Content Security Policy (CSP) and HTTP security headers for the Astro static site. Scans the codebase for inline scripts/styles, generates appropriate nonces or hashes, and produces ready-to-deploy CSP directives. Use when setting up CSP, adding new third-party resources, or fixing CSP violations.
when_to_use: CSP setup, security headers, fixing CSP violations, third-party resource integration
allowed-tools: Read Write Edit Bash Glob Grep
model: inherit
paths: "**/*.astro,**/*.html,nginx.conf,astro.config.*"
---

# CSP Generator — privacyscore.fr

You generate and maintain a strict Content Security Policy for the static Astro site. Goal: pass the [securityheaders.com](https://securityheaders.com) test with grade A+ and the [observatory.mozilla.org](https://observatory.mozilla.org) test with grade A+.

## Target CSP (production)

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://privacyscore.fr;
  font-src 'self';
  connect-src 'self';
  frame-src 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
  report-uri https://privacyscore.fr/csp-report;
```

Why `'unsafe-inline'` for styles? Astro inlines small stylesheets for performance. We accept this trade-off because:
1. We never accept user-submitted content
2. No third-party styles loaded
3. Style injection attacks have minimal impact vs script attacks

To remove `'unsafe-inline'` for styles, use nonces (see Advanced section below).

## Complete security headers stack

Add these to Nginx (see [nginx-deployer](../nginx-deployer/SKILL.md)):

```nginx
# Strict transport security (2 years, include subdomains, preload)
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

# Content Security Policy
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://privacyscore.fr; font-src 'self'; connect-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests" always;

# Permissions Policy (formerly Feature-Policy)
add_header Permissions-Policy "geolocation=(), microphone=(), camera=(), payment=(), usb=(), bluetooth=(), accelerometer=(), gyroscope=(), magnetometer=(), midi=(), interest-cohort=()" always;

# Anti-clickjacking
add_header X-Frame-Options "DENY" always;

# MIME-sniffing prevention
add_header X-Content-Type-Options "nosniff" always;

# Referrer policy
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Cross-Origin policies
add_header Cross-Origin-Opener-Policy "same-origin" always;
add_header Cross-Origin-Embedder-Policy "require-corp" always;
add_header Cross-Origin-Resource-Policy "same-origin" always;

# Hide Nginx version
server_tokens off;
```

## CSP audit workflow

When asked to audit/update CSP:

### Step 1: Find all inline scripts and styles

```bash
# Inline <script>
grep -rn "<script>" src/ --include="*.astro"
grep -rn "<script " src/ --include="*.astro" | grep -v "src="

# Inline event handlers
grep -rn "onclick\|onload\|onerror\|onsubmit" src/ --include="*.astro"

# Inline styles
grep -rn "style=\"" src/ --include="*.astro"
grep -rn "<style>" src/ --include="*.astro"
```

### Step 2: Find all external resources

```bash
# External scripts
grep -rn "<script.*src=\"http" src/

# External stylesheets
grep -rn "<link.*href=\"http" src/

# External images
grep -rn "src=\"https://" src/ --include="*.astro" | grep -v "privacyscore.fr"

# External fonts
grep -rn "fonts.googleapis\|fonts.gstatic" src/
```

### Step 3: Document each finding

For each external resource found, document:
- URL pattern
- Why it's needed
- Is there a self-hosted alternative? (PREFER self-hosting)
- If keeping external: SRI hash required

### Step 4: Update CSP directives

If a new external script is justified, add to script-src:
```nginx
script-src 'self' https://cdn.example.com;
```

Always with SRI in the HTML:
```html
<script src="https://cdn.example.com/lib.js" integrity="sha384-..." crossorigin="anonymous"></script>
```

## CSP report-only mode (for safe rollout)

Before enforcing strict CSP, deploy a report-only version:

```nginx
# REPORT-ONLY: see what would be blocked, don't actually block
add_header Content-Security-Policy-Report-Only "default-src 'self'; script-src 'self'; ..." always;
```

Set up a `/csp-report` endpoint or use a service like [report-uri.com](https://report-uri.com) (free tier).

After 7 days with no real violations, switch to enforcing mode.

## Refactoring inline JavaScript to be CSP-friendly

### Pattern 1: Inline event handlers → addEventListener

❌ BAD (violates CSP):
```html
<button onclick="handleClick()">Click</button>
<script>function handleClick() { alert('hi'); }</script>
```

✅ GOOD:
```html
<button id="my-btn">Click</button>
<script>
  document.getElementById('my-btn').addEventListener('click', () => alert('hi'));
</script>
```

But the inline `<script>` still violates. So move to external:

✅ BEST:
```html
<button id="my-btn">Click</button>
<script src="/scripts/click-handler.js"></script>
```

Where `/scripts/click-handler.js` contains:
```js
document.getElementById('my-btn').addEventListener('click', () => alert('hi'));
```

### Pattern 2: Inline `style="..."` → CSS classes

❌ BAD:
```html
<div style="color: red; padding: 10px;">Hello</div>
```

✅ GOOD:
```html
<div class="alert">Hello</div>
```
```css
.alert { color: red; padding: 10px; }
```

### Pattern 3: JSON-LD (allowed exception)

JSON-LD `<script type="application/ld+json">` is fine — it's data, not executable:

```astro
<script type="application/ld+json" set:html={JSON.stringify(jsonLdData)}></script>
```

This is allowed because:
- Type is `application/ld+json`, not executable JS
- It's data, parsed by search engines, never executed by the browser
- CSP does not block `type="application/ld+json"`

## Advanced: nonce-based CSP (no `'unsafe-inline'` for styles)

For maximum security, generate nonces per request. Requires Nginx with sub_filter or build-time generation.

Astro 6's built-in CSP support:

```js
// astro.config.mjs
export default defineConfig({
  // ...
  csp: {
    algorithm: 'SHA-256',
    scriptDirective: {
      strictDynamic: true,
    },
    styleDirective: {
      // Astro will auto-add hashes for inline styles
    },
  },
});
```

This computes SHA-256 hashes for all inline styles at build time. Resulting CSP:

```
style-src 'self' 'sha256-abc123...' 'sha256-def456...';
```

## Common CSP violations and fixes

| Violation | Cause | Fix |
|---|---|---|
| Inline script blocked | `<script>...</script>` inline | Move to external `.js` file |
| Inline event handler | `onclick="..."` | Use `addEventListener` |
| Inline style blocked | `style="..."` | Use CSS class |
| Google Fonts blocked | `fonts.googleapis.com` in CSS | Self-host fonts |
| Analytics blocked | Third-party analytics CDN | Self-host Plausible or remove |
| Image from CDN blocked | `<img src="cdn.x.com/...">` | Add to `img-src` |
| YouTube embed blocked | `<iframe src="youtube.com">` | Add `https://www.youtube-nocookie.com` to `frame-src` |

## Testing the CSP

After deploying:

```bash
# Headers check
curl -I https://privacyscore.fr/fr/ | grep -i "content-security-policy"

# Online tools
# https://securityheaders.com/?q=privacyscore.fr
# https://observatory.mozilla.org/analyze/privacyscore.fr
# https://csp-evaluator.withgoogle.com/
```

Targets:
- securityheaders.com: A+
- Mozilla Observatory: A+ (130+)
- CSP Evaluator: All directives green

## Privacy-specific CSP additions

Since we're a privacy-focused site:

- ❌ NO `https://*.google.com` in connect-src (no tracking)
- ❌ NO `https://*.facebook.com` (no FB pixel)
- ❌ NO `https://*.googletagmanager.com` (no GTM)
- ✅ ONLY `'self'` and necessary partners (with disclosure)

## Related skills

- [nginx-deployer](../nginx-deployer/SKILL.md) — applies these headers in production
- [owasp-auditor](../owasp-auditor/SKILL.md) — verifies headers via audit
- [astro-builder](../astro-builder/SKILL.md) — Astro CSP integration
