/**
 * Caret look — PLAYFUL
 *
 *   pnpm --filter @caret/examples look:playful
 *
 * Aesthetic: Charm / Gum / Bubbletea ecosystem. Pink & magenta
 * accents, chunky rounded borders, emoji, playful copy. "Terminal
 * ama eğlenceli."
 */

import chalk from 'chalk'

const pink = chalk.hex('#ff6ac1')
const magenta = chalk.hex('#c77dff')
const cream = chalk.hex('#fff1f8')
const soft = chalk.hex('#a18599')
const dim = chalk.hex('#5b4556')
const green = chalk.hex('#a7f3d0')
const out = process.stdout

const WIDTH = 50

function write(s = ''): void { out.write(s + '\n') }
function sleep(ms: number): Promise<void> { return new Promise(r => setTimeout(r, ms)) }

function topBar(): string { return pink('╭─── ') + magenta('✧ ') + pink.bold('caret') + magenta(' ✧') + pink(' ' + '─'.repeat(WIDTH - 15) + '╮') }
function botBar(): string { return pink('╰' + '─'.repeat(WIDTH - 2) + '╯') }
function emptyRow(): string { return pink('│') + ' '.repeat(WIDTH - 2) + pink('│') }
function row(raw: string, visibleLen: number): string {
  const pad = ' '.repeat(Math.max(0, WIDTH - 4 - visibleLen))
  return pink('│ ') + raw + pad + pink(' │')
}

const steps = [
  { label: 'build',  emoji: '🔨', ms: 600 },
  { label: 'test',   emoji: '🧪', ms: 700 },
  { label: 'upload', emoji: '📦', ms: 900 },
  { label: 'verify', emoji: '✨', ms: 500 },
]

const spinnerFrames = ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷']

async function main(): Promise<void> {
  write()
  write(topBar())
  write(emptyRow())
  write(row('🚀  ' + cream.bold('Deploying to production'), 4 + 24))
  write(row(soft('    us-east-1  ·  node 20  ·  3f8a1c'), 40))
  write(emptyRow())

  // Prepaint step rows
  const startLines: string[] = []
  for (const s of steps) {
    const line = row('  ' + soft('·') + '  ' + s.emoji + '  ' + dim(s.label), 2 + 1 + 2 + 2 + 2 + s.label.length)
    startLines.push(line)
    write(line)
  }
  write(emptyRow())
  write(botBar())

  // Animate steps above "prompt" block (which we haven't drawn yet)
  const TOTAL_LINES_BELOW = 1 // bot bar
  const STEP_LINES = steps.length + 1 // +1 empty row after steps
  // move cursor up to first step line
  out.write(`\x1b[${TOTAL_LINES_BELOW + STEP_LINES}A`)

  let frame = 0
  const states: ('pending' | 'running' | 'done')[] = steps.map(() => 'pending')

  for (let i = 0; i < steps.length; i++) {
    const currentStep = steps[i]!
    states[i] = 'running'
    const start = Date.now()
    while (Date.now() - start < currentStep.ms) {
      // repaint all step rows + empty row
      out.write(`\x1b[${STEP_LINES}A`)
      for (let j = 0; j < steps.length; j++) {
        const stepJ = steps[j]!
        let icon: string
        if (states[j] === 'done') icon = green('✓')
        else if (states[j] === 'running') icon = pink(spinnerFrames[frame % spinnerFrames.length] ?? '⣾')
        else icon = dim('·')
        const labelColor = states[j] === 'pending' ? dim : cream
        const line = row('  ' + icon + '  ' + stepJ.emoji + '  ' + labelColor(stepJ.label), 2 + 1 + 2 + 2 + 2 + stepJ.label.length)
        out.write('\x1b[2K\r' + line + '\n')
      }
      out.write('\x1b[2K\r' + emptyRow() + '\n')
      // now cursor is at bot bar line, we need to NOT touch it (it's still there).
      // But we moved down STEP_LINES, so to re-loop we need to move back up by STEP_LINES.
      out.write(`\x1b[${STEP_LINES}A`)
      frame++
      await sleep(80)
    }
    states[i] = 'done'
  }
  // final repaint (cursor is at first step line)
  for (let j = 0; j < steps.length; j++) {
    const stepJ = steps[j]!
    const icon = green('✓')
    const line = row('  ' + icon + '  ' + stepJ.emoji + '  ' + cream(stepJ.label), 2 + 1 + 2 + 2 + 2 + stepJ.label.length)
    out.write('\x1b[2K\r' + line + '\n')
  }
  out.write('\x1b[2K\r' + emptyRow() + '\n')
  // skip past bot bar
  out.write('\x1b[1B')

  write()
  write(pink('  ❯ ') + cream('Confirm deployment?') + soft('  (y/n)'))
  write()
}

main()
