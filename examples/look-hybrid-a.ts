/**
 * Caret look — HYBRID A (editorial + retro voice)
 *
 *   pnpm --filter @caret/examples look:hybrid-a
 *
 * Editorial'ın sessiz düzeni (border yok, dotted leader, bol boşluk)
 * + retro'nun güçlü sesi (mono amber palet, letter-spaced CAPS,
 * block progress bar). Karakter yüksek, dekorasyon düşük.
 *
 * Amaç: "design-led" ama "anında tanınır".
 */

import chalk from 'chalk'

// Monochrome amber phosphor — 4 intensity stops
const bright = chalk.hex('#ffb000')
const mid = chalk.hex('#cc8800')
const dim = chalk.hex('#805500')
const faint = chalk.hex('#3d2800')
const out = process.stdout

const INDENT = '    '
const CONTENT_WIDTH = 58

function write(s = ''): void { out.write(s + '\n') }
function sleep(ms: number): Promise<void> { return new Promise(r => setTimeout(r, ms)) }

function tracking(s: string): string {
  return s.toUpperCase().split('').join(' ')
}

function header(): void {
  write()
  write()
  write(INDENT + bright.bold(tracking('Caret')))
  write(INDENT + dim('── terminal design system'))
  write()
  write()
  write()
}

type Step = { label: string; detail: string; ms: number; state: 'pending' | 'running' | 'done' }

const steps: Step[] = [
  { label: 'Build',   detail: 'compile sources',        ms: 750, state: 'pending' },
  { label: 'Test',    detail: 'run test suite',         ms: 850, state: 'pending' },
  { label: 'Upload',  detail: 'push 12 assets to edge', ms: 1100, state: 'pending' },
  { label: 'Verify',  detail: 'health check',           ms: 600, state: 'pending' },
]

const BAR_LEN = 18
const spinnerBlocks = ['░', '▒', '▓', '█', '▓', '▒']

function progressBar(s: Step, frame: number): string {
  let filled = 0
  if (s.state === 'done') filled = BAR_LEN
  else if (s.state === 'running') filled = Math.floor(BAR_LEN * ((frame % 20) / 20))
  const full = bright('█'.repeat(filled))
  const empty = faint('░'.repeat(BAR_LEN - filled))
  return full + empty
}

function renderStep(s: Step, frame: number): string {
  // Icon: retro-style [√] / [·] / [ ]
  let icon: string
  if (s.state === 'done') icon = bright('[') + bright.bold('√') + bright(']')
  else if (s.state === 'running') {
    const ch = spinnerBlocks[frame % spinnerBlocks.length] ?? '░'
    icon = bright('[') + bright(ch) + bright(']')
  }
  else icon = faint('[ ]')

  // Label: editorial tracking caps, dim when pending
  const labelRaw = tracking(s.label)
  const label = s.state === 'pending' ? faint(labelRaw) : bright(labelRaw)

  // Detail: muted small-caps style (lowercase)
  const detail = s.state === 'pending' ? faint(s.detail) : mid(s.detail)

  // Dotted leader between detail and progress
  const usedBeforeBar = 4 + labelRaw.length + 2 + s.detail.length + 2 + BAR_LEN
  const leaderLen = Math.max(3, CONTENT_WIDTH - usedBeforeBar)
  const leader = faint(' ' + '·'.repeat(leaderLen) + ' ')

  return INDENT + icon + ' ' + label + '  ' + detail + leader + progressBar(s, frame)
}

async function runSteps(): Promise<void> {
  write(INDENT + bright.bold(tracking('Deploying to production')))
  write()
  write(INDENT + mid('us-east-1') + faint('   ·   ') + mid('node 20') + faint('   ·   ') + mid('3f8a1c'))
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
  write(INDENT + bright.bold(tracking('Confirm deployment?')))
  write()
  write(INDENT + bright('Y') + faint('   /   ') + bright('N') + faint('     ›'))
  write()
  write()
}

async function main(): Promise<void> {
  header()
  await runSteps()
  prompt()
}

main()
