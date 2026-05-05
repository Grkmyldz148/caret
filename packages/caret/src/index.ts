#!/usr/bin/env node

import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ANSI = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  accent: '\x1b[38;2;88;130;247m', // #5882f7 — Caret accent
}

/**
 * The Caret wordmark, generated once with figlet's "ANSI Shadow" font
 * and committed alongside the package. Reading from disk keeps the
 * binary tarball small and lets users override the file if they want
 * to ship a fork with a different identity.
 */
function readLogo(): string {
  try {
    const here = dirname(fileURLToPath(import.meta.url))
    // Try package root first (npm install layout: dist/ + logo.txt siblings),
    // then workspace dev layout (packages/caret/logo.txt one level up).
    const candidates = [
      resolve(here, '..', 'logo.txt'),
      resolve(here, '..', '..', 'logo.txt'),
    ]
    for (const c of candidates) {
      try {
        return readFileSync(c, 'utf8').replace(/\n+$/, '')
      } catch {}
    }
  } catch {}
  return ''
}

function help(): string {
  const logo = readLogo()
  const accent = (s: string) => `${ANSI.accent}${s}${ANSI.reset}`
  const dim = (s: string) => `${ANSI.dim}${s}${ANSI.reset}`
  const bold = (s: string) => `${ANSI.bold}${s}${ANSI.reset}`

  const banner = logo
    ? `${accent(logo)}\n${accent('^')} ${bold('caret')} ${dim('· the design system for modern command-line tools')}\n`
    : `${accent('^')} ${bold('caret')} ${dim('· the design system for modern command-line tools')}\n`

  return `${banner}
${bold('Usage:')}
  caret <command> [options]

${bold('Commands:')}
  ${accent('init')}               Scaffold a new CLI with Caret preinstalled
  ${accent('add')} <component>    Copy a component into your project
  ${accent('list')}               List available components
  ${accent('help')}               Show this help

${bold('Components:')} ${dim('(see `caret list` for the full catalog)')}
  prompt             text, password, confirm, select, multi-select, number
  error              Rust-compiler-style error blocks
  spinner            loading with success/failure resolution
  table, tree, list, banner, progress, step…

Learn more: ${accent('https://caret.dev')}
`
}

async function main(): Promise<void> {
  const args = process.argv.slice(2)
  const command = args[0]

  if (!command || command === 'help' || command === '--help' || command === '-h') {
    process.stdout.write(help())
    return
  }

  if (command === '--version' || command === '-v' || command === 'version') {
    // Read version from the bundled package.json so we don't drift.
    try {
      const here = dirname(fileURLToPath(import.meta.url))
      const candidates = [
        resolve(here, '..', 'package.json'),
        resolve(here, '..', '..', 'package.json'),
      ]
      for (const c of candidates) {
        try {
          const pkg = JSON.parse(readFileSync(c, 'utf8')) as { name?: string; version?: string }
          if (pkg.name === 'caret-cli' && pkg.version) {
            process.stdout.write(`${pkg.version}\n`)
            return
          }
        } catch {}
      }
    } catch {}
    process.stdout.write('unknown\n')
    return
  }

  switch (command) {
    case 'init': {
      const { init } = await import('./commands/init.js')
      await init(args.slice(1))
      return
    }
    case 'add': {
      const { add } = await import('./commands/add.js')
      await add(args.slice(1))
      return
    }
    case 'list': {
      const { list } = await import('./commands/list.js')
      await list()
      return
    }
    default: {
      process.stderr.write(`Unknown command: ${command}\n`)
      process.stderr.write('Run `caret help` for usage.\n')
      process.exit(1)
    }
  }
}

main().catch((err: unknown) => {
  process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`)
  process.exit(1)
})
