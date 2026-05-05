/**
 * Caret look — HYBRID B gallery
 *
 *   pnpm --filter @caret/examples look:gallery-b
 *
 * Full element catalog in Hybrid B style: neutral grayscale +
 * single cool blue accent, letter-spaced CAPS section headers,
 * braille dot spinners, ✓/○/· symbols, thin dividers, bol
 * whitespace, dotted leaders.
 *
 * Aim: show every element type once — apples-to-apples with A.
 */

import chalk from 'chalk'

// Neutral grayscale + single confident accent
const ink = chalk.hex('#f5f5f4')
const body = chalk.hex('#d6d3d1')
const muted = chalk.hex('#78716c')
const faint = chalk.hex('#3f3f46')

// Single accent — proper semantic colors still respected
const accent = chalk.hex('#5b8dff')
const accentDim = chalk.hex('#3a5ca8')

const ok = chalk.hex('#34d399')
const warn = chalk.hex('#fbbf24')
const err = chalk.hex('#f87171')
const info = chalk.hex('#60a5fa')

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
  write(INDENT + ink.bold(tracking(title)))
  write()
}

// ─────────────────────────────────────────────────────────────
// 1. HEADER
// ─────────────────────────────────────────────────────────────

function header(): void {
  write()
  write(INDENT + ink.bold(tracking('Caret')))
  write(INDENT + muted('the design system for modern command-line tools'))
  write()
  write(INDENT + faint('v0.1.0') + muted('   ·   ') + faint('hybrid B — minimal + editorial'))
}

// ─────────────────────────────────────────────────────────────
// 2. TYPOGRAPHY
// ─────────────────────────────────────────────────────────────

function typography(): void {
  section('Typography')
  write(INDENT + ink.bold(tracking('Display title')))
  write()
  write(INDENT + ink.bold('Heading — paragraph-level'))
  write()
  write(INDENT + body('Body text, the default paragraph color. Reads calmly'))
  write(INDENT + body('at normal intensity without shouting.'))
  write()
  write(INDENT + muted('Caption text — secondary, quieter still.'))
  write(INDENT + faint('Disabled text — barely there, used for pending state.'))
}

// ─────────────────────────────────────────────────────────────
// 3. MESSAGES
// ─────────────────────────────────────────────────────────────

function messages(): void {
  section('Messages')
  write(INDENT + ok('✓  ') + ink('success') + muted('   ── ') + body('deployed to production'))
  write(INDENT + info('i  ') + ink('info') + muted('      ── ') + body('cache was cold, built from scratch'))
  write(INDENT + warn('!  ') + ink('warning') + muted('   ── ') + body('3 packages outdated'))
  write(INDENT + err('✗  ') + ink('error') + muted('     ── ') + body('build failed — see logs above'))
  write(INDENT + faint('·  ') + muted('debug') + faint('     ── parsed 134 files in 840ms'))
}

// ─────────────────────────────────────────────────────────────
// 4. LIST
// ─────────────────────────────────────────────────────────────

function lists(): void {
  section('List')
  write(INDENT + accent('•  ') + body('first item in a bulleted list'))
  write(INDENT + accent('•  ') + body('second item, same intensity'))
  write(INDENT + accent('•  ') + body('third item rounds it out'))
  write()
  write(INDENT + muted('1.  ') + body('ordered lists use trailing dot'))
  write(INDENT + muted('2.  ') + body('kept monospace-aligned by design'))
  write(INDENT + muted('3.  ') + body('muted numbers keep content forward'))
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
    write(INDENT + muted(keyText) + faint(' ' + '·'.repeat(leaderLen) + ' ') + ink(v))
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
  const headerLine = cols.map((c, i) => muted(tracking(c).padEnd(widths[i]!))).join('')
  write(INDENT + headerLine)
  write(INDENT + faint('─'.repeat(widths.reduce((a, b) => a + b, 0))))
  for (const row of rows) {
    const pkg = body(row[0]!.padEnd(widths[0]!))
    const ver = muted(row[1]!.padEnd(widths[1]!))
    const status = row[2] === 'ok' ? ok(row[2]!.padEnd(widths[2]!)) : warn(row[2]!.padEnd(widths[2]!))
    write(INDENT + pkg + ver + status)
  }
}

// ─────────────────────────────────────────────────────────────
// 7. BADGES
// ─────────────────────────────────────────────────────────────

function badges(): void {
  section('Badges')
  const mk = (label: string, color = accent) => color('  ') + color(tracking(label)) + color('  ')
  // Render as pill with subtle bg-like effect using inverse or brackets
  const pill = (label: string, color = accent) => color('◖') + color(tracking(label)) + color('◗')
  write(INDENT + pill('stable') + '  ' + pill('beta', warn) + '  ' + pill('alpha', err) + '  ' + pill('draft', muted) + '  ' + pill('v2', info))
}

// ─────────────────────────────────────────────────────────────
// 8. CODE BLOCK
// ─────────────────────────────────────────────────────────────

function codeBlock(): void {
  section('Code')
  write(INDENT + muted('Inline code: ') + accent('`const x = 1`') + muted(' reads like this.'))
  write()
  const lines = [
    "import { caret } from '@caret/registry'",
    "",
    "caret.deploy({",
    "  region: 'us-east-1',",
    "  onStep: step => console.log(step.name),",
    "})",
  ]
  write(INDENT + muted('example.ts'))
  write(INDENT + faint('─'.repeat(54)))
  for (let i = 0; i < lines.length; i++) {
    const lineNum = faint(String(i + 1).padStart(2, ' ') + '  ')
    write(INDENT + lineNum + body(lines[i]!))
  }
  write(INDENT + faint('─'.repeat(54)))
}

// ─────────────────────────────────────────────────────────────
// 9. DIFF
// ─────────────────────────────────────────────────────────────

function diff(): void {
  section('Diff')
  write(INDENT + muted('config.ts'))
  write(INDENT + faint('─'.repeat(54)))
  write(INDENT + faint('  ') + muted('export const config = {'))
  write(INDENT + err('- ') + err('  region: "us-west-2",'))
  write(INDENT + ok('+ ') + ok('  region: "us-east-1",'))
  write(INDENT + ok('+ ') + ok('  retries: 3,'))
  write(INDENT + faint('  ') + muted('  timeout: 30000,'))
  write(INDENT + faint('  ') + muted('}'))
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
    const colorName = name.endsWith('/') ? ink(name) : body(name)
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
  // Thin unicode bars (not heavy blocks)
  for (const [label, pct] of states) {
    const filled = Math.floor(BAR * pct)
    const bar = accent('━'.repeat(filled)) + faint('━'.repeat(BAR - filled))
    const pctText = (pct === 0 ? faint : pct === 1 ? ok : accent)(`${Math.floor(pct * 100)}%`.padStart(4))
    write(INDENT + muted(tracking(label).padEnd(14)) + bar + '  ' + pctText)
  }
}

// ─────────────────────────────────────────────────────────────
// 12. SPINNER (animated, brief)
// ─────────────────────────────────────────────────────────────

async function spinner(): Promise<void> {
  section('Spinner')
  const braille = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
  const label = tracking('Loading modules')
  const DURATION = 1400
  const start = Date.now()
  let f = 0
  write()
  while (Date.now() - start < DURATION) {
    const ch = braille[f % braille.length]!
    out.write('\r' + INDENT + accent(ch) + '   ' + ink(label) + faint('   ' + '·'.repeat(20)))
    f++
    await sleep(90)
  }
  out.write('\r' + INDENT + ok('✓') + '   ' + ink(label) + faint('   ' + '·'.repeat(20)) + '  ' + ok(tracking('done')) + '\n')
}

// ─────────────────────────────────────────────────────────────
// 13. PROMPTS (static mocks)
// ─────────────────────────────────────────────────────────────

function prompts(): void {
  section('Prompts')
  write(INDENT + accent('?') + '  ' + ink(tracking('Name')) + faint('   ·   ') + body('John Doe') + accent('▎'))
  write()
  write(INDENT + accent('?') + '  ' + ink(tracking('Region')))
  write(INDENT + '    ' + accent('●  ') + ink('us-east-1'))
  write(INDENT + '    ' + faint('○  ') + muted('us-west-2'))
  write(INDENT + '    ' + faint('○  ') + muted('eu-west-1'))
  write()
  write(INDENT + accent('?') + '  ' + ink(tracking('Confirm deploy?')) + faint('   ·   ') + ink('y') + faint(' / ') + muted('n') + accent('  ›'))
}

// ─────────────────────────────────────────────────────────────
// 14. CALLOUT / ALERT
// ─────────────────────────────────────────────────────────────

function callout(): void {
  section('Callout')
  const lines = [
    ink.bold(tracking('Tip')),
    '',
    body('You can skip confirmation with ') + accent('--yes') + body(', but'),
    body('production deploys will still require y/n.'),
  ]
  for (const line of lines) {
    write(INDENT + accent('│ ') + line)
  }
}

// ─────────────────────────────────────────────────────────────
// 15. BREADCRUMB
// ─────────────────────────────────────────────────────────────

function breadcrumb(): void {
  section('Breadcrumb')
  write(INDENT + muted(tracking('home')) + faint('  ›  ') + muted(tracking('projects')) + faint('  ›  ') + muted(tracking('caret')) + faint('  ›  ') + ink.bold(tracking('deploy')))
}

// ─────────────────────────────────────────────────────────────
// 16. KBD (keyboard shortcut)
// ─────────────────────────────────────────────────────────────

function kbd(): void {
  section('Keyboard')
  const key = (k: string) => faint('⌐') + ink(' ' + k + ' ') + faint('¬')
  write(INDENT + body('Press ') + key('⌘') + ' ' + key('K') + body(' to search, ') + key('Esc') + body(' to close.'))
  write(INDENT + body('Navigate with ') + key('↑') + ' ' + key('↓') + body(', select with ') + key('⏎') + body('.'))
}

// ─────────────────────────────────────────────────────────────
// 17. QUOTE
// ─────────────────────────────────────────────────────────────

function quote(): void {
  section('Quote')
  write(INDENT + accent('│ ') + body('"The terminal is a design surface."'))
  write(INDENT + accent('│ ') + faint('   — ') + muted(tracking('caret manifesto')))
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
  write(INDENT + faint('── ') + muted(tracking('section break')) + faint(' ' + '─'.repeat(36)))
}

// ─────────────────────────────────────────────────────────────
// 19. FOOTER
// ─────────────────────────────────────────────────────────────

function footer(): void {
  write()
  write()
  write(INDENT + faint('─'.repeat(54)))
  write(INDENT + faint('caret  ·  hybrid B  ·  2026-04-09 14:22'))
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
