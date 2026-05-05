/**
 * Component smoke tests.
 *
 * For every static (synchronous, non-Ink) Caret component, this file:
 *   1. Calls the component with a minimal valid configuration.
 *   2. Captures everything written to stdout and stderr.
 *   3. Asserts the call did not throw and produced non-empty output.
 *   4. Where reasonable, asserts a content marker (a label, a glyph,
 *      a known character) actually appeared in the output.
 *
 * Interactive Ink-rendered components (prompt.*, search, pager, form,
 * modal, toast, spinner.tsx, etc.) require ink-testing-library and
 * key-event simulation; those are deferred to a later phase.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  alert,
  avatar,
  badge,
  banner,
  brailleChart,
  breadcrumb,
  calendar,
  chat,
  checklist,
  code,
  codeBlock,
  columns,
  dashboard,
  debug,
  diff,
  divider,
  error,
  flamegraph,
  gauge,
  gradient,
  heatmap,
  help,
  info,
  jsonViewer,
  kbd,
  keyValue,
  link,
  list,
  log,
  markdown,
  panel,
  paragraph,
  progress,
  qrcode,
  quote,
  radar,
  snippet,
  space,
  sparkline,
  stats,
  statusLine,
  step,
  success,
  table,
  timeAgo,
  timeline,
  timestamp,
  tree,
  warning,
  waveform,
} from '../index.js'

// ── stdout / stderr capture ─────────────────────────────────────────

let stdoutChunks: string[] = []
let stderrChunks: string[] = []
// vi.spyOn returns a MockInstance whose generic type fights the
// process.stdout.write overload; we only ever call mockRestore() so a
// minimal interface keeps tsc happy without bringing the full type in.
type Restorable = { mockRestore: () => void }
let stdoutSpy: Restorable
let stderrSpy: Restorable

beforeEach(() => {
  stdoutChunks = []
  stderrChunks = []
  stdoutSpy = vi
    .spyOn(process.stdout, 'write')
    .mockImplementation((chunk: string | Uint8Array) => {
      stdoutChunks.push(typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf8'))
      return true
    })
  stderrSpy = vi
    .spyOn(process.stderr, 'write')
    .mockImplementation((chunk: string | Uint8Array) => {
      stderrChunks.push(typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf8'))
      return true
    })
})

afterEach(() => {
  stdoutSpy.mockRestore()
  stderrSpy.mockRestore()
})

// Strip ANSI color escapes so assertions don't depend on TTY detection.
function stripAnsi(s: string): string {
  // biome-ignore lint/suspicious/noControlCharactersInRegex: ANSI escape stripping
  return s.replace(/\x1b\[[0-9;]*m/g, '').replace(/\x1b\][^\x07]*\x07/g, '')
}

const stdout = (): string => stripAnsi(stdoutChunks.join(''))
const stderr = (): string => stripAnsi(stderrChunks.join(''))
const both = (): string => stdout() + stderr()

// ── Single-line messages ────────────────────────────────────────────

describe('messages', () => {
  it('info writes to stdout with the info: prefix', () => {
    info('cache cleared')
    expect(stdout()).toContain('info:')
    expect(stdout()).toContain('cache cleared')
  })

  it('success writes to stdout with the success: prefix', () => {
    success('build complete')
    expect(stdout()).toContain('success:')
    expect(stdout()).toContain('build complete')
  })

  it('warning writes to stderr with the warning: prefix', () => {
    warning('deprecated config')
    expect(stderr()).toContain('warning:')
    expect(stderr()).toContain('deprecated config')
  })

  it('debug writes to stderr', () => {
    debug('fetched 47 records')
    expect(stderr()).toContain('debug:')
    expect(stderr()).toContain('fetched 47 records')
  })

  it('error writes a structured block to stderr', () => {
    error('Failed to deploy', {
      body: 'API returned 401.',
      hint: 'Run my-cli login.',
      see: 'https://example.dev/docs',
    })
    expect(stderr()).toContain('error:')
    expect(stderr()).toContain('Failed to deploy')
    expect(stderr()).toContain('API returned 401.')
    expect(stderr()).toContain('Run my-cli login.')
    expect(stderr()).toContain('https://example.dev/docs')
  })
})

// ── Inline (string-returning) components ────────────────────────────

describe('inline returns', () => {
  it('badge wraps the label in brackets', () => {
    expect(stripAnsi(badge('beta'))).toBe('[beta]')
    expect(stripAnsi(badge('passing', { color: 'success' }))).toBe('[passing]')
  })

  it('avatar returns bracketed initials', () => {
    expect(stripAnsi(avatar('Görkem Yıldız'))).toBe('[GY]')
    expect(stripAnsi(avatar('jane'))).toBe('[J]')
  })

  it('code wraps text in backticks', () => {
    const out = stripAnsi(code('caret init'))
    expect(out).toBe('`caret init`')
  })

  it('kbd wraps a single key in brackets', () => {
    expect(stripAnsi(kbd('Enter'))).toBe('[Enter]')
  })

  it('kbd joins a chord with +', () => {
    expect(stripAnsi(kbd(['Ctrl', 'C']))).toBe('[Ctrl]+[C]')
  })

  it('link renders display text and a URL', () => {
    const out = stripAnsi(link('https://caret.dev', 'docs'))
    expect(out).toContain('docs')
  })

  it('breadcrumb joins segments with a separator', () => {
    const out = stripAnsi(breadcrumb(['caret', 'registry', 'list.ts']))
    expect(out).toContain('caret')
    expect(out).toContain('registry')
    expect(out).toContain('list.ts')
    expect(out).toMatch(/›/)
  })

  it('sparkline returns one bar character per value', () => {
    const out = stripAnsi(sparkline([1, 2, 3, 4]))
    expect(out.length).toBeGreaterThanOrEqual(4)
  })

  it('sparkline returns empty for empty input', () => {
    expect(sparkline([])).toBe('')
  })

  it('gradient returns the same number of visible characters as input', () => {
    const out = stripAnsi(gradient('Caret'))
    expect(out).toBe('Caret')
  })

  it('timestamp formats a date in time mode by default', () => {
    const fixed = new Date('2026-05-05T10:30:00Z')
    const out = timestamp({ date: fixed })
    expect(out).toMatch(/\d{1,2}:\d{2}/)
  })

  it('timeAgo returns a human-readable relative string', () => {
    const fortyTwoMinAgo = new Date(Date.now() - 1000 * 60 * 42)
    const out = timeAgo(fortyTwoMinAgo)
    expect(out).toMatch(/\d+\s?(m|min|minutes?)/i)
  })
})

// ── Block (stdout-writing) components ───────────────────────────────

describe('list', () => {
  it('renders bullet items by default', () => {
    list({ items: ['First', 'Second', 'Third'] })
    expect(stdout()).toContain('First')
    expect(stdout()).toContain('Second')
    expect(stdout()).toContain('Third')
  })

  it('renders numbered variant with 1./2./3.', () => {
    list({ items: ['a', 'b', 'c'], variant: 'numbered' })
    expect(stdout()).toMatch(/1\.\s+a/)
    expect(stdout()).toMatch(/2\.\s+b/)
  })

  it('renders item label and description', () => {
    list({
      items: [{ label: 'Auth', description: 'OAuth + email' }],
    })
    expect(stdout()).toContain('Auth')
    expect(stdout()).toContain('OAuth + email')
  })
})

describe('keyValue', () => {
  it('renders aligned rows', () => {
    keyValue({
      rows: [
        { key: 'Project', value: 'caret' },
        { key: 'Region', value: 'us-east-1' },
      ],
    })
    expect(stdout()).toContain('Project')
    expect(stdout()).toContain('caret')
    expect(stdout()).toContain('us-east-1')
  })
})

describe('banner', () => {
  it('renders title, subtitle, and a horizontal rule', () => {
    banner({ title: 'My CLI', subtitle: 'v2.0.0' })
    const out = stdout()
    expect(out).toContain('M Y   C L I') // tracking()
    expect(out).toContain('v2.0.0')
  })
})

describe('divider', () => {
  it('renders a plain rule when no label', () => {
    divider({ width: 20 })
    expect(stdout().trim().length).toBeGreaterThan(0)
  })

  it('embeds a tracked label when provided', () => {
    divider({ label: 'Section', width: 40 })
    expect(stdout()).toContain('S E C T I O N')
  })
})

describe('paragraph', () => {
  it('writes wrapped lines that contain the input words', () => {
    paragraph('Caret is the design system for modern command-line tools.', {
      width: 30,
    })
    expect(stdout()).toContain('Caret')
    expect(stdout()).toContain('design')
    expect(stdout()).toContain('command-line')
  })
})

describe('quote', () => {
  it('prefixes each line with a gutter', () => {
    quote('first line\nsecond line')
    const lines = stdout().trimEnd().split('\n')
    expect(lines.length).toBe(2)
    expect(lines.every((l) => /^\S\s+/.test(l))).toBe(true)
  })
})

describe('alert', () => {
  it('renders kind, title, and body', () => {
    alert({ kind: 'warning', title: 'Deprecated', body: 'Use OAuth2.' })
    expect(stdout()).toContain('warning')
    expect(stdout()).toContain('Deprecated')
    expect(stdout()).toContain('Use OAuth2.')
  })
})

describe('checklist', () => {
  it('renders items with done/pending markers', () => {
    checklist({
      items: [
        { label: 'Install', done: true },
        { label: 'Configure', done: false },
      ],
    })
    expect(stdout()).toContain('Install')
    expect(stdout()).toContain('Configure')
  })
})

describe('statusLine', () => {
  it('renders all items with their labels', () => {
    statusLine({
      items: [
        { label: 'built', status: 'done' },
        { label: 'tested', status: 'done' },
        { label: 'deploying', status: 'active' },
      ],
    })
    expect(stdout()).toContain('built')
    expect(stdout()).toContain('tested')
    expect(stdout()).toContain('deploying')
  })
})

describe('table', () => {
  it('renders header row and data', () => {
    type Row = { name: string; status: string }
    table<Row>({
      columns: [
        { header: 'NAME', accessor: (r) => r.name },
        { header: 'STATUS', accessor: (r) => r.status },
      ],
      rows: [
        { name: 'web', status: 'running' },
        { name: 'api', status: 'failed' },
      ],
    })
    const out = stdout()
    expect(out).toContain('NAME')
    expect(out).toContain('STATUS')
    expect(out).toContain('web')
    expect(out).toContain('api')
    expect(out).toContain('running')
  })
})

describe('tree', () => {
  it('renders root and children', () => {
    tree({
      root: {
        label: 'project',
        children: [{ label: 'src' }, { label: 'package.json' }],
      },
    })
    const out = stdout()
    expect(out).toContain('project')
    expect(out).toContain('src')
    expect(out).toContain('package.json')
  })
})

describe('diff', () => {
  it('renders added/removed/unchanged lines', () => {
    diff({
      lines: [
        { kind: 'unchanged', text: 'host: api' },
        { kind: 'removed', text: 'port: 80' },
        { kind: 'added', text: 'port: 443' },
      ],
    })
    const out = stdout()
    expect(out).toContain('host: api')
    expect(out).toContain('port: 80')
    expect(out).toContain('port: 443')
  })
})

describe('codeBlock', () => {
  it('renders the code with line numbers', () => {
    codeBlock("const a = 1\nconst b = 2", { language: 'ts' })
    const out = stdout()
    expect(out).toContain('const a = 1')
    expect(out).toContain('const b = 2')
    expect(out).toContain('ts')
  })
})

describe('progress', () => {
  it('renders a bar with percent text', () => {
    progress({ value: 50, total: 100, label: 'Build' })
    const out = stdout()
    expect(out).toContain('Build')
    expect(out).toMatch(/50/)
  })
})

describe('step', () => {
  it('renders every step label', () => {
    step({
      steps: [
        { label: 'Validate', status: 'done' },
        { label: 'Build', status: 'active' },
        { label: 'Deploy', status: 'pending' },
      ],
    })
    const out = stdout()
    expect(out).toContain('Validate')
    expect(out).toContain('Build')
    expect(out).toContain('Deploy')
  })
})

describe('log', () => {
  it('writes a single entry to stdout', () => {
    log({ message: 'server started on 3000' })
    expect(stdout()).toContain('server started on 3000')
  })

  it('routes error level to stderr', () => {
    log({ message: 'connection refused', level: 'error' })
    expect(stderr()).toContain('connection refused')
  })
})

describe('columns', () => {
  it('renders content from each column', () => {
    columns({
      items: [
        { title: 'A', content: 'left side' },
        { title: 'B', content: 'right side' },
      ],
    })
    expect(stdout()).toContain('left side')
    expect(stdout()).toContain('right side')
  })
})

describe('panel', () => {
  it('renders a bordered box with title and body', () => {
    panel({ title: 'Status', body: 'all systems nominal' })
    const out = stdout()
    expect(out).toContain('Status')
    expect(out).toContain('all systems nominal')
  })

  it('accepts an array body', () => {
    panel({ body: ['line one', 'line two'] })
    expect(stdout()).toContain('line one')
    expect(stdout()).toContain('line two')
  })
})

describe('jsonViewer', () => {
  it('renders nested object values', () => {
    jsonViewer({ data: { name: 'caret', count: 42, tags: ['cli', 'design'] } })
    const out = stdout()
    expect(out).toContain('name')
    expect(out).toContain('caret')
    expect(out).toContain('42')
    expect(out).toContain('cli')
  })
})

describe('snippet', () => {
  it('renders single-line code', () => {
    snippet({ code: 'caret init my-cli', language: 'sh' })
    expect(stdout()).toContain('caret init my-cli')
  })

  it('renders multi-line code with line numbers by default', () => {
    snippet({ code: "import x\nuse(x)" })
    const out = stdout()
    expect(out).toContain('import x')
    expect(out).toContain('use(x)')
  })
})

describe('calendar', () => {
  it('renders the requested month and year', () => {
    calendar({ month: 5, year: 2026, marked: [12, 19] })
    const out = stdout()
    // The header is tracked CAPS ("M A Y   2 0 2 6"); the day grid is not.
    expect(out).toContain('2 0 2 6')
    expect(out).toMatch(/\b12\b/)
    expect(out).toMatch(/\b19\b/)
  })
})

describe('heatmap', () => {
  it('renders cells for a 2D dataset', () => {
    heatmap({
      data: [
        [0.1, 0.5, 0.9],
        [0.4, 0.2, 0.7],
      ],
      rowLabels: ['A', 'B'],
      colLabels: ['x', 'y', 'z'],
    })
    const out = stdout()
    expect(out).toContain('A')
    expect(out).toContain('B')
    expect(out).toContain('x')
    expect(out.length).toBeGreaterThan(10)
  })
})

describe('chat', () => {
  it('renders messages from each role', () => {
    chat({
      messages: [
        { role: 'user', content: 'how do I install?' },
        { role: 'assistant', content: 'run npx caret init' },
      ],
    })
    const out = stdout()
    expect(out).toContain('how do I install?')
    expect(out).toContain('run npx caret init')
  })
})

describe('help', () => {
  it('renders the program name and a command list', () => {
    help({
      name: 'my-cli',
      description: 'Tiny tool',
      commands: [
        { name: 'init', description: 'scaffold a project' },
        { name: 'add', description: 'add a component' },
      ],
    })
    const out = stdout()
    expect(out).toContain('my-cli')
    expect(out).toContain('init')
    expect(out).toContain('add')
    expect(out).toContain('scaffold a project')
  })
})

describe('markdown', () => {
  it('renders headings and inline code', () => {
    markdown('# Caret\n\nUse `caret init` to start.\n')
    const out = stdout()
    // H1 is rendered as tracked CAPS, body is plain.
    expect(out).toContain('C A R E T')
    expect(out).toContain('caret init')
  })
})

describe('stats', () => {
  it('renders label/value pairs', () => {
    stats({
      items: [
        { label: 'Requests', value: '12.4k', trend: 'up', delta: '+8%' },
        { label: 'Errors', value: '3', trend: 'down' },
      ],
    })
    const out = stdout()
    // Labels are tracked CAPS; values are not.
    expect(out).toContain('R E Q U E S T S')
    expect(out).toContain('E R R O R S')
    expect(out).toContain('12.4k')
  })
})

describe('timeline', () => {
  it('renders every event title', () => {
    timeline({
      events: [
        { time: '10:00', title: 'Build started' },
        { time: '10:02', title: 'Tests passed', kind: 'success' },
        { time: '10:03', title: 'Deploy failed', kind: 'failure' },
      ],
    })
    const out = stdout()
    expect(out).toContain('Build started')
    expect(out).toContain('Tests passed')
    expect(out).toContain('Deploy failed')
  })
})

describe('brailleChart', () => {
  it('renders bar mode', () => {
    brailleChart({ mode: 'bar', values: [1, 3, 2, 5, 4] })
    expect(stdout().length).toBeGreaterThan(0)
  })

  it('renders heatmap mode', () => {
    brailleChart({
      mode: 'heatmap',
      data: [
        [0.1, 0.4],
        [0.7, 0.9],
      ],
    })
    expect(stdout().length).toBeGreaterThan(0)
  })
})

describe('waveform', () => {
  it('renders sample data without throwing', () => {
    const samples = Array.from({ length: 32 }, (_, i) => Math.sin(i / 4))
    waveform({ values: samples, width: 16, height: 8 })
    expect(stdout().length).toBeGreaterThan(0)
  })
})

describe('flamegraph', () => {
  it('renders a stack of frames', () => {
    flamegraph({
      stacks: [
        { label: 'main', value: 1.0 },
        { label: 'render', value: 0.6 },
        { label: 'paint', value: 0.2 },
      ],
      width: 30,
    })
    const out = stdout()
    expect(out).toContain('main')
    expect(out).toContain('render')
  })
})

describe('qrcode', () => {
  it('renders a QR matrix and an optional label', () => {
    qrcode({ data: 'https://caret.dev', label: 'caret.dev' })
    const out = stdout()
    expect(out).toContain('caret.dev')
    expect(out.length).toBeGreaterThan(50) // matrix takes real width
  })
})

describe('gauge', () => {
  it('renders a value and a label', () => {
    gauge({ value: 0.7, label: 'CPU', width: 12 })
    expect(stdout()).toContain('CPU')
  })

  it('clamps out-of-range values', () => {
    expect(() => gauge({ value: -0.5, width: 8 })).not.toThrow()
    expect(() => gauge({ value: 2.0, width: 8 })).not.toThrow()
  })
})

describe('radar', () => {
  it('renders with three axes', () => {
    radar({
      axes: ['perf', 'cost', 'risk'],
      values: [0.8, 0.4, 0.2],
      width: 16,
    })
    const out = stdout()
    expect(out).toContain('perf')
    expect(out).toContain('cost')
    expect(out).toContain('risk')
  })
})

describe('dashboard', () => {
  it('lays out cells in a grid', () => {
    dashboard({
      cells: [
        { title: 'Uptime', content: '99.98%' },
        { title: 'p95', content: '142ms' },
      ],
      cols: 2,
      width: 60,
    })
    const out = stdout()
    // Cell titles are tracked CAPS; cell contents are plain.
    expect(out).toContain('U P T I M E')
    expect(out).toContain('99.98%')
    expect(out).toContain('142ms')
  })
})

describe('space', () => {
  it('writes a single newline by default', () => {
    space()
    expect(stdoutChunks.join('')).toBe('\n')
  })

  it('writes N newlines when count > 1', () => {
    space(3)
    expect(stdoutChunks.join('')).toBe('\n\n\n')
  })
})
