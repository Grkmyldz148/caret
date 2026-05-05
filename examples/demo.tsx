/**
 * Caret demo — the full tour
 *
 *   pnpm demo
 *
 * Walks through every Caret component in one continuous run, with brief
 * pauses between sections. Non-interactive — interactive components
 * (form, modal, prompt) are listed at the end with their own commands.
 */

import {
  splash,
  banner,
  divider,
  // Messages
  info,
  success,
  warning,
  error,
  debug,
  // Display
  list,
  keyValue,
  tree,
  table,
  diff,
  paragraph,
  quote,
  codeBlock,
  alert,
  checklist,
  statusLine,
  // Inline
  badge,
  kbd,
  code,
  link,
  sparkline,
  breadcrumb,
  timeAgo,
  // Progress
  progress,
  step,
  // Async
  boot,
  spinner,
  toast,
  // Animation
  typewriter,
  reveal,
  // Utility
  sleep,
} from '@caret/registry'

async function section(title: string): Promise<void> {
  await sleep(700)
  process.stdout.write('\n')
  divider({ label: title, align: 'left' })
  process.stdout.write('\n')
  await sleep(250)
}

async function main(): Promise<void> {
  // ── 1. SPLASH ──────────────────────────────────────────
  await splash({
    logo: { text: 'caret' },
    title: 'Caret',
    subtitle: 'A complete tour of every component',
    duration: 'normal',
  })
  await sleep(500)

  // ── 2. MESSAGES ────────────────────────────────────────
  await section('Messages')
  info('Cache cleared')
  success('Build complete')
  warning('Deprecated config syntax — see migration guide')
  debug('Fetched 47 records in 12ms')
  process.stdout.write('\n')
  error('Failed to deploy to production', {
    body: 'The Vercel API returned 401 Unauthorized.',
    hint: 'Your API token may have expired. Run `my-cli login` to refresh it.',
    see: 'https://my-cli.dev/docs/auth',
  })

  // ── 3. INLINE ELEMENTS ─────────────────────────────────
  await section('Inline elements')
  process.stdout.write(
    `Status:  ${badge('production', { color: 'danger' })}  ${badge('v2.4.1', { color: 'info' })}  ${badge('passing', { color: 'success' })}  ${badge('beta', { color: 'warning' })}\n`,
  )
  process.stdout.write('\n')
  process.stdout.write(`Run ${code('caret init')} to scaffold a new project.\n`)
  process.stdout.write(`Press ${kbd('Ctrl+C')} to cancel, ${kbd('↵')} to confirm.\n`)
  process.stdout.write(
    `Read the ${link('https://caret.dev/docs', 'docs')} or check ${link('https://github.com/gorkemyildiz/caret', 'github.com/gorkemyildiz/caret')}.\n`,
  )
  process.stdout.write('\n')
  process.stdout.write(
    `Path:    ${breadcrumb(['caret', 'registry', 'components', 'alert.ts'])}\n`,
  )
  process.stdout.write(
    `Trend:   ${sparkline([1, 2, 4, 7, 8, 6, 3, 2, 5, 9, 8, 4])}  CPU usage (last 12 samples)\n`,
  )

  // ── 4. PARAGRAPH ───────────────────────────────────────
  await section('Paragraph')
  paragraph(
    'Caret is the design system for modern command-line tools. It gives your CLI the taste and polish of a design-led product, out of the box. Components copy into your project, you own the code, and the visual identity is consistent across every Caret-built tool.',
    { width: 70 },
  )

  // ── 5. QUOTE ───────────────────────────────────────────
  await section('Quote')
  quote(
    'Tip: enable auto-rollback in .deploy.toml to revert\nautomatically if health checks fail within 5 minutes.',
    { color: 'accent' },
  )

  // ── 5a. ALERT ──────────────────────────────────────────
  await section('Alert')
  alert({
    kind: 'warning',
    title: 'Deprecated API',
    body: 'The legacy auth flow will be removed in v3.0. Migrate to OAuth2 before the end of the quarter.',
  })

  // ── 6. LIST ────────────────────────────────────────────
  await section('List')
  list({
    items: [
      { label: 'Authentication', description: 'Sign in with email or OAuth' },
      { label: 'Database', description: 'PostgreSQL on Neon' },
      { label: 'Email', description: 'Transactional via Resend' },
    ],
    variant: 'arrow',
  })

  // ── 7. KEY-VALUE ───────────────────────────────────────
  await section('Key Value')
  const deployedAt = new Date(Date.now() - 1000 * 60 * 42) // 42 minutes ago
  keyValue({
    rows: [
      { key: 'Project', value: `caret  ${badge('production', { color: 'danger' })}` },
      { key: 'Environment', value: 'production' },
      { key: 'Region', value: 'us-east-1' },
      { key: 'Version', value: '0.1.0' },
      { key: 'Components', value: 31 },
      { key: 'Last deploy', value: timeAgo(deployedAt) },
      { key: 'Requests/s', value: `${sparkline([42, 48, 56, 72, 88, 94, 82, 76, 68, 71])}  68` },
    ],
  })

  // ── 7a. CHECKLIST ──────────────────────────────────────
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

  // ── 8. TREE ────────────────────────────────────────────
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

  // ── 9. TABLE ───────────────────────────────────────────
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

  // ── 10. DIFF ────────────────────────────────────────────
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

  // ── 11. CODE BLOCK ─────────────────────────────────────
  await section('Code block')
  codeBlock(
    `import { prompt, success } from '@caret/registry'

const name = await prompt.text({
  label: 'Project name',
})

success(\`Created \${name}\`)`,
    { language: 'ts' },
  )

  // ── 12. PROGRESS ───────────────────────────────────────
  await section('Progress')
  progress({ value: 25, total: 100, label: 'Phase 1' })
  progress({ value: 50, total: 100, label: 'Phase 2' })
  progress({ value: 75, total: 100, label: 'Phase 3' })
  progress({ value: 100, total: 100, label: 'Done   ' })

  // ── 13. STEP ───────────────────────────────────────────
  await section('Step')
  step({
    steps: [
      { label: 'Validate inputs', status: 'done' },
      { label: 'Run tests', status: 'done' },
      { label: 'Compile assets', status: 'done' },
      { label: 'Deploy to production', status: 'active' },
      { label: 'Run smoke tests', status: 'pending' },
      { label: 'Send notification', status: 'pending' },
    ],
  })

  // ── 13a. STATUS LINE ───────────────────────────────────
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

  // ── 14. TYPEWRITER ─────────────────────────────────────
  await section('Typewriter')
  await typewriter('Welcome to Caret v0.1.0')

  // ── 15. REVEAL ─────────────────────────────────────────
  await section('Reveal')
  await reveal([
    'Initializing Caret CLI…',
    'Loading registry manifest…',
    'Verifying component integrity…',
    'Connecting to caret.dev…',
    'Ready.',
  ])

  // ── 16. BOOT ───────────────────────────────────────────
  await section('Boot sequence')
  await boot({
    steps: [
      { label: 'Loading configuration', task: () => sleep(450) },
      { label: 'Connecting to API', task: () => sleep(550) },
      { label: 'Authenticating user', task: () => sleep(350) },
      { label: 'Warming local caches', task: () => sleep(400) },
    ],
  })

  // ── 17. SPINNER (success) ──────────────────────────────
  await section('Spinner — success')
  await spinner(
    'Deploying to production',
    async () => {
      await sleep(1500)
    },
    { onSuccess: 'Deployed to production' },
  )

  // ── 18. SPINNER (failure) ──────────────────────────────
  await sleep(400)
  await section('Spinner — failure')
  try {
    await spinner(
      'Uploading artifacts',
      async () => {
        await sleep(800)
        throw new Error('Network timeout')
      },
      { onFailure: 'Upload failed' },
    )
  } catch {
    // expected
  }

  // ── 19. TOAST ──────────────────────────────────────────
  await section('Toast')
  await toast.info('Loading workspace', { duration: 1200 })
  await sleep(200)
  await toast.success('File saved', { duration: 1200 })
  await sleep(200)
  await toast.warning('Connection lost', { duration: 1200 })
  await sleep(200)
  await toast.error('Build failed', { duration: 1200 })

  // ── 20. BANNER ─────────────────────────────────────────
  await section('Banner')
  banner({
    title: 'Tour complete',
    subtitle: '31 components, one design system',
  })

  // ── FINALE ─────────────────────────────────────────────
  await sleep(500)
  process.stdout.write('\n')
  success('All non-interactive components rendered')
  process.stdout.write('\n')

  paragraph(
    'Three components are interactive and would block this non-interactive tour. To test them separately, run any of these:',
    { width: 70 },
  )
  process.stdout.write('\n')
  process.stdout.write(
    `  ${kbd('pnpm --filter @caret/examples prompt:all')}    ${badge('6 prompt variants', { color: 'info' })}\n`,
  )
  process.stdout.write(
    `  ${kbd('pnpm --filter @caret/examples form')}          ${badge('multi-field form', { color: 'info' })}\n`,
  )
  process.stdout.write(
    `  ${kbd('pnpm --filter @caret/examples modal')}         ${badge('confirmation overlay', { color: 'info' })}\n`,
  )
  process.stdout.write('\n')
  process.stdout.write(
    `Or see Caret in a realistic flow: ${kbd('pnpm fake-deploy')}\n`,
  )
  process.stdout.write('\n')
}

main().catch((err: unknown) => {
  process.stderr.write(`${err instanceof Error ? err.stack ?? err.message : String(err)}\n`)
  process.exit(1)
})
