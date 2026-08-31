---
name: design-prototype
description: Design, review, and evolve product UI inside a maintained design system before production implementation. Use when exploring or refining layouts, components, states, responsive behavior, or interaction flows while keeping production source read-only until approval.
---

# Design Prototype

Use the product's maintained design system to make design decisions executable, reviewable, and durable.

## Establish context

1. Locate the authoritative design system from repository guidance, saved context, or existing project directories. Ask where to work or whether to create one when none is defined.
2. Inspect the target surface, nearby product patterns, design guidance, tokens, components, assets, and provided visual references.
3. Confirm the surface, intended user outcome, constraints, relevant states, and behavior that must remain stable.
4. Extend the established product language unless the user explicitly asks to explore a new direction.
5. Keep production source read-only until the user approves the design and requests implementation.

## Choose the direction

- Use an existing product pattern or visual reference when it answers the design question.
- When the direction is materially unresolved, create two or three distinct directions that vary hierarchy, layout, or interaction. Wait for the user to select or refine one.
- Use the selected direction to ground the maintained design-system implementation.

## Implement in the design system

1. Add or update a formal catalog entry, route, component, surface, or flow in the existing design system.
2. Reuse its framework, navigation, tokens, components, assets, fixtures, and build conventions.
3. Mount accessible production components through the design system's adapter boundary. Otherwise, add reusable design-system components.
4. Mock only the application boundary needed for review. Keep fixtures deterministic and free of credentials or private data.
5. Cover the relevant widths, long content, loading, empty, error, pending, selection, and interaction states.
6. Make the core journey and primary controls work with realistic local data.
7. Record durable decisions and update the design system's existing lifecycle and fidelity metadata.

## Review and validate

1. Run the design system with its existing tooling and inspect the rendered result, core interactions, responsive states, and console in a browser.
2. When a visual target exists, compare it with the implementation at the same viewport, theme, content, and interaction state.
3. Check hierarchy, layout, typography, spacing, color, assets, copy, responsiveness, and accessibility. Use DOM measurements where precision matters.
4. Resolve actionable design or usability drift, repeat the comparison, and run the repository's required build and validation commands.
5. Deploy only when the user explicitly asks to share or publish.

## Carry the design into production

1. Before implementation, report the approved design-system entry, confirmed states, browser evidence, production surface, and unresolved decisions.
2. After explicit approval, follow the production repository's implementation and verification workflow.
3. Compare the production result with the approved design-system state at matching viewports and interactions.
4. Promote the design entry, update its production metadata, and mount the production component when stable.
5. Retain useful fixtures and design decisions, remove superseded design-only implementation, and add tests only for demonstrated regression risks.
