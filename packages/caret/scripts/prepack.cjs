#!/usr/bin/env node
/**
 * Pre-pack hook for caret-cli.
 *
 * `npm pack` / `npm publish` ships everything listed in `package.json`
 * `files`. The CLI bundles the workspace's component registry so
 * `caret add <component>` can copy files from disk without an HTTP
 * round-trip. Workspace layout is monorepo-style (registry/ at the
 * root), but the published tarball needs the registry sitting next
 * to dist/. This script copies it in just before pack runs.
 *
 * The copy lands at packages/caret/registry/ which is gitignored so
 * the workspace stays clean.
 */

const { copyFileSync, cpSync, mkdirSync, rmSync, existsSync } = require('node:fs')
const { resolve, join } = require('node:path')

const HERE = __dirname
const PKG_ROOT = resolve(HERE, '..')
const WORKSPACE_ROOT = resolve(PKG_ROOT, '..', '..')
const WORKSPACE_REGISTRY = resolve(WORKSPACE_ROOT, 'registry')
const PACKAGE_REGISTRY = join(PKG_ROOT, 'registry')

if (!existsSync(WORKSPACE_REGISTRY)) {
  console.error(`prepack: workspace registry not found at ${WORKSPACE_REGISTRY}`)
  process.exit(1)
}

if (existsSync(PACKAGE_REGISTRY)) {
  rmSync(PACKAGE_REGISTRY, { recursive: true, force: true })
}

mkdirSync(PACKAGE_REGISTRY, { recursive: true })

cpSync(WORKSPACE_REGISTRY, PACKAGE_REGISTRY, {
  recursive: true,
  // Skip dev artefacts that have no business in the published tarball.
  filter: (src) => {
    if (src.includes('node_modules')) return false
    if (src.endsWith('.test.ts') || src.endsWith('.test.tsx')) return false
    if (src.includes('__tests__')) return false
    if (src.endsWith('tsconfig.tsbuildinfo')) return false
    return true
  },
})

console.log(`prepack: copied registry → ${PACKAGE_REGISTRY}`)

// README and LICENSE live at the workspace root; copy them so the npm
// package page renders properly and the legal text is bundled.
for (const name of ['README.md', 'LICENSE']) {
  const src = join(WORKSPACE_ROOT, name)
  const dest = join(PKG_ROOT, name)
  if (existsSync(src)) {
    copyFileSync(src, dest)
    console.log(`prepack: copied ${name}`)
  }
}
