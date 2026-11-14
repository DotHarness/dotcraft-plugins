# Structure across specs

## One owner per topic

Every fact has exactly one owning spec. Two copies drift, and a reader who finds both cannot tell which one is true. The index records ownership: a table of topic → owning spec, grouped by category. When a topic has no row, add one before writing it.

A narrower spec refines its parent's boundary and states only what is local to it. It never silently weakens or overrides the broader rule. A real change goes into the parent.

## Categories

A specs directory usually separates:

| Category | Holds |
|---|---|
| Architecture | Terms, domain relationships, authorization, component boundaries, invariants every workflow builds on. |
| Workflows | One user or system capability end to end: actors, lifecycle, state, failure, recovery. |
| Protocols | Cross-process contracts whose shapes and semantics other processes depend on. |
| Design | Presentation and interaction: tokens, layout, components, copy. |

Follow the repository's own categories when it has them.

## References between specs

Link to another spec only where a reader cannot follow a rule here without it, and then with one short link to the file. Never summarize another spec, never chain "see X" references, and prefer a file link over a heading anchor, because headings move when a spec is tightened.

The index is the map. A spec does not carry its own list of related specs.

## Code does not cite specs

A comment that names a spec path or section goes stale the moment the spec is reorganized, and the code should be readable on its own. Repository guidance (such as AGENTS.md) may point contributors at the spec index, and source files may not.

## Splitting and merging

Split a spec when it owns two capabilities a reader would look up separately. Merge two specs when one only restates or thinly extends the other, as a protocol page that repeats its workflow does. In either case update the index, every incoming link, and the moved rules' owner in the same change.
