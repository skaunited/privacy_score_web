# MCP Server Setup — privacy-score-web

The plugin declares 3 MCP servers in `.mcp.json`. None are required for the plugin to work, but they enable advanced workflows. Set up only the ones you'll use.

## 1. Google Search Console (FREE — recommended)

Tracks impressions, clicks, ranking positions, and indexing issues for your site in Google.

### Setup
1. Enable Search Console API in Google Cloud Console
2. Create OAuth credentials (Web application type)
3. Get a refresh token (instructions in the MCP server README)
4. Verify ownership of `privacyscore.fr` in Search Console
5. Add to your shell rc file (`~/.zshrc` or `~/.bashrc`):
   ```bash
   export GSC_CLIENT_ID="..."
   export GSC_CLIENT_SECRET="..."
   export GSC_REFRESH_TOKEN="..."
   ```
6. Restart Claude Code

### What it enables
- Query top-performing pages by clicks/impressions
- Find pages losing ranking
- Detect indexing errors
- Pull keyword performance data

## 2. DataForSEO (PAID — keyword research)

Provides SERP data, keyword volumes, difficulty scores, backlink data.

### Setup
1. Create account at https://dataforseo.com (pay-as-you-go)
2. Get API credentials (login + password)
3. Add to your shell rc:
   ```bash
   export DATAFORSEO_LOGIN="..."
   export DATAFORSEO_PASSWORD="..."
   ```
4. Restart Claude Code

### What it enables
- Keyword research for FR + EN
- SERP analysis for target keywords
- Competitor keyword discovery
- Backlink monitoring

### Alternative if you don't want to pay
- Skip this MCP server entirely
- Use Google Keyword Planner (free, requires Google Ads account)
- Use Ubersuggest free tier
- Manual research via Google Search

## 3. Screaming Frog SEO Spider (PAID — full site crawl)

Crawls your entire site like Google would. Finds broken links, missing meta, hreflang issues, schema problems.

### Setup
1. Buy a Screaming Frog license (£199/year, after 14-day free trial)
2. Install SEO Spider v24 or later (the MCP is built-in to v24+)
3. Add license key to your shell rc:
   ```bash
   export SF_LICENSE_KEY="..."
   ```
4. Restart Claude Code

### What it enables
- Full site crawl
- Auto-detect: broken links, redirect chains, missing meta, duplicate titles
- hreflang validation across all pages
- Structured data validation
- Custom extraction (rules-based)

### Alternative if you don't want to pay
- Use the Screaming Frog free tier (500 URLs — enough for our marketing site)
- Or use Sitebulb (free trial)
- Or do manual audits via [seo-master](skills/seo-master/SKILL.md)

## Without any MCP server

The plugin works perfectly without any MCP server. You just won't have:
- Automated SERP/keyword data
- Automated site crawls
- Real-time GSC performance data

You can still:
- Build pages, write copy, audit SEO manually
- Run Lighthouse via the build tools
- Manually validate schema at https://validator.schema.org/

## Quick install (if you want all 3)

```bash
# Add to your ~/.zshrc or ~/.bashrc
cat >> ~/.zshrc <<'EOF'

# privacy-score-web MCP servers
export GSC_CLIENT_ID=""
export GSC_CLIENT_SECRET=""
export GSC_REFRESH_TOKEN=""
export DATAFORSEO_LOGIN=""
export DATAFORSEO_PASSWORD=""
export SF_LICENSE_KEY=""
EOF

# Restart your shell
source ~/.zshrc

# Restart Claude Code
```

## Verify MCP servers are loaded

Inside Claude Code:
```
/mcp
```

Should list:
- google-search-console
- dataforseo
- screaming-frog

Each shows "connected" or "error". If error, check env vars are set.
