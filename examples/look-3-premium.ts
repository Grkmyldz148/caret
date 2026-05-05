/**
 * Caret look — PREMIUM
 *
 *   pnpm --filter @caret/examples look:premium
 *
 * Aesthetic: Linear / Vercel-dark-mode premium. Rounded borders,
 * gradient title (per-character truecolor interpolation between
 * two brand stops), soft dim body, smooth braille spinner, right-
 * aligned state labels. "SaaS ürünü gibi".
 */

import chalk from 'chalk'

// Brand stops — violet → pink, OKLCH-friendly hexes.
const STOP_A: readonly [number, number, number] = [0xa7, 0x8b, 0xfa] // #a78bfa
const STOP_B: readonly [number, number, number] = [0xec, 0x48, 0x99] // #ec4899

const text = chalk.hex('#e5e7eb')
const muted = chalk.hex('#9ca3af')
const faint = chalk.hex('#4b5563')
const border = chalk.hex('#3f3f46')
const borderLit = chalk.hex('#a78bfa')
const success = chalk.hex('#34d399')

const out = process.stdout

function write(s = ''): void { out.write(s + '\n') }
function sleep(ms: number): Promise<void> { return new Promise(r => setTimeout(r, ms)) }

function lerp(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t)
}

function gradientHex(t: number): string {
  const r = lerp(STOP_A[0], STOP_B[0], t)
  const g = lerp(STOP_A[1], STOP_B[1], t)
  const b = lerp(STOP_A[2], STOP_B[2], t)
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
}

function gradientText(s: string): string {
  if (s.length === 0) return s
  let out = ''
  for (let i = 0; i < s.length; i++) {
    const t = s.length === 1 ? 0 : i / (s.length - 1)
    const ch = s[i] ?? ''
    out += chalk.hex(gradientHex(t))(ch)
  }
  return out
}

const WIDTH = 52

function topBar(): string {
  return border('╭' + '─'.repeat(WIDTH - 2) + '╮')
}
function botBar(): string {
  return border('╰' + '─'.repeat(WIDTH - 2) + '╯')
}
function innerLine(raw: string, visibleLength: number): string {
  const pad = ' '.repeat(Math.max(0, WIDTH - 2 - visibleLength))
  return border('│') + raw + pad + border('│')
}

function header(): void {
  write()
  write(topBar())
  const diamond = borderLit('◆')
  const title = gradientText('caret')
  const inner = '  ' + diamond + '  ' + title
  // visible length: 2 + 1 + 2 + 5 = 10
  write(innerLine(inner, 10))
  const subtitle = muted('the design system for modern command-line tools')
  const subVisible = 'the design system for modern command-line tools'.length
  write(innerLine('  ' + subtitle, 2 + subVisible))
  write(botBar())
  // subtle shadow row
  write(' ' + faint('▔'.repeat(WIDTH - 2)))
}

type State = 'pending' | 'running' | 'done'
type Step = { label: string; detail: string; ms: number; state: State }

const steps: Step[] = [
  { label: 'build',  detail: 'compiling sources',      ms: 700, state: 'pending' },
  { label: 'test',   detail: 'running test suite',     ms: 800, state: 'pending' },
  { label: 'upload', detail: 'pushing to edge',        ms: 1000, state: 'pending' },
  { label: 'verify', detail: 'health check',           ms: 600, state: 'pending' },
]

const braille = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

function renderStep(s: Step, frame: number): string {
  let icon: string
  const spinnerChar = braille[frame % braille.length] ?? '⠋'
  if (s.state === 'done') icon = success('●')
  else if (s.state === 'running') icon = chalk.hex(gradientHex((frame % 20) / 20))(spinnerChar)
  else icon = faint('○')

  const label = s.state === 'pending' ? faint(s.label.padEnd(10)) : text(s.label.padEnd(10))
  const detail = muted(s.detail.padEnd(24))
  const state =
    s.state === 'done' ? success('done') :
    s.state === 'running' ? borderLit('running') :
    faint('pending')

  return '  ' + icon + '  ' + label + detail + state
}

async function runSteps(): Promise<void> {
  write()
  write('  ' + text.bold('Deploying to production'))
  write('  ' + faint('us-east-1  ·  node 20  ·  commit 3f8a1c'))
  write()

  // pre-render placeholder lines
  for (const s of steps) write(renderStep(s, 0))

  // move cursor up to first step line
  const LINES = steps.length
  let frame = 0

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]!
    step.state = 'running'
    const start = Date.now()
    while (Date.now() - start < step.ms) {
      // repaint all lines
      out.write(`\x1b[${LINES}A`) // up
      for (const s of steps) {
        out.write('\x1b[2K\r' + renderStep(s, frame) + '\n')
      }
      frame++
      await sleep(70)
    }
    step.state = 'done'
  }
  // final repaint
  out.write(`\x1b[${LINES}A`)
  for (const s of steps) out.write('\x1b[2K\r' + renderStep(s, frame) + '\n')
}

function prompt(): void {
  write()
  write(topBar())
  const q = borderLit('?') + '  ' + text('Confirm deployment') + muted('   (y/n)')
  // visible length: 1 + 2 + 18 + 3 + 5 = 29
  write(innerLine('  ' + q, 2 + 1 + 2 + 18 + 3 + 5))
  write(botBar())
  write(' ' + faint('▔'.repeat(WIDTH - 2)))
  write()
}

async function main(): Promise<void> {
  header()
  await runSteps()
  prompt()
}

main()
