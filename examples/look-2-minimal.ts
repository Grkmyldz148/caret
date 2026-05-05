/**
 * Caret look — MINIMAL
 *
 *   pnpm --filter @caret/examples look:minimal
 *
 * Aesthetic: Vercel / shadcn. No borders, generous whitespace,
 * single accent color (everything else grayscale), subtle braille
 * spinner, ✓/○/· symbols. Ciddi minimalizm.
 */

import chalk from 'chalk'

// Single accent — pick a confident neutral. This is Vercel-ish blue.
const accent = chalk.hex('#5b8dff')
const text = chalk.hex('#e5e7eb')
const muted = chalk.hex('#6b7280')
const faint = chalk.hex('#374151')
const out = process.stdout

function write(s = ''): void { out.write(s + '\n') }
function sleep(ms: number): Promise<void> { return new Promise(r => setTimeout(r, ms)) }

const INDENT = '  '

function header(): void {
  write()
  write(INDENT + text.bold('caret'))
  write(INDENT + muted('the design system for modern command-line tools'))
  write()
  write()
}

const steps = [
  { label: 'build',  detail: 'tsc --build',    ms: 600 },
  { label: 'test',   detail: 'vitest run',     ms: 700 },
  { label: 'upload', detail: '12 assets',      ms: 900 },
  { label: 'verify', detail: 'health check',   ms: 500 },
]

const braille = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

async function runStep(label: string, detail: string, ms: number): Promise<void> {
  const start = Date.now()
  let i = 0
  const labelPad = label.padEnd(10)
  while (Date.now() - start < ms) {
    const frame = braille[i % braille.length]
    out.write('\r' + INDENT + '  ' + accent(frame) + '  ' + text(labelPad) + muted(detail).padEnd(30))
    i++
    await sleep(80)
  }
  out.write('\r' + INDENT + '  ' + accent('✓') + '  ' + text(labelPad) + muted(detail).padEnd(30) + '\n')
}

async function main(): Promise<void> {
  header()

  write(INDENT + muted('Deploying to production'))
  write(INDENT + faint('us-east-1  ·  node 20  ·  3f8a1c'))
  write()

  for (const { label, detail, ms } of steps) {
    await runStep(label, detail, ms)
  }

  // pending/future indicators (static)
  write(INDENT + '  ' + faint('·') + '  ' + faint('notify'.padEnd(10)) + faint('slack + email'))

  write()
  write()
  write(INDENT + accent('?') + '  ' + text('Confirm deployment') + muted('  ›  (y/n)'))
  write()
}

main()
