/**
 * Registry loader
 *
 * Locates the Caret component registry, regardless of whether the CLI
 * is running from an npm install (registry bundled with the package),
 * from the workspace dev environment (registry at the workspace root),
 * or from a checked-out git clone.
 */

import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export type RegistryComponent = {
  name: string
  kind: 'interactive' | 'display' | 'utility'
  description: string
  spec?: string
  files: string[]
  dependencies?: string[]
  tokens?: string[]
}

export type RegistryManifest = {
  version: string
  components: Record<string, RegistryComponent>
  tokens: Record<
    string,
    { description: string; files: string[]; status?: string }
  >
  theme: { description: string; files: string[] }
  lib: { description: string; files: string[] }
}

export type LoadedRegistry = {
  /** Absolute path to the registry root directory. */
  root: string
  /** The parsed registry.json manifest. */
  manifest: RegistryManifest
}

/**
 * Find and load the registry. Searches several candidate paths in order:
 *
 *   1. Bundled with the npm package: <package>/registry/registry.json
 *   2. Workspace dev environment: <package>/../../registry/registry.json
 *   3. Current working directory: ./registry/registry.json
 *
 * Returns the absolute root path and parsed manifest.
 */
export function loadRegistry(): LoadedRegistry {
  const here = dirname(fileURLToPath(import.meta.url))

  const candidates = [
    // 1. Bundled with package (caret/dist/lib → caret/registry)
    resolve(here, '..', '..', 'registry', 'registry.json'),
    // 2. Workspace dev (packages/caret/src/lib → registry)
    resolve(here, '..', '..', '..', '..', 'registry', 'registry.json'),
    // 3. cwd
    resolve(process.cwd(), 'registry', 'registry.json'),
  ]

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      const manifest = JSON.parse(readFileSync(candidate, 'utf8')) as RegistryManifest
      return {
        root: dirname(dirname(candidate)),
        manifest,
      }
    }
  }

  throw new Error(
    `Could not locate Caret registry. Searched:\n${candidates.map((c) => `  - ${c}`).join('\n')}`,
  )
}

/** Read a single file from the registry by its path relative to the registry root. */
export function readRegistryFile(registryRoot: string, relativePath: string): string {
  const absolute = join(registryRoot, relativePath)
  if (!existsSync(absolute)) {
    throw new Error(`Registry file not found: ${relativePath}`)
  }
  return readFileSync(absolute, 'utf8')
}
