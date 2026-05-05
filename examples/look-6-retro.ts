/**
 * Caret look — RETRO / CRT
 *
 *   pnpm --filter @caret/examples look:retro
 *
 * Aesthetic: phosphor CRT. Amber monochrome, double-line borders
 * (╔═╗╚╝║), heavy shading (▓▒░), ALL CAPS, block spinner. 80'ler
 * terminal nostaljisi.
 */

import chalk from 'chalk'

// Amber phosphor palette — single channel, multiple intensities
const bright = chalk.hex('#ffb000')
const mid = chalk.hex('#cc8800')
const dim = chalk.hex('#805500')
const faint = chalk.hex('#402a00')
const out = process.stdout

const WIDTH = 48

function write(s = ''): void { out.write(s + '\n') }
function sleep(ms: number): Promise<void> { return new Promise(r => setTimeout(r, ms)) }

function topBar(): string { return bright('╔' + '═'.repeat(WIDTH - 2) + '╗') }
function botBar(): string { return bright('╚' + '═'.repeat(WIDTH - 2) + '╝') }
function mid_bar(): string { return bright('╠' + '═'.repeat(WIDTH - 2) + '╣') }
function empty(): string { return bright('║') + ' '.repeat(WIDTH - 2) + bright('║') }
function row(raw: string, visibleLen: number): string {
  const pad = ' '.repeat(Math.max(0, WIDTH - 2 - visibleLen))
  return bright('║') + raw + pad + bright('║')
}

function header(): void {
  write()
  write(topBar())
  const title = 'C · A · R · E · T'
  const pad = Math.floor((WIDTH - 2 - title.length) / 2)
  write(row(' '.repeat(pad) + bright.bold(title), pad + title.length))
  const sub = '── TERMINAL DESIGN SYSTEM ──'
  const pad2 = Math.floor((WIDTH - 2 - sub.length) / 2)
  write(row(' '.repeat(pad2) + mid(sub), pad2 + sub.length))
  write(botBar())
  write()
  write(faint('▓'.repeat(WIDTH)))
  write(mid('▒▒ ') + bright.bold('DEPLOYING TO PRODUCTION') + mid(' ▒▒' + '▒'.repeat(WIDTH - 30)))
  write(faint('▓'.repeat(WIDTH)))
  write()
}

type Step = { label: string; ms: number; state: 'pending' | 'running' | 'done' }
const steps: Step[] = [
  { label: 'BUILD',  ms: 650, state: 'pending' },
  { label: 'TEST',   ms: 750, state: 'pending' },
  { label: 'UPLOAD', ms: 950, state: 'pending' },
  { label: 'VERIFY', ms: 550, state: 'pending' },
]

const blocks = ['░', '▒', '▓', '█', '▓', '▒']

function renderStep(s: Step, frame: number): string {
  let icon: string
  const block = blocks[frame % blocks.length] ?? '░'
  if (s.state === 'done') icon = bright('[√]')
  else if (s.state === 'running') icon = bright('[' + block + ']')
  else icon = dim('[ ]')

  const label = s.state === 'pending' ? faint(s.label.padEnd(10)) : (s.state === 'done' ? bright(s.label.padEnd(10)) : bright.bold(s.label.padEnd(10)))

  // progress bar
  const BAR_LEN = 20
  let filled = 0
  if (s.state === 'done') filled = BAR_LEN
  else if (s.state === 'running') filled = Math.floor(BAR_LEN * ((frame % 20) / 20))
  const bar = bright('█'.repeat(filled)) + faint('░'.repeat(BAR_LEN - filled))

  return '  ' + icon + '  ' + label + bar
}

async function runSteps(): Promise<void> {
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
      await sleep(90)
    }
    step.state = 'done'
  }
  out.write(`\x1b[${LINES}A`)
  for (const s of steps) out.write('\x1b[2K\r' + renderStep(s, frame) + '\n')
}

function prompt(): void {
  write()
  write(faint('▓'.repeat(WIDTH)))
  write(bright.bold('>>> CONFIRM? (Y/N) ') + bright('█'))
  write(faint('▓'.repeat(WIDTH)))
  write()
}

async function main(): Promise<void> {
  header()
  await runSteps()
  prompt()
}

main()
