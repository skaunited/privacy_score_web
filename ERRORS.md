# ERRORS.md — Privacy Score Web

**Lessons-learned log.** Read this BEFORE suggesting any approach similar to a past task — it may have failed before for reasons that aren't obvious from the prompt.

## Standing rules

1. **Check this file first** when starting a task that resembles a past one (use the Tags index to find related entries)
2. **Log a new entry** when an approach takes **more than 2 attempts** to get right
3. **Be honest** — failed attempts are valuable knowledge, not embarrassments to hide
4. **Cross-reference** — if an error contradicts a decision in `CLAUDE.md`, surface the conflict; the decision may need revisiting

## Entry template

```
### YYYY-MM-DD — <short imperative title>
**Context**: <what we were trying to accomplish, in 1-2 lines>

**Failed attempts**:
- Attempt 1: <what we tried> → <why it failed (error message / outcome)>
- Attempt 2: <what we tried next> → <why it failed>
- (Attempt 3 / 4 / ... if applicable)

**What worked**:
<the approach that finally succeeded, with code/commands/files if relevant>

**Root cause**:
<the underlying reason the first attempts failed — the lesson>

**Avoid in the future**:
- <specific actionable guidance to prevent this exact mistake>
- <related pitfalls to watch for>

**Tags**: `<comma-separated keywords for search, e.g. astro, i18n, hreflang, deploy, mcp, nginx, ssl, csp, tailwind>`

**Related**: <links to CLAUDE.md decisions, other ERRORS.md entries, or external docs>
```

## How to use this file

### Before starting a task
1. Skim the **Tags index** below for keywords matching your task
2. Read any matching entries to learn from past failures
3. Adjust your approach based on what worked previously

### When you hit > 2 failed attempts
1. Stop trying variations
2. Diagnose the root cause (don't just patch the symptom)
3. Once a solution works, **immediately** log an entry here
4. Update the Tags index

## Tags index

*(Updated as entries are added. Helps quickly find relevant past failures.)*

| Tag | Entries |
|---|---|
| `astro` | 2026-10-19 — Preserve the original icon geometry |
| `i18n` | — |
| `hreflang` | — |
| `tailwind` | — |
| `deploy` | — |
| `nginx` | — |
| `ssl` | — |
| `csp` | — |
| `mcp` | — |
| `seo` | — |
| `schema` | — |
| `image` | — |
| `motion` | — |
| `view-transitions` | — |
| `screaming-frog` | — |
| `dataforseo` | — |
| `gsc` | — |
| `astro-check` | — |
| `build` | — |
| `lighthouse` | 2026-10-19 — Preserve the original icon geometry |
| `analytics` | 2026-10-19 — Separate browser rendering from virtual measurement time |
| `playwright` | 2026-10-19 — Separate browser rendering from virtual measurement time |

---

## Entries (chronological — newest at the bottom)

### 2026-10-19 — Preserve the original icon geometry during SEO repairs

**Context**: The owner requested reversal of visual regressions introduced during the SEO rebuild. Icon substitutions also changed the site's visual identity and collapsed padded SVGs into very small glyph areas.

**Failed attempts**:
- The rebuild replaced Material Icons with SVGs using the existing padded icon classes. A one-em SVG box under border-box sizing left almost no room for the drawing; marketing copy and whole sections were also replaced without a separate design request.
- Restoring the original full icon font recovered the shapes but loaded about 170 KiB and caused layout shifts when text ligatures resolved into icons. Lighthouse exposed the shift despite passing WCAG-focused browser checks.
- Restoring the original muted colors needed small contrast repairs; global selectors did not override Astro's more specific scoped metadata styles. The restored storyboard also had an invalid article/listitem role pairing.

**What worked**:
Restore the original sections, visible homepage copy and blog presentation. Retain the original Material Icons glyph outlines and advances in a 3.2 KiB local subset, and reserve the final content-box dimensions before the font loads. Use valid div/listitem markup without changing layout. Apply minimal contrast repairs at the actual scoped selectors. Compare desktop EN/FR geometry against the original build and keep browser assertions for the 2,487 counter, DNS labels, eight panels and three intact icon boxes.

**Root cause**:
Treating a technical SEO task as authorization to redesign the homepage, and treating icon elements as interchangeable without checking their box model, font metrics or rendered appearance.

**Avoid in the future**:
- Preserve owner-approved presentation during technical SEO maintenance; get an explicit design request before changing copy, sections or the icon family.
- Verify rendered glyphs and desktop/mobile geometry, not only the existence of an SVG or an accessibility score.
- Test CLS and font loading on the actual build; keep original outlines and stable boxes when optimizing delivery.

**Tags**: `astro, icons, image, lighthouse, css, visual-regression`

**Related**: `CLAUDE.md` owner visual correction; `src/styles/material-icons.css`; `scripts/subset-icons.py`; `tests/browser.spec.ts`.

---

### 2026-10-19 — Separate browser rendering from virtual measurement time

**Context**: Browser coverage for consented scroll thresholds, active article reading and cross-page navigation.

**Failed attempts**:
- Advancing Playwright's clock immediately after `scrollTo()` missed native scroll dispatches and the 100% event; waiting for fonts and disabling animations did not resolve the rendering-clock mismatch.
- Checking a new document's data layer immediately after its URL changed raced bundle initialization. Reading assertions also exposed unreported partial time at the inactivity boundary.

**What worked**:
In virtual-time scroll tests, change the real scroll position, explicitly dispatch scroll and advance the throttled animation frame. Poll the actual page-view event after navigation. Flush incremental reading time on transition to inactivity as well as blur, page hide and navigation. Keep separate real-input coverage on the built site.

Headless Playwright also emulates focus in every page; bringing a second tab forward does not reliably make `document.hasFocus()` false in the first. Control the focus API and focus/blur events explicitly for deterministic reading-time assertions, alongside the actual cross-tab consent and native wheel/click tests.

**Root cause**:
Playwright's virtual timer controls do not synchronize all native browser rendering events. Periodic incremental reporting also leaves a partial interval until an explicit flush.

**Avoid in the future**:
- Wait for observable analytics initialization after full-page navigation.
- Distinguish timer-driven test observations from native rendering/input, and validate both.
- Sum incremental durations and settle partial time when reading pauses.

**Tags**: `analytics, playwright, consent, browser-clock`

**Related**: `tests/analytics.spec.ts`; `src/assets/engagement.ts`.

---

## References

- Decision log + Standing rules: `CLAUDE.md`
- Plugin: `.claude/plugins/privacy-score-web/`
- Memory: `~/.claude/projects/.../memory/MEMORY.md`
