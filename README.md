# DotCraft Official Plugins

This repository is the official DotCraft plugins registry.

It contains curated DotCraft plugin source bundles and the marketplace index
used by DotCraft clients to discover installable official plugins. Each plugin
lives under `plugins/<pluginId>/` and must contain `.craft-plugin/plugin.json`.

The marketplace index lives at `.craft/plugins/marketplace.json`.

## Publishing from a plugin repository

A plugin repository builds its plugin root, uploads it as an artifact, and calls
the shared workflow from a `v*.*.*` tag. The workflow checks that the tag matches
the manifest version, copies the plugin to `plugins/<pluginId>/` with release
provenance, updates the marketplace index and opens a pull request here.

```yaml
publish:
  needs: build
  if: startsWith(github.ref, 'refs/tags/v')
  uses: DotHarness/dotcraft-plugins/.github/workflows/publish-plugin.yml@main
  with:
    artifact: my-plugin
    category: Coding
  secrets: inherit
```

The calling repository must be able to read the organization variable
`MARKETPLACE_APP_ID` and the organization secret `MARKETPLACE_APP_PRIVATE_KEY`.
