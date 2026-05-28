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
| `astro` | — |
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
| `lighthouse` | — |

---

## Entries (chronological — newest at the bottom)

*(empty — first entry will be logged after the first task that takes > 2 attempts)*

---

## References

- Decision log + Standing rules: `CLAUDE.md`
- Plugin: `.claude/plugins/privacy-score-web/`
- Memory: `~/.claude/projects/.../memory/MEMORY.md`
