/**
 * Caret look — BRUTAL
 *
 *   pnpm --filter @caret/examples look:brutal
 *
 * Aesthetic: suckless/dwm purist. Pure ASCII (+---+, [x], |/-\),
 * monochrome green phosphor, zero decoration, terse copy.
 *
 * This demo is self-contained — no @caret/registry components —
 * so the aesthetic is legible without theme interference.
 */

import chalk from 'chalk'

const green = chalk.hex('#00cc44')
const dim = chalk.hex('#2a6630')
const out = process.stdout

const WIDTH = 44

function write(s = ''): void { out.write(s + '\n') }
function sleep(ms: number): Promise<void> { return new Promise(r => setTimeout(r, ms)) }

function bar(): string {
  return green('+' + '-'.repeat(WIDTH - 2) + '+')
}

function boxLine(text: string): string {
  const inner = ' ' + text
  return green('|') + green(inner.padEnd(WIDTH - 2)) + green('|')
}

function header(): void {
  write(bar())
  write(boxLine('CARET'))
  write(boxLine('terminal design system'))
  write(bar())
}

const steps = [
  { label: 'build',  ms: 600 },
  { label: 'test',   ms: 700 },
  { label: 'upload', ms: 800 },
  { label: 'verify', ms: 500 },
]

async function runStep(label: string, ms: number): Promise<void> {
  const frames = ['|', '/', '-', '\\']
  const start = Date.now()
  let i = 0
  while (Date.now() - start < ms) {
    const line = ` [${frames[i % 4]}] ${label}`
    out.write('\r' + green(line.padEnd(WIDTH)))
    i++
    await sleep(90)
  }
  const done = ` [x] ${label}`
  out.write('\r' + green(done.padEnd(WIDTH)) + '\n')
}

async function main(): Promise<void> {
  out.write('\n')
  header()
  write()
  write(green(' > deploying to production'))
  write(dim(' > us-east-1 . node-20 . commit 3f8a1c'))
  write()

  for (const { label, ms } of steps) {
    await runStep(label, ms)
  }

  write()
  write(bar())
  write(boxLine('confirm? [y/n] _'))
  write(bar())
  write()
}

main()
