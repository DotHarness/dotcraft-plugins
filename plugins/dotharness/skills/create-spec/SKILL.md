---
name: create-spec
description: Create a durable DotHarness-style specification when the user explicitly asks to create or draft a spec. Do not use for implementation plans, progress tracking, or ordinary feature work.
---

# Create Spec

Create a durable contract for the requested scope. Before writing, read repository guidance, the complete spec index, and relevant parent or related specs. Follow established location, naming, structure, and terminology.

## Core rules

- One document owns each complete contract. A narrower spec links its parent and states only its local refinement; it must not silently weaken or override the broader boundary.
- Define the core design and flow contract. Include only what the subject needs; do not impose a fixed section template.
- State what the system must do and what must remain true, not how internal code will implement it. Do not prescribe files, classes, methods, code, or implementation steps unless a public API, schema, or wire shape is itself the contract.
- Schemas own serialized shapes; their prose owner retains semantics, authorization, lifecycle, and failure behavior.
- Keep implementation plans, milestones, TODOs, progress history, and raw research outside Draft and Living specs. Code and tests are conformance evidence, not contract authority.

## Metadata

- Put a metadata table immediately after the H1 title with semantic `Version`, `Status`, and `Date`; add linked Parent or Related Specs when needed.
- `Status` is `Draft` for a proposed contract under review or `Living` for the current normative contract. References are supporting sources, not a lifecycle status or product authority.
- Increment major for incompatible contract or authority changes, minor for additive behavior or durable scope changes, and patch for semantics-preserving clarification or link repair. Date records the latest substantive update.

If the repository has no spec convention, create `specs/<kebab-case>.md` with an H1 title followed by this metadata:

| Field | Value |
|---|---|
| Version | 0.1.0 |
| Status | Draft |
| Date | current date in `YYYY-MM-DD` |

Add Parent or Related Specs only when they are needed to establish authority or interpretation.

## Maintain and validate

- Update the owning spec and affected schemas before or with implementation and conformance tests. If implementation diverges from a still-valid Living contract, fix the implementation.
- Use repository-relative Markdown links. Keep indexes complete and update incoming references in the same change when adding, renaming, replacing, or removing a spec.
- Run the bundled validator by resolving `scripts/validate_spec.py` relative to this `SKILL.md`: `python <skill-directory>/scripts/validate_spec.py <spec-path>`. When an index exists, add `--index <index-path>`. Run repository-specific checks as well.
- Review design, flows, ownership, and duplicated contracts manually; the validator checks structure, metadata, local links, index inclusion, and whitespace.
