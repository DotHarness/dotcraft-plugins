---
name: please-cleanup
description: Clean up uncommitted changes on the current branch or within a user-specified scope. Use only when the user explicitly invokes or requests please-cleanup.
---

Review the scoped diff and clean it up without changing its intended behavior. Stay within the user's requested scope; otherwise use all uncommitted changes on the current branch.

- Remove real project references, real file paths, and other sensitive information.
- Keep only necessary, critical new tests; remove redundant or low-value tests. A test is low-value when it only restates presentation — rendered copy, class names, styles, geometry, element order, or source text read from disk; delete it rather than update its expectations.
- Remove tombstone code, comments, and documentation instead of preserving obsolete material.

Verify the cleaned diff and run relevant checks when practical.
