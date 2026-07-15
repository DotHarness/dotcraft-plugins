---
name: ui-prototype
description: Prototype UI outside production code for design review. Use when exploring layouts, states, responsive behavior, or interaction flows before implementation.
---

# UI Prototype

Use this skill to separate visual and product design iteration from production changes.

## Repository setup

Treat the current repository as the source repository. Derive the default design repository from its root directory name: a source repository named `<project-name>` uses a sibling `<project-name>-design` directory.

- Prefer an existing sibling design repository when present.
- If it does not exist, ask before creating it or ask the user for another prototype artifact location.
- Do not hardcode absolute local paths in the skill, artifacts, or instructions.
- Keep the source repository read-only throughout prototype work. Edit it only after the user approves the design and asks for implementation.

Before prototyping, discover the design guidance applicable to the target surface. Inspect repository instructions, design-system documentation, tokens, component conventions, and nearby implementation patterns. Use the guidance with the closest applicable scope. If multiple sources conflict and scope does not resolve the conflict, ask the user.

## Workflow

1. Confirm the design question and scope.
   - Identify the UI surface, states, constraints, and what must stay unchanged.
   - Keep production wording, colors, and behavior stable unless the user explicitly wants to explore them.

2. Choose the preview fidelity.
   - Prefer one standalone `.html` file with embedded CSS and minimal JavaScript for early visual exploration, copy or layout alternatives, and concepts that do not require production runtime behavior.
   - When fidelity depends on real components, state, tokens, providers, text measurement, or framework layout behavior, use the project's native UI framework in the design repository.
   - Use TSX only when the source project uses React and TSX is appropriate to the target surface.
   - Keep earlier HTML references as design notes when useful, but do not treat them as the final pixel source after a framework-coupled preview exists.

3. Create or update a standalone artifact in the design repository.
   - Group artifacts by product area when useful.
   - Keep ordinary HTML prototypes independent of the production build, production state, production components, and network assets.
   - For a framework-coupled preview, use the design repository as a thin host that reuses the relevant source components and design primitives instead of copying them.
   - Mock only the minimum application boundary needed for realistic review.

4. Model realistic states and edge cases.
   - Include narrow and normal widths, long labels, empty/loading/error/pending states, selected and inactive rows, hover/focus where relevant, and controls for the variables under discussion.
   - Use side-by-side comparison when evaluating current and candidate layouts.
   - Make controls interactive enough for browser review.

5. Review in a browser.
   - Open standalone HTML directly or serve it locally when browser restrictions require it.
   - Run framework previews with the design repository's existing development or preview tooling.
   - Iterate until the user confirms the visual direction.
   - Treat screenshots, DOM measurements, and browser observations as design evidence. Use them to reduce implementation drift before editing production code.

6. Handoff before production implementation.
   - Summarize approved layout decisions, interaction behavior, tokens, and unresolved risks.
   - Record the applicable project design guidance and the production surface that would change.
   - Only enter implementation after explicit user approval, then follow the source repository's development and verification workflow.

## Framework-coupled preview

Use this path when a standalone HTML reference is likely to drift from production behavior. Good triggers include:

- the UI depends on an existing production component, state container, provider, or design token
- the issue involves exact text measurement, truncation, grid or flex tracks, hover/focus actions, badges, icons, or status slots
- the visual defect appears only after application state changes
- a prior static prototype and production implementation have diverged

Recommended setup:

- Add a design-only entry under the relevant product area in the design repository.
- Reuse the source project's framework, package manager, and established preview/build conventions.
- Import the real components, tokens, icons, providers, and state needed by the surface when repository boundaries allow it.
- Mock only the minimum host API required for review interactions.
- Seed realistic state and expose small controls for width, state, and interaction mode.
- Keep all preview-specific code in the design repository.

Validation expectations:

- Run the artifact's build or validation command before using it as implementation evidence.
- Verify the page is non-empty and has no relevant runtime, framework, or console errors.
- Measure actual DOM geometry when reviewing spacing, alignment, truncation, or layout shift; prefer grid tracks, bounding boxes, and gaps over visual impressions alone.
- Capture screenshots of the reviewed states, especially interaction and width variants.
- After approved production implementation, compare the implementation with the reviewed prototype and add targeted tests only where they protect a real regression.

## Artifact standards

- Keep prototypes clearly non-production: mock data, local state, and explanatory labels are allowed.
- Preserve user-visible strings from production only when they are part of the design question.
- Keep dimensions and constraints explicit, especially status slots, truncation, alignment, and responsive behavior.
- Prefer editable design tokens or CSS variables so candidate values can be tuned quickly.
- Avoid decorative UI unrelated to the design decision.
- Include enough notes for reviewers to understand the comparison without reading production code.

## Handoff notes

When the prototype is approved, report:

- the design artifact path
- whether the reviewed source of truth was standalone HTML or a project-native framework preview
- the confirmed UI states and constraints
- the browser/build evidence, including screenshots or DOM measurements when relevant
- the production implementation surface
- any choices that still need product confirmation
