import { createHash } from 'node:crypto'
import { appendFileSync, cpSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

const { values } = parseArgs({
  options: {
    source: { type: 'string' },
    category: { type: 'string' },
    version: { type: 'string' },
    repository: { type: 'string' },
    commit: { type: 'string' }
  }
})
for (const name of ['source', 'category', 'version', 'repository', 'commit']) {
  if (!values[name]) throw new Error(`--${name} is required`)
}

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = resolve(values.source)
const manifest = JSON.parse(readFileSync(join(source, '.craft-plugin', 'plugin.json'), 'utf8'))
const id = manifest.id
if (typeof id !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(id)) throw new Error('Plugin manifest id is invalid.')
if (manifest.version !== values.version) {
  throw new Error(`Plugin manifest version '${manifest.version}' does not match release version '${values.version}'.`)
}

const target = resolve(repoRoot, 'plugins', id)
if (!target.startsWith(resolve(repoRoot, 'plugins') + sep)) throw new Error('Invalid plugin target.')
rmSync(target, { recursive: true, force: true })
cpSync(source, target, { recursive: true })

function files(root, directory = root) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? files(root, path) : [relative(root, path).split(sep).join('/')]
  })
}

const pluginFiles = files(target).sort().map((path) => ({
  sha256: createHash('sha256').update(readFileSync(join(target, path))).digest('hex'),
  path
}))
const provenance = {
  repository: values.repository,
  commit: values.commit,
  version: values.version,
  pluginFiles,
  schemaVersion: 1
}
writeFileSync(join(target, 'release-provenance.json'), JSON.stringify(provenance, null, 2) + '\n')

const indexPath = join(repoRoot, '.craft', 'plugins', 'marketplace.json')
const index = JSON.parse(readFileSync(indexPath, 'utf8'))
const entry = {
  name: id,
  source: { source: 'local', path: `./plugins/${id}` },
  policy: { installation: 'AVAILABLE', authentication: 'ON_INSTALL' },
  category: values.category
}
const position = index.plugins.findIndex((plugin) => plugin.name === id)
if (position >= 0) index.plugins[position] = entry
else index.plugins.push(entry)
writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n')

if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `id=${id}\n`)
