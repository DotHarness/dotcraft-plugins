import { existsSync, readFileSync } from 'node:fs'
import { join, resolve, relative, dirname, isAbsolute } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const marketplacePath = join(repoRoot, '.craft', 'plugins', 'marketplace.json')

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
    validateManifestReferences(name, resolved.full, manifest)
  }
}

if (process.exitCode) {
  process.exit(process.exitCode)
}

console.log('[validate-registry] OK')
