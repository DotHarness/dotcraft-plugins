# Playwright

Playwright is a DotCraft MCP plugin for browser automation, page interaction, screenshots, form filling, and end-to-end testing workflows.

## Setup

Install and enable the Playwright plugin in DotCraft. Node.js 18 or newer must be available on `PATH`.

The plugin starts Microsoft's Playwright MCP server with `npx -y @playwright/mcp@latest`. The first run may download the package and any required browser assets before tools become available.

Use this plugin when DotCraft needs to inspect rendered pages, click controls, fill forms, capture screenshots, or debug browser-facing behavior.

Reference: https://github.com/microsoft/playwright-mcp
