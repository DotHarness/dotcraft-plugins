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

function resolveRegistryPath(pathValue) {
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
    const value = manifest[key]
    if (typeof value !== 'string') continue
    const resolved = resolveRegistryPathFromPlugin(pluginRoot, value)
    if (resolved.error) {
      fail(`${pluginId}: manifest ${key} ${resolved.error}`)
      continue
    }
    if (!existsSync(resolved.full)) {
      fail(`${pluginId}: manifest ${key} points to missing path ${relative(repoRoot, resolved.full)}`)
    }
  }

  const iface = manifest.interface ?? {}
  for (const key of ['composerIcon', 'logo']) {
    const value = iface[key]
    if (typeof value !== 'string') continue
    const resolved = resolveRegistryPathFromPlugin(pluginRoot, value)
    if (resolved.error) {
      fail(`${pluginId}: interface.${key} ${resolved.error}`)
      continue
    }
    if (!existsSync(resolved.full)) {
      fail(`${pluginId}: interface.${key} points to missing path ${relative(repoRoot, resolved.full)}`)
    }
  }
}

function resolveRegistryPathFromPlugin(pluginRoot, pathValue) {
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
    const id = typeof entry.id === 'string' ? entry.id.trim() : ''
    if (!/^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(id)) {
      fail('plugin entry id is invalid')
      continue
    }
    if (seen.has(id.toLowerCase())) {
      fail(`${id}: duplicate marketplace id`)
      continue
    }
    seen.add(id.toLowerCase())

    if (entry.source?.kind !== 'registryPath') {
      fail(`${id}: source.kind must be registryPath`)
      continue
    }
    if (entry.policy?.installation !== 'AVAILABLE') {
      fail(`${id}: policy.installation must be AVAILABLE`)
    }
    if (entry.policy?.authentication !== 'ON_INSTALL') {
      fail(`${id}: policy.authentication must be ON_INSTALL`)
    }

    const resolved = resolveRegistryPath(entry.source?.path)
    if (resolved.error) {
      fail(`${id}: ${resolved.error}`)
      continue
    }
    if (!existsSync(resolved.full)) {
      fail(`${id}: source.path does not exist`)
      continue
    }

    const manifestPath = join(resolved.full, '.craft-plugin', 'plugin.json')
    if (!existsSync(manifestPath)) {
      fail(`${id}: missing .craft-plugin/plugin.json`)
      continue
    }
    const manifest = readJson(manifestPath)
    if (!manifest) continue
    if (manifest.id !== id) {
      fail(`${id}: manifest id '${manifest.id}' does not match marketplace id`)
    }
    validateManifestReferences(id, resolved.full, manifest)
  }
}

if (process.exitCode) {
  process.exit(process.exitCode)
}

console.log('[validate-registry] OK')
