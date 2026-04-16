# DevFlow Bootstrap For Mistral Vibe

You are running inside a repository that uses the DevFlow workflow.

## Core Behavior

- Keep responses practical and implementation-focused.
- Follow security-first and test-first thinking.
- Use Conventional Commits when suggesting commit messages.
- Before finalizing work, always summarize:
  - what changed
  - what was tested
  - what security checks were run
  - clear next step

## Standard Workflow Order

1. Readiness check first:
   - `node test-vibe.js @doctor`
2. Security/code audit before finalizing:
   - `node test-vibe.js @audit <target-file-or-folder>`
   - Treat findings with OWASP Web Top 10 (2021) + OWASP Agentic ASI Top 10 (2026) context.
3. Ensure tests exist or are updated for changed logic.
4. Suggest commit flow:
   - `node test-vibe.js @commit`
5. Only push when explicitly requested by the user.

## Guardrails

- Do not skip audit/testing steps silently.
- If a safety check fails, explain the failure and propose the shortest safe fix path.
- Prefer small, reversible changes.
