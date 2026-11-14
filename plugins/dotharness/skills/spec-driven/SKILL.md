---
name: spec-driven
description: Write, update, review, and reorganize a repository's specifications for spec-driven development. Use whenever a task creates or edits a spec, changes behavior a spec owns, reviews specs for scope or duplication, or restructures a specs directory, including spec edits made in passing during implementation.
---

# Spec-Driven Development

Specs are the durable contract of a product: what it does, for whom, under which rules, and why. Code and tests show conformance, and the spec decides what is correct. This skill keeps specs that way from the first draft, so they never need a cleanup pass afterwards.

Before touching a spec, read repository guidance, the spec index, and the specs that own neighbouring topics. Follow the repository's established location, naming, terms, and header format. The references describe the default when it has none.

## Pick the task, then read only what it needs

| Task | Read |
|---|---|
| Write a new spec, or change what an existing one says | [writing](references/writing.md), [structure](references/structure.md) |
| Code is about to change, or has changed, behaviour a spec owns | [lifecycle](references/lifecycle.md) |
| Rename, split, merge, or retire specs, or bump a version | [lifecycle](references/lifecycle.md), [structure](references/structure.md) |
| Review one spec, a change to specs, or a whole specs directory | [review](references/review.md), with writing and structure as the standard it checks against |

A large reorganization follows the batch procedure in [review](references/review.md#reorganizing-a-whole-directory).

## Check your work

Run the validator on every spec you touched, from the repository root, resolving the script relative to this file:

```bash
python <skill-directory>/scripts/validate_spec.py --index <spec-index> <spec-paths...>
```

Errors (structure, metadata, links, index inclusion) must be fixed. Warnings point at content a spec should not hold. Resolve each one, or leave it when the sentence is a legitimate rule, such as a state that "no longer" holds. Add `--code <source-dir>` when you changed code comments, to find any that cite a spec.

When a review covers more than one spec, also run `scripts/find_duplicates.py <specs-dir>` and resolve each reported pair by its owner.

The scripts check form. Ownership, contradictions, and whether a rule belongs in a spec at all are your judgment, guided by the references.
