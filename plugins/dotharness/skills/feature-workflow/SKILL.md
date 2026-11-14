---
name: feature-workflow
description: Plan and deliver substantial features through a stable spec and reviewed milestones. Use for large or multi-stage work that should be designed before implementation.
---

# Feature Workflow

A large feature is designed completely before it is built, then delivered in milestones the user accepts one at a time. The spec is the durable contract throughout, and milestones are temporary coordination that never reaches the product.

Write and maintain every spec with `$spec-driven`: it owns spec format, scope, ownership, versioning, and validation. This skill owns only the delivery rhythm around it.

## Research before designing

Read the code, existing specs, tests, documentation, and history the feature touches, until you understand its goal and users, the boundaries and contracts it changes, the behaviour that must stay stable, and the decisions that could change the design. Bring external prior art into the discussion when it would materially improve the design, and search or clone outside projects only with the user's approval. Resolve material uncertainty with the user before the design is treated as ready, including whether the feature is feasible and the milestone split realistic.

## Specify the whole feature first

Write the main spec for the finished feature in the repository's spec location, or in the file the user names. It states the complete design and flow, not the order of building it.

Then outline the milestones: each one a coherent, reviewable increment with its goal, the behaviour it makes observable, what it leaves out, and what it depends on. Write a short milestone spec for each in a temporary location (`references/` at the repository root unless the user names another), stating that increment's scope and acceptance in behavioural terms. Check that the milestones together deliver the main spec.

Present the main spec and the milestone set together, and start implementing only after the user confirms them.

## Deliver one milestone at a time

For each milestone, in order:

1. Plan it in the conversation: affected modules, contracts that change, tests, and risks. Pause for the user when the plan changes scope, carries material risk, or rests on a non-obvious trade-off.
2. Implement only that milestone, without pulling in later work because the code is nearby.
3. Validate against the milestone spec and the main spec, report the evidence, and stop for the user's acceptance unless they asked you to continue without stopping.

When implementation shows that behaviour, architecture, or scope must change, update the main spec first, then the affected later milestone specs, then the plan and the code. Feedback that adds scope becomes a later milestone. A milestone is complete when its acceptance holds and the user accepts it.

## Close out

When every milestone is accepted, merge the durable behaviour and decisions into the main spec, confirm it matches the implementation, and delete the milestone specs, unless the user already said how to handle them.

Milestones are invisible in the product: no milestone labels or phase narration in code, tests, documentation, or commit messages, and milestone specs are never committed.
