---
name: publish-blog
description: Write and publish a new blog post. Researches keywords, generates the article in the requested locale, validates SEO, commits as a markdown file in src/content/blog/. Use for one locale at a time.
allowed-tools: Read Write Edit Bash Agent
argument-hint: <topic> <locale: fr|en>
---

# /publish-blog command

Write and publish a single blog post in the specified locale.

## Inputs

`$ARGUMENTS` format: `<topic> <locale>` 
Examples:
- `"Comment activer le rapport de confidentialité Apple" fr`
- `"How to disable IDFA on iPhone" en`

## Workflow

1. **Clarify if needed**:
   - Target keyword (if not obvious from topic)?
   - Length: pillar (1500-2500 words) / supporting (800-1200) / quick tip (400-600)?
   - Internal links to existing posts?

2. **Delegate to seo-specialist** for keyword research:
   ```
   Agent(subagent_type: 'seo-specialist', prompt: 'Research <locale> keywords for "<topic>"')
   ```

3. **Delegate to spec-architect** for article outline:
   ```
   Agent(subagent_type: 'spec-architect', prompt: 'Outline blog post: <topic>, <length>, primary keyword <kw>')
   ```

4. **Delegate to the appropriate copywriter** (NOT both — single locale):
   - If `fr`: `Agent(subagent_type: 'copy-writer-fr', prompt: '<outline + keywords>')`
   - If `en`: `Agent(subagent_type: 'copy-writer-en', prompt: '<outline + keywords>')`

5. **Create the markdown file** at:
   - `src/content/blog/fr/<slug>.md` (if FR)
   - `src/content/blog/en/<slug>.md` (if EN)

   With proper frontmatter (matches `content.config.ts` schema):
   ```yaml
   ---
   title: "..."
   description: "..."
   publishDate: 2026-05-25
   heroImage: ./images/<slug>-hero.png
   heroImageAlt: "..."
   tags: [...]
   author: "Skander Bahri"
   lang: fr
   ---
   ```

6. **Delegate to seo-specialist** for final validation:
   ```
   Agent(subagent_type: 'seo-specialist', prompt: 'Audit blog post src/content/blog/<locale>/<slug>.md')
   ```

7. **Suggest writing the equivalent locale version** at the end:
   "Article published in FR. Want me to write the EN version now? Run `/publish-blog \"<topic in EN>\" en`."

## Output

```markdown
✅ Published: src/content/blog/<locale>/<slug>.md

- Title: "..."
- Word count: XXX
- Target keyword: <kw>
- Internal links: X
- SEO score: ...

🔗 Will be live at: https://privacyscore.fr/<locale>/blog/<slug>/

Next: Want the equivalent post in the other locale?
```
