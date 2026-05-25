---
name: new-page
description: Create a new page on privacyscore.fr in both FR and EN. Orchestrates the full workflow: architect → keyword research → parallel copywriting → development → animation → SEO validation.
allowed-tools: Read Write Edit Bash Glob Grep Agent
argument-hint: <page-purpose>
---

# /new-page command

Orchestrate creation of a new page from scratch. Delegate to specialist agents.

## Inputs

User provided: $ARGUMENTS

Likely a description like "feature page for VPN analysis" or "blog post about IDFA".

## Workflow to execute

1. **Clarify if needed**: ask the user for any missing critical info:
   - Page type (landing / feature / blog / FAQ / legal)?
   - Primary topic / keyword if known?
   - Target audience?
   - URL slug (FR + EN)?

2. **Delegate to spec-architect**:
   ```
   Agent(subagent_type: 'spec-architect', prompt: '<page spec from inputs>')
   ```

3. **Delegate to seo-specialist** for keyword research:
   ```
   Agent(subagent_type: 'seo-specialist', prompt: 'Research FR and EN keywords for <topic>')
   ```

4. **Delegate to BOTH copywriters in PARALLEL** (same message, two Agent calls):
   ```
   Agent(subagent_type: 'copy-writer-fr', prompt: '<spec + FR keywords>')
   Agent(subagent_type: 'copy-writer-en', prompt: '<spec + EN keywords>')
   ```

5. **Delegate to spec-developer**:
   ```
   Agent(subagent_type: 'spec-developer', prompt: '<spec + both copies>')
   ```

6. **Delegate to animation-designer** if spec calls for animations:
   ```
   Agent(subagent_type: 'animation-designer', prompt: '<page path + animation spec>')
   ```

7. **Delegate to seo-specialist** for final SEO validation:
   ```
   Agent(subagent_type: 'seo-specialist', prompt: 'Audit /fr/<page> and /en/<page>')
   ```

8. **Report to user**:
   - Files created
   - URLs (FR + EN)
   - Lighthouse scores
   - SEO findings (any HIGH/CRITICAL)
   - Next steps (deploy, image creation, etc.)

## Constraints

- Always run both copywriters in PARALLEL (not sequential)
- Never skip the SEO validation step
- If any step fails, report and ask for guidance before continuing
