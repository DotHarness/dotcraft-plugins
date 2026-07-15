---
name: dotcraft-docs-guide
description: Guidance for writing and editing DotCraft documentation for users and developers, including localized content. Does not cover release notes or code comments.
---

# Documentation Guide

The key decision for every page is **who it is for** and **what job it does**. That choice determines tone, structure, code density, and what to omit.

Repository-specific details — doc framework, section layout, localization, paths, syntax, and terminology examples — live in `references/project-profile.md`. Read it first and verify changeable details against the current repository. Use `dotcraft-dev-guide` for the broader development workflow.

## Step 1 — Decide audience and purpose

Every page answers two questions before you write a sentence.

**Who is the reader?** Keep the page true to the section it lives in (the exact section→audience map is in the profile):

| Reader | Their pages live in… | They want |
|---|---|---|
| **End user** | user-facing sections (overview, getting-started, features, guides) | To get a result. "What is this, why do I care, how do I do the thing." |
| **Developer** | reference sections (architecture, SDK/API, protocols, configuration) | To build against a contract. "Exactly how it behaves, every option, edge cases." |

**What job does the page do?** This is the Diátaxis distinction — a page does *one* of these well, not all four:

| Purpose | Reader is… | The page… | Typical home |
|---|---|---|---|
| **Tutorial** | learning by doing | walks one happy path to first success | getting-started, quickstarts |
| **How-to** | competent, has a goal | gives direct steps to solve one real task | feature pages, SDK task pages |
| **Reference** | needs a fact | describes options/behavior austerely and completely | config, protocols, CLI, API, SDK method docs |
| **Explanation** | wants to understand | discusses concepts, trade-offs, "why" | architecture, lifecycle, concept overviews |

If you can't name one cell in each table, the page has no focus yet — split it. A feature page that drifts into protocol field tables should hand that off to a reference page and link to it.

**Illustrative routing examples (e.g., not an exhaustive mapping):** a "Getting Started" page = end user × tutorial → warm, one path, almost no code internals. A protocol page = developer × reference → neutral, exhaustive, table-driven. A "what is feature X" page = end user × explanation → friendly concept page with a diagram, light on code.

## Step 2 — Match the voice to the reader

This is where user and developer docs genuinely diverge. Same product, two registers:

| | **User-facing pages** | **Developer pages** |
|---|---|---|
| **Voice** | Warm, second-person, encouraging. Talk to the reader like a helpful colleague. | Neutral, precise, austere. Respect the reader's expertise; no hand-holding. |
| **Opening** | One plain sentence on the value: what they get and why it matters. | One sentence naming the audience and scope (e.g. "This page targets integrators and contributors"). |
| **Structure** | Task-first: "what you'll do" before "how it works." Lead with the outcome. | Mirrors the product: the doc's structure matches the API/config/protocol structure. |
| **Code** | Sparse. Commands they actually type, expected output. No internal types or wire details. | Dense and complete. Full signatures, params, payloads; multi-language grouped in tabs. |
| **"Why" vs "how"** | Show, don't lecture. Minimize explanation inside a tutorial. | Explain trade-offs and consequences where they affect correct use. |
| **Jargon** | Define or avoid. Prefer plain language over infra paths and internal names. | Use precise terms freely; link the first occurrence to its reference. |
| **Omit** | Internal mechanics, exhaustive flag lists, edge cases. | Marketing language, motivational framing, repetition of basics. |

When a page must serve both (e.g. a feature a power user will also script against), write the user narrative first and **link out** to the developer reference rather than inlining it. One page, one register.

The detailed mechanics — person, headings, capitalization, sentence length, contractions — are in `references/style-and-mechanics.md`. Read it before a substantial writing pass.

## Step 3 — Use the right page template

Use the matching skeleton from `references/page-templates.md` (quickstart, feature overview, how-to, concept/architecture, or reference) rather than inventing a new structure.

## House conventions (apply to every page)

These principles are universal; the exact syntax, paths, and terms for this repo are in the profile.

- **One H1 per file.** Most generators derive the page title from it.
- **Admonitions, used sparingly** — a *note* clarifies, a *tip* shortcuts, a *caution* warns of a real consequence. If half the page is callouts, none of them land. (Syntax: profile.)
- **Group parallel multi-language code in tabs** in a fixed language order. (Syntax + order: profile.)
- **Tables for structured facts**, capped at ~5 columns; bold the key term in the first column. Use prose for narrative — don't tabularize a story.
- **End with a "Related docs" footer** of 2–5 sibling links. Assume the reader arrived from search; always give them a next step. Use relative links.
- **Diagrams carry alt text**; reuse existing ones before drawing new. (Location: profile.)
- **Stay current; no history.** Don't document old-version migration rationale or "why the legacy behavior existed." Describe how it works now.
- **Preserve established product and brand terms exactly.** The profile contains examples, not an exhaustive vocabulary; inspect current product UI, specs, code, and nearby docs for additional terms.
- **If the project ships more than one language**, keep all versions structurally identical and edit them in the same change. (Languages + paths: profile.)

## What must NOT appear

Before shipping, remove or relocate:

1. Internal mechanics or premature architecture on user-facing pages.
2. Mixed user and developer registers on one page.
3. Undefined terms, acronyms, or implicit load-bearing rules.
4. Historical, migration, compatibility-rationale, maintainer-only, or spec-voice content.
5. Duplicated content that should have one source of truth.
6. Unnatural translated phrasing or dense noun-heavy sentences.
7. Troubleshooting, FAQ, or Q&A sections. Fold essential prevention into the relevant guidance; track genuine bugs in the issue tracker.

Worked before/after examples for each are in `references/style-and-mechanics.md` (§10).

## Quality checklist

Before you call a page done:

- [ ] Audience and purpose are unambiguous, and the page does only that one job.
- [ ] Voice matches the audience table (warm-user vs neutral-developer).
- [ ] One H1; headings are descriptive and in sentence case (see mechanics ref).
- [ ] Code examples are runnable and minimal for the audience; multi-language uses the project's tab syntax.
- [ ] Admonitions earn their place; no callout spam.
- [ ] "Related docs" footer present with relative links.
- [ ] No troubleshooting / FAQ / Q&A block — guidance gaps fixed inline, genuine bugs left to the issue tracker.
- [ ] Nothing from "What must NOT appear" remains.
- [ ] Established product terms are preserved, including relevant terms not listed in the profile; all current project-profile conventions are followed.
- [ ] New page placed where its audience already lives — if unsure, ask before creating it.

## Reference files

- `references/project-profile.md` — the project-specific profile (framework, sections, languages, syntax, terms). Read first; replace this one file to reuse the skill elsewhere.
- `references/page-templates.md` — copy-paste skeletons for each archetype. Read when starting a new page.
- `references/style-and-mechanics.md` — detailed voice, grammar, headings, links, images, multi-language sync, and the anti-pattern before/afters. Read before any substantial writing or editing pass.
