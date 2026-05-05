import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { loadRegistry, readRegistryFile } from '../lib/registry-loader.js'

const ANSI = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
}

export async function add(args: string[]): Promise<void> {
  const componentName = args[0]
  if (!componentName) {
    process.stderr.write('Usage: caret add <component> [--dir <path>]\n')
    process.exit(1)
  }

  const dirFlagIdx = args.indexOf('--dir')
  const targetBase = dirFlagIdx >= 0 && args[dirFlagIdx + 1] !== undefined
    ? resolve(process.cwd(), args[dirFlagIdx + 1]!)
    : resolve(process.cwd(), 'caret')

  let registry
  try {
    registry = loadRegistry()
  } catch (err) {
    process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`)
    process.exit(1)
  }

  const component = registry.manifest.components[componentName]
  if (!component) {
    process.stderr.write(
      `${ANSI.red}error:${ANSI.reset} unknown component "${componentName}"\n`,
    )
    process.stderr.write(`\nRun ${ANSI.bold}caret list${ANSI.reset} to see available components.\n`)
    process.exit(1)
  }

  process.stdout.write(
    `${ANSI.blue}^${ANSI.reset} ${ANSI.bold}Adding ${componentName}${ANSI.reset}\n`,
  )
  process.stdout.write(`  ${ANSI.dim}${component.description}${ANSI.reset}\n\n`)

  if (component.files.length === 0) {
    process.stderr.write(`${ANSI.red}error:${ANSI.reset} component has no files registered\n`)
    process.exit(1)
  }

  const written: string[] = []
  for (const file of component.files) {
    try {
      const contents = readRegistryFile(registry.root, file)
      // Strip the leading "registry/" prefix to make the destination cleaner.
      const relPath = file.startsWith('registry/') ? file.slice('registry/'.length) : file
      const destination = join(targetBase, relPath)
      mkdirSync(dirname(destination), { recursive: true })
      writeFileSync(destination, contents, 'utf8')
      written.push(relative(process.cwd(), destination))
    } catch (err) {
      process.stderr.write(`  ${ANSI.red}✗${ANSI.reset} ${file}: ${err instanceof Error ? err.message : String(err)}\n`)
    }
  }

  for (const path of written) {
    process.stdout.write(`  ${ANSI.green}+${ANSI.reset} ${path}\n`)
  }
  process.stdout.write('\n')
  process.stdout.write(`${ANSI.green}✓${ANSI.reset} ${written.length} file(s) written\n`)

  if (component.dependencies && component.dependencies.length > 0) {
    process.stdout.write('\n')
    process.stdout.write(`${ANSI.bold}Required dependencies:${ANSI.reset}\n`)
    process.stdout.write(`  npm install ${component.dependencies.join(' ')}\n`)
  }

  if (component.spec !== undefined) {
    process.stdout.write('\n')
    process.stdout.write(`${ANSI.dim}See ${component.spec} for the full specification.${ANSI.reset}\n`)
  }
}
