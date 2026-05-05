/**
 * Caret look — HYBRID A gallery
 *
 *   pnpm --filter @caret/examples look:gallery-a
 *
 * Full element catalog in Hybrid A style: mono amber phosphor,
 * letter-spaced CAPS, retro-style indicators, block progress bars,
 * dotted leaders, no borders (except on callouts).
 *
 * Aim: show every element type once so you can judge the whole
 * design language, not just one scenario.
 */

import chalk from 'chalk'

// Monochrome amber phosphor — 4 intensity stops
const bright = chalk.hex('#ffb000')
const mid = chalk.hex('#cc8800')
const dim = chalk.hex('#805500')
const faint = chalk.hex('#3d2800')

// Semantic — kept monochromatic, differentiated by intensity + icon
// (retro terminals didn't have semantic color — we honor that)
const ok = bright
const warn = chalk.hex('#ffd166')
const err = chalk.hex('#ff6b35')
const info = mid

const out = process.stdout

const INDENT = '    '

function write(s = ''): void { out.write(s + '\n') }
function sleep(ms: number): Promise<void> { return new Promise(r => setTimeout(r, ms)) }

function tracking(s: string): string {
  return s.toUpperCase().split('').join(' ')
}

function section(title: string): void {
  write()
  write()
  write(INDENT + bright.bold(tracking(title)))
  write(INDENT + faint('─'.repeat(title.length * 2 + 4)))
  write()
}

// ─────────────────────────────────────────────────────────────
// 1. HEADER
// ─────────────────────────────────────────────────────────────

function header(): void {
  write()
  write(INDENT + bright.bold(tracking('Caret')))
  write(INDENT + dim('── terminal design system'))
  write()
  write(INDENT + faint('v0.1.0') + dim('   ·   ') + faint('hybrid A — editorial + retro'))
}

// ─────────────────────────────────────────────────────────────
// 2. TYPOGRAPHY
// ─────────────────────────────────────────────────────────────

function typography(): void {
  section('Typography')
  write(INDENT + bright.bold(tracking('Display title')))
  write()
  write(INDENT + bright.bold('Heading — paragraph-level'))
  write()
  write(INDENT + mid('Body text, the default paragraph color. Reads calmly'))
  write(INDENT + mid('at normal intensity without shouting.'))
  write()
  write(INDENT + dim('Caption text — secondary, quieter still.'))
  write(INDENT + faint('Disabled text — barely there, used for pending state.'))
}

// ─────────────────────────────────────────────────────────────
// 3. MESSAGES
// ─────────────────────────────────────────────────────────────

function messages(): void {
  section('Messages')
  write(INDENT + ok('[√] ') + bright('success') + dim('  ── ') + mid('deployed to production'))
  write(INDENT + info('[i] ') + bright('info') + dim('     ── ') + mid('cache was cold, built from scratch'))
  write(INDENT + warn('[!] ') + bright('warning') + dim('  ── ') + mid('3 packages outdated'))
  write(INDENT + err('[x] ') + bright('error') + dim('    ── ') + mid('build failed — see logs above'))
  write(INDENT + faint('[·] ') + dim('debug') + faint('    ── parsed 134 files in 840ms'))
}

// ─────────────────────────────────────────────────────────────
// 4. LIST
// ─────────────────────────────────────────────────────────────

function lists(): void {
  section('List')
  write(INDENT + bright('— ') + mid('first item in a bulleted list'))
  write(INDENT + bright('— ') + mid('second item, same intensity'))
  write(INDENT + bright('— ') + mid('third item rounds it out'))
  write()
  write(INDENT + faint('01  ') + mid('ordered lists use zero-padded numbers'))
  write(INDENT + faint('02  ') + mid('kept monospace-aligned by design'))
  write(INDENT + faint('03  ') + mid('dim numbers keep content forward'))
}

// ─────────────────────────────────────────────────────────────
// 5. KEY-VALUE
// ─────────────────────────────────────────────────────────────

function keyValue(): void {
  section('Key · Value')
  const rows: [string, string][] = [
    ['Environment', 'production'],
    ['Region',      'us-east-1'],
    ['Node version', '20.11.0'],
    ['Commit',      '3f8a1c'],
    ['Started',     '2026-04-09 14:22:03'],
  ]
  const width = 52
  for (const [k, v] of rows) {
    const keyText = tracking(k)
    const used = keyText.length + v.length + 2
    const leaderLen = Math.max(3, width - used)
    write(INDENT + dim(keyText) + faint(' ' + '·'.repeat(leaderLen) + ' ') + bright(v))
  }
}

// ─────────────────────────────────────────────────────────────
// 6. TABLE
// ─────────────────────────────────────────────────────────────

function table(): void {
  section('Table')
  const cols = ['PACKAGE', 'VERSION', 'STATUS']
  const widths = [20, 12, 12]
  const rows: string[][] = [
    ['react',            '18.3.1',   'ok'],
    ['vite',             '5.0.0',    'ok'],
    ['typescript',       '5.6.0',    'ok'],
    ['chalk',            '5.3.0',    'ok'],
    ['figlet',           '1.7.0',    'outdated'],
  ]
  const headerLine = cols.map((c, i) => dim(tracking(c).padEnd(widths[i]!))).join('')
  write(INDENT + headerLine)
  write(INDENT + faint('─'.repeat(widths.reduce((a, b) => a + b, 0))))
  for (const row of rows) {
    const pkg = mid(row[0]!.padEnd(widths[0]!))
    const ver = dim(row[1]!.padEnd(widths[1]!))
    const status = row[2] === 'ok' ? ok(row[2]!.padEnd(widths[2]!)) : warn(row[2]!.padEnd(widths[2]!))
    write(INDENT + pkg + ver + status)
  }
}

// ─────────────────────────────────────────────────────────────
// 7. BADGES
// ─────────────────────────────────────────────────────────────

function badges(): void {
  section('Badges')
  const mk = (label: string, color = bright) => color('[ ') + color.bold(tracking(label)) + color(' ]')
  write(INDENT + mk('stable') + '  ' + mk('beta', warn) + '  ' + mk('alpha', err) + '  ' + mk('draft', dim) + '  ' + mk('v2', info))
}

// ─────────────────────────────────────────────────────────────
// 8. CODE BLOCK
// ─────────────────────────────────────────────────────────────

function codeBlock(): void {
  section('Code')
  write(INDENT + dim('Inline code: ') + bright('`const x = 1`') + dim(' reads like this.'))
  write()
  const lines = [
    "import { caret } from '@caret/registry'",
    "",
    "caret.deploy({",
    "  region: 'us-east-1',",
    "  onStep: step => console.log(step.name),",
    "})",
  ]
  const LW = 2
  write(INDENT + faint('── example.ts ' + '─'.repeat(40)))
  for (let i = 0; i < lines.length; i++) {
    const lineNum = faint(String(i + 1).padStart(LW, ' ') + '  ')
    write(INDENT + lineNum + mid(lines[i]!))
  }
  write(INDENT + faint('─'.repeat(54)))
}

// ─────────────────────────────────────────────────────────────
// 9. DIFF
// ─────────────────────────────────────────────────────────────

function diff(): void {
  section('Diff')
  write(INDENT + faint('── config.ts ') + faint('─'.repeat(40)))
  write(INDENT + faint('  ') + dim('export const config = {'))
  write(INDENT + err('- ') + err('  region: "us-west-2",'))
  write(INDENT + ok('+ ') + ok('  region: "us-east-1",'))
  write(INDENT + ok('+ ') + ok('  retries: 3,'))
  write(INDENT + faint('  ') + dim('  timeout: 30000,'))
  write(INDENT + faint('  ') + dim('}'))
}

// ─────────────────────────────────────────────────────────────
// 10. TREE
// ─────────────────────────────────────────────────────────────

function tree(): void {
  section('Tree')
  const lines: [string, string][] = [
    ['',            'caret/'],
    ['├─ ',         'packages/'],
    ['│  └─ ',      'caret/'],
    ['│     ├─ ',   'src/'],
    ['│     └─ ',   'package.json'],
    ['├─ ',         'registry/'],
    ['│  ├─ ',      'components/'],
    ['│  ├─ ',      'tokens/'],
    ['│  └─ ',      'theme/'],
    ['└─ ',         'examples/'],
  ]
  for (const [prefix, name] of lines) {
    const colorName = name.endsWith('/') ? bright(name) : mid(name)
    write(INDENT + faint(prefix) + colorName)
  }
}

// ─────────────────────────────────────────────────────────────
// 11. PROGRESS BARS
// ─────────────────────────────────────────────────────────────

function progress(): void {
  section('Progress')
  const BAR = 30
  const states: [string, number][] = [
    ['build',  1.00],
    ['test',   1.00],
    ['upload', 0.65],
    ['verify', 0.00],
  ]
  for (const [label, pct] of states) {
    const filled = Math.floor(BAR * pct)
    const bar = bright('█'.repeat(filled)) + faint('░'.repeat(BAR - filled))
    const pctText = (pct === 0 ? faint : pct === 1 ? ok : bright)(`${Math.floor(pct * 100)}%`.padStart(4))
    write(INDENT + dim(tracking(label).padEnd(14)) + bar + '  ' + pctText)
  }
}

// ─────────────────────────────────────────────────────────────
// 12. SPINNER (animated, brief)
// ─────────────────────────────────────────────────────────────

async function spinner(): Promise<void> {
  section('Spinner')
  const blocks = ['░', '▒', '▓', '█', '▓', '▒']
  const label = tracking('Loading modules')
  const DURATION = 1400
  const start = Date.now()
  let f = 0
  write()
  while (Date.now() - start < DURATION) {
    const ch = blocks[f % blocks.length]!
    out.write('\r' + INDENT + bright('[') + bright(ch) + bright(']') + '  ' + bright(label) + dim('   ' + '·'.repeat(20)))
    f++
    await sleep(90)
  }
  out.write('\r' + INDENT + bright('[') + bright.bold('√') + bright(']') + '  ' + bright(label) + dim('   ' + '·'.repeat(20)) + '  ' + ok(tracking('done')) + '\n')
}

// ─────────────────────────────────────────────────────────────
// 13. PROMPTS (static mocks)
// ─────────────────────────────────────────────────────────────

function prompts(): void {
  section('Prompts')
  write(INDENT + bright('>>> ') + dim(tracking('Name')) + faint('  ·····  ') + bright('John Doe') + bright('_'))
  write()
  write(INDENT + bright('>>> ') + dim(tracking('Region')))
  write(INDENT + '    ' + bright('(●) ') + bright.bold('us-east-1'))
  write(INDENT + '    ' + dim('( ) us-west-2'))
  write(INDENT + '    ' + dim('( ) eu-west-1'))
  write()
  write(INDENT + bright('>>> ') + dim(tracking('Confirm deploy?')) + faint('  ·····  ') + bright.bold('Y') + faint(' / ') + dim('N'))
}

// ─────────────────────────────────────────────────────────────
// 14. CALLOUT / ALERT
// ─────────────────────────────────────────────────────────────

function callout(): void {
  section('Callout')
  const lines = [
    bright.bold(tracking('Tip')),
    '',
    mid('You can skip confirmation with ') + bright('--yes') + mid(', but'),
    mid('production deploys will still require Y/N.'),
  ]
  // retro-style: thick shading block on the left
  for (const line of lines) {
    write(INDENT + bright('▌ ') + line)
  }
}

// ─────────────────────────────────────────────────────────────
// 15. BREADCRUMB
// ─────────────────────────────────────────────────────────────

function breadcrumb(): void {
  section('Breadcrumb')
  write(INDENT + dim(tracking('home')) + faint('  ›  ') + dim(tracking('projects')) + faint('  ›  ') + dim(tracking('caret')) + faint('  ›  ') + bright.bold(tracking('deploy')))
}

// ─────────────────────────────────────────────────────────────
// 16. KBD (keyboard shortcut)
// ─────────────────────────────────────────────────────────────

function kbd(): void {
  section('Keyboard')
  const key = (k: string) => bright('[') + bright.bold(' ' + k + ' ') + bright(']')
  write(INDENT + mid('Press ') + key('⌘') + ' ' + key('K') + mid(' to search, ') + key('Esc') + mid(' to close.'))
  write(INDENT + mid('Navigate with ') + key('↑') + ' ' + key('↓') + mid(', select with ') + key('⏎') + mid('.'))
}

// ─────────────────────────────────────────────────────────────
// 17. QUOTE
// ─────────────────────────────────────────────────────────────

function quote(): void {
  section('Quote')
  write(INDENT + bright('▌ ') + mid('"The terminal is a design surface."'))
  write(INDENT + bright('▌ ') + faint('   — ') + dim(tracking('caret manifesto')))
}

// ─────────────────────────────────────────────────────────────
// 18. DIVIDER
// ─────────────────────────────────────────────────────────────

function divider(): void {
  section('Divider')
  write(INDENT + faint('─'.repeat(54)))
  write()
  write(INDENT + faint('· · · · · · · · · · · · · · · · · · · · · · · · · ·'))
  write()
  write(INDENT + faint('── ') + dim(tracking('section break')) + faint(' ' + '─'.repeat(36)))
}

// ─────────────────────────────────────────────────────────────
// 19. FOOTER
// ─────────────────────────────────────────────────────────────

function footer(): void {
  write()
  write()
  write(INDENT + faint('─'.repeat(54)))
  write(INDENT + faint('caret  ·  hybrid A  ·  2026-04-09 14:22'))
  write()
}

// ─────────────────────────────────────────────────────────────
// main
// ─────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  header()
  typography()
  messages()
  lists()
  keyValue()
  table()
  badges()
  codeBlock()
  diff()
  tree()
  progress()
  await spinner()
  prompts()
  callout()
  breadcrumb()
  kbd()
  quote()
  divider()
  footer()
}

main()
