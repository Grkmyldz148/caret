/**
 * Caret look — CANONICAL gallery
 *
 *   pnpm --filter @caret/examples look:caret
 *
 * This is the "real" Caret look after manifesto. Unlike the earlier
 * hybrid exploration demos, this file respects every rule in
 * specs/look.md:
 *
 *   1. No background is ever set.
 *   2. Foreground hierarchy is ANSI attributes, never hex grays.
 *      (chalk.dim, chalk.bold, chalk.italic)
 *   3. Accent is the single truecolor brand hex from tokens/colors.
 *   4. Semantic states emit ANSI named colors (green/yellow/red/blue)
 *      so they harmonize with the user's terminal theme.
 *   5. Titles use tracking() — letter-spaced CAPS.
 *   6. Label/value rows use dottedLeader() / leaderAt().
 *   7. 4-space page indent.
 *   8. No emoji. No block progress bars. No double-line borders.
 *
 * Compare against look:gallery-a and look:gallery-b to see how
 * discipline transforms the look.
 */

import chalk from 'chalk'
import {
  tracking,
  leaderAt,
  sleep,
} from '@caret/registry'
import { accent } from '@caret/registry/tokens/colors.js'
import { symbols } from '@caret/registry/tokens/symbols.js'

// ─────────────────────────────────────────────────────────────
// Palette
// ─────────────────────────────────────────────────────────────
//
// Only two hex references — the accent (three stops from the
// Helmlab-authored palette). Every other color is an ANSI
// attribute on top of the user's terminal foreground.

const brand = chalk.hex(accent.default)
const brandDim = chalk.hex(accent.muted)
const brandEm = chalk.hex(accent.emphasized)

// Semantic → ANSI named, per manifesto rule #3
const ok = chalk.green
const warn = chalk.yellow
const err = chalk.red
const info = chalk.blue

// Foreground hierarchy → attributes, per manifesto rule #2
const bold = chalk.bold
const dim = chalk.dim
const subtle = chalk.dim.italic
const body = (s: string) => s   // default — terminal's own fg

const out = process.stdout

// ─────────────────────────────────────────────────────────────
// Layout
// ─────────────────────────────────────────────────────────────

const INDENT = '    '          // 4-space page indent
const CONTENT_WIDTH = 56

function write(s = ''): void { out.write(s + '\n') }

function section(title: string): void {
  // Two blanks before, one after — the Caret breathing pattern.
  write()
  write()
  write(INDENT + bold(tracking(title)))
  write()
}

function sectionWithRuler(title: string): void {
  write()
  write()
  write(INDENT + bold(tracking(title)))
  // Short ruler, 2× title length, dim.
  const trackedLen = tracking(title).length
  write(INDENT + dim('─'.repeat(trackedLen + 2)))
  write()
}

// ─────────────────────────────────────────────────────────────
// 1. HEADER
// ─────────────────────────────────────────────────────────────

function header(): void {
  write()
  write(INDENT + bold(tracking('Caret')))
  write(INDENT + dim('the design system for modern command-line tools'))
  write()
  write(INDENT + subtle('v0.1.0   ·   canonical look   ·   2026-04-09'))
}

// ─────────────────────────────────────────────────────────────
// 2. TYPOGRAPHY
// ─────────────────────────────────────────────────────────────

function typography(): void {
  sectionWithRuler('Typography')
  write(INDENT + bold(tracking('Display title')))
  write()
  write(INDENT + bold('Heading — paragraph-level'))
  write()
  write(INDENT + body('Body text, the default paragraph color. Inherits from'))
  write(INDENT + body("your terminal's own foreground — no hex color here."))
  write()
  write(INDENT + dim('Muted text — dim attribute, still your fg.'))
  write(INDENT + subtle('Subtle text — dim italic, for hints and placeholders.'))
}

// ─────────────────────────────────────────────────────────────
// 3. MESSAGES
// ─────────────────────────────────────────────────────────────

function messages(): void {
  section('Messages')
  write(INDENT + ok(symbols.state.success) + '  ' + body('success') + dim('   ── deployed to production'))
  write(INDENT + info(symbols.state.info)   + '  ' + body('info') + dim('      ── cache was cold, built from scratch'))
  write(INDENT + warn(symbols.state.warning) + '  ' + body('warning') + dim('   ── 3 packages outdated'))
  write(INDENT + err(symbols.state.failure) + '  ' + body('error') + dim('     ── build failed — see logs above'))
  write(INDENT + dim(symbols.prefix.idle)   + '  ' + dim('debug     ── parsed 134 files in 840ms'))
}

// ─────────────────────────────────────────────────────────────
// 4. LIST
// ─────────────────────────────────────────────────────────────

function lists(): void {
  section('List')
  write(INDENT + brand(symbols.bullet) + '  ' + body('first item in a bulleted list'))
  write(INDENT + brand(symbols.bullet) + '  ' + body('second item, same intensity'))
  write(INDENT + brand(symbols.bullet) + '  ' + body('third item rounds it out'))
  write()
  write(INDENT + dim('1.') + '  ' + body('ordered lists use trailing dot'))
  write(INDENT + dim('2.') + '  ' + body('kept monospace-aligned by design'))
  write(INDENT + dim('3.') + '  ' + body('muted numbers keep content forward'))
}

// ─────────────────────────────────────────────────────────────
// 5. KEY · VALUE — dotted leader rows
// ─────────────────────────────────────────────────────────────

function keyValue(): void {
  section('Key · Value')
  const rows: [string, string][] = [
    ['Environment',  'production'],
    ['Region',       'us-east-1'],
    ['Node version', '20.11.0'],
    ['Commit',       '3f8a1c'],
    ['Started',      '2026-04-09 14:22:03'],
  ]
  // Anchor the dot column at the widest label + 2 for breathing.
  const LABEL_COL = Math.max(...rows.map(r => tracking(r[0]).length)) + 2
  for (const [k, v] of rows) {
    write(INDENT + leaderAt(dim(tracking(k)), body(v), LABEL_COL, CONTENT_WIDTH))
  }
}

// ─────────────────────────────────────────────────────────────
// 6. TABLE
// ─────────────────────────────────────────────────────────────

function table(): void {
  section('Table')
  const cols = ['Package', 'Version', 'Status']
  const widths = [20, 12, 12]
  const rows: [string, string, 'ok' | 'outdated'][] = [
    ['react',      '18.3.1', 'ok'],
    ['vite',       '5.0.0',  'ok'],
    ['typescript', '5.6.0',  'ok'],
    ['chalk',      '5.3.0',  'ok'],
    ['figlet',     '1.7.0',  'outdated'],
  ]
  // Header row — tracking CAPS in dim
  const headerRow = cols.map((c, i) => dim(tracking(c).padEnd(widths[i]!))).join('')
  write(INDENT + headerRow)
  // Thin horizontal rule — the only line in the table
  write(INDENT + dim('─'.repeat(widths.reduce((a, b) => a + b, 0))))
  for (const [pkg, ver, status] of rows) {
    const pkgCell = body(pkg.padEnd(widths[0]!))
    const verCell = dim(ver.padEnd(widths[1]!))
    const statusCell =
      status === 'ok'
        ? ok(status.padEnd(widths[2]!))
        : warn(status.padEnd(widths[2]!))
    write(INDENT + pkgCell + verCell + statusCell)
  }
}

// ─────────────────────────────────────────────────────────────
// 7. BADGES
// ─────────────────────────────────────────────────────────────

function badges(): void {
  section('Badges')
  // Badges are tracking CAPS in accent or semantic. No backgrounds.
  const b = (label: string, color: (s: string) => string) =>
    color(tracking(label))
  write(
    INDENT +
    b('stable', brand) + '     ' +
    b('beta',   warn)  + '     ' +
    b('alpha',  err)   + '     ' +
    b('draft',  dim)   + '     ' +
    b('v2',     brandEm)
  )
}

// ─────────────────────────────────────────────────────────────
// 8. CODE
// ─────────────────────────────────────────────────────────────

function codeBlock(): void {
  section('Code')
  write(INDENT + dim('Inline code: ') + brand('`const x = 1`') + dim(' reads like this.'))
  write()
  const lines = [
    "import { caret } from '@caret/registry'",
    '',
    'caret.deploy({',
    "  region: 'us-east-1',",
    '  onStep: step => console.log(step.name),',
    '})',
  ]
  write(INDENT + dim('example.ts'))
  write(INDENT + dim('─'.repeat(CONTENT_WIDTH)))
  for (let i = 0; i < lines.length; i++) {
    const lineNum = dim(String(i + 1).padStart(2, ' ') + '  ')
    write(INDENT + lineNum + body(lines[i]!))
  }
  write(INDENT + dim('─'.repeat(CONTENT_WIDTH)))
}

// ─────────────────────────────────────────────────────────────
// 9. DIFF
// ─────────────────────────────────────────────────────────────

function diff(): void {
  section('Diff')
  write(INDENT + dim('config.ts'))
  write(INDENT + dim('─'.repeat(CONTENT_WIDTH)))
  write(INDENT + dim('  ') + dim('export const config = {'))
  write(INDENT + err(symbols.diff.removed + ' ') + err('  region: "us-west-2",'))
  write(INDENT + ok(symbols.diff.added   + ' ') + ok('  region: "us-east-1",'))
  write(INDENT + ok(symbols.diff.added   + ' ') + ok('  retries: 3,'))
  write(INDENT + dim('  ') + dim('  timeout: 30000,'))
  write(INDENT + dim('  ') + dim('}'))
}

// ─────────────────────────────────────────────────────────────
// 10. TREE
// ─────────────────────────────────────────────────────────────

function tree(): void {
  section('Tree')
  const nodes: [string, string][] = [
    ['',              'caret/'],
    [symbols.tree.branch + ' ',     'packages/'],
    [symbols.tree.vertical + symbols.tree.lastBranch + ' ', 'caret/'],
    [symbols.tree.vertical + symbols.tree.space     + symbols.tree.branch     + ' ', 'src/'],
    [symbols.tree.vertical + symbols.tree.space     + symbols.tree.lastBranch + ' ', 'package.json'],
    [symbols.tree.branch + ' ',     'registry/'],
    [symbols.tree.vertical + symbols.tree.branch     + ' ', 'components/'],
    [symbols.tree.vertical + symbols.tree.branch     + ' ', 'tokens/'],
    [symbols.tree.vertical + symbols.tree.lastBranch + ' ', 'theme/'],
    [symbols.tree.lastBranch + ' ', 'examples/'],
  ]
  for (const [prefix, name] of nodes) {
    const colored = name.endsWith('/') ? bold(name) : body(name)
    write(INDENT + dim(prefix) + colored)
  }
}

// ─────────────────────────────────────────────────────────────
// 11. PROGRESS
// ─────────────────────────────────────────────────────────────

function progress(): void {
  section('Progress')
  const BAR = 30
  const states: [string, number][] = [
    ['build',  1.0],
    ['test',   1.0],
    ['upload', 0.65],
    ['verify', 0.0],
  ]
  for (const [label, pct] of states) {
    const filled = Math.floor(BAR * pct)
    // Manifesto: heavy line filled, light line empty — no blocks.
    const bar = brand(symbols.progress.filled.repeat(filled)) + dim(symbols.progress.empty.repeat(BAR - filled))
    const pctText =
      pct === 0 ? dim('  0%') :
      pct === 1 ? ok((Math.floor(pct * 100) + '%').padStart(4)) :
      brand((Math.floor(pct * 100) + '%').padStart(4))
    write(INDENT + dim(tracking(label).padEnd(14)) + bar + '  ' + pctText)
  }
}

// ─────────────────────────────────────────────────────────────
// 12. SPINNER
// ─────────────────────────────────────────────────────────────

async function spinner(): Promise<void> {
  section('Spinner')
  write()
  const frames = symbols.spinner.braille
  const label = tracking('Loading modules')
  const DURATION = 1400
  const start = Date.now()
  let f = 0
  while (Date.now() - start < DURATION) {
    const ch = frames[f % frames.length]!
    out.write('\r' + INDENT + brand(ch) + '   ' + body(label) + dim('   ' + '·'.repeat(20)))
    f++
    await sleep(80)
  }
  out.write(
    '\r' + INDENT + ok(symbols.state.success) + '   ' + body(label) +
    dim('   ' + '·'.repeat(20)) + '  ' + ok(tracking('done')) + '\n'
  )
}

// ─────────────────────────────────────────────────────────────
// 13. PROMPTS
// ─────────────────────────────────────────────────────────────

function prompts(): void {
  section('Prompts')
  // Text prompt — uses the ^ anchor, the true Caret signature.
  write(
    INDENT +
    brand(symbols.anchor) + '  ' +
    brand('?') + '  ' +
    bold(tracking('Name')) +
    dim('   ·   ') +
    body('John Doe') +
    brand('▎')
  )
  write()
  // Select prompt — radio style
  write(
    INDENT +
    brand(symbols.anchor) + '  ' +
    brand('?') + '  ' +
    bold(tracking('Region'))
  )
  write(INDENT + '      ' + brand(symbols.marker.selected)   + '  ' + body('us-east-1'))
  write(INDENT + '      ' + dim(symbols.marker.unselected)   + '  ' + dim('us-west-2'))
  write(INDENT + '      ' + dim(symbols.marker.unselected)   + '  ' + dim('eu-west-1'))
  write()
  // Confirm
  write(
    INDENT +
    brand(symbols.anchor) + '  ' +
    brand('?') + '  ' +
    bold(tracking('Confirm deploy?')) +
    dim('   ·   ') +
    body('y') + dim(' / ') + dim('n') +
    '   ' + brand('›')
  )
}

// ─────────────────────────────────────────────────────────────
// 14. CALLOUT
// ─────────────────────────────────────────────────────────────

function callout(): void {
  section('Callout')
  // Manifesto: single ‘│’ left gutter in accent, no other border.
  const gutter = brand(symbols.structure.gutter + ' ')
  write(INDENT + gutter + bold(tracking('Tip')))
  write(INDENT + gutter)
  write(INDENT + gutter + body('You can skip confirmation with ') + brand('--yes') + body(','))
  write(INDENT + gutter + body('but production deploys will still require y / n.'))
}

// ─────────────────────────────────────────────────────────────
// 15. BREADCRUMB
// ─────────────────────────────────────────────────────────────

function breadcrumb(): void {
  section('Breadcrumb')
  const sep = dim('   ›   ')
  write(
    INDENT +
    dim(tracking('home')) + sep +
    dim(tracking('projects')) + sep +
    dim(tracking('caret')) + sep +
    bold(tracking('deploy'))
  )
}

// ─────────────────────────────────────────────────────────────
// 16. KEYBOARD
// ─────────────────────────────────────────────────────────────

function kbd(): void {
  section('Keyboard')
  // Keys are bold inside thin dim brackets. No background, no
  // Nerd Font glyphs. Monospace-aligned naturally.
  const key = (k: string) => dim('[') + bold(k) + dim(']')
  write(INDENT + body('Press ') + key('⌘K') + body(' to search, ') + key('Esc') + body(' to close.'))
  write(INDENT + body('Navigate with ') + key('↑') + ' ' + key('↓') + body(', select with ') + key('⏎') + body('.'))
}

// ─────────────────────────────────────────────────────────────
// 17. QUOTE
// ─────────────────────────────────────────────────────────────

function quote(): void {
  section('Quote')
  const gutter = brand(symbols.structure.gutter + ' ')
  write(INDENT + gutter + body('"The terminal is a design surface."'))
  write(INDENT + gutter + dim('   — ') + dim(tracking('caret manifesto')))
}

// ─────────────────────────────────────────────────────────────
// 18. DIVIDER
// ─────────────────────────────────────────────────────────────

function divider(): void {
  section('Divider')
  write(INDENT + dim('─'.repeat(CONTENT_WIDTH)))
  write()
  write(INDENT + dim('·  '.repeat(Math.floor(CONTENT_WIDTH / 3))))
  write()
  write(INDENT + dim('── ') + dim(tracking('section break')) + dim(' ' + '─'.repeat(CONTENT_WIDTH - tracking('section break').length - 5)))
}

// ─────────────────────────────────────────────────────────────
// 19. FOOTER
// ─────────────────────────────────────────────────────────────

function footer(): void {
  write()
  write()
  write(INDENT + dim('─'.repeat(CONTENT_WIDTH)))
  write(INDENT + subtle('caret  ·  canonical look  ·  2026-04-09 14:22'))
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
