/**
 * Caret look — EDITORIAL
 *
 *   pnpm --filter @caret/examples look:editorial
 *
 * Aesthetic: Notion / Stripe / dergi. Border yok, tipografi ve
 * boşluk kahraman. Letter-spaced başlık, dotted leaders (label
 * ....... done), bol dikey boşluk, muted palet.
 */

import chalk from 'chalk'

// Muted palette — single warm accent on top of pure grayscale
const ink = chalk.hex('#f5f5f4')
const body = chalk.hex('#d6d3d1')
const muted = chalk.hex('#78716c')
const faint = chalk.hex('#44403c')
const accent = chalk.hex('#f59e0b') // warm amber
const out = process.stdout

function write(s = ''): void { out.write(s + '\n') }
function sleep(ms: number): Promise<void> { return new Promise(r => setTimeout(r, ms)) }

const INDENT = '    '
const CONTENT_WIDTH = 54

function tracking(s: string): string {
  return s.toUpperCase().split('').join(' ')
}

function header(): void {
  write()
  write()
  write(INDENT + ink.bold(tracking('Caret')))
  write(INDENT + muted('── terminal design system'))
  write()
  write()
  write()
}

type Step = { label: string; detail: string; ms: number; state: 'pending' | 'running' | 'done' }

const steps: Step[] = [
  { label: 'Build',   detail: 'compile sources',         ms: 700, state: 'pending' },
  { label: 'Test',    detail: 'run test suite',          ms: 800, state: 'pending' },
  { label: 'Upload',  detail: 'push 12 assets to edge',  ms: 1000, state: 'pending' },
  { label: 'Verify',  detail: 'health check',            ms: 600, state: 'pending' },
]

function renderStep(s: Step): string {
  const label = s.state === 'pending' ? faint(s.label.padEnd(10)) : body(s.label.padEnd(10))
  const detail = s.state === 'pending' ? faint(s.detail) : muted(s.detail)
  // dotted leader calculation
  const labelLen = 10
  const detailLen = s.detail.length
  const stateText =
    s.state === 'done' ? 'done' :
    s.state === 'running' ? 'running' :
    'pending'
  const stateColored =
    s.state === 'done' ? accent(stateText) :
    s.state === 'running' ? ink(stateText) :
    faint(stateText)
  const used = labelLen + 1 + detailLen + 1 + stateText.length
  const leaderLen = Math.max(3, CONTENT_WIDTH - used)
  const leader = faint(' ' + '·'.repeat(leaderLen) + ' ')
  return INDENT + label + ' ' + detail + leader + stateColored
}

async function runSteps(): Promise<void> {
  write(INDENT + ink.bold(tracking('Deploying to production')))
  write()
  write(INDENT + muted('us-east-1') + faint('   ·   ') + muted('node 20') + faint('   ·   ') + muted('3f8a1c'))
  write()
  write()

  // prerender
  for (const s of steps) write(renderStep(s))

  const LINES = steps.length

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]!
    step.state = 'running'
    const start = Date.now()
    while (Date.now() - start < step.ms) {
      out.write(`\x1b[${LINES}A`)
      for (const s of steps) out.write('\x1b[2K\r' + renderStep(s) + '\n')
      await sleep(80)
    }
    step.state = 'done'
  }
  // final repaint
  out.write(`\x1b[${LINES}A`)
  for (const s of steps) out.write('\x1b[2K\r' + renderStep(s) + '\n')
}

function prompt(): void {
  write()
  write()
  write()
  write(INDENT + ink.bold(tracking('Confirm deployment?')))
  write()
  write(INDENT + body('y') + faint('   /   ') + body('n') + faint('     ›'))
  write()
  write()
}

async function main(): Promise<void> {
  header()
  await runSteps()
  prompt()
}

main()
