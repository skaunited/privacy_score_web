---
name: nginx-deployer
description: Generates and maintains Nginx configuration for deploying the static Astro site to the user's own server. Handles HTTPS, HTTP/2, security headers, gzip/brotli compression, cache control, multilingual routing, and rewrites. Use when deploying to production, debugging server issues, or setting up the initial server config.
when_to_use: Nginx config, deploy to server, HTTPS setup, server security headers, cache control, redirects
allowed-tools: Read Write Edit Bash
model: inherit
paths: "nginx.conf,sites-available/**,sites-enabled/**,*.nginx"
---

# Nginx Deployer — privacyscore.fr

You manage the Nginx configuration that serves the static Astro `dist/` output on the user's own server. Goal: A+ on securityheaders.com, A+ on SSL Labs, Lighthouse-friendly cache headers.

## Deployment model

```
User's server (Linux, Nginx)
└── /var/www/privacyscore.fr/
    └── dist/                    ← built by `pnpm build`, rsync'd here
        ├── index.html
        ├── fr/
        ├── en/
        ├── _astro/             ← hashed assets (cache forever)
        └── sitemap-index.xml
```

Deploy flow:
1. Build locally: `pnpm build`
2. Rsync `dist/` to server: `rsync -avz --delete dist/ user@server:/var/www/privacyscore.fr/dist/`
3. Reload Nginx if config changed: `sudo nginx -s reload`
4. Verify: `curl -I https://privacyscore.fr/fr/`

## Canonical Nginx config (production)

`/etc/nginx/sites-available/privacyscore.fr`:

```nginx
# ============ Redirect HTTP → HTTPS ============
server {
    listen 80;
    listen [::]:80;
    server_name privacyscore.fr www.privacyscore.fr;
    return 301 https://privacyscore.fr$request_uri;
}

# ============ Redirect www → apex ============
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.privacyscore.fr;

    ssl_certificate     /etc/letsencrypt/live/privacyscore.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/privacyscore.fr/privkey.pem;

    return 301 https://privacyscore.fr$request_uri;
}

# ============ Main server block ============
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name privacyscore.fr;

    root /var/www/privacyscore.fr/dist;
    index index.html;

    # Hide Nginx version
    server_tokens off;

    # ------------ SSL/TLS ------------
    ssl_certificate     /etc/letsencrypt/live/privacyscore.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/privacyscore.fr/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/privacyscore.fr/chain.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;

    # OCSP stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 1.1.1.1 1.0.0.1 valid=300s;
    resolver_timeout 5s;

    # ------------ Security headers (all pages) ------------
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=(), payment=(), usb=(), bluetooth=(), interest-cohort=()" always;
    add_header Cross-Origin-Opener-Policy "same-origin" always;
    add_header Cross-Origin-Resource-Policy "same-origin" always;

    # ------------ Compression ------------
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json
        application/ld+json
        image/svg+xml
        font/woff2;

    # Brotli (requires ngx_brotli module)
    brotli on;
    brotli_static on;
    brotli_comp_level 6;
    brotli_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/json
        application/ld+json
        image/svg+xml
        font/woff2;

    # ------------ Cache control ------------
    # HTML pages: no cache (always fresh)
    location ~* \.html$ {
        add_header Cache-Control "no-cache, must-revalidate";
        add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
        add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests" always;
        add_header X-Frame-Options "DENY" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    }

    # Astro hashed assets: cache forever (filename includes hash, so safe)
    location /_astro/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
        add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
        access_log off;
    }

    # Images: cache 1 month
    location ~* \.(png|jpg|jpeg|gif|webp|avif|svg|ico)$ {
        add_header Cache-Control "public, max-age=2592000";
        add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
        access_log off;
    }

    # Fonts: cache forever
    location ~* \.(woff2|woff|ttf|otf)$ {
        add_header Cache-Control "public, max-age=31536000, immutable";
        add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
        add_header Access-Control-Allow-Origin "*";
        access_log off;
    }

    # robots.txt, sitemap.xml: cache 1 day
    location ~* \.(txt|xml)$ {
        add_header Cache-Control "public, max-age=86400";
    }

    # ------------ Routing ------------

    # Redirect bare / to /fr/ (default locale)
    location = / {
        return 302 /fr/;
    }

    # Try files, then fall back to index.html (Astro static routing)
    location / {
        try_files $uri $uri/ $uri.html $uri/index.html =404;
    }

    # ------------ 404 ------------
    error_page 404 /fr/404.html;
    location = /fr/404.html {
        internal;
    }

    # ------------ Block sensitive files ------------
    location ~ /\.(env|git|gitignore|gitattributes|DS_Store|md|json|yml|yaml|toml|lock)$ {
        deny all;
        return 404;
    }

    # ------------ Block bad bots (optional) ------------
    if ($http_user_agent ~* (AhrefsBot|MJ12bot|SemrushBot|DotBot)) {
        return 403;
    }

    # ------------ Logging ------------
    access_log /var/log/nginx/privacyscore.fr.access.log;
    error_log  /var/log/nginx/privacyscore.fr.error.log warn;
}
```

## Initial server setup commands

```bash
# 1. Install dependencies
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
# For Brotli (Ubuntu):
sudo apt install -y nginx-module-brotli

# 2. Get SSL cert
sudo certbot --nginx -d privacyscore.fr -d www.privacyscore.fr

# 3. Enable HSTS preload (submit at hstspreload.org after deploy)

# 4. Create site directory
sudo mkdir -p /var/www/privacyscore.fr/dist
sudo chown -R $USER:$USER /var/www/privacyscore.fr

# 5. Symlink config
sudo ln -s /etc/nginx/sites-available/privacyscore.fr /etc/nginx/sites-enabled/

# 6. Test + reload
sudo nginx -t
sudo systemctl reload nginx

# 7. Verify
curl -I https://privacyscore.fr/fr/
```

## Auto-renewal of SSL

Certbot installs a systemd timer automatically. Verify:
```bash
sudo systemctl status certbot.timer
```

Renew manually (test):
```bash
sudo certbot renew --dry-run
```

## Deploy script (run locally)

`scripts/deploy.sh`:
```bash
#!/usr/bin/env bash
set -euo pipefail

SERVER_USER="deploy"
SERVER_HOST="privacyscore.fr"
SERVER_PATH="/var/www/privacyscore.fr/dist/"

echo "→ Building..."
pnpm build

echo "→ Running pre-deploy checks..."
pnpm astro check
test -f dist/sitemap-index.xml || (echo "❌ sitemap missing"; exit 1)
test -f dist/robots.txt || (echo "❌ robots.txt missing"; exit 1)
test -f dist/fr/index.html || (echo "❌ FR homepage missing"; exit 1)
test -f dist/en/index.html || (echo "❌ EN homepage missing"; exit 1)

echo "→ Rsyncing to $SERVER_HOST..."
rsync -avz --delete --human-readable \
  --exclude='.DS_Store' \
  --exclude='*.map' \
  dist/ "$SERVER_USER@$SERVER_HOST:$SERVER_PATH"

echo "→ Verifying live site..."
sleep 2
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$SERVER_HOST/fr/")
if [ "$HTTP_CODE" != "200" ]; then
  echo "❌ Site returned $HTTP_CODE"
  exit 1
fi

echo "✅ Deploy complete: https://$SERVER_HOST/fr/"
```

## Verification commands (after every deploy)

```bash
# 1. Status code
curl -I https://privacyscore.fr/fr/

# 2. HSTS check
curl -I https://privacyscore.fr/fr/ | grep -i "strict-transport"

# 3. CSP check
curl -I https://privacyscore.fr/fr/ | grep -i "content-security-policy"

# 4. Compression check
curl -H "Accept-Encoding: br,gzip" -I https://privacyscore.fr/_astro/index.css

# 5. Cache headers
curl -I https://privacyscore.fr/_astro/index-abc123.js | grep -i "cache-control"
# Should be: public, max-age=31536000, immutable

# 6. SSL Labs grade (online): https://www.ssllabs.com/ssltest/analyze.html?d=privacyscore.fr
# 7. Security headers grade (online): https://securityheaders.com/?q=privacyscore.fr
```

## Common issues

| Issue | Symptom | Fix |
|---|---|---|
| Trailing slash redirect loop | Infinite redirects between `/page` and `/page/` | Set `trailingSlash: 'never'` in `astro.config.mjs`, match Nginx with `try_files $uri $uri.html` (not `$uri/`) |
| CSP blocks fonts | DevTools shows font load blocked | Add `font-src 'self' data:` |
| Brotli not active | `Content-Encoding: gzip` only | Verify nginx-module-brotli installed and `load_module` in nginx.conf |
| HSTS not appearing | curl shows no HSTS header | Verify `always` flag in `add_header` |
| Slow first byte | TTFB > 500ms | Check OCSP stapling enabled, server geo location |

## Related skills

- [csp-generator](../csp-generator/SKILL.md) — generates the CSP that goes here
- [owasp-auditor](../owasp-auditor/SKILL.md) — audits the deployed site
- [astro-builder](../astro-builder/SKILL.md) — produces the `dist/`
