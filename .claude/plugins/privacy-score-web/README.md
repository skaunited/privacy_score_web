# privacy-score-web — Claude Code Plugin

Complete development plugin for the **privacyscore.fr** marketing website. Built specifically for an SEO-first, FR+EN bilingual, static Astro site.

## What's in the box

### 11 Skills

| Skill | Purpose |
|---|---|
| [`astro-builder`](skills/astro-builder/SKILL.md) | Astro 6.x project setup, components, Content Layer, partial hydration |
| [`seo-master`](skills/seo-master/SKILL.md) | Meta tags, structured data, hreflang, sitemap, Core Web Vitals |
| [`seo-copywriter-fr`](skills/seo-copywriter-fr/SKILL.md) | Native French SEO copywriting (RGPD/CNIL-aware) |
| [`seo-copywriter-en`](skills/seo-copywriter-en/SKILL.md) | Native English SEO copywriting (GDPR/CCPA-aware) |
| [`i18n-manager`](skills/i18n-manager/SKILL.md) | Multilingual plumbing — routing, hreflang, key parity (no translation) |
| [`web-animator`](skills/web-animator/SKILL.md) | Performance-safe animations (CSS + View Transitions + Motion mini) |
| [`owasp-auditor`](skills/owasp-auditor/SKILL.md) | OWASP Top 10:2025 + ASVS 5.0 security auditing |
| [`csp-generator`](skills/csp-generator/SKILL.md) | Content Security Policy and security headers |
| [`nginx-deployer`](skills/nginx-deployer/SKILL.md) | Nginx config for self-hosted static deployment |
| [`supply-chain-guard`](skills/supply-chain-guard/SKILL.md) | npm dependency security, OWASP A03 |
| [`aso-iphone`](skills/aso-iphone/SKILL.md) | Apple App Store ASO for the Privacy Score iOS app |

### 8 Agents

| Agent | Role |
|---|---|
| [`spec-orchestrator`](agents/spec-orchestrator.md) | Top-level workflow coordinator |
| [`spec-architect`](agents/spec-architect.md) | Designs page structure and components |
| [`spec-developer`](agents/spec-developer.md) | Implements Astro code from specs |
| [`seo-specialist`](agents/seo-specialist.md) | SEO audits, keyword research, validation |
| [`copy-writer-fr`](agents/copy-writer-fr.md) | Native French copy |
| [`copy-writer-en`](agents/copy-writer-en.md) | Native English copy |
| [`animation-designer`](agents/animation-designer.md) | Performance-safe animations |
| [`security-auditor`](agents/security-auditor.md) | Pre-deploy security audits |

### 6 Slash Commands

| Command | What it does |
|---|---|
| [`/new-page <purpose>`](commands/new-page.md) | Create a new page in FR + EN (full workflow) |
| [`/audit-seo [path]`](commands/audit-seo.md) | Run SEO audit on the site or a specific page |
| [`/audit-security`](commands/audit-security.md) | Run full security audit |
| [`/deploy`](commands/deploy.md) | Build and deploy to your server (with safety checks) |
| [`/publish-blog <topic> <locale>`](commands/publish-blog.md) | Write and publish a blog post |
| [`/check-i18n`](commands/check-i18n.md) | Validate translation key parity and hreflang reciprocity |

### Hooks (automatic behavior)

| Trigger | What happens |
|---|---|
| Edit `src/i18n/*.json` | Auto-check FR/EN key parity, warn on mismatch |
| Edit `package.json` / `pnpm-lock.yaml` | Auto-run `pnpm audit`, warn on new vulnerabilities |
| Bash `rm -rf /` etc. | BLOCK destructive commands |
| Bash `git push --force` to main | BLOCK force-push to protected branches |

### 3 Optional MCP Servers

See [MCP_SETUP.md](MCP_SETUP.md) for installation. All optional.

| MCP Server | Free? | Purpose |
|---|---|---|
| Google Search Console | ✅ Free | Site performance data, indexing status |
| DataForSEO | 💰 Paid | Keyword research, SERP data, backlinks |
| Screaming Frog | 💰 Paid | Full-site SEO crawl |

## Installation

The plugin is already inside this project at `.claude/plugins/privacy-score-web/`. To enable:

```bash
# 1. Restart Claude Code (or run /reload-plugins)

# 2. Verify the plugin loaded
# Inside Claude Code:
/plugins
```

You should see `privacy-score-web` in the list. The skills, agents, and commands are now available.

## Quick start: create your first page

```
/new-page "Homepage for privacyscore.fr"
```

This will:
1. Delegate to `spec-architect` for structure
2. Delegate to `seo-specialist` for FR + EN keywords
3. Delegate to BOTH copywriters IN PARALLEL (native FR + native EN)
4. Delegate to `spec-developer` to build the Astro files
5. Delegate to `animation-designer` for tasteful animations
6. Delegate to `seo-specialist` for final SEO validation
7. Report results

## Standard workflows

### Building the site for the first time

```
1. /init                       (sets up CLAUDE.md if not done)
2. Ask Claude: "Initialize the Astro project per the astro-builder spec"
3. /new-page "Homepage"
4. /new-page "Features page"
5. /new-page "FAQ"
6. /new-page "About / mentions légales"
7. /audit-seo
8. /audit-security
9. /deploy
```

### Adding a new blog post

```
1. /publish-blog "Comment activer le rapport de confidentialité Apple" fr
2. /publish-blog "How to enable Apple's App Privacy Report" en
3. /check-i18n
4. /audit-seo
5. /deploy
```

### Routine maintenance

```
Weekly:
- /audit-seo                  → find regressions
- /audit-security             → check new vulnerabilities

Monthly:
- /check-i18n                 → ensure FR/EN parity
- Update dependencies via supply-chain-guard
```

## Design principles

The plugin enforces:

1. **SEO is non-negotiable** — Every page must pass SEO audit before merge
2. **Native bilingual** — FR and EN written separately, never translated
3. **Performance first** — Zero JS by default, < 3 KB animation JS, Lighthouse ≥ 95
4. **Security by default** — OWASP compliance, CSP, HSTS, no third-party tracking
5. **Privacy by example** — We're a privacy site; we hold ourselves to a higher standard

## Sources / Cherry-picked from

This plugin was assembled from the best parts of these public skills (May 2026):
- [AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo) — 7K⭐ flagship SEO skill
- [spillwavesolutions/publishing-astro-websites-agentic-skill](https://github.com/spillwavesolutions/publishing-astro-websites-agentic-skill) — Astro patterns
- [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) — copywriting frameworks
- [freshtechbro/claudedesignskills](https://github.com/freshtechbro/claudedesignskills) — animation patterns
- [agamm/claude-code-owasp](https://github.com/agamm/claude-code-owasp) — OWASP 2025 Top 10
- [TimBroddin/app-store-aso-skill](https://github.com/TimBroddin/app-store-aso-skill) — ASO validator

Adapted and rewritten for privacyscore.fr's specific stack and constraints.

## Plugin structure

```
privacy-score-web/
├── .claude-plugin/
│   └── plugin.json                 ← manifest
├── skills/                          ← 11 skill directories
│   ├── astro-builder/
│   │   ├── SKILL.md
│   │   └── references/
│   ├── seo-master/
│   ├── ...
│   └── aso-iphone/
│       └── scripts/
│           └── validate_metadata.py
├── agents/                          ← 8 agent definitions
│   ├── spec-orchestrator.md
│   ├── spec-architect.md
│   ├── ...
│   └── security-auditor.md
├── commands/                        ← 6 slash commands
│   ├── new-page.md
│   ├── audit-seo.md
│   ├── audit-security.md
│   ├── deploy.md
│   ├── publish-blog.md
│   └── check-i18n.md
├── hooks/
│   └── hooks.json                  ← automatic behaviors
├── scripts/                         ← hook implementation scripts
│   ├── check-i18n-on-save.sh
│   ├── supply-chain-on-pkg-change.sh
│   └── block-destructive.sh
├── .mcp.json                        ← MCP server declarations
├── MCP_SETUP.md                     ← MCP installation guide
└── README.md                        ← this file
```

## License

MIT — same as Privacy Score iOS app.

## Author

Built for Skander Bahri / Codevelop by Claude (Opus 4.6 / 4.7) in May 2026.
