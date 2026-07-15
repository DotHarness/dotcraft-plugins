---
name: feature-workflow
description: Guides substantial feature development through repository research, a stable main specification, temporary milestone contracts, one-milestone-at-a-time implementation, user acceptance, and final spec consolidation. Use when planning or delivering a major feature, a multi-milestone capability, or any request that should be fully designed before implementation.
---

# Feature Workflow

Use a research-first, spec-first process for large features. Establish the complete design before implementation, deliver it in accepted milestones, and keep milestone mechanics out of production artifacts.

## Core rules

1. Research the current project before designing the feature.
2. Define one main spec for the complete feature before implementation.
3. Treat the main spec as the durable contract. Update it before changing behavior, architecture, or workflow in code.
4. Define all milestone contracts up front, then implement one milestone at a time unless the user explicitly requests bundled delivery.
5. After each milestone, validate it and stop for user acceptance unless the user explicitly asks to continue without stopping.
6. Keep milestone files and terminology temporary. Do not expose them in the final repository or commit history.

Do enough research and confirmation to keep the main spec stable. Do not rewrite it merely to make divergent implementation appear compliant; when the agreed contract still stands, correct the implementation instead.

## Discover project conventions

Inspect repository guidance and existing specifications before creating artifacts.

- If the user designates an existing Markdown file, use it as the main spec.
- Otherwise, follow the project's established spec location, naming, and structure. Ask before creating the main spec only when the correct target cannot be determined.
- Store temporary milestone specs under the repository-root `references/` directory by default. A user-specified location overrides this default.
- Never stage or commit temporary milestone specs.

## Phase 1: Research and scope

Always inspect the current project. Read the relevant code, existing specs, tests, documentation, and repository history needed to understand:

- the feature goal, users, success criteria, and non-goals
- current architecture, module boundaries, contracts, and lifecycle
- compatibility, migration, UX, and testing constraints
- existing behavior that must remain stable
- unresolved decisions that could change the design

Discuss external research when prior art could materially improve the design. Search or clone external projects only when useful and approved. Summarize reusable ideas, rejected patterns, and remaining questions in the conversation unless the user requests a persistent research artifact.

Resolve material uncertainty before treating the design as ready.

Before authoring specs, review feasibility with the user when it exposes meaningful trade-offs. Cover architecture pressure, compatibility or migration concerns, UX complexity, testing difficulty, and whether the proposed milestone split is realistic.

## Phase 2: Main spec and milestone contracts

Draft the main spec first, derive the milestone outline and contracts from it, then present the complete set together for review.

Follow the project's existing spec format when one exists. Otherwise, use the fallback structures below.

### Main spec

Make the main spec the durable source of truth for the finished feature. Capture the core design and workflow contract, including:

- goals, scope, and non-goals
- architecture and system boundaries
- user and system workflows
- public behavior, contracts, and lifecycle
- constraints, compatibility, and failure behavior
- acceptance criteria for the completed feature

Describe what must be true without turning the spec into a file-by-file implementation plan.

When no project format exists, use:

1. Overview
2. Goal
3. Scope
4. Non-goals
5. Core design and architecture
6. User and system workflows
7. Behavioral contracts and lifecycle
8. Constraints and compatibility
9. Acceptance checklist
10. Open questions

Start with a title and a metadata table containing `Version`, `Status`, and `Date`. Include `Parent Spec` when this feature extends a broader specification. Resolve material open questions before implementation begins.

### Milestone outline

Produce a milestone outline before writing the detailed milestone specs. Each milestone needs a short name, user or product goal, expected outcome, out-of-scope boundary, and major dependencies or blockers.

Use this fallback structure:

```markdown
## Milestone Outline

- M1: [name]
  Goal: [...]
  Expected outcome: [...]
  Out of scope: [...]
  Dependencies: [...]

- M2: [name]
  Goal: [...]
  Expected outcome: [...]
  Out of scope: [...]
  Dependencies: [...]
```

Keep the outline at product and behavior level. It is a planning scaffold, not an implementation plan.

### Milestone specs

Create all temporary milestone specs under `references/` or the user-approved location. Each milestone spec should define:

- its goal and incremental outcome
- included and excluded scope
- dependencies and ordering constraints
- behavior added or made observable in that milestone
- milestone-specific acceptance criteria

Do not put concrete file edits, class designs, or step-by-step implementation instructions in milestone specs. Those belong to the per-milestone implementation plan.

When no project naming convention exists, use numbered filenames such as `feature-name-m1.md` and `feature-name-m2.md`. Start each file with a title and a metadata table containing `Version`, `Status`, `Date`, and `Parent Spec`.

Use this fallback section order:

1. Overview
2. Goal
3. Scope
4. Non-goals
5. User experience or behavioral contract
6. Required workflow or lifecycle
7. Constraints and compatibility notes
8. Acceptance checklist
9. Open questions

Split milestones so each produces a coherent, reviewable increment. Confirm that their combined outcomes satisfy the main spec.

Do not begin implementation until the user has reviewed and confirmed the main spec and milestone set.

## Phase 3: Plan and implement one milestone

Before each milestone, create a concrete implementation plan for that milestone only. Cover:

- affected modules and files
- contracts or interfaces that change
- data and control flow implications
- tests and verification
- risks and fallback choices

Keep this plan in the conversation unless the user requests another artifact.

Pause for confirmation before implementation when the plan changes scope, introduces material risk, or depends on a non-obvious trade-off.

Implement only the active milestone. Do not pull later milestone work into it merely because code paths are nearby.

If implementation reveals that behavior, architecture, workflow, or scope must change:

1. update the main spec first
2. update affected unimplemented milestone specs
3. revise the active implementation plan
4. then change the implementation

No separate approval is required merely because the main spec changes. Ask the user only when the underlying change exceeds the authorized scope, contradicts user intent, or requires a product decision.

## Phase 4: Validate and accept the milestone

Validate the implementation against both the active milestone spec and the main spec. Check required behavior, lifecycle, UX, constraints, compatibility, tests, and acceptance criteria.

Report the evidence and stop for user acceptance by default.

- If the result does not meet the existing contract, continue work on the current milestone.
- If feedback adds scope or changes the confirmed contract, update the main spec first and add or revise a later milestone.
- Do not mark the milestone complete until its acceptance criteria pass and the user accepts it.

After acceptance, proceed to the next milestone and repeat the planning, implementation, validation, and acceptance cycle.

## Phase 5: Consolidate the final spec

After every milestone is implemented and accepted, check whether the user has already specified how to handle the temporary milestone specs. If not, ask whether to consolidate them into the main spec.

When consolidation is approved:

1. merge only durable final behavior, constraints, and decisions into the main spec
2. remove milestone ordering, progress history, and temporary development narration
3. verify that the main spec matches the accepted implementation
4. delete all temporary milestone spec files

## Production hygiene

Milestones are a development coordination mechanism, not a product concept.

- Do not use milestone labels or phase narration in production code, tests, product documentation, or commit messages.
- Do not commit temporary milestone specs, even if they live inside the repository.
- Do not leave temporary milestone files behind after approved consolidation.
- Do not treat external reference projects as copy sources.
- Final artifacts should describe the feature and its behavior, not the sequence used to build it.
