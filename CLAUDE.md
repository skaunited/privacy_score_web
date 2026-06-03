# CLAUDE.md — Privacy Score Web

**Read this file at the START of every session before doing any work.**

This is the canonical decision log for the privacyscore.fr project. Every major architectural, technical, or product decision is recorded here with rationale and rejected alternatives. Decisions logged here are **binding** — do not overturn them without notifying the user first.

---

## Project at a glance

- **Goal**: SEO-first marketing website for the **Privacy Score** iOS app
- **Domain**: privacyscore.fr
- **Languages**: French (primary) + English
- **Owner**: Skander Bahri (Codevelop)
- **App recap**: see `APP_RECAP.md` in this directory

## Standing rules

1. **Always route work through the `privacy-score-web` plugin** — never bypass even if a shortcut seems faster
2. **SEO is the #1 priority** — every decision is weighed against SEO impact first
3. **Native bilingual** — FR and EN are written separately by native copywriters, never translated
4. **Privacy by example** — we're a privacy site; no third-party tracking, no Google Fonts CDN, no analytics that phone home
5. **Performance first** — Lighthouse ≥ 95 across all categories is non-negotiable
6. **Self-hosted** — user has their own server; deployment targets Nginx on their server, not Vercel/Netlify
7. **Decisions in this file are binding** — do not change them without explicit user approval
8. **Session closure protocol** — when the user says "end of session", "let's stop here", "we'll pick this up tomorrow" (or equivalent), write a Session log entry in this file BEFORE responding with the closing message. See "Session log" section below for the template.
9. **Errors protocol** — maintain `ERRORS.md` at the project root. Check it BEFORE suggesting approaches similar to past tasks. Log an entry whenever an approach takes more than 2 attempts to work (what didn't work, what did, root cause, how to avoid repeating). See `ERRORS.md` for the template.
10. **Extended thinking protocol** — for any question touching **system architecture**, **performance**, **database/storage design**, or **long-term technical decisions** (anything that creates lock-in or is hard to reverse), use the structured deep-reasoning format:
    1. **Work through the problem step by step** (don't jump to a conclusion)
    2. **Point out trade-offs the user may have overlooked**
    3. **Highlight assumptions that might not hold up at scale**
    4. **Then give the recommendation**

    Do NOT trigger this for: trivial config tweaks, copy edits, simple bug fixes, or quick clarifications. See "Extended thinking trigger guide" section below for examples.

---

## Decision log

Format per entry:
```
### YYYY-MM-DD — <decision title>
**Decided**: <what>
**Why**: <reasoning>
**Rejected**: <alternative> — <reason>
```

---

### 2026-05-25 — Framework: Astro 6.x

**Decided**: Build the site with **Astro 6.3+** using static output (SSG).

**Why**:
- Ships zero JavaScript by default → best possible Core Web Vitals
- Built for content/marketing sites with islands architecture for selective interactivity
- Built-in image optimization, sitemap, i18n routing, View Transitions
- Static HTML output = trivial to host on user's own Nginx server
- Excellent DX with TypeScript and component model

**Rejected**:
- **Next.js**: ships more JavaScript by default; better for app-like sites, overkill for marketing
- **Hugo / 11ty**: faster builds but no component model = harder maintainability for non-trivial layouts
- **WordPress**: requires database + PHP, security overhead, slower TTFB

---

### 2026-05-25 — Hosting: User's own server (self-hosted)

**Decided**: Deploy as static files on user's personal Linux server with Nginx + Let's Encrypt SSL.

**Why**:
- User already owns infrastructure
- Static output means trivial deployment (rsync)
- Full control over headers, caching, security
- No vendor lock-in, no monthly fees, no third-party data exposure

**Rejected**:
- **Vercel/Netlify/Cloudflare Pages**: managed but introduce a third party that sees all traffic; conflicts with our privacy-first ethos
- **GitHub Pages**: less control over headers and caching

---

### 2026-05-25 — CMS: None for v1 (Markdown + code)

**Decided**: No CMS for the initial version. Pages in `.astro` files, blog posts in `.md`/`.mdx` files via Astro Content Collections.

**Why**:
- Marketing content changes infrequently
- Tighter integration with git workflow
- Zero attack surface from CMS plugins (OWASP A06)
- Free, fast, type-safe

**Rejected**:
- **Decap CMS / TinaCMS**: viable future option if a non-technical person needs to edit; can add later without breaking changes
- **Strapi / Sanity**: overkill for static marketing site; introduces server dependency

**Reconsider when**: someone other than the developer needs to edit content regularly.

---

### 2026-05-25 — i18n: Subdirectory strategy (`/fr/`, `/en/`)

**Decided**: Subdirectory routing with Astro's built-in i18n. `/fr/` is the default locale, `/en/` is the secondary. Bare `/` redirects to `/fr/`. `prefixDefaultLocale: true`.

**Why**:
- Consolidates link equity under one domain (better SEO than subdomains)
- Simpler infrastructure (one Nginx vhost, one SSL cert)
- Built-in Astro support, mature since v4
- Allows URL-level localization (`/fr/fonctionnalites/audit` vs `/en/features/audit`) for better SEO

**Rejected**:
- **Subdomains** (`fr.privacyscore.fr`): splits link equity, more complex SSL/Nginx setup
- **ccTLDs** (`privacyscore.fr` + `privacyscore.com`): expensive, complex, requires separate sites
- **`astro-i18next` library**: archived, incompatible with Astro 5+

---

### 2026-05-25 — Default locale: French

**Decided**: `defaultLocale: 'fr'`. `x-default` hreflang points to `/fr/`.

**Why**:
- Primary market is France (domain is `.fr`)
- User is French
- Initial keyword research targets French queries

**Rejected**:
- **English default**: would prioritize a market we're not initially targeting

---

### 2026-05-25 — Translation: NEVER translate, always native copywriters

**Decided**: Two separate copywriter agents (`copy-writer-fr` + `copy-writer-en`) that write natively in their language, working in PARALLEL. Each does their own keyword research for their market. They share only the page structure, never the wording.

**Why**:
- Translation produces literal, mechanical copy that ranks poorly
- Keywords differ between markets (`audit confidentialité iphone` ≠ `iphone privacy audit`)
- Cultural references differ (CNIL/RGPD vs FTC/CCPA)
- Tone differs (FR formal `vous`, EN direct/conversational)
- Google detects machine translation and may flag as low-quality

**Rejected**:
- **DeepL MCP / DeepL translation**: produces translation, not native copy → bad SEO
- **One copywriter doing both**: forces translation thinking, loses cultural nuance
- **AI translation post-edit**: same problem; still produces translation, not original copy

---

### 2026-05-25 — Animation stack: CSS + View Transitions + Motion mini

**Decided**: CSS animations by default. Astro's built-in View Transitions for page transitions. Motion mini (~2.5 KB) for scroll-triggered animations only. Total animation JS budget: < 3 KB gzipped per page.

**Why**:
- Marketing site needs visual polish without sacrificing Core Web Vitals
- CSS is free (0 KB, browser-native, GPU-accelerated)
- View Transitions are browser-native (85%+ support)
- Motion mini covers scroll/sequenced animation needs in 2.5 KB

**Rejected**:
- **GSAP** (~37 KB): overkill, runs on main thread, hurts INP
- **Framer Motion** (~50 KB): React-only, too heavy
- **Lottie** (~60 KB): blocks interactivity, undermines our zero-JS philosophy
- **AOS** (~29 KB): replaceable with 10 lines of IntersectionObserver

---

### 2026-05-25 — Plugin scope: Full plugin with 11 skills + 8 agents + 6 commands

**Decided**: Build the complete `privacy-score-web` plugin at `.claude/plugins/privacy-score-web/`. All 11 skills, 8 agents, 6 slash commands, hooks, and MCP server config.

**Why**:
- Investment now pays off for entire site lifecycle (homepage + features + blog + maintenance)
- All skills have clear, distinct responsibilities
- Workflow only works end-to-end if all pieces exist

**Rejected**:
- **MVP with 5 core skills**: would need rework as we add features; agents lose context without all skills
- **Skills only, no agents/MCP yet**: misses the orchestration benefit
- **Build from scratch**: rejected in favor of cherry-picking battle-tested skills from popular repos (AgriciDaniel/claude-seo, etc.)

---

### 2026-05-25 — Plugin location: Inside project (not global)

**Decided**: Plugin lives at `.claude/plugins/privacy-score-web/` inside this project.

**Why**:
- Versioned alongside the site code
- Travels with the repo if forked / moved
- Project-specific tuning doesn't pollute global config

**Rejected**:
- **Global at `~/.claude/plugins/`**: would require manual install on every new machine; harder to keep in sync
- **Both (symlinked)**: added complexity without clear benefit

---

### 2026-05-25 — Skill triggers: Slash commands + auto-trigger + hooks (all three)

**Decided**: Skills can be invoked via slash commands (e.g., `/new-page`), auto-trigger via file paths (e.g., editing `.astro` triggers `astro-builder`), and hooks (e.g., editing `i18n/*.json` triggers parity check).

**Why**:
- Slash commands give explicit control
- Auto-trigger means skills come in when relevant without typing
- Hooks enforce quality gates (security, i18n parity) automatically

**Rejected**:
- **Slash commands only**: requires user to remember every workflow
- **Auto-trigger only**: less predictable, hard to invoke deliberately

---

### 2026-05-25 — MCP servers: GSC + DataForSEO + Screaming Frog (NO DeepL)

**Decided**: Three MCP servers configured in `.mcp.json`:
- Google Search Console (free) — performance + indexing data
- DataForSEO (paid) — keyword research, SERP data, backlinks
- Screaming Frog (paid, free 500 URLs) — full site crawl validation

**Why**:
- GSC is essential and free
- DataForSEO gives real keyword data for both FR and EN markets
- Screaming Frog catches technical SEO issues a human would miss

**Rejected**:
- **DeepL MCP**: would tempt translation workflow → bad SEO (see translation decision above)
- **Ahrefs / SEMrush MCPs**: paid alternatives to DataForSEO; chosen DataForSEO for pay-as-you-go pricing

---

### 2026-05-25 — Design integration: Pixel-perfect from Claude artifact

**Decided**: Design source is a claude.site URL (Claude artifact). Implementation is **pixel-perfect** to the design. Design tokens are extracted to `docs/design-tokens.md` and baked into Tailwind config BEFORE any component is built.

**Why**:
- Design is the source of truth for visual identity
- Pixel-perfect ensures user sees what they designed
- Extracting tokens to Tailwind once = consistent application everywhere

**Rejected**:
- **"Inspiration + tokens only"**: would allow drift from the design; harder to QA
- **"Mostly follow, adapt for SEO"**: SEO doesn't usually require visual changes; if a conflict arises, surface it explicitly, don't auto-adapt

---

### 2026-05-25 — Tailwind CSS for styling

**Decided**: Use Tailwind CSS for styling.

**Why**:
- Utility-first reduces unused CSS to near-zero (good for performance)
- Easy to enforce design tokens via config
- Excellent integration with Astro (`@astrojs/tailwind`)

**Rejected**:
- **CSS Modules**: more verbose, harder to enforce design system
- **Vanilla CSS**: more code to maintain, easier to drift from design
- **Styled-components**: requires JS runtime, conflicts with zero-JS goal

---

### 2026-05-27 — Médiateur de la consommation : CM2C

**Decided**: CM2C is the designated mediator for B2C disputes under Art. L. 612-1 du Code de la consommation. Cost: €48 HT for 3 years + €36 HT per case.

**Registration confirmed 2026-05-28**. Official coordinates (replacing earlier placeholder):
- CM2C
- 49 rue de Ponthieu, 75008 PARIS
- Téléphone : 01 89 47 00 14
- Site internet : https://www.cm2c.net/declarer-un-litige.php
- Email : litiges@cm2c.net

The CGU FR + EN were updated on 2026-05-29 with the confirmed coordinates AND the exact mandatory wording CM2C requires (replacing the earlier paraphrase). Source: CM2C registration packet supplied by the user.

**Why**: Cheapest CECMC-accredited option for a 1-person micro-EI. Accredited since 2017 (stable, no recent rebrand). Sector-agnostic (covers digital subscriptions explicitly). Fast online onboarding via cm2c.net.

**Rejected**:
- **FEVAD Mediator (e-commerce)**: requires FEVAD membership ~€600+/year, disproportionate at our scale
- **CNPM-Médiation Consommation (now MEDCONSODEV)**: cheaper (~€25 HT) but recent rebrand creates organizational uncertainty
- **CMAP**: €1,000 HT joining fee, oriented B2B/large companies, way too expensive

---

### 2026-05-27 — Subscription pricing : 2 tiers + first scan free for life

**Decided**: Two paid subscription tiers via Apple IAP:
- **Annual**: €23.88/year (= €1.99/month equivalent)
- **Six-month**: €20.94/6 months (= €3.49/month equivalent)

The first scan is **free for life**: any user can import one privacy report and consult the full audit indefinitely without subscribing. The paid subscription only unlocks subsequent imports.

**Why**: 
- Annual is the obvious better deal which strengthens conversion
- First-scan-free is a strong trust signal for a privacy app (users see the value before paying)
- 6-month tier acts as a "soft commitment" alternative
- No monthly-only tier avoids quick-churn behavior
- Apple IAP handles billing, refunds, cancellations

**Rejected**:
- **Monthly-only tier**: highest psychological deal but encourages quick churn
- **Standard 3-tier (monthly + 6-month + annual)**: complicates UX without revenue benefit at our scale
- **One-time purchase**: misaligns with the "regular audit" use case (privacy report should be re-checked periodically)

---

### 2026-05-27 — Editor contact: email-only (no phone) — risk accepted

**Decided**: `support@privacyscore.fr` is the sole editor contact channel published in Mentions légales and across all legal docs. No phone number is published.

**Why**: A 1-person micro-EI doesn't maintain a dedicated phone line, and the user's personal mobile is not for publication. The strict reading of LCEN art. 1-1, 1° (post-SREN 2024) requires phone for personnes physiques, so this is technical non-compliance. Aggregated risk level: MEDIUM-LOW (DGCCRF rarely enforces against micro-EIs without prior antecedents; civil dispute leverage is the bigger real concern but minor for our scale).

**Rejected**:
- **VoIP number** (OnOff, RingOver, Aircall): viable later (~€5-15/month) if traffic or litigation rises
- **Publish personal mobile**: privacy concern
- **Stop publishing until phone exists**: would block App Store submission indefinitely

**Reconsider when**: traffic exceeds 1,000 users, OR the first formal consumer dispute arises, OR DGCCRF / CNIL contact is triggered for any reason. Default: revisit every 6 months.

---

### 2026-05-27 — Legal docs rendering: src/content/legal/ as build-time mirror

⚠️ **SUPERSEDED on 2026-05-28** — see [2026-05-28 — Legal docs consolidated into Privacy Score Web (no more mirror)](#2026-05-28--legal-docs-consolidated-into-privacy-score-web-no-more-mirror)

**Decided**: The canonical markdown source for the 6 legal documents lives at `App/Privacy Score/StoreListing/legal/{fr,en}/`. The Astro web project consumes them via mirrored copies in `App/Privacy Score Web/src/content/legal/`, synced manually when canonical files change. Each Astro page directly imports its mirrored .md via `import { Content, frontmatter } from '...'`.

**Why**: 
- These docs serve dual purposes (iOS App Store distribution + web publication)
- The iOS team needs them at the canonical StoreListing path
- Astro Content Collections require files inside `src/content/`
- Mirror+sync is simpler than symlinks (which break on Windows) or external Vite aliases (which conflict with security boundaries)

**Rejected**:
- **Symlinks (`ln -s`)**: cross-platform issues on Windows
- **Astro alias to external folder**: Vite security restrictions, fragile
- **Inline content directly in .astro pages**: kills DRY, makes updates require dual edits in two locations
- **Hosted CMS (Decap/Sanity)**: overkill for 6 stable legal docs

**Sync protocol**: documented in `src/content/legal/README.md`.

---

### 2026-05-28 — Legal URL slugs: same as EN across both locales (overrides URL-level localization)

**Decided**: All legal pages share identical URL slugs across both locales (using the EN slugs):

| Locale | URL |
|---|---|
| FR | `/fr/legal-notice/`, `/fr/privacy-policy/`, `/fr/terms-of-use/` |
| EN | `/en/legal-notice/`, `/en/privacy-policy/`, `/en/terms-of-use/` |

The FR slugs `/fr/mentions-legales/`, `/fr/politique-de-confidentialite/`, `/fr/cgu/` (created earlier in this session) were deleted.

The corresponding markdown files in `src/content/legal/fr/` were also renamed to match: `legal-notice.md`, `privacy-policy.md`, `terms-of-use.md`.

**Why**: 
- The shared `Header.astro` language-switcher does a naive locale-prefix swap (`/fr/X/` → `/en/X/`). With locale-specific slugs, the FR↔EN toggle on legal pages led to 404s.
- The same logic generates `<link rel="alternate" hreflang>` SEO tags, so the slug mismatch would have taught search engines the wrong URL pairs (hurting SEO worse than the slug-loss itself).
- The brief plugin spec (`seo-master`) and the i18n-manager skill both recommend URL-level localization for SEO. Overriding both for the legal pages keeps the rest of the site free to use locale-native slugs later if we add a mapping table.

**Trade-off accepted**: The FR slugs are now English, which slightly hurts FR SEO for branded queries like "mentions légales privacy score" — but legal pages are not SEO targets (they're transactional/compliance), and the broken switcher would have hurt UX more.

**Rejected**:
- **URL-mapping table in `src/i18n/utils.ts`**: would have preserved native FR slugs and fixed the switcher. Cleaner long-term but adds a per-page maintenance burden; deferred until we have non-legal pages with locale-specific slugs.
- **Make all slugs French (`/en/mentions-legales/`)**: would have hurt EN SEO worse.

**Reconsider when**: we add the first content page (e.g., a blog) where SEO genuinely matters, and we want locale-native slugs. At that point, build the URL mapping table in `i18n/utils.ts` and migrate everything.

---

### 2026-05-28 — Legal docs consolidated into Privacy Score Web (no more mirror)

**Decided**: All legal artifacts now live exclusively inside `App/Privacy Score Web/`. No more mirror or sync protocol. New canonical layout:

| Artifact | New canonical location |
|---|---|
| Legal markdown sources (6 files, FR + EN) | `src/content/legal/{fr,en}/*.md` (consumed directly by Astro Content Collection) |
| Verifier reports + reader-lawyer report (4 files) | `docs/legal-review/*.md` |
| Internal ROPA register (Art. 30 RGPD) | `compliance/ROPA-codevelop.md` |

The `App/Privacy Score/StoreListing/` directory no longer contains any legal files; only `APP_STORE_LISTING.md` and `LEGAL_DOCUMENTS_BRIEF.md` (user-authored) remain there.

The `src/content/legal/README.md` file was also removed (it was being matched by the `legal` Content Collection glob, which broke `pnpm dev` with `InvalidContentEntryDataError` because the README has no schema-compliant frontmatter). The glob pattern in `src/content.config.ts` was tightened to `{fr,en}/**/*.md` as defense in depth.

**Why**:
- Single source of truth, no sync risk between two directories
- The web project is the right home for web-published artifacts
- The dual-purpose argument (iOS app distribution + web) was thin: App Store Connect takes URLs, not file copies, so the iOS team only needs the public URLs from the web build
- One fewer protocol to remember (no more "re-copy when canonical changes")
- Fixes a real `pnpm dev` error caused by the auto-discovery of README.md as a content entry

**Rejected**:
- **Symlinks from StoreListing → web project**: Cross-platform fragility, same as before
- **Keep the mirror, just exclude README from the glob**: Doesn't address the underlying redundancy
- **Keep StoreListing as canonical, move only the README out**: Doesn't solve the dual-source-of-truth issue

**Migration applied this date**: 
- `mv App/Privacy Score/StoreListing/legal/review/*.md App/Privacy Score Web/docs/legal-review/`
- `mv App/Privacy Score/StoreListing/internal/ROPA-codevelop.md App/Privacy Score Web/compliance/`
- `rm App/Privacy Score/StoreListing/legal/{fr,en}/*.md` (already mirrored at canonical destination)
- `rm App/Privacy Score Web/src/content/legal/README.md`
- Tightened `src/content.config.ts` glob pattern
- Updated stale path references in 2 changelog cells + 6 `.astro` header comments

---

## How to add a new decision

When a major decision is made:

1. Add a new entry at the bottom of "Decision log" with today's date
2. Use the template:
   ```
   ### YYYY-MM-DD — <decision title>
   **Decided**: ...
   **Why**: ...
   **Rejected**: ... — ...
   ```
3. If the decision REPLACES a previous one, mark the old entry with `⚠️ SUPERSEDED on YYYY-MM-DD — see "<new title>"` and explain in the new entry why we changed our mind

## How to handle a request that would overturn a logged decision

If the user asks for something that conflicts with a logged decision:

1. **Stop before doing it**
2. Quote the existing decision (date + title + rationale)
3. Explain the conflict
4. Ask the user explicitly: "Do you want to overturn this decision?"
5. Only proceed if they say yes — then log the new decision and supersede the old one

---

## Extended thinking trigger guide

Use the structured deep-reasoning format (Rule #10) for these categories:

### ✅ TRIGGER extended thinking for

| Category | Examples |
|---|---|
| **System architecture** | "Should we use SSG or SSR for this page?", "Component vs page-level i18n?", "How should we structure Content Collections for the blog?", "Should we add a CMS?" |
| **Performance** | "How do we get LCP under 1.5s?", "Should we self-host fonts vs use the Astro font integration?", "Image format strategy?", "When is partial hydration justified?" |
| **Storage / data design** | "Where do we store user-submitted form data?", "How do we model multilingual content in Content Collections?", "Schema for blog posts and authors?", "How do we cache MCP server responses?" |
| **Long-term / lock-in decisions** | "Should we adopt React for islands or stick to vanilla?", "Which CSS framework long-term?", "Should we add a CDN in front of Nginx?", "Move to a monorepo?", "Pick a specific image CDN?" |

### ❌ DO NOT trigger for

| Category | Example |
|---|---|
| Trivial config | "Add Permissions-Policy header" |
| Copy edits | "Make this CTA more punchy" |
| Simple bug fix | "Why is this `<Image />` not rendering?" |
| Quick lookups | "What's the current Astro version?" |
| Mechanical task | "Run the build", "Deploy now" |

### Response format when triggered

```markdown
## Extended thinking — <topic>

### Step 1: Frame the problem
<what we're really deciding, beyond the surface question>

### Step 2: Options on the table
| Option | Pros | Cons | Cost to reverse |
|---|---|---|---|
| A | ... | ... | low/medium/high |
| B | ... | ... | ... |
| C | ... | ... | ... |

### Step 3: Trade-offs you may have overlooked
- <non-obvious trade-off 1, with explanation>
- <non-obvious trade-off 2>
- <hidden coupling, second-order effect, etc.>

### Step 4: Assumptions that might not hold at scale
- If <metric / situation> changes, then <assumption breaks>
- "What happens at 10×, 100×, 1000× current usage?"
- "What if [external dependency] goes away or changes?"

### Step 5: Recommendation
**<the answer>**

Rationale: <2-3 sentences>

If we choose this and later regret it, the escape hatch is: <how to unwind>
```

This format goes into the final answer to the user. If it triggers a new decision, also log it in the Decision log section above.

---

## Session log

Append a new entry at the END of this section whenever the user signals end of session via phrases like:
- "end of session"
- "let's stop here"
- "we'll pick this up tomorrow"
- "let's wrap up"
- "stop for today"
- "à demain", "on s'arrête là", "fin de session" (FR equivalents)

### Template

```
### YYYY-MM-DD HH:MM — Session #N
**Worked on**: <1-3 lines describing the session's focus>

**Completed**:
- ✅ <item> (link to artifact/file/PR if relevant)
- ✅ ...

**In progress**:
- 🟡 <item> — <% complete> — <what's blocking / what's next>
- 🟡 ...

**Decisions made this session**: (with links to Decision log entries above)
- [<date — title>](#yyyy-mm-dd--title)
- ...

**Priorities for next session**:
1. <highest priority>
2. <next>
3. <next>

**Open questions for the user**:
- <question 1>
- <question 2>

**Notes for next-Claude**: <any context that would otherwise be lost>
```

### Entries (chronological — newest at the bottom)

### 2026-05-27 23:55 — Session #1

**Worked on**:
1. Built the `privacy-score-web` Claude Code plugin (11 skills, 8 agents, 6 commands, hooks, MCP servers)
2. Installed 4 standing-rule protocols (decision log, session closure, errors log, extended thinking)
3. Ran the full Cabinet Avocat legal-documents workflow for Privacy Score iOS app: Stages 0 (médiateur) → 1 (drafts) → 2 (3 lawyer verifications via MCP LegiFrance) → 3 (reader-lawyer review) → 4 (Astro rendering + footer URLs)

**Completed**:
- ✅ `privacy-score-web` plugin in `.claude/plugins/privacy-score-web/` (11 skills + 8 agents + 6 commands + hooks + 3 MCP server configs)
- ✅ CLAUDE.md, ERRORS.md, and 4 memory protocols (claudemd_decision_log, session_closure_protocol, errors_protocol, extended_thinking_protocol)
- ✅ Stage 0 médiateur recommendation (CM2C selected, see Decision log)
- ✅ Stage 1: 6 legal documents drafted natively in FR + EN (Mentions légales, Politique de confidentialité, CGU)
   - Source path: `App/Privacy Score/StoreListing/legal/{fr,en}/`
- ✅ Stage 2: 3 lawyer verifications via MCP LegiFrance
   - `verifier-report-mentions-legales.md` (cabinet-avocat:droit-affaires) — PASS 2
   - `verifier-report-privacy-policy.md` (cabinet-avocat:rgpd-data) — PASS 2
   - `verifier-report-cgu.md` (cabinet-avocat:droit-consommation) — PASS 2
- ✅ 15 corrections applied across the 2 PASS cycles (notably: LCEN art. 1-1 post-SREN 2024 renumbering, DSA replacing Directive 2000/31/CE for Apple, L. 221-28 13° third criterion, L. 224-25-5 digital service obligations)
- ✅ Internal ROPA register (`App/Privacy Score/StoreListing/internal/ROPA-codevelop.md`) for Art. 30 RGPD compliance
- ✅ Stage 3: reader-lawyer (cabinet-avocat:relecteur) independent PASS/FAIL — all 6 documents PASS WITH CAVEAT (`reader-lawyer-report.md`)
- ✅ Stage 4: 6 Astro pages rendered via direct .md import + Content Collection schema (`src/content/legal/`, `src/content.config.ts`)
- ✅ Footer links updated in `src/i18n/fr.json` and `src/i18n/en.json` (3 legal URLs per locale)
- ✅ `pnpm astro check` and `pnpm build` both PASS (0 errors, 0 warnings, 10 pages built)
- ✅ Voice rules across all 6 docs: zero em-dash, zero exclamation, zero "actionable"

**In progress**:
- 🟡 Homepage polish per `docs/homepage-spec.md` (10 section components already exist, need final content + design pass)
- 🟡 Hero images / OG image creation
- 🟡 Lighthouse audit + Screaming Frog crawl
- 🟡 Nginx deployment to user's Hostinger server (Paris)

**Decisions made this session**:
- [2026-05-27 — Médiateur de la consommation : CM2C](#2026-05-27--médiateur-de-la-consommation--cm2c)
- [2026-05-27 — Subscription pricing : 2 tiers + first scan free for life](#2026-05-27--subscription-pricing--2-tiers--first-scan-free-for-life)
- [2026-05-27 — Editor contact: email-only (no phone) — risk accepted](#2026-05-27--editor-contact-email-only-no-phone--risk-accepted)
- [2026-05-27 — Legal docs rendering: src/content/legal/ as build-time mirror](#2026-05-27--legal-docs-rendering-srccontentlegal-as-build-time-mirror)

**Priorities for next session** (in order):

1. **User action items BEFORE legal docs go live publicly**:
   a. Register CoDevelop with CM2C (€48 HT / 3 years at cm2c.net). Once attestation received, update the CGU FR + EN with the confirmed exact address (currently flagged `[adresse à confirmer à l'inscription définitive]`).
   b. Audit iOS app accessibility (VoiceOver, Dynamic Type, contrast). Either confirm conformance OR retract the assertion in CGU section 7.3.
   c. Test Apple IAP subscription flow in a real test environment to confirm the confirmation email is sent (the CGU asserts this satisfies L. 221-28, 13° c).

2. **Verify legal pages render correctly in a browser** (run `pnpm dev` and visit `/fr/mentions-legales/`, `/fr/politique-de-confidentialite/`, `/fr/cgu/` + EN equivalents). Check styling, headings, table rendering.

3. **Provide URLs to App Store Connect**:
   - Mandatory: Privacy Policy URL (FR and/or EN)
     - https://privacyscore.fr/fr/politique-de-confidentialite/
     - https://privacyscore.fr/en/privacy-policy/
   - Optional but recommended: License Agreement / Terms
     - https://privacyscore.fr/fr/cgu/
     - https://privacyscore.fr/en/terms-of-use/

4. **Resume homepage build** per `docs/homepage-spec.md` if homepage needs more work (10 section components already exist).

5. **Deploy to user's Hostinger server** (Paris) via Nginx + Let's Encrypt SSL.

**Open questions for the user**:
- Should we revisit the editor-phone decision in 6 months as planned, or earlier if traffic/disputes increase?
- Is the homepage spec at `docs/homepage-spec.md` finalized, or still iterating?
- Do we need /press, /about, /blog at launch, or is homepage + legal pages sufficient for v1 publication?
- The claude.site design URL mentioned earlier was never shared — should we use what's in `privacy-score-web-design/project/` instead?

**Notes for next-Claude**:

- **Astro version mismatch**: The existing project uses Astro 5.16.1 (not 6.x as the `privacy-score-web` plugin's `astro-builder` skill recommends). Both work for static SSG; the plugin doc was based on the latest at the time. Don't upgrade to 6.x without checking compat with the existing setup.
- **trailingSlash**: This project uses `trailingSlash: 'always'` and a custom client-side language sniffer at `/` (different from the plugin's recommendation of `'never'`). The sniffer is intentional — don't change without understanding.
- **Path aliases**: TypeScript paths in `tsconfig.json` use `@layouts/`, `@components/`, `@i18n/`, `@assets/`, `@/`. The 6 legal page stubs use these aliases.
- **Legal markdown sync protocol**: The canonical legal docs live at `App/Privacy Score/StoreListing/legal/` (shared with the iOS app). The Astro project mirrors them at `App/Privacy Score Web/src/content/legal/`. When the canonical files change, re-copy them (see `src/content/legal/README.md` for the protocol).
- **Cabinet Avocat plugin**: Located at `/Users/skanderbahri/.claude/plugins/marketplaces/local-desktop-app-uploads/cabinet-avocat/`. It provides 17 specialized lawyer skills + the workflow used in this session.
- **iOS app side**: The Privacy Score iOS project has its own CLAUDE.md at `/Users/skanderbahri/Library/Mobile Documents/com~apple~CloudDocs/Professionel/DEV/Projects/privacy_guard/CLAUDE.md` — legal-document decisions logged here should also be cross-referenced there at next opportunity (separate session).
- **DataForSEO MCP**: Configured with real credentials in `.claude/plugins/privacy-score-web/.mcp.json`. Use for keyword research when working on homepage SEO copy.
- **Pricing in Apple App Store Connect**: When configuring the App Store listing, the IAP tier mappings are: Annual ~€23.88 (Tier 24 or closest Apple tier), 6-month ~€20.94 (closest Apple tier). Apple tier IDs may differ; verify in App Store Connect.

### 2026-06-02 00:30 — Session #2

**Worked on**:
1. SEO audit (`docs/seo-audit-2026-05-31.md`) implemented end-to-end: all 6 P0 + 9 P1 + 11 P2 items.
2. Pre-launch §12 GO/NO-GO checklist executed; site went live at https://www.privacyscore.fr/.
3. Mobile Safari perf debug after launch (Safari was visibly slower than Brave on the same iPhone).

**Completed**:

*SEO + content (P0 + P1 + P2):*
- ✅ Canonical = www; apex → www 301 via Cloudflare. `SITE_ORIGIN` in `src/i18n/utils.ts` + `site` in `astro.config.mjs` aligned.
- ✅ All em-dashes purged from titles, descriptions, body copy, HTML comments (sed pass + linter cleanup). 7 page titles rewritten with `:` separator + 50-60 char target.
- ✅ Self-hosted fonts via `@fontsource-variable/manrope`, `@fontsource-variable/jetbrains-mono`, `material-icons` npm packages. Google Fonts preconnects + imports removed.
- ✅ CTAs converted to `<button disabled aria-disabled="true">` "Coming soon" state; footer "App" column links labeled `(bientôt)` / `(coming soon)`.
- ✅ 404 page: SEO.astro refactored to accept `noindex` + `canonicalOverride` props. Result: exactly 1 robots meta (`noindex,nofollow`), 1 self-canonical to `/404/`, 0 fake hreflang.
- ✅ FR meta descriptions: ASCII accents restored (é, à, ç, etc.); all ≤160 chars.
- ✅ Real H1 with primary keyword added on `/fr/` + `/en/`; dramatic display demoted to H2.
- ✅ Screenshots: 11 PNGs (18 MB) → 9 WebPs at 1320×2868 → resized to 660×1434 (380 KB total final, -98% from start).
- ✅ `BreadcrumbList` JSON-LD on 16 pages (6 legal + 4 blog posts + 4 blog/about pages + 2 security-policy stubs).
- ✅ EN homepage title + ogTitle now contain "App Privacy Report" keyword.
- ✅ Brand normalization: every "Codevelop" → "CoDevelop" across i18n + jsonld + humans.txt.
- ✅ `inlineStylesheets: 'always'` in `astro.config.mjs` for inline CSS on every page.
- ✅ Alt-text rewrite: 4 phone screenshots + hero phone got keyword-rich, accessibility-friendly alts.
- ✅ `&nbsp;` stripped from FAQ JSON-LD (visible HTML keeps proper French typography).
- ✅ `Policy`, `Acknowledgments`, `Hiring` fields added to `security.txt`. PGP `Encryption` field omitted (no key yet).
- ✅ Apple Support documentation link cited in FAQ #1 (AI Overview citation eligibility).
- ✅ `/fr/a-propos/` + `/en/about/` pages built with native bilingual bios (~570-660 words each), Person JSON-LD tied to CoDevelop Org.
- ✅ Blog Content Collection schema (`src/content.config.ts`); `/fr/blog/` + `/en/blog/` index pages; `[slug].astro` post template with BlogPosting JSON-LD.
- ✅ 4 long-form blog posts written by dedicated copy-writer subagents (FR + EN, 1850-2337 words each, native keyword research via DataForSEO MCP, voice rules clean).
- ✅ Legal slug localization with 301 redirects:
   - `/fr/legal-notice/` → `/fr/mentions-legales/`
   - `/fr/privacy-policy/` → `/fr/politique-de-confidentialite/`
   - `/fr/terms-of-use/` → `/fr/cgu/`
- ✅ Slug-mapping URL system in `src/i18n/utils.ts`: `PageKey` + `pageSlugs[locale]` + new `getAlternateLocaleUrl()` that returns the correct cross-locale URL even when slugs differ (used by Header switcher + SEO hreflang).
- ✅ Footer 4th column "Ressources" / "Resources" → Blog + À propos / About links.
- ✅ `Person` + `BlogPosting` JSON-LD builders added to `src/i18n/jsonld.ts`.
- ✅ `Organization.sameAs` JSDoc enhanced with ordered priority list for when official profiles exist.

*Pre-launch §12:*
- ✅ Yandex Webmaster meta `<meta name="yandex-verification" content="2b8c8907535df868">` shipped on every page (incl. root sniffer).
- ✅ Site deployed to user's Plesk + Cloudflare (Hostinger CDG).
- ✅ Plesk Nginx `Additional nginx directives` field configured:
   - 3× rewrite for FR slug 301s
   - `proxy_intercept_errors on; error_page 404 /404.html;` (Plesk already declares the `location =` block; ours conflicted, removed)
   - 8 security headers: HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, COOP, CORP, CSP
- ✅ CSP: `script-src 'self' 'unsafe-inline'` (Astro inlines a small JS module; strict CSP broke animations + revealed FOUC; documented why this is safe given no third-party scripts and no user input).
- ✅ Custom 404 routing verified via live curl: title = "Page introuvable / Page not found | Privacy Score", status code 404 (not 200).
- ✅ Sitemap submitted to Google Search Console + Bing Webmaster Tools + Yandex Webmaster.
- ✅ Yandex ownership verification completed.

*Mobile perf optimization (post-launch fire-fighting):*
- ✅ `.reveal` animation polarity inverted: visible by default, hidden only when `.js-ready` + not in viewport. Eliminates FOUC on hero.
- ✅ Synchronous above-the-fold pass in `site.js`: `getBoundingClientRect()` marks visible elements `.in` BEFORE `.js-ready` is added (zero-frame flash).
- ✅ IntersectionObserver tuned aggressive: `threshold: 0, rootMargin: '0px 0px 400px 0px'` (sections pre-render 400 px before viewport). 1.5 s safety net catches stuck elements.
- ✅ Above-the-fold dashboard screenshot: `loading="eager"` + `fetchpriority="high"`.
- ✅ Identified Cloudflare Email Address Obfuscation as Safari/Brave perf differential (Brave Shields blocks the injected `email-decode.min.js`; Safari runs it → DOM scan + replace + reflow = 200-800 ms blocking). **User disabled it in CF dashboard + purged cache; awaiting tomorrow's retest.**

**In progress**:
- 🟡 Mobile Safari smoothness verification — 95% — waiting until 2026-06-02 daytime for user retest after Cloudflare Email Obfuscation disable + cache purge. If still slow, next levers: defer the inline JS module (set Vite `build.assetsInlineLimit: 0`), subset inlined CSS, audit Cloudflare Rocket Loader + Auto Minify + Bot Fight Mode (still need user check).
- 🟡 IndexNow setup (Tasks #88, #89) — 0% — explicitly deferred; do it when publishing the next blog post.
- 🟡 Screaming Frog MCP crawl — 0% — failed mid-session because user had SF GUI open and DB was locked. Re-attempt next session after asking user to quit GUI.

**Decisions made this session** (none had inline Decision Log entries; the major ones to consider promoting to formal entries):
- Canonical host = www.privacyscore.fr (apex → www permanent 301 at Cloudflare).
- CTA strategy at launch = "Coming soon" disabled buttons (defer App Store URL until iOS app ships).
- FR legal slugs in native French (`/fr/mentions-legales/` etc.) with 301 redirects from English-style URLs.
- CSP `script-src` includes `'unsafe-inline'` — accepted because (a) no third-party scripts, (b) no user input rendered to HTML, (c) Astro's inlined JS module would otherwise break.
- WebP screenshots = 660×1434 px (down from 1320×2868) — 1.0× to 2.2× device-pixel density across all renders; resolves mobile decode latency.
- Cloudflare Email Address Obfuscation = OFF. Reason: it injected the email-decode script that ran on Safari (not on Brave), causing the 3-4 sec mobile slowdown the user couldn't reproduce on desktop.
- Custom 404 routing via Nginx `proxy_intercept_errors` directive — required because Plesk fronts Apache behind Nginx and the bare `error_page` directive isn't enough.

**Priorities for next session** (in priority order):

1. **Verify Safari mobile smoothness post-CF-obfuscation-disable.** First diagnostic: `curl -s https://www.privacyscore.fr/fr/ | grep -E 'cdn-cgi|cfemail'` should now return empty. If yes → ask user to hard-refresh Safari + test. If still slow: defer the inline JS module (Vite assetsInlineLimit:0) + re-run mobile Lighthouse.
2. **Re-run the full Lighthouse mobile audit.** Pre-fix was 67/100 weighted; target post-fix is mid-90s. Compare against the original `docs/seo-audit-2026-05-31.md`.
3. **Re-run Screaming Frog MCP crawl** (ask user to close SF GUI first). With `Follow Internal "nofollow"` enabled, the crawl should discover all 19 indexable pages and confirm no remaining indexing issues (the 4 warnings on the root sniffer are by-design and should be acknowledged as such).
4. **Promote this session's major decisions to formal Decision Log entries** (canonical host, CTA strategy, CSP relaxation, etc.) so they're reachable from the "Decision log" table of contents.
5. **IndexNow setup** when the user is ready to publish the next blog post (Tasks #88 + #89 have the full recipe).
6. Optional: revisit Cloudflare Rocket Loader / Auto Minify / Bot Fight Mode if Safari is still slow (user hasn't checked these yet).

**Open questions for the user**:
- After Safari retest tomorrow: smooth or still gappy?
- Did you also disable Cloudflare Rocket Loader + Auto Minify + Bot Fight Mode (recommended in session response), or just Email Obfuscation? Want me to verify those too?
- When the iOS app ships → swap "Coming soon" CTAs for real App Store URL. Should I add a `data-app-store-url` config switch so it's a 1-line change at that point?
- Plan to generate a PGP key for `security.txt`'s `Encryption:` field, or leave it indefinite?

**Notes for next-Claude**:
- **Site is live at https://www.privacyscore.fr/** behind Cloudflare → Plesk (Nginx + Apache) on Hostinger CDG.
- **22 HTML pages** in `dist/`: 19 indexable, 1 root sniffer (noindex), 1 404, 3 FR-slug redirect stubs. Sitemap = 18 URLs. Total `dist/` ≈ 4 MB.
- **Plesk Nginx config gotcha**: Plesk auto-generates a `location = /404.html { internal; }` block. Adding ours duplicates it and fails validation. Just use `proxy_intercept_errors on; error_page 404 /404.html;` — nothing else.
- **CSP relaxation is intentional**: `script-src 'self' 'unsafe-inline'`. To tighten later, set Vite `build.assetsInlineLimit: 0` to force JS external, then remove `'unsafe-inline'`. The no-js stripper inline script can be moved to top of `site.js`.
- **Yandex token**: `2b8c8907535df868`. Lives in `src/components/SEO.astro` (every page via BaseLayout) + `src/pages/index.astro` (the root sniffer, since it bypasses BaseLayout).
- **Slug-mapping system**: `src/i18n/utils.ts` `PageKey` enum + `pageSlugs[locale]` constant. Add new locale-specific routes there. Blog posts are NOT in the map (they're native-per-locale, switcher routes to blog index).
- **WebP screenshots in `public/assets/`**: now 660×1434 px each (32-55 KB). DO NOT regenerate to higher resolution without an explicit reason — mobile decode latency was the issue.
- **`.reveal` animation system**: visible by default, hidden only with `.js-ready` body class. Above-the-fold elements are pre-marked `.in` in `site.js` PASS 1 (synchronous `getBoundingClientRect()`). DO NOT revert to opacity:0 default — it breaks FOUC.
- **Cloudflare features to leave OFF**: Email Address Obfuscation (just disabled, was Safari perf killer). Likely candidates to also disable if Safari is still slow: Rocket Loader, Auto Minify, Bot Fight Mode.
- **Subagents that worked well**: `privacy-score-web:copy-writer-fr` + `privacy-score-web:copy-writer-en` produced clean blog posts + about pages on first try, voice rules respected, native keyword research via DataForSEO MCP.
- **MCP I missed using**: Screaming Frog. User called this out mid-session; was unable to use during session because user had the GUI open (DB lock conflict). Plan to retry next session.
- **Plesk redirects field**: Don't add `location { internal; }` blocks; Plesk already declares them. Don't add non-trailing-slash redirect variants; `trailingSlash: 'always'` config + Nginx canonicalization handles them.
- **Mobile Safari vs Brave differential**: not server-side. Brave Shields blocks Cloudflare-injected scripts and bypasses CSP; Safari runs everything. Identifying server-side contributors (like Email Obfuscation) is the lever, not CSP changes.

---

## References

- Plugin: `.claude/plugins/privacy-score-web/`
- App technical recap: `APP_RECAP.md`
- Memory: `~/.claude/projects/.../memory/MEMORY.md`
