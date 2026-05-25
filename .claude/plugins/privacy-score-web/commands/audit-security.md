---
name: audit-security
description: Run full security audit (OWASP Top 10:2025, CSP, headers, supply chain, privacy concerns). Required before every production deploy.
allowed-tools: Read Bash Glob Grep Agent
---

# /audit-security command

Run comprehensive security audit before deploy.

## Workflow

1. **Delegate to security-auditor**:
   ```
   Agent(subagent_type: 'security-auditor', prompt: 'Run full pre-deploy security audit')
   ```

2. **Present findings to user**:
   - 🔴 CRITICAL (block deploy)
   - 🟠 HIGH (must fix)
   - 🟡 MEDIUM (fix soon)
   - 🔵 LOW (hygiene)

3. **If CRITICAL or HIGH findings exist** → BLOCK deploy, offer to fix.

4. **Verdict**:
   - 🔴 DEPLOY BLOCKED — list of must-fix items
   - ✅ READY TO DEPLOY

## Reminder

This audit is automatically run by the `/deploy` command. Run `/audit-security` standalone when you want a security check without deploying.
