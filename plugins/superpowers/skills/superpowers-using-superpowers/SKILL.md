---
name: superpowers-using-superpowers
description: Use when starting work with Superpowers, choosing which Superpowers skill applies, or explaining how the Superpowers workflow fits DotCraft.
---

# Using Superpowers

Superpowers is a set of workflow skills for planning, TDD, debugging, review, worktrees, and finishing branches. Use it as a menu of proven approaches, not as a rule that overrides the user.

## Priority

Follow this order:

1. User instructions and project instructions such as AGENTS.md.
2. Explicitly requested skills.
3. Relevant Superpowers skills.
4. General agent behavior.

If a project instruction says not to use a workflow, respect that instruction.

## Choosing Skills

Check the relevant `superpowers-*` skills before doing substantial work:

- `superpowers-brainstorming`: shaping vague ideas, comparing directions, or making design choices.
- `superpowers-writing-plans`: turning an agreed direction into an implementation plan.
- `superpowers-subagent-driven-development`: executing a plan with parallel or delegated workers.
- `superpowers-executing-plans`: executing a plan in the current session.
- `superpowers-test-driven-development`: feature or bugfix work where tests can guide the change.
- `superpowers-systematic-debugging`: failures with unclear causes, flaky behavior, or regressions.
- `superpowers-requesting-code-review`: asking another agent to review code.
- `superpowers-receiving-code-review`: triaging review feedback without defensiveness.
- `superpowers-using-git-worktrees`: isolating parallel or risky work.
- `superpowers-verification-before-completion`: checking work before declaring it done.
- `superpowers-finishing-a-development-branch`: final cleanup before handoff, commit, or PR.
- `superpowers-writing-skills`: creating or improving skills.

## Practical Use

When a Superpowers skill fits, load it through DotCraft's skill mechanism and follow the parts that apply. If several skills fit, start with the process skill that decides the approach, then use implementation skills as needed.

Use task tracking when a selected skill has a checklist or multi-step workflow. Keep the checklist scoped to the current task, and update it as work completes.

## Red Flags

Pause and check the skill menu when you catch yourself thinking:

- "This is probably too small for a workflow."
- "I can debug this by guessing one more thing."
- "I'll write the plan after I start."
- "The review comment is obviously wrong."
- "I verified enough without running the relevant check."

The goal is not ceremony. The goal is to use the right lightweight discipline before the work drifts.
