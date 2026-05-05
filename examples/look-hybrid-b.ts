/**
 * Caret look — HYBRID B (minimal + editorial typography)
 *
 *   pnpm --filter @caret/examples look:hybrid-b
 *
 * Minimal'in temiz paleti ve braille dot spinner'ı + editorial'ın
 * letter-spaced CAPS başlıkları ve dotted leader'ları. Modern
 * nötr, tipografik. "Vercel with more taste."
 *
 * Amaç: timeless, restrained, okunur.
 */

import chalk from 'chalk'

// Neutral grayscale + single cool accent
const ink = chalk.hex('#f5f5f4')
const body = chalk.hex('#d6d3d1')
const muted = chalk.hex('#78716c')
const faint = chalk.hex('#3f3f46')
const accent = chalk.hex('#5b8dff') // confident blue
const accentDim = chalk.hex('#3a5ca8')
const out = process.stdout

const INDENT = '    '
const CONTENT_WIDTH = 56

function write(s = ''): void { out.write(s + '\n') }
function sleep(ms: number): Promise<void> { return new Promise(r => setTimeout(r, ms)) }

function tracking(s: string): string {
  return s.toUpperCase().split('').join(' ')
}

function header(): void {
  write()
  write()
  write(INDENT + ink.bold(tracking('Caret')))
  write(INDENT + muted('the design system for modern command-line tools'))
  write()
  write()
  write()
}

type Step = { label: string; detail: string; ms: number; state: 'pending' | 'running' | 'done' }

const steps: Step[] = [
  { label: 'Build',   detail: 'compile sources',        ms: 700, state: 'pending' },
  { label: 'Test',    detail: 'run test suite',         ms: 800, state: 'pending' },
  { label: 'Upload',  detail: 'push 12 assets to edge', ms: 1000, state: 'pending' },
  { label: 'Verify',  detail: 'health check',           ms: 600, state: 'pending' },
]

const braille = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

function renderStep(s: Step, frame: number): string {
  // Icon: minimal style ✓ / spinner / ○
  let icon: string
  if (s.state === 'done') icon = accent('✓')
  else if (s.state === 'running') {
    const ch = braille[frame % braille.length] ?? '⠋'
    icon = accent(ch)
  }
  else icon = faint('○')

  // Label: editorial tracking caps
  const labelRaw = tracking(s.label)
  const label = s.state === 'pending' ? faint(labelRaw) : ink(labelRaw)

  // Detail: muted lowercase
  const detail = s.state === 'pending' ? faint(s.detail) : muted(s.detail)

  // State text on the right
  const stateText =
    s.state === 'done' ? 'done' :
    s.state === 'running' ? 'running' :
    'pending'
  const stateColored =
    s.state === 'done' ? accent(stateText) :
    s.state === 'running' ? accentDim(stateText) :
    faint(stateText)

  // Dotted leader
  const usedBeforeState = 2 + 1 + 2 + labelRaw.length + 2 + s.detail.length + 2 + stateText.length
  const leaderLen = Math.max(3, CONTENT_WIDTH - usedBeforeState)
  const leader = faint(' ' + '·'.repeat(leaderLen) + ' ')

  return INDENT + icon + '  ' + label + '  ' + detail + leader + stateColored
}

async function runSteps(): Promise<void> {
  write(INDENT + ink.bold(tracking('Deploying to production')))
  write()
  write(INDENT + muted('us-east-1') + faint('   ·   ') + muted('node 20') + faint('   ·   ') + muted('3f8a1c'))
  write()
  write()

  for (const s of steps) write(renderStep(s, 0))

  const LINES = steps.length
  let frame = 0

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]!
    step.state = 'running'
    const start = Date.now()
    while (Date.now() - start < step.ms) {
      out.write(`\x1b[${LINES}A`)
      for (const s of steps) out.write('\x1b[2K\r' + renderStep(s, frame) + '\n')
      frame++
      await sleep(80)
    }
    step.state = 'done'
  }
  out.write(`\x1b[${LINES}A`)
  for (const s of steps) out.write('\x1b[2K\r' + renderStep(s, frame) + '\n')
}

function prompt(): void {
  write()
  write()
  write()
  write(INDENT + ink.bold(tracking('Confirm deployment?')))
  write()
  write(INDENT + accent('?') + '  ' + body('y') + faint('  /  ') + body('n') + muted('     ›'))
  write()
  write()
}

async function main(): Promise<void> {
  header()
  await runSteps()
  prompt()
}

main()
