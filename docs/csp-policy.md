# CSP & Security Headers — privacyscore.fr

Produced by the `audit-security` skill during Phase 5 (pre-deploy validation).
Consumed by the `nginx-deployer` skill in Phase 6.

The site is a **static Astro 5.18 SSG, served over HTTPS only by nginx, no backend,
no cookies, no auth, no forms**. The headers below are the recommended baseline.
All values are nginx-syntax ready (`add_header NAME "VALUE" always;`).

---

## 1. Required headers (set on every HTML response)

### `Strict-Transport-Security`
```
max-age=63072000; includeSubDomains; preload
```
- 2 years, includes subdomains, eligible for HSTS preload list.
- Apply **only after** you confirm the apex + every subdomain serves HTTPS
  cleanly, since preload is hard to undo.

### `X-Content-Type-Options`
```
nosniff
```
- Disables MIME sniffing. Required for `.js` and `.css` to be respected as such.

### `X-Frame-Options`
```
DENY
```
- Belt-and-suspenders alongside `frame-ancestors 'none'` in the CSP.
- Some legacy crawlers / scanners still check this header explicitly.

### `Referrer-Policy`
```
strict-origin-when-cross-origin
```
- Sends only the origin on cross-origin, full URL on same-origin.
- Matches the privacy posture of the brand without breaking analytics
  attribution (there is no analytics anyway).

### `Permissions-Policy`
```
accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), camera=(), cross-origin-isolated=(), display-capture=(), document-domain=(), encrypted-media=(), execution-while-not-rendered=(), execution-while-out-of-viewport=(), fullscreen=(), geolocation=(), gyroscope=(), keyboard-map=(), magnetometer=(), microphone=(), midi=(), navigation-override=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), usb=(), web-share=(), xr-spatial-tracking=(), interest-cohort=()
```
- Disables **every** powerful feature. The site uses none.
- `interest-cohort=()` opts out of FLoC / Topics API — important for a
  privacy-branded site.
- Keep on one line in nginx (no continuation), or use the long form below.

### `Cross-Origin-Opener-Policy`
```
same-origin
```
- Isolates the browsing context. Cheap win for a static site.

### `Cross-Origin-Resource-Policy`
```
same-origin
```
- Prevents other origins from embedding our assets cross-origin.
- May need `cross-origin` if you ever embed the OG image elsewhere; revisit then.

### `X-Permitted-Cross-Domain-Policies`
```
none
```
- Legacy Adobe Flash / PDF reader cross-domain policy lockdown.

---

## 2. Content-Security-Policy

The strict policy below was derived from a full grep of `src/` and `dist/`.

### Inputs that shaped the policy

| Source                                        | Need                                              |
|-----------------------------------------------|---------------------------------------------------|
| BaseLayout inline `<script>` (no-js strip)    | `'sha256-tuKyZn/3ycw/MNMDii/kvSPrelo6SCsJSecqb1n2neg='` |
| Astro's reveal-on-scroll IO bootstrap         | `'sha256-JUQY9bx/3OgTEeL9P9E+QGpc9OSK3s0DkjaV9RGJqC4='` |
| Root `/` language sniffer (index.astro)       | `'sha256-SpCO0lCmBdYkOQd77GjKgwUFoMzivNECjdsoCInNllo='` |
| JSON-LD blocks (`type="application/ld+json"`) | Not script-executing → does NOT need a hash (browsers exempt non-executable script types from CSP `script-src`) |
| `ds.css` `@import url('https://fonts.googleapis.com/...')` × 4 | `style-src https://fonts.googleapis.com` |
| Google Fonts woff2 files                      | `font-src https://fonts.gstatic.com`              |
| Astro inlined critical CSS                    | `style-src 'self' 'unsafe-inline'` (Astro inlines critical CSS as `<style>` blocks — hashing is impractical because Vite rotates them per build) |
| All `<img src="…">`                           | `img-src 'self' data:` (data: needed for inline SVG icons) |
| All `<a href="…">`                            | First-party only or `mailto:` — no `connect-src` needed |
| Astro's hashed JS bundle                      | `script-src 'self'`                               |
| `<link rel="preconnect" href="https://fonts.{googleapis,gstatic}.com">` | covered by style-src / font-src |

### Production policy (nginx-ready)

```
default-src 'none';
script-src 'self' 'sha256-tuKyZn/3ycw/MNMDii/kvSPrelo6SCsJSecqb1n2neg=' 'sha256-JUQY9bx/3OgTEeL9P9E+QGpc9OSK3s0DkjaV9RGJqC4=' 'sha256-SpCO0lCmBdYkOQd77GjKgwUFoMzivNECjdsoCInNllo=';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data:;
connect-src 'self';
manifest-src 'self';
base-uri 'self';
form-action 'none';
frame-ancestors 'none';
upgrade-insecure-requests;
```

### Notes & known trade-offs

1. **`style-src 'unsafe-inline'`** — Astro inlines small critical CSS as
   `<style>` blocks whose content rotates every build. Per-hash whitelisting is
   not maintainable. The risk of CSS-injection on a static site with no user
   input is negligible (no DOM-XSS sink, no API). If a strict-only posture is
   desired later, hash every inlined `<style>` block at deploy time via a
   build-time CSP generator.

2. **`fonts.googleapis.com` / `fonts.gstatic.com`** — These are third-party
   requests. Per Google's 2022 statement, font requests are not logged with IPs,
   and there is no cookie. Acceptable for v1. For a stricter privacy posture
   (recommended for v2), self-host the four font families to `/public/fonts/`
   and remove the `@import` lines from `ds.css`. This would simplify the CSP to
   `font-src 'self'` and `style-src 'self' 'unsafe-inline'`.

3. **No `report-uri` / `report-to`** — Deliberate. We don't want to ship CSP
   reports to a third-party endpoint and have no first-party endpoint to
   receive them. Re-evaluate if/when a server-side component is added.

4. **`upgrade-insecure-requests`** — Forces mixed-content protocol upgrade.
   Defense in depth; should be a no-op since `src/` has no `http://` URLs.

5. **JSON-LD** does **not** need a CSP hash. Browsers do not execute
   `type="application/ld+json"` scripts, and the CSP `script-src` directive
   applies only to executable scripts (ECMAScript). Verified in WHATWG CSP3 §4.2.5.

---

## 3. Headers NOT to add

- `X-XSS-Protection: 1; mode=block` — deprecated, removed from Chrome 78,
  can actually introduce XSS in legacy browsers. Skip.
- `Public-Key-Pins` — deprecated, removed from Chrome 72. Skip.
- `Feature-Policy` — superseded by `Permissions-Policy`. Skip.
- `Expect-CT` — obsolete since browsers enforce CT by default. Skip.

---

## 4. Cache-Control hints for nginx (informational)

Not security per se, but the nginx config should set:

| Path pattern                | Cache-Control                                 |
|-----------------------------|-----------------------------------------------|
| `/_astro/*` (hashed assets) | `public, max-age=31536000, immutable`         |
| `/assets/*.{png,svg,webp}`  | `public, max-age=2592000`                     |
| `*.html`, `/`, `/fr/`, `/en/`, `/404.html` | `public, max-age=300, must-revalidate` |
| `/sitemap-index.xml`, `/sitemap-0.xml`, `/robots.txt`, `/humans.txt` | `public, max-age=3600` |

---

## 5. Verification checklist (run after Phase 6 deploy)

- [ ] `curl -I https://privacyscore.fr/fr/` → all 9 headers present
- [ ] `curl -I https://privacyscore.fr/` → same (root sniffer page)
- [ ] https://securityheaders.com/?q=privacyscore.fr → target **A+**
- [ ] https://observatory.mozilla.org/analyze/privacyscore.fr → target **A+**
- [ ] https://www.ssllabs.com/ssltest/analyze.html?d=privacyscore.fr → target **A+**
- [ ] Open `https://privacyscore.fr/fr/` in Firefox + DevTools → 0 CSP violations
- [ ] Open `https://privacyscore.fr/en/` in Chromium + DevTools → 0 CSP violations
- [ ] Confirm zero `Set-Cookie` headers anywhere
- [ ] Confirm DNS: DNSSEC enabled, CAA records restrict CAs, DMARC/SPF for email

If any CSP violation is reported by a browser console after deploy, **do not**
loosen the policy reflexively — re-audit which script changed and re-hash.

---

## 6. CSP hash maintenance

The three `sha256-…` hashes in `script-src` correspond to **deterministic** inline
scripts authored in source. They only change if you edit:

1. `src/layouts/BaseLayout.astro` line 66 (`document.documentElement.classList.remove('no-js')`)
2. `src/pages/index.astro` lines 27-44 (root language sniffer)
3. The Astro-emitted reveal-on-scroll IO bootstrap (rare; only changes on
   Astro major-version updates affecting the View Transitions / prefetch code).

To regenerate after any edit, run from the project root after `pnpm build`:

```bash
python3 - <<'PY'
import re, os, hashlib, base64
seen = set()
for root, _, files in os.walk('dist'):
    for f in files:
        if not f.endswith('.html'):
            continue
        html = open(os.path.join(root, f)).read()
        for m in re.finditer(r'<script([^>]*)>(.*?)</script>', html, re.DOTALL):
            attrs, content = m.group(1), m.group(2)
            if 'src=' in attrs or 'application/ld+json' in attrs:
                continue
            h = base64.b64encode(hashlib.sha256(content.encode()).digest()).decode()
            seen.add(h)
for h in sorted(seen):
    print(f"'sha256-{h}'")
PY
```

Update the three hashes in `nginx/security-headers.conf` (Phase 6 artifact)
whenever the script above prints values that don't match.
