/**
 * Caret kitchen sink — every component, one runnable.
 *
 *   pnpm --filter @caret/examples kitchen
 *
 * Walks through every non-blocking Caret component in one continuous
 * tour. Animations use short durations (≤ 600 ms) so the whole run
 * finishes in under a minute.
 *
 * Truly interactive components (prompt.*, search, pager, file-picker,
 * form, modal, tabs, accordion, slider, toggle, etc.) would block on
 * keypresses — they get listed at the end with their own commands.
 */

import {
  // Opening / animation
  splash,
  banner,
  divider,
  typewriter,
  reveal,
  boot,
  smartTypewriter,
  brailleTransition,
  morph,
  // Messages
  info,
  success,
  warning,
  error,
  debug,
  // Inline / string-returning
  badge,
  kbd,
  code,
  link,
  sparkline,
  breadcrumb,
  avatar,
  timestamp,
  timeAgo,
  gradient,
  // Block display
  paragraph,
  quote,
  alert,
  list,
  checklist,
  keyValue,
  stats,
  tree,
  table,
  diff,
  codeBlock,
  snippet,
  progress,
  step,
  statusLine,
  log,
  columns,
  panel,
  jsonViewer,
  calendar,
  chat,
  help,
  markdown,
  timeline,
  // Visualisations
  brailleChart,
  waveform,
  gauge,
  radar,
  flamegraph,
  heatmap,
  qrcode,
  dashboard,
  // Async
  spinner,
  toast,
  countdown,
  // Effects
  confetti,
  // Utility
  space,
  sleep,
} from '@caret/registry'

// ── helpers ─────────────────────────────────────────────────────────

async function section(label: string): Promise<void> {
  await sleep(300)
  process.stdout.write('\n')
  divider({ label, align: 'left' })
  process.stdout.write('\n')
  await sleep(150)
}

// ── tour ────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  // 1. SPLASH ────────────────────────────────────────────────────────
  await splash({
    logo: { text: 'caret' },
    title: 'Caret kitchen sink',
    subtitle: 'every component, one runnable',
    duration: 'fast',
  })

  // 2. TYPEWRITER intro ──────────────────────────────────────────────
  await section('Typewriter')
  await typewriter('Welcome — every Caret component is below.')

  // 3. SMART TYPEWRITER ─────────────────────────────────────────────
  await section('Smart typewriter')
  await smartTypewriter(
    'This one types like a person: brief pauses after commas, longer ones at periods.',
    { speed: 'fast' },
  )

  // 4. REVEAL ────────────────────────────────────────────────────────
  await section('Reveal')
  await reveal([
    'Initialising registry…',
    'Loading theme tokens…',
    'Verifying capability…',
    'Ready.',
  ])

  // 5. BRAILLE TRANSITION ────────────────────────────────────────────
  await section('Braille transition')
  await brailleTransition({ text: 'caret · the cli design system', duration: 500 })

  // 6. MORPH ────────────────────────────────────────────────────────
  await section('Morph')
  await morph('loading…', 'ready.', { duration: 300 })

  // 7. BANNER ────────────────────────────────────────────────────────
  await section('Banner')
  banner({ title: 'My CLI', subtitle: 'v2.0.0 — production' })

  // 8. MESSAGES ──────────────────────────────────────────────────────
  await section('Messages')
  info('Cache cleared')
  success('Build complete')
  warning('Deprecated config syntax — see migration guide')
  debug('Fetched 47 records in 12ms')
  space()
  error('Failed to deploy', {
    body: 'The Vercel API returned 401 Unauthorized.',
    hint: 'Run `my-cli login` to refresh your token.',
    see: 'https://caret.dev/docs/auth',
  })

  // 9. INLINE PRIMITIVES ─────────────────────────────────────────────
  await section('Inline primitives')
  process.stdout.write(
    `Status:  ${badge('production', { color: 'danger' })}  ${badge('passing', { color: 'success' })}  ${badge('beta', { color: 'warning' })}  ${badge('v2.4.1', { color: 'info' })}\n`,
  )
  process.stdout.write('\n')
  process.stdout.write(`Run ${code('caret init')} to scaffold a new project.\n`)
  process.stdout.write(`Press ${kbd('Ctrl+C')} to cancel, ${kbd('↵')} to confirm.\n`)
  process.stdout.write(
    `Read the ${link('https://caret.dev/docs', 'docs')} or browse the ${link('https://github.com/gorkemyildiz/caret', 'source')}.\n`,
  )
  process.stdout.write('\n')
  process.stdout.write(`Path:    ${breadcrumb(['caret', 'registry', 'components', 'list.ts'])}\n`)
  process.stdout.write(`Trend:   ${sparkline([1, 2, 4, 7, 8, 6, 3, 2, 5, 9, 8, 4])}  CPU usage\n`)
  process.stdout.write('\n')
  process.stdout.write(
    `Author:  ${avatar('Görkem Yıldız')}  ${avatar('Jane Smith', { color: 'success' })}  ${avatar('AI', { color: 'info' })}\n`,
  )
  process.stdout.write(`Built:   ${timestamp({ format: 'full' })}\n`)
  process.stdout.write(`Updated: ${timeAgo(new Date(Date.now() - 1000 * 60 * 18))}\n`)
  process.stdout.write('\n')
  process.stdout.write(gradient('Caret · the design system for modern command-line tools') + '\n')

  // 10. PARAGRAPH & QUOTE ────────────────────────────────────────────
  await section('Paragraph')
  paragraph(
    'Caret is the design system for modern command-line tools. Components copy into your project, you own the code, and the visual identity is consistent across every Caret-built tool.',
    { width: 70 },
  )

  await section('Quote')
  quote(
    'Tip: enable auto-rollback in .deploy.toml to revert\nautomatically if health checks fail within 5 minutes.',
    { color: 'accent' },
  )

  // 11. ALERT ────────────────────────────────────────────────────────
  await section('Alert')
  alert({
    kind: 'warning',
    title: 'Deprecated API',
    body: 'The legacy auth flow will be removed in v3.0. Migrate to OAuth2.',
  })

  // 12. LIST & CHECKLIST ────────────────────────────────────────────
  await section('List')
  list({
    items: [
      { label: 'Authentication', description: 'Sign in with email or OAuth' },
      { label: 'Database', description: 'PostgreSQL on Neon' },
      { label: 'Email', description: 'Transactional via Resend' },
    ],
    variant: 'arrow',
  })

  await section('Checklist')
  checklist({
    items: [
      { label: 'Install dependencies', done: true },
      { label: 'Configure environment', done: true, description: '.env.local created' },
      { label: 'Run database migrations', done: true },
      { label: 'Seed initial data' },
      { label: 'Start development server', description: 'npm run dev' },
    ],
  })

  // 13. KEY-VALUE & STATS ───────────────────────────────────────────
  await section('Key Value')
  keyValue({
    rows: [
      { key: 'Project', value: `caret  ${badge('production', { color: 'danger' })}` },
      { key: 'Environment', value: 'production' },
      { key: 'Region', value: 'us-east-1' },
      { key: 'Version', value: '0.1.0' },
      { key: 'Last deploy', value: timeAgo(new Date(Date.now() - 1000 * 60 * 42)) },
      { key: 'Requests/s', value: `${sparkline([42, 48, 56, 72, 88, 94, 82, 76, 68, 71])}  68` },
    ],
  })

  await section('Stats')
  stats({
    items: [
      { label: 'Requests', value: '12.4k', trend: 'up', delta: '+8%' },
      { label: 'Errors', value: '3', trend: 'down', delta: '-50%' },
      { label: 'P95', value: '142ms', trend: 'neutral' },
    ],
  })

  // 14. TREE ─────────────────────────────────────────────────────────
  await section('Tree')
  tree({
    root: {
      label: 'caret',
      children: [
        {
          label: 'registry',
          children: [
            {
              label: 'components',
              children: [
                { label: 'prompt' },
                { label: 'spinner.tsx' },
                { label: 'splash.tsx' },
                { label: 'table.ts' },
              ],
            },
            { label: 'theme' },
            { label: 'lib' },
          ],
        },
        { label: 'specs' },
        { label: 'examples' },
      ],
    },
  })

  // 15. TABLE ────────────────────────────────────────────────────────
  await section('Table')
  type Row = { name: string; status: string; region: string; uptime: string; cpu: number }
  const rows: Row[] = [
    { name: 'web-frontend', status: 'running', region: 'us-east-1', uptime: '3d 4h', cpu: 12 },
    { name: 'api-server', status: 'running', region: 'us-east-1', uptime: '3d 4h', cpu: 38 },
    { name: 'worker-queue', status: 'starting', region: 'eu-west-1', uptime: '32s', cpu: 4 },
    { name: 'billing-svc', status: 'failed', region: 'us-east-1', uptime: '0s', cpu: 0 },
  ]
  table<Row>({
    columns: [
      { header: 'NAME', accessor: (r) => r.name },
      { header: 'STATUS', accessor: (r) => r.status },
      { header: 'REGION', accessor: (r) => r.region },
      { header: 'UPTIME', accessor: (r) => r.uptime },
      { header: 'CPU %', accessor: (r) => r.cpu, align: 'right' },
    ],
    rows,
    borders: true,
  })

  // 16. DIFF ─────────────────────────────────────────────────────────
  await section('Diff')
  diff({
    lines: [
      { kind: 'unchanged', text: 'host: api.example.com' },
      { kind: 'removed', text: 'port: 80' },
      { kind: 'added', text: 'port: 443' },
      { kind: 'unchanged', text: 'timeout: 30s' },
      { kind: 'removed', text: 'debug: true' },
      { kind: 'added', text: 'debug: false' },
    ],
  })

  // 17. CODE BLOCK ──────────────────────────────────────────────────
  await section('Code block')
  codeBlock(
    `import { prompt, success } from '@caret/registry'

const name = await prompt.text({
  label: 'Project name',
})

success(\`Created \${name}\`)`,
    { language: 'ts' },
  )

  // 18. SNIPPET ──────────────────────────────────────────────────────
  await section('Snippet')
  snippet({ code: 'caret add prompt && caret add spinner', language: 'sh' })

  // 19. PROGRESS / STEP / STATUS LINE ───────────────────────────────
  await section('Progress')
  progress({ value: 25, total: 100, label: 'Phase 1' })
  progress({ value: 50, total: 100, label: 'Phase 2' })
  progress({ value: 75, total: 100, label: 'Phase 3' })
  progress({ value: 100, total: 100, label: 'Done   ' })

  await section('Step')
  step({
    steps: [
      { label: 'Validate inputs', status: 'done' },
      { label: 'Run tests', status: 'done' },
      { label: 'Compile assets', status: 'done' },
      { label: 'Deploy to production', status: 'active' },
      { label: 'Run smoke tests', status: 'pending' },
    ],
  })

  await section('Status line')
  statusLine({
    items: [
      { label: 'built', status: 'done' },
      { label: 'tested', status: 'done' },
      { label: 'deploying', status: 'active' },
      { label: 'verified', status: 'pending' },
      { label: 'rollback-ready', status: 'skipped' },
    ],
  })

  // 20. LOG ──────────────────────────────────────────────────────────
  await section('Log')
  log({ message: 'Server started on port 3000' })
  log({ message: 'Connected to postgres', level: 'info', source: 'db' })
  log({ message: 'Slow query detected', level: 'warn', source: 'db' })
  log({ message: 'Connection refused', level: 'error', source: 'api' })

  // 21. COLUMNS & PANEL ─────────────────────────────────────────────
  await section('Columns')
  columns({
    items: [
      { title: 'Server A', content: 'CPU: 45%\nMem: 2.1GB\nUptime: 3d' },
      { title: 'Server B', content: 'CPU: 82%\nMem: 3.7GB\nUptime: 12h' },
    ],
    separator: true,
  })

  await section('Panel')
  panel({
    title: 'Build summary',
    body: ['Build time:   2.3s', 'Bundle size:  142kb gzipped', 'Status:       passed'],
  })

  // 22. JSON VIEWER ─────────────────────────────────────────────────
  await section('JSON viewer')
  jsonViewer({
    data: {
      name: 'caret',
      version: '0.1.0',
      tags: ['cli', 'design-system'],
      tokens: {
        colors: { accent: '#5882f7', success: '#3FBF6F' },
        motion: { duration: 200 },
      },
    },
  })

  // 23. CALENDAR ────────────────────────────────────────────────────
  await section('Calendar')
  calendar({ marked: [3, 15, 28] })

  // 24. CHAT ────────────────────────────────────────────────────────
  await section('Chat')
  chat({
    messages: [
      { role: 'user', content: 'How do I add the spinner component?' },
      { role: 'assistant', content: 'Run `caret add spinner` in your project root.' },
      { role: 'user', content: 'And the prompt?' },
      { role: 'assistant', content: 'Same — `caret add prompt`. You own the code afterwards.' },
    ],
  })

  // 25. HELP ────────────────────────────────────────────────────────
  await section('Help')
  help({
    name: 'caret',
    description: 'The design system for modern command-line tools.',
    usage: 'caret <command> [options]',
    commands: [
      { name: 'init', description: 'scaffold a new CLI with Caret preinstalled' },
      { name: 'add', description: 'copy a component into the current project' },
      { name: 'list', description: 'list every available component' },
    ],
    options: [
      { flags: '-h, --help', description: 'show this help' },
      { flags: '--no-color', description: 'disable color output' },
    ],
  })

  // 26. MARKDOWN ────────────────────────────────────────────────────
  await section('Markdown')
  markdown(
    `# Caret

A copy-paste design system for command-line tools.

- **Components** — copy into your project, you own the code.
- **Tokens** — colors, motion, symbols, typography.
- **A spec** — \`caret\` is portable beyond TypeScript.

> The web has shadcn/ui. The terminal has Caret.`,
    { width: 60 },
  )

  // 27. TIMELINE ────────────────────────────────────────────────────
  await section('Timeline')
  timeline({
    events: [
      { time: '10:00', title: 'Build started' },
      { time: '10:02', title: 'Tests passed', kind: 'success' },
      { time: '10:03', title: 'Deploying to production', body: 'us-east-1 · canary 10%' },
      { time: '10:04', title: 'Health checks failed', kind: 'failure', body: 'rolled back automatically' },
    ],
  })

  // 28. VISUALISATIONS ──────────────────────────────────────────────
  await section('Braille bar chart')
  brailleChart({ mode: 'bar', values: [3, 7, 4, 9, 6, 8, 5, 10, 7, 4, 6, 9] })

  await section('Waveform')
  const samples = Array.from({ length: 64 }, (_, i) => Math.sin(i / 4) * Math.exp(-i / 80))
  waveform({ values: samples, width: 32, height: 6 })

  await section('Gauge')
  gauge({ value: 0.72, label: 'CPU', width: 18 })

  await section('Radar')
  radar({
    axes: ['perf', 'cost', 'risk', 'fit', 'speed'],
    values: [0.8, 0.4, 0.2, 0.7, 0.6],
    width: 18,
  })

  await section('Flamegraph')
  flamegraph({
    stacks: [
      { label: 'main', value: 1.0 },
      { label: 'render', value: 0.7 },
      { label: 'paint', value: 0.4 },
      { label: 'flush', value: 0.15 },
    ],
    width: 36,
  })

  await section('Heatmap')
  heatmap({
    data: [
      [0.1, 0.4, 0.6, 0.8, 0.3],
      [0.2, 0.5, 0.9, 0.6, 0.2],
      [0.3, 0.7, 0.8, 0.4, 0.1],
    ],
    rowLabels: ['Mon', 'Tue', 'Wed'],
    colLabels: ['00h', '06h', '12h', '18h', '24h'],
  })

  await section('QR code')
  qrcode({ data: 'https://caret.dev', label: 'caret.dev' })

  await section('Dashboard')
  dashboard({
    cells: [
      { title: 'Requests', content: `${sparkline([42, 48, 56, 72, 88, 94, 82, 76, 68])}\n68 req/s` },
      { title: 'Errors', content: `${sparkline([3, 5, 2, 1, 4, 1, 0, 2, 1])}\n1 / min` },
      { title: 'CPU', content: 'web   12%\napi   38%\nwk     4%' },
      { title: 'Status', content: 'web    running\napi    running\nwk     failed' },
    ],
    cols: 2,
    width: 70,
  })

  // 29. ASYNC WRAPPERS ──────────────────────────────────────────────
  await section('Boot sequence')
  await boot({
    steps: [
      { label: 'Loading configuration', task: () => sleep(250) },
      { label: 'Connecting to API', task: () => sleep(300) },
      { label: 'Authenticating user', task: () => sleep(200) },
      { label: 'Warming local caches', task: () => sleep(250) },
    ],
  })

  await section('Spinner — success')
  await spinner(
    'Deploying to production',
    async () => {
      await sleep(800)
    },
    { onSuccess: 'Deployed to production' },
  )

  await sleep(200)
  await section('Spinner — failure')
  try {
    await spinner(
      'Uploading artifacts',
      async () => {
        await sleep(600)
        throw new Error('Network timeout')
      },
      { onFailure: 'Upload failed' },
    )
  } catch {
    // expected
  }

  await section('Toast')
  await toast.info('Loading workspace', { duration: 800 })
  await sleep(120)
  await toast.success('File saved', { duration: 800 })
  await sleep(120)
  await toast.warning('Connection lost', { duration: 800 })
  await sleep(120)
  await toast.error('Build failed', { duration: 800 })

  await section('Countdown')
  await countdown({ seconds: 3, label: 'starting in' })

  // 30. EFFECTS ─────────────────────────────────────────────────────
  await section('Confetti')
  await confetti({ duration: 800, density: 25, width: 50, height: 8 })

  // ── INTERACTIVE COMPONENTS — listed, not run ──────────────────────
  await sleep(200)
  process.stdout.write('\n')
  banner({ title: 'Interactive components', subtitle: 'run any of these on their own' })
  process.stdout.write('\n')
  paragraph(
    'These components block on keypresses, so they are listed below with their own commands. Each prints to your terminal in a real REPL session.',
    { width: 72 },
  )
  process.stdout.write('\n')

  list({
    variant: 'dash',
    items: [
      { label: 'prompt.text / password / number / confirm / select / multi-select / autocomplete / editor', description: 'pnpm --filter @caret/examples prompt:all' },
      { label: 'form — multi-field input', description: 'pnpm --filter @caret/examples form' },
      { label: 'modal — confirmation overlay', description: 'pnpm --filter @caret/examples modal' },
      { label: 'search — fuzzy filter over a list', description: 'pnpm --filter @caret/examples search' },
      { label: 'pager — scroll through long content', description: 'pnpm --filter @caret/examples pager' },
      { label: 'autocomplete — search-and-pick', description: 'pnpm --filter @caret/examples autocomplete' },
      { label: 'editor — multi-line input', description: 'pnpm --filter @caret/examples editor' },
      { label: 'fake-deploy — Caret in a realistic flow', description: 'pnpm fake-deploy' },
    ],
  })

  process.stdout.write('\n')
  paragraph(
    'Components without a dedicated example yet (tabs, toggle, accordion, slider, file-picker, command-palette, context-menu, virtualized-list, scrollable, split-pane) ship in the registry and will gain runnable demos in a later phase.',
    { width: 72 },
  )

  // ── FINALE ────────────────────────────────────────────────────────
  await sleep(400)
  process.stdout.write('\n')
  banner({ title: 'Tour complete', subtitle: '~50 components, one design system' })
  process.stdout.write('\n')
}

main().catch((err: unknown) => {
  process.stderr.write(`${err instanceof Error ? (err.stack ?? err.message) : String(err)}\n`)
  process.exit(1)
})
