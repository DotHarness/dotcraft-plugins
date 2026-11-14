---
name: please-cleanup
description: Clean up uncommitted changes on the current branch or within a user-specified scope. Use only when the user explicitly invokes or requests please-cleanup.
---

Review the scoped diff and leave only what the change needs, without changing its intended behavior. Stay within the scope the user names, or use all uncommitted changes on the current branch when they name none. Words the user adds to the request extend or override the rules below.

## What to remove

- **Defensive code the change does not need**: guards for states the code cannot reach, fallbacks nothing calls, re-validation of values already checked, try/catch around code that does not throw there, and options or abstractions with a single use. Keep checks at real trust boundaries (user input, network, files, other processes) and the error handling a caller relies on.
- **Comments that do not earn their place**: keep a comment only when the code would mislead without it, in one or two sentences. Drop comments that restate the code, narrate the change, or cite a spec path or section.
- **Compatibility code**: shims, fallbacks for older formats or clients, migration and upgrade paths, and dual old/new code paths, unless the repository's guidance or the user says compatibility is required. Replaced code is deleted, not kept beside its replacement.
- **Tombstones**: commented-out code, "removed" or "previously" notes, deprecated stubs, and documentation describing what used to be. Version control keeps history.
- **Sensitive and local details**: real project or customer names, absolute or machine-specific file paths, internal hostnames, account identifiers, credentials, and anything copied from a private source. Use neutral examples instead.
- **Semicolons in new prose**: in comments, documentation, and UI copy the change adds, end the sentence or use a comma, a colon, or a dash instead, because a semicolon leaves the relation between two clauses unstated.
- **Low-value tests**: keep only tests that guard behavior a regression would break. A test that only restates presentation (rendered copy, class names, styles, geometry, element order, or source text read from disk) is deleted rather than updated.

## Finish

Re-read the cleaned diff as a whole, run the relevant build, tests, and linters, and report what you removed and anything you kept that a rule above would have removed, with the reason.
