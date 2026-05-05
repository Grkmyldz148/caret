/**
 * Caret inline components — demo
 *
 *   pnpm --filter @caret/examples inline
 *
 * Showcases badge, kbd, breadcrumb, code, sparkline, checklist,
 * statusLine, quote, paragraph, divider.
 */

import {
  badge,
  kbd,
  breadcrumb,
  code,
  sparkline,
  checklist,
  statusLine,
  quote,
  paragraph,
  divider,
} from '@caret/registry/components/index.js'

// ── Badge ──────────────────────────────────────────────────
process.stdout.write('Badges:\n')
process.stdout.write(
  `  ${badge('beta')}  ${badge('passing', { color: 'success' })}  ${badge('failed', { color: 'danger' })}  ${badge('deprecated', { color: 'muted' })}\n`,
)

process.stdout.write('\n')

// ── Kbd ────────────────────────────────────────────────────
process.stdout.write('Keyboard shortcuts:\n')
process.stdout.write(`  Save: ${kbd(['Cmd', 'S'])}   Quit: ${kbd('Ctrl+C')}   Enter: ${kbd('↵')}\n`)

process.stdout.write('\n')

// ── Breadcrumb ─────────────────────────────────────────────
process.stdout.write('Breadcrumb:\n')
process.stdout.write(`  ${breadcrumb(['home', 'projects', 'my-app', 'settings'])}\n`)

process.stdout.write('\n')

// ── Inline code ────────────────────────────────────────────
process.stdout.write(`Run ${code('caret init')} to scaffold a new project.\n`)

process.stdout.write('\n')

// ── Sparkline ──────────────────────────────────────────────
process.stdout.write(`CPU: ${sparkline([1, 3, 5, 7, 8, 6, 4, 2, 3, 5, 7, 9, 8, 6])} 62%\n`)

process.stdout.write('\n')

// ── Divider ────────────────────────────────────────────────
divider({ label: 'Status', width: 50 })

process.stdout.write('\n')

// ── Status line ────────────────────────────────────────────
statusLine({
  items: [
    { label: 'built', status: 'done' },
    { label: 'tested', status: 'done' },
    { label: 'deploying', status: 'active' },
    { label: 'verified', status: 'pending' },
  ],
})

process.stdout.write('\n')

// ── Checklist ──────────────────────────────────────────────
checklist({
  items: [
    { label: 'Install dependencies', done: true },
    { label: 'Configure environment', done: true },
    { label: 'Run migrations' },
    { label: 'Start server' },
  ],
})

process.stdout.write('\n')

// ── Quote ──────────────────────────────────────────────────
quote('Good design is as little design as possible.\n— Dieter Rams')

process.stdout.write('\n')

// ── Paragraph ──────────────────────────────────────────────
paragraph(
  'Caret is a design system for modern command-line tools. It provides a consistent visual language built from ANSI attributes, semantic symbols, and a single brand accent — no backgrounds, no RGB gymnastics, just disciplined typography.',
  { width: 60, indent: 2 },
)
