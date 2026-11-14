# Reviewing specs

A review checks specs against [writing](writing.md) and [structure](structure.md). It finds what a spec should not hold and where specs disagree. It does not rewrite for style alone.

## What to check

For each spec:

1. **Scope**: only core design and flow rules, with reasons where they are not obvious.
2. **No temporary content**: plans, milestones, TODOs, open questions, progress notes.
3. **No implementation**: internal names, code, storage and query mechanics.
4. **No history**: migration, compatibility, "now" or "no longer" framing of a change.
5. **No boilerplate**: Overview or Scope restating the opening, related-spec lists, test checklists.
6. **Ownership**: content another spec owns, and presentation or domain rules in the wrong kind of spec.
7. **References**: links that summarize, chain, point at a missing heading, or could be dropped.
8. **Contradictions**: two specs, or a spec and the code, saying different things.

Across the repository, also look for code comments that cite a spec.

Run the validator and the duplicate finder first. Their findings are leads: confirm each one by reading.

## Resolving a contradiction

The owning spec wins over a spec that restates it. Check the code to learn which rule is actually in force, and keep a rule the code contradicts only when the user confirms it is the intended behaviour, in which case the code is the bug. Report every contradiction with the rule you kept and why, because each one is a product decision someone may want to revisit.

## Reporting

When asked to review rather than fix, list findings ordered by severity, each with `file:line`, the problem, and the proposed change. When asked to fix, apply the changes and report what changed, what moved between specs, rules you kept despite doubt, and contradictions resolved.

## Reorganizing a whole directory

For a large pass over many specs:

1. Write one rules file for the pass: the writing and structure rules plus any repository-specific decisions.
2. Assign specs to batches by topic, so each batch owns related files and no file is in two batches. Batches can run in parallel.
3. Before deleting content because another spec owns it, confirm the owner states it, reading the owner as it was before the pass began (`git show HEAD:<path>`). If the owner does not state it, keep it once in the current file. Parallel writers would otherwise each delete what they assume the other keeps.
4. Each batch edits only its own files and reports cross-file fixes for the batch that owns them.
5. Finish with one pass over everything: validator, duplicate finder, link check, index completeness, and code comments that cite specs.
