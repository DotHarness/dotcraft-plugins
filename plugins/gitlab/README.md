# GitLab

GitLab is a DotCraft MCP plugin for working with repositories, merge requests, issues, CI/CD pipelines, wikis, and related GitLab DevOps resources.

## Setup

Install and enable the GitLab plugin in DotCraft. This first version starts GitLab's official MCP endpoint through `mcp-remote`, so Node.js 20 or newer must be available on `PATH`.

The first connection opens the GitLab OAuth flow. Complete authorization in the browser, then return to DotCraft and retry the MCP tool if the first request was waiting for sign-in.

For GitLab Self-Managed, edit `plugins/gitlab/.mcp.json` and replace `https://gitlab.com/api/v4/mcp` with the MCP endpoint for your instance.

GitLab MCP tools can read project content and write issues, merge requests, and pipeline-related resources according to the account you authorize. Review tool actions before approving changes from untrusted repository content.

Reference: https://docs.gitlab.com/user/gitlab_duo/model_context_protocol/mcp_server/
