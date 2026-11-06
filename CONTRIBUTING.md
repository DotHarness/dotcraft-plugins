# Contributing a plugin

Anyone can propose a plugin for the official registry with a pull request. An official listing is a review result, not a sandbox or a security guarantee.

To publish without review, or only to your team, use your own marketplace repository instead. See [Plugin Market](https://www.dotcraft.net/extend/plugin-market).

## Add a plugin

1. Build and test the plugin in DotCraft. `$plugin-creator` can do this and prepare the contribution for you.
2. Run the verifier and fix every error:

   ```bash
   dotcraft plugin verify --candidate <plugin-root> --for-publish
   ```

3. Fork this repository and copy the plugin to `plugins/<id>/`, leaving out development artifacts. A Desktop plugin includes its built `desktop/dist/`, and a .NET plugin includes its built `lib/`.
4. Add an entry to `.craft/plugins/marketplace.json`. `category` equals the manifest's `interface.category`:

   ```json
   {
     "name": "<id>",
     "source": { "source": "local", "path": "./plugins/<id>" },
     "policy": { "installation": "AVAILABLE", "authentication": "ON_INSTALL" },
     "category": "<category>"
   }
   ```

5. Open a pull request and complete its checklist.

The manifest fields, copy limits, and icon rules are in [Plugin manifest](https://www.dotcraft.net/extend/plugin-manifest).

## Update a plugin

Change the files under `plugins/<id>/` and increase `version`. The `id` never changes after listing, because installed copies depend on it.

## What reviewers look for

- The name and descriptions state what the plugin does, without hedging or explanation.
- Every referenced file exists, and the plugin uses supported contribution types.
- The license of the code and artwork permits redistribution.
- Data and network access are disclosed and justified.
- Compiled or bundled code names a public source repository and commit.

CI checks the structure on every pull request. It also runs the verifier on each plugin the pull request changes.
