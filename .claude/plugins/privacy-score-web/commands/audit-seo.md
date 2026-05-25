---
name: audit-seo
description: Run a full SEO audit of the site (or a specific page). Returns CRITICAL/HIGH/MEDIUM/LOW findings with fix recommendations.
allowed-tools: Read Bash Glob Grep WebFetch Agent
argument-hint: [page-path-optional]
---

# /audit-seo command

Run a comprehensive SEO audit.

## Inputs

`$ARGUMENTS`:
- If empty → audit the whole site
- If a path (e.g., `/fr/blog/article-name`) → audit that specific page

## Workflow

1. **Delegate to seo-specialist**:
   ```
   Agent(subagent_type: 'seo-specialist', prompt: 'Audit <path or whole site>')
   ```

2. **If Screaming Frog MCP is configured**, optionally crawl with it for deeper findings.

3. **Aggregate findings** from seo-specialist and present to user:
   - 🔴 CRITICAL (block publish)
   - 🟠 HIGH (fix before publish)
   - 🟡 MEDIUM (fix this week)
   - 🔵 LOW (hygiene)

4. **Offer to fix** the HIGH and CRITICAL findings automatically (delegate to spec-developer if accepted).

## Output

```markdown
## SEO Audit — <target>

### 🔴 CRITICAL
- ...

### 🟠 HIGH
- ...

### 🟡 MEDIUM
- ...

### 🔵 LOW
- ...

### Verdict
{Block | Ready to publish | Ready with caveats}

Want me to fix the HIGH/CRITICAL items? Type yes.
```
