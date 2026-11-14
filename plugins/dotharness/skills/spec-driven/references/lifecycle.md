# Spec lifecycle

## Status

- `Draft`: a proposed contract under review. Implementation may begin only on parts the user has agreed.
- `Living`: the current normative contract. Code that diverges from it is a bug unless the spec changes first.

## Spec first

Change the owning spec before or together with the code that changes behaviour. If implementation shows the agreed contract is wrong, update the spec, then the code. If the contract still stands, fix the code. Never rewrite a spec to make divergent code look compliant.

Ask the user only when the change exceeds what they authorized or needs a product decision. A spec edit that follows an agreed decision needs no separate approval.

## Versions and dates

Version is semantic:

- Major: an incompatible contract or authority change.
- Minor: added behaviour or a durable scope change.
- Patch: clarification, tightening, or link repair that preserves meaning.

Date records the latest substantive change, so a patch-level rewrite keeps it.

## Rename, split, merge, retire

Do these in one change: move the content, update the index, update every incoming link, and remove the old file outright. Leave no redirect stub or tombstone note, because version control keeps the old path.

## Temporary artifacts

Milestone specs, plans, and research notes live outside the specs directory (for example under `references/`) and are never committed with the product. When the work is accepted, merge only the durable behaviour and decisions into the owning spec, then delete the temporary files.
