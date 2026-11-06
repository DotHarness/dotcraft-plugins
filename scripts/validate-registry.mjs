import { existsSync, readFileSync } from 'node:fs'
import { join, resolve, relative, dirname, isAbsolute } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const marketplacePath = join(repoRoot, '.craft', 'plugins', 'marketplace.json')
const mcpServerFields = new Set([
  'name',
  'enabled',
  'transport',
  'command',
  'arguments',
  'environmentVariables',
  'envVars',
  'cwd',
  'url',
  'headers',
  'envHttpHeaders',
  'bearerTokenEnvVar',
  'startupTimeoutSec',
  'toolTimeoutSec'
])
const lspServerFields = new Set([
  'enabled',
  'command',
  'arguments',
  'extensionToLanguage',
  'transport',
  'environmentVariables',
  'initializationOptions',
  'settings',
  'workspaceFolder',
  'startupTimeoutMs',
  'maxRestarts'
])

function fail(message) {
  console.error(`[validate-registry] ${message}`)
  process.exitCode = 1
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch (error) {
    fail(`Could not parse ${relative(repoRoot, path)}: ${error.message}`)
    return null
  }
}

function isInside(path, root) {
  const rel = relative(root, path)
  return rel === '' || (!!rel && !rel.startsWith('..') && !isAbsolute(rel))
}

function resolveMarketplacePath(pathValue) {
  if (typeof pathValue !== 'string' || !pathValue.startsWith('./')) {
    return { error: 'source.path must start with ./' }
  }
  const segments = pathValue.slice(2).split(/[\\/]+/).filter(Boolean)
  if (segments.includes('..')) return { error: 'source.path must not contain ..' }
  const full = resolve(repoRoot, ...segments)
  if (!isInside(full, repoRoot)) return { error: 'source.path must stay inside the repository' }
  return { full }
}

function validateManifestReferences(pluginId, pluginRoot, manifest) {
  for (const key of ['skills', 'apps', 'mcpServers', 'lspServers', 'desktopExtensions']) {
    validateManifestPathReference(pluginId, pluginRoot, `manifest ${key}`, manifest[key])
  }
  validateManifestHooksReferences(pluginId, pluginRoot, manifest.hooks)
  validateServerContributions(pluginId, pluginRoot, manifest)

  const iface = manifest.interface ?? {}
  for (const key of ['composerIcon', 'logo']) {
    validateManifestPathReference(pluginId, pluginRoot, `interface.${key}`, iface[key])
  }
}

function validateManifestPathReference(pluginId, pluginRoot, label, value) {
  if (typeof value !== 'string') return
  const resolved = resolvePluginRelativePath(pluginRoot, value)
  if (resolved.error) {
    fail(`${pluginId}: ${label} ${resolved.error}`)
    return
  }
  if (!existsSync(resolved.full)) {
    fail(`${pluginId}: ${label} points to missing path ${relative(repoRoot, resolved.full)}`)
  }
}

function validateManifestHooksReferences(pluginId, pluginRoot, hooks) {
  if (hooks == null) return
  if (typeof hooks === 'string') {
    validateManifestPathReference(pluginId, pluginRoot, 'manifest hooks', hooks)
    return
  }
  if (Array.isArray(hooks)) {
    hooks.forEach((entry, index) => {
      if (typeof entry === 'string') {
        validateManifestPathReference(pluginId, pluginRoot, `manifest hooks[${index}]`, entry)
      } else if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
        fail(`${pluginId}: manifest hooks[${index}] must be a relative path string or inline hooks object`)
      }
    })
    return
  }
  if (typeof hooks !== 'object') {
    fail(`${pluginId}: manifest hooks must be a relative path string, array, or inline hooks object`)
  }
}

function resolvePluginRelativePath(pluginRoot, pathValue) {
  if (typeof pathValue !== 'string' || !pathValue.startsWith('./')) {
    return { error: 'must start with ./' }
  }
  const segments = pathValue.slice(2).split(/[\\/]+/).filter(Boolean)
  if (segments.includes('..')) return { error: 'must not contain ..' }
  const full = resolve(pluginRoot, ...segments)
  if (!isInside(full, pluginRoot)) return { error: 'must stay inside the plugin root' }
  return { full }
}

function validateServerContributions(pluginId, pluginRoot, manifest) {
  const mcpPath = resolveContributionPath(pluginId, pluginRoot, 'mcpServers', manifest.mcpServers, '.mcp.json')
  if (mcpPath) {
    validateServerMap(pluginId, mcpPath, 'mcpServers', mcpServerFields, validateMcpServer)
  }

  const lspPath = resolveContributionPath(pluginId, pluginRoot, 'lspServers', manifest.lspServers, '.lsp.json')
  if (lspPath) {
    validateServerMap(pluginId, lspPath, 'lspServers', lspServerFields, validateLspServer)
  }
}

function resolveContributionPath(pluginId, pluginRoot, label, configuredPath, defaultName) {
  if (configuredPath != null && typeof configuredPath !== 'string') {
    fail(`${pluginId}: manifest ${label} must be a relative path string`)
    return null
  }

  if (typeof configuredPath === 'string') {
    const resolved = resolvePluginRelativePath(pluginRoot, configuredPath)
    return resolved.error || !existsSync(resolved.full) ? null : resolved.full
  }

  const conventionalPath = join(pluginRoot, defaultName)
  return existsSync(conventionalPath) ? conventionalPath : null
}

function validateServerMap(pluginId, path, wrapperName, allowedFields, validateServer) {
  const document = readJson(path)
  if (!isObject(document)) {
    if (document != null) {
      fail(`${pluginId}: ${relative(repoRoot, path)} must contain a JSON object`)
    }
    return
  }

  const serverMap = Object.hasOwn(document, wrapperName) ? document[wrapperName] : document
  if (!isObject(serverMap)) {
    fail(`${pluginId}: ${relative(repoRoot, path)} ${wrapperName} must be an object keyed by server name`)
    return
  }

  for (const [serverName, server] of Object.entries(serverMap)) {
    const prefix = `${pluginId}: ${relative(repoRoot, path)} server '${serverName}'`
    if (!serverName.trim()) {
      fail(`${prefix} must have a non-empty name`)
      continue
    }
    if (!isObject(server)) {
      fail(`${prefix} must be an object`)
      continue
    }

    for (const field of Object.keys(server)) {
      if (!allowedFields.has(field)) {
        fail(`${prefix} contains unknown property '${field}'`)
      }
    }
    validateServer(prefix, server)
  }
}

function validateMcpServer(prefix, server) {
  optionalString(prefix, server, 'name')
  optionalBoolean(prefix, server, 'enabled')
  optionalString(prefix, server, 'transport')
  optionalString(prefix, server, 'command')
  optionalStringArray(prefix, server, 'arguments')
  optionalStringMap(prefix, server, 'environmentVariables')
  optionalStringArray(prefix, server, 'envVars')
  optionalString(prefix, server, 'cwd')
  optionalString(prefix, server, 'url')
  optionalStringMap(prefix, server, 'headers')
  optionalStringMap(prefix, server, 'envHttpHeaders')
  optionalString(prefix, server, 'bearerTokenEnvVar')
  optionalNumber(prefix, server, 'startupTimeoutSec')
  optionalNumber(prefix, server, 'toolTimeoutSec')

  const transport = server.transport ?? 'stdio'
  if (transport !== 'stdio' && transport !== 'http') {
    fail(`${prefix} transport must be 'stdio' or 'http'`)
    return
  }

  if (transport === 'stdio') {
    if (!isNonEmptyString(server.command)) {
      fail(`${prefix} command is required for stdio transport`)
    }
    if (isNonEmptyString(server.url)
        || isNonEmptyString(server.bearerTokenEnvVar)
        || hasEntries(server.headers)
        || hasEntries(server.envHttpHeaders)) {
      fail(`${prefix} contains HTTP-only fields for stdio transport`)
    }
    return
  }

  if (!isAbsoluteUrl(server.url)) {
    fail(`${prefix} url must be an absolute URL for http transport`)
  }
  if (isNonEmptyString(server.command)
      || hasEntries(server.arguments)
      || hasEntries(server.environmentVariables)
      || hasEntries(server.envVars)
      || isNonEmptyString(server.cwd)) {
    fail(`${prefix} contains stdio-only fields for http transport`)
  }
}

function validateLspServer(prefix, server) {
  optionalBoolean(prefix, server, 'enabled')
  optionalString(prefix, server, 'command')
  optionalStringArray(prefix, server, 'arguments')
  optionalStringMap(prefix, server, 'extensionToLanguage')
  optionalString(prefix, server, 'transport')
  optionalStringMap(prefix, server, 'environmentVariables')
  optionalString(prefix, server, 'workspaceFolder')
  optionalInteger(prefix, server, 'startupTimeoutMs', 1)
  optionalInteger(prefix, server, 'maxRestarts', 0)

  if (!isNonEmptyString(server.command)) {
    fail(`${prefix} command is required`)
  }
  if (!isObject(server.extensionToLanguage) || Object.keys(server.extensionToLanguage).length === 0) {
    fail(`${prefix} extensionToLanguage must contain at least one entry`)
  }

  const transport = server.transport ?? 'stdio'
  if (transport !== 'stdio' && transport !== 'socket') {
    fail(`${prefix} transport must be 'stdio' or 'socket'`)
  }
}

function optionalString(prefix, value, field) {
  if (value[field] != null && typeof value[field] !== 'string') {
    fail(`${prefix} property '${field}' must be a string`)
  }
}

function optionalBoolean(prefix, value, field) {
  if (value[field] != null && typeof value[field] !== 'boolean') {
    fail(`${prefix} property '${field}' must be a boolean`)
  }
}

function optionalNumber(prefix, value, field) {
  if (value[field] != null && (typeof value[field] !== 'number' || !Number.isFinite(value[field]))) {
    fail(`${prefix} property '${field}' must be a finite number`)
  }
}

function optionalInteger(prefix, value, field, minimum) {
  if (value[field] != null && (!Number.isInteger(value[field]) || value[field] < minimum)) {
    fail(`${prefix} property '${field}' must be an integer greater than or equal to ${minimum}`)
  }
}

function optionalStringArray(prefix, value, field) {
  if (value[field] != null
      && (!Array.isArray(value[field]) || value[field].some(entry => typeof entry !== 'string'))) {
    fail(`${prefix} property '${field}' must be an array of strings`)
  }
}

function optionalStringMap(prefix, value, field) {
  if (value[field] != null
      && (!isObject(value[field]) || Object.values(value[field]).some(entry => typeof entry !== 'string'))) {
    fail(`${prefix} property '${field}' must be an object with string values`)
  }
}

function isObject(value) {
  return value != null && typeof value === 'object' && !Array.isArray(value)
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function hasEntries(value) {
  return Array.isArray(value) ? value.length > 0 : isObject(value) && Object.keys(value).length > 0
}

function isAbsoluteUrl(value) {
  if (!isNonEmptyString(value)) return false
  try {
    return Boolean(new URL(value).protocol)
  } catch {
    return false
  }
}

const marketplace = readJson(marketplacePath)
if (!marketplace || !Array.isArray(marketplace.plugins)) {
  fail('marketplace.plugins must be an array')
} else {
  const seen = new Set()
  for (const entry of marketplace.plugins) {
    const name = typeof entry.name === 'string' ? entry.name.trim() : ''
    if (!/^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(name)) {
      fail('plugin entry name is invalid')
      continue
    }
    if (seen.has(name.toLowerCase())) {
      fail(`${name}: duplicate marketplace name`)
      continue
    }
    seen.add(name.toLowerCase())

    if (entry.source?.source !== 'local') {
      fail(`${name}: source.source must be local`)
      continue
    }
    if (entry.policy?.installation !== 'AVAILABLE') {
      fail(`${name}: policy.installation must be AVAILABLE`)
    }
    if (entry.policy?.authentication !== 'ON_INSTALL') {
      fail(`${name}: policy.authentication must be ON_INSTALL`)
    }

    const resolved = resolveMarketplacePath(entry.source?.path)
    if (resolved.error) {
      fail(`${name}: ${resolved.error}`)
      continue
    }
    if (!existsSync(resolved.full)) {
      fail(`${name}: source.path does not exist`)
      continue
    }

    const manifestPath = join(resolved.full, '.craft-plugin', 'plugin.json')
    if (!existsSync(manifestPath)) {
      fail(`${name}: missing .craft-plugin/plugin.json`)
      continue
    }
    const manifest = readJson(manifestPath)
    if (!manifest) continue
    if (manifest.id !== name) {
      fail(`${name}: manifest id '${manifest.id}' does not match marketplace name`)
    }
    if (entry.category !== manifest.interface?.category) {
      fail(`${name}: category '${entry.category}' does not match manifest interface.category '${manifest.interface?.category}'`)
    }
    validateManifestReferences(name, resolved.full, manifest)
  }
}

if (process.exitCode) {
  process.exit(process.exitCode)
}

console.log('[validate-registry] OK')
