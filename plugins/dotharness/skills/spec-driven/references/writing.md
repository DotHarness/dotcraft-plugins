# Writing a spec

A spec is read by people and agents deciding what the product must do. Every sentence should be a rule, a decision, or the reason for one.

## What a spec holds

- Core design and flow: actors, what each can do, states and transitions, authorization, limits, failure and recovery behaviour.
- Product decisions, including what the product deliberately does not do, stated once in the section it concerns.
- The reason behind any rule whose reason is not obvious, because a rule without its reason gets broken by the first edge case it did not foresee.
- In a protocol spec, the cross-process contract other processes rely on: message shapes, fields, ordering, error semantics, and the public endpoints an outside client calls.
- Settings and names an operator or integrator types: an option name, a CLI command, a file an operator edits.

## What a spec leaves out

- Internal implementation: class, method, file, folder, table, column, or index names, code and pseudo-code, query order, and caching. Describe the behaviour the code must keep. A public API, schema, or wire shape is the exception when it is itself the contract.
- Temporary content: plans, milestones, TODOs, progress notes, open questions, raw research. These live in the conversation or in a temporary file outside the spec.
- History: "now", "no longer", "was replaced", "legacy", migration and upgrade notes, compatibility with earlier versions. Write as if the current rules are the only rules that ever existed, because version control keeps the past.
- Boilerplate that restates the opening paragraph: Overview, Goal and Scope sections, "Related specifications" lists, and Verification or Acceptance checklists. A behaviour that only a checklist states belongs in the body.
- Presentation in a behaviour spec, and domain rules in a design spec. Sizes, colours, spacing, motion, and control placement belong to the design spec. Who may act, lifecycle, persistence, and authorization belong to the behaviour spec that owns the topic.
- Anything another spec owns. See [structure](structure.md).

## How to write it

- Plain declarative present tense at normal volume. Capitalized MUST or NEVER, piled-up emphasis, and hedges such as "try to" or "ideally" on a real requirement make every rule read as equally loud or optional.
- State the intent positively. Keep a prohibition when it is a real rule, with its reason beside it.
- Write behaviour in prose, so the reason travels with the rule, and reference data in tables (fields, states, event names, role matrices).
- Say each thing once, where a reader looks for it. Shorter is the result of removing restatement and padding, never a reason to drop a rule.
- Use the product's own terms consistently, and quote UI copy exactly when the spec fixes it.
- Avoid semicolons, because they leave the relation between two clauses unstated. End the sentence, or join the clauses with a comma, a colon, or a dash.

## Shape

Start with the H1 title and, immediately after it, the metadata table:

| Field | Value |
|---|---|
| Version | 0.1.0 |
| Status | Draft |
| Date | YYYY-MM-DD |

Add a `Parent specs` or `Related specs` row, with repository-relative links, only when it establishes which spec's boundary this one refines. Then one opening paragraph saying what the spec owns and the decisions that frame it, followed by `##` sections by topic in the order a reader needs them. Choose sections for the subject, since there is no fixed template.

A design-system spec that follows an external format, such as Google's DESIGN.md with token front matter, keeps that format instead.
