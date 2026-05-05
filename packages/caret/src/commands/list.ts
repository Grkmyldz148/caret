import { loadRegistry } from '../lib/registry-loader.js'

export async function list(): Promise<void> {
  let registry
  try {
    registry = loadRegistry()
  } catch (err) {
    process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`)
    process.exit(1)
  }

  const components = Object.values(registry.manifest.components)
  const grouped = {
    interactive: components.filter((c) => c.kind === 'interactive'),
    display: components.filter((c) => c.kind === 'display'),
    utility: components.filter((c) => c.kind === 'utility'),
  }

  process.stdout.write(`Caret components (${components.length})\n\n`)

  for (const [kind, list] of Object.entries(grouped)) {
    if (list.length === 0) continue
    process.stdout.write(`${kind}:\n`)
    for (const c of list) {
      process.stdout.write(`  ${c.name.padEnd(14)} ${c.description}\n`)
    }
    process.stdout.write('\n')
  }

  process.stdout.write(`Tokens:  ${Object.keys(registry.manifest.tokens).join(', ')}\n`)
  process.stdout.write(`\nUse \`caret add <name>\` to copy a component into your project.\n`)
}
