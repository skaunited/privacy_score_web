# DEPLOY.md — Manual upload to your own server

> **Goal:** ship `dist/` to your server **without git on the server**. You build locally, then upload the files by hand via SFTP / SCP / file-manager. Server pulls from nothing, no webhook, no CI runner.

This is more secure (no SSH key for git, no token, no exposed `.git` directory), and simpler to audit.

---

## 1. One-time server setup (Linux + nginx)

Do these once. You'll never need them again unless you rebuild the server.

### 1.1 Install nginx + certbot

Run on the **server** (SSH in once for the setup):

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
# Optional but recommended for ~25% smaller payloads vs gzip:
sudo apt install -y libnginx-mod-brotli
```

### 1.2 Create the document root

```bash
sudo mkdir -p /var/www/privacyscore.fr
sudo chown -R $USER:$USER /var/www/privacyscore.fr
```

### 1.3 Point your DNS

At your registrar:

| Type | Name | Value | TTL |
|---|---|---|---|
| `A`     | `@` (or `privacyscore.fr`) | your-server-ip | 3600 |
| `A`     | `www`                       | your-server-ip | 3600 |
| `AAAA`  | `@`                         | your-server-ipv6 (if any) | 3600 |
| `CAA`   | `@`                         | `0 issue "letsencrypt.org"` | 3600 |

Wait for DNS to propagate (a few minutes to a few hours). Verify:
```bash
dig +short privacyscore.fr
```

### 1.4 Get an SSL certificate

```bash
sudo certbot --nginx -d privacyscore.fr -d www.privacyscore.fr \
  --agree-tos -m security@privacyscore.fr --non-interactive
```

Certbot installs an auto-renewal timer. Verify:
```bash
sudo systemctl status certbot.timer
sudo certbot renew --dry-run
```

### 1.5 Install the nginx config

Upload the nginx config file (see §5 below) to the server, e.g. at `/etc/nginx/sites-available/privacyscore.fr`, then:

```bash
sudo ln -s /etc/nginx/sites-available/privacyscore.fr /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default       # remove default page
sudo nginx -t                                      # syntax check
sudo systemctl reload nginx
```

### 1.6 Smoke-test the empty server

```bash
curl -I https://privacyscore.fr/        # 404 (no files uploaded yet) — that's expected
```

If you get a 404 from nginx (and NOT a TLS error), the server is ready. Now you can ship the site.

---

## 2. Every deploy — local build

On your **local machine**, in the project root:

```bash
pnpm install      # only if deps changed since last deploy
pnpm build        # runs astro check then astro build — must end with "Complete!"
```

This refreshes `dist/`. Run pre-flight sanity checks:

```bash
# All four pages built?
ls dist/index.html dist/fr/index.html dist/en/index.html dist/404.html

# Sitemap?
ls dist/sitemap-index.xml dist/sitemap-0.xml

# Robots + security.txt?
ls dist/robots.txt dist/.well-known/security.txt

# Hashed assets present?
ls dist/_astro/

# Final smoke: serve locally and curl
pnpm preview --port 4322 &
sleep 3
curl -s -o /dev/null -w "FR %{http_code}\n" http://localhost:4322/fr/
curl -s -o /dev/null -w "EN %{http_code}\n" http://localhost:4322/en/
pkill -f "astro preview"
```

If all green, `dist/` is ready to ship.

---

## 3. Every deploy — upload `dist/` to the server

Pick whichever upload method you prefer. **All three do the same job** — they replace the contents of `/var/www/privacyscore.fr/` on the server with the contents of your local `dist/`.

### Option A — GUI: FileZilla / Cyberduck / Transmit (easiest)

1. Open your SFTP client.
2. Connect: host `privacyscore.fr`, user `<your-user>`, port `22`, **SFTP** (not FTP — FTP sends passwords in cleartext).
3. **Server pane**: navigate to `/var/www/privacyscore.fr/`
4. **Local pane**: navigate to your project, into the `dist/` folder.
5. Select ALL files **inside** `dist/` (Cmd-A) — note: **inside**, not the `dist/` folder itself.
6. Drag and drop to the server pane.
7. When prompted on conflicts: **Overwrite all**.

Then clean up stale hashed assets (see §3.4 below).

### Option B — Command-line: `scp` (one-liner)

```bash
scp -r dist/* user@privacyscore.fr:/var/www/privacyscore.fr/
```

`scp` does NOT delete files that no longer exist locally. After uploading, manually delete stale hashed CSS/JS (see §3.4).

### Option C — Web file-manager (cPanel / Plesk / Hestia)

1. Log in to your panel.
2. Open the File Manager.
3. Navigate to `/var/www/privacyscore.fr/` (or the panel-mapped path — often `/home/USER/public_html/`).
4. **Delete** the existing `_astro/` folder first (to avoid stale hashed assets accumulating).
5. **Upload**: select all files inside your local `dist/`, upload, overwrite on conflict.

### 3.4 Clean up stale hashed assets

Every build produces fresh hashed filenames in `_astro/` (e.g. `index.BudXbcOV.css` → next build → `index.K8d9Lp.css`). Old files don't auto-delete on `scp` or SFTP — over time you'll accumulate dozens of dead CSS/JS files.

**Two options:**

- **Aggressive (recommended):** before uploading, SSH to the server and delete the old `_astro/` folder:
  ```bash
  rm -rf /var/www/privacyscore.fr/_astro/
  ```
  Then upload — only the fresh hashed files end up there.

- **Conservative:** leave old hashed files in place. They keep working for any user who has a stale HTML page cached in their browser. The cost is disk space (negligible — each is < 50 KB). Clean up once a quarter.

### 3.5 What you must NEVER upload

The following should **never** be on the server. The `.gitignore` already excludes them locally, but be careful when bulk-selecting:

| File / folder | Why not |
|---|---|
| `node_modules/` | Huge, server doesn't need it (everything is in `dist/`) |
| `src/`, `public/` | Source. Server only serves `dist/`. |
| `.env` (if you have one) | Secrets |
| `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `tsconfig.json`, `astro.config.mjs` | Build config, not for the public |
| `*.md` (README.md, DEPLOY.md, SEO.md, etc.) | Internal docs |
| `docs/` | Internal docs incl. SBOM and CSP policy |
| `privacy-score-web-design/` | Design handoff bundle |
| `APP_RECAP.md` | Contains unverified facts and internal notes |
| Anything starting with `.` (`.DS_Store`, `.git`, `.npmrc`, `.gitignore`) | Hidden files / dev metadata |

**Rule:** only upload what's **inside** `dist/`. Nothing else.

The nginx config in §5 also blocks `\.(env|git|md|json|yml|yaml|toml|lock)$` at the URL level as a belt-and-braces safeguard, but the right discipline is "don't upload it in the first place."

---

## 4. Post-deploy verification

Run these from your local machine after every upload:

```bash
# 1. Each page returns 200
for path in /fr/ /en/ / /robots.txt /sitemap-index.xml /humans.txt /.well-known/security.txt /404.html; do
  printf "%-30s " "$path"
  curl -s -o /dev/null -w "%{http_code}\n" "https://privacyscore.fr$path"
done

# 2. Security headers present
curl -sI https://privacyscore.fr/fr/ | grep -iE "strict-transport|content-security|x-frame|x-content-type|referrer-policy|permissions-policy"

# 3. Brotli active (the response should say Content-Encoding: br)
curl -sI -H "Accept-Encoding: br,gzip" https://privacyscore.fr/_astro/index.HiGDxPqD.css | grep -i "content-encoding"

# 4. Cache-Control on hashed assets says immutable
curl -sI https://privacyscore.fr/_astro/index.HiGDxPqD.css | grep -i "cache-control"

# 5. HTML pages NOT cached (always fresh)
curl -sI https://privacyscore.fr/fr/ | grep -i "cache-control"
```

External validators (run these once after first deploy, then once a quarter):

- **SSL Labs** → https://www.ssllabs.com/ssltest/analyze.html?d=privacyscore.fr — should be **A or A+**
- **Security Headers** → https://securityheaders.com/?q=privacyscore.fr&hide=on&followRedirects=on — should be **A+**
- **Mozilla Observatory** → https://observatory.mozilla.org/analyze/privacyscore.fr — should be **A+ (90+)**
- **Google Rich Results Test** → https://search.google.com/test/rich-results — paste `https://privacyscore.fr/fr/` and confirm WebSite, MobileApplication, Organization, FAQPage all detected.

---

## 5. The nginx config — `/etc/nginx/sites-available/privacyscore.fr`

Copy-paste this file verbatim. The CSP `sha256-...` hashes come from `docs/csp-policy.md` (security-auditor pre-computed them against the built inline scripts). **If you change any inline `<script>` in `BaseLayout.astro`, the hashes drift and you'll have to recompute them** — see `docs/csp-policy.md §6` for the regenerate snippet.

```nginx
# ========================================================================
# privacyscore.fr — production
# Static SSG site served from /var/www/privacyscore.fr/
# ========================================================================

# ── HTTP → HTTPS redirect ──────────────────────────────────────────────
server {
    listen 80;
    listen [::]:80;
    server_name privacyscore.fr www.privacyscore.fr;
    return 301 https://privacyscore.fr$request_uri;
}

# ── www → apex redirect ────────────────────────────────────────────────
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.privacyscore.fr;

    ssl_certificate     /etc/letsencrypt/live/privacyscore.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/privacyscore.fr/privkey.pem;

    return 301 https://privacyscore.fr$request_uri;
}

# ── Main server block ──────────────────────────────────────────────────
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name privacyscore.fr;

    root /var/www/privacyscore.fr;
    index index.html;

    server_tokens off;
    charset utf-8;

    # ── SSL / TLS ──
    ssl_certificate         /etc/letsencrypt/live/privacyscore.fr/fullchain.pem;
    ssl_certificate_key     /etc/letsencrypt/live/privacyscore.fr/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/privacyscore.fr/chain.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;

    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 1.1.1.1 1.0.0.1 valid=300s;
    resolver_timeout 5s;

    # ── Security headers (apply to every response) ──
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Cross-Origin-Opener-Policy "same-origin" always;
    add_header Cross-Origin-Resource-Policy "same-origin" always;
    add_header Permissions-Policy "accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), camera=(), display-capture=(), document-domain=(), encrypted-media=(), fullscreen=(self), geolocation=(), gyroscope=(), interest-cohort=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), usb=(), web-share=(), xr-spatial-tracking=()" always;
    add_header Content-Security-Policy "default-src 'none'; script-src 'self' 'sha256-REPLACE_WITH_HASH_FROM_csp-policy.md'; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'none'; manifest-src 'self'; upgrade-insecure-requests" always;

    # ── Compression ──
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript
               application/javascript application/xml application/xml+rss
               application/json application/ld+json image/svg+xml font/woff2;

    # Brotli (requires nginx-module-brotli installed in §1.1)
    brotli on;
    brotli_static on;
    brotli_comp_level 6;
    brotli_types text/plain text/css text/xml text/javascript
                 application/javascript application/json application/ld+json
                 image/svg+xml font/woff2;

    # ── Cache control ──
    # HTML: never cache, always fresh
    location ~ \.html$ {
        add_header Cache-Control "no-cache, must-revalidate";
        # Security headers are inherited from server block via "always".
    }

    # Astro-hashed assets (filename has the hash → safe to cache forever)
    location /_astro/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }

    # Images: cache 30 days
    location ~* \.(png|jpg|jpeg|gif|webp|avif|svg|ico)$ {
        add_header Cache-Control "public, max-age=2592000";
        access_log off;
    }

    # Fonts: cache forever
    location ~* \.(woff2|woff|ttf|otf)$ {
        add_header Cache-Control "public, max-age=31536000, immutable";
        add_header Access-Control-Allow-Origin "*";
        access_log off;
    }

    # robots.txt, sitemap, txt files: cache 1 day
    location ~* \.(txt|xml)$ {
        add_header Cache-Control "public, max-age=86400";
    }

    # ── Routing ──
    # Try exact file, then file.html, then directory/index.html
    location / {
        try_files $uri $uri/ $uri.html $uri/index.html =404;
    }

    # ── 404 page ──
    error_page 404 /404.html;
    location = /404.html {
        internal;
    }

    # ── Block dev / metadata files in case they get uploaded by mistake ──
    location ~ /\.(env|git|gitignore|gitattributes|DS_Store)$ {
        deny all;
        return 404;
    }
    location ~* \.(md|json|yml|yaml|toml|lock)$ {
        # JSON-LD is rendered inline in HTML, NOT served as .json files,
        # so this is safe to block.
        deny all;
        return 404;
    }

    # ── Optional: block known-bad bots at the edge ──
    if ($http_user_agent ~* (AhrefsBot|MJ12bot|SemrushBot|DotBot|Bytespider)) {
        return 403;
    }

    # ── Logging ──
    access_log /var/log/nginx/privacyscore.fr.access.log;
    error_log  /var/log/nginx/privacyscore.fr.error.log warn;
}
```

After editing the config:

```bash
sudo nginx -t              # MUST say "syntax is ok"
sudo systemctl reload nginx
```

**Important about the CSP hash:** the placeholder `'sha256-REPLACE_WITH_HASH_FROM_csp-policy.md'` must be replaced with the actual hash from `docs/csp-policy.md §2`. Without it, your inline language-sniffer script and the no-JS strip script will be blocked by CSP and the page will misbehave on first paint.

To compute the hash yourself (re-run after any change to BaseLayout.astro inline scripts):

```bash
# From the project root, after `pnpm build`:
node -e "
const fs = require('fs');
const crypto = require('crypto');
const html = fs.readFileSync('dist/fr/index.html', 'utf8');
const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)]
  .filter(m => !m[0].includes('type=\"application/ld+json\"'))
  .map(m => m[1].trim())
  .filter(s => s.length > 0 && !s.includes('src='));
const hashes = scripts.map(s => crypto.createHash('sha256').update(s).digest('base64'));
console.log('Inline-script SHA-256 hashes:');
hashes.forEach((h, i) => console.log(\`  'sha256-\${h}' // script #\${i+1}\`));
"
```

---

## 6. Update workflow (no nginx changes needed)

For content updates (new copy, new images, new JSON-LD), the loop is short:

```
[local]  edit src/...
[local]  pnpm build
[local]  upload dist/* to /var/www/privacyscore.fr/  (your preferred method)
[server] nothing — nginx serves the new files instantly
```

You do **not** reload nginx on a content update. nginx is only restarted when you change:

- The nginx config itself
- The SSL certificate (certbot auto-reloads via post-renewal hook)
- The kernel or nginx version

---

## 7. Rollback strategy

Before every deploy, snapshot the current `dist/` on the server. Cheap insurance.

### Manual snapshot (via SSH, one-time SSH per deploy)

```bash
# On the server, before uploading the new build:
sudo cp -r /var/www/privacyscore.fr /var/www/privacyscore.fr.backup.$(date +%Y%m%d-%H%M%S)
```

If the new deploy is broken, swap back:

```bash
sudo rm -rf /var/www/privacyscore.fr
sudo mv /var/www/privacyscore.fr.backup.20260526-143000 /var/www/privacyscore.fr
sudo nginx -s reload    # not strictly needed for static, but safe
```

Keep the last 2-3 backups, prune older ones monthly. Total cost: ~60 MB each (mostly the iPhone screenshot PNGs).

### Snapshot via your file-manager

Most panels (cPanel, Plesk) have a "duplicate folder" right-click option. Same effect.

---

## 8. Submit to search engines (once, after first deploy)

After the site is live:

1. **Google Search Console** — https://search.google.com/search-console
   - Add the property `https://privacyscore.fr/` (URL prefix, with `https://`).
   - Verify ownership (DNS TXT record or upload an HTML file to `public/` then rebuild + redeploy).
   - In *Sitemaps*, submit `https://privacyscore.fr/sitemap-index.xml`.

2. **Bing Webmaster Tools** — https://www.bing.com/webmasters/about
   - Add the same property.
   - Submit the same sitemap. Bing also covers DuckDuckGo and (indirectly) ChatGPT search.

3. **HSTS preload** (recommended once you've run the site stable for 30 days)
   - Submit `https://privacyscore.fr` at https://hstspreload.org/
   - Browsers will then hard-code HTTPS-only for your domain — no first-visit downgrade attack possible.

---

## 9. Deploy checklist (print and tape to your monitor)

Before every deploy:

- [ ] `pnpm build` ran with **0 errors**, ended on "Complete!"
- [ ] All 8 routes return 200 from `pnpm preview` locally
- [ ] Visually checked `/fr/` and `/en/` in a browser locally (or after a `pnpm preview`)
- [ ] `dist/` is the freshly built version, not stale
- [ ] (Optional) Server snapshot taken (§7)

During upload:

- [ ] Uploading **contents of `dist/`** (not the `dist/` folder itself)
- [ ] Target is `/var/www/privacyscore.fr/`
- [ ] **Not uploading**: src/, node_modules/, *.md, package.json, docs/, .env, .DS_Store
- [ ] Stale `_astro/` files cleared on the server

After upload:

- [ ] `curl -I https://privacyscore.fr/fr/` returns **200**
- [ ] Same for `/en/`, `/`, `/robots.txt`, `/sitemap-index.xml`
- [ ] Security headers present (`curl -I` shows HSTS, CSP, X-Frame-Options)
- [ ] Brotli active on the Astro hashed assets
- [ ] Spot-check in a real browser — language switcher works, navigation anchors work, animations fire

---

## 10. Common issues

| Symptom | Likely cause | Fix |
|---|---|---|
| Page loads with no styling | Stale `_astro/` files on server (old hashes referenced by new HTML) | Re-upload `dist/_astro/` cleanly; clear old files first |
| Language switcher 404s | Uploaded `fr/` but not `en/` (or vice versa) | Re-upload entire `dist/` |
| CSP blocks inline script | BaseLayout inline-script hash drifted from the one in nginx config | Recompute hashes (§5 snippet), update nginx config, `nginx -s reload` |
| Brotli not active (only gzip in response) | `nginx-module-brotli` not installed | `sudo apt install libnginx-mod-brotli`, then reload nginx |
| SSL Labs B grade | Old TLS 1.0/1.1 enabled, or weak cipher | The config in §5 only allows TLS 1.2+. Confirm with `sudo nginx -T \| grep ssl_protocols` |
| Rich Results Test "FAQPage" failed | FAQ answer body contains an unescaped character | Re-run `pnpm build` (JSON-LD is rebuilt fresh), re-deploy |
| Sitemap not getting indexed | Sitemap submitted but `robots.txt` doesn't declare it | Confirm `dist/robots.txt` contains `Sitemap: https://privacyscore.fr/sitemap-index.xml` |
| Random 404s on URLs like `/fr` (no trailing slash) | Astro config has `trailingSlash: 'always'` — nginx must match | The `try_files $uri $uri/` directive in §5 handles this; if not working, double-check `try_files` order |

---

## 11. Why no git on the server (the "danger tunnel" point)

You're right to push back on this. Reasons to avoid:

1. **Server doesn't need to know your source.** Source code on a public-facing server is an unnecessary attack surface. A misconfigured nginx `location` could expose `.git/` directory, leaking your full history (commit messages, removed secrets, dev branches).
2. **No webhook = no public endpoint for the server to receive deploys.** That's one less exposed surface.
3. **No SSH key dedicated to a `git pull`.** Pulling on the server requires either an SSH key (extra key to rotate) or a personal access token (extra secret in `~/.git-credentials`). Manual upload uses your existing SSH/SFTP session — one credential, audited.
4. **Build environment is yours, not the server's.** No need to install Node, pnpm, build deps on the server. Server stays minimal: nginx + SSL only. Smaller attack surface, faster patching, less RAM.
5. **Atomic deploys.** When you upload `dist/`, you can use a stage-then-swap pattern (upload to `/var/www/privacyscore.fr.new/`, then `mv` to swap atomically). With a `git pull`, the site is briefly in a half-updated state.

Your model: build locally, upload artifact, done. Standard pattern for static sites — used by every static-site host (Netlify/Vercel/Cloudflare Pages internally do exactly this, just automated). Doing it manually is the conservative version.
