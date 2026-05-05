/**
 * Caret fake-deploy — a realistic CLI flow demo
 *
 *   pnpm --filter @caret/examples fake-deploy
 *
 * Simulates a complete deploy CLI experience using nearly every Caret
 * component organically — splash, banner, boot sequence, keyValue, diff,
 * spinner with label updates, step indicator, kbd, badge, link, paragraph,
 * info/success/warning/error. This is what a real Caret-built CLI feels
 * like end to end.
 */

import {
  splash,
  banner,
  boot,
  spinner,
  keyValue,
  diff,
  step,
  divider,
  paragraph,
  info,
  success,
  warning,
  link,
  kbd,
  badge,
  code,
  quote,
  sleep,
} from '@caret/registry'

async function main(): Promise<void> {
  // ── 1. Splash ──────────────────────────────────────────
  await splash({
    logo: { text: 'deploy' },
    title: 'Deploy CLI',
    subtitle: 'Ship your project to production',
  })

  // ── 2. Boot sequence ───────────────────────────────────
  await boot({
    steps: [
      { label: 'Loading config from .deploy.toml', task: () => sleep(450) },
      { label: 'Authenticating with deploy.dev',   task: () => sleep(550) },
      { label: 'Fetching workspace state',         task: () => sleep(400) },
    ],
  })

  await sleep(400)
  process.stdout.write('\n')

  // ── 3. Current state ───────────────────────────────────
  divider({ label: 'Current state' })
  process.stdout.write('\n')
  keyValue({
    rows: [
      { key: 'Project',     value: `my-app  ${badge('production', { color: 'danger' })}` },
      { key: 'Branch',      value: 'main' },
      { key: 'Commit',      value: 'abc1234 — feat: new prompt component' },
      { key: 'Last deploy', value: '2 hours ago' },
    ],
  })

  await sleep(500)
  process.stdout.write('\n')

  // ── 4. Pending changes ─────────────────────────────────
  divider({ label: 'Changes since last deploy' })
  process.stdout.write('\n')
  diff({
    lines: [
      { kind: 'added',     text: 'src/api/users.ts' },
      { kind: 'added',     text: 'src/api/users.test.ts' },
      { kind: 'removed',   text: 'src/api/legacy.ts' },
      { kind: 'unchanged', text: 'src/index.ts' },
      { kind: 'added',     text: 'package.json' },
    ],
  })

  await sleep(500)
  process.stdout.write('\n')

  // ── 5. Pre-deploy info ────────────────────────────────
  info(`This will replace ${code('my-app.deploy.dev')} — ${badge('zero-downtime', { color: 'info' })}`)
  await sleep(300)
  warning('Build cache is older than 24 hours and will be rebuilt')
  await sleep(500)
  process.stdout.write('\n')

  // ── 6. Deploy phase ────────────────────────────────────
  divider({ label: 'Deploying' })
  process.stdout.write('\n')

  await spinner('Building application', async () => {
    await sleep(1500)
  }, { onSuccess: 'Application built · 342 KB' })

  await spinner('Running tests', async (s) => {
    await sleep(400)
    s.update('Running unit tests (47/120)')
    await sleep(400)
    s.update('Running unit tests (96/120)')
    await sleep(400)
    s.update('Running integration tests')
    await sleep(500)
  }, { onSuccess: 'All 134 tests passed' })

  await spinner('Uploading artifacts', async (s) => {
    s.update('Uploading 1/4 — index.html')
    await sleep(350)
    s.update('Uploading 2/4 — bundle.js')
    await sleep(450)
    s.update('Uploading 3/4 — bundle.css')
    await sleep(350)
    s.update('Uploading 4/4 — assets/')
    await sleep(450)
  }, { onSuccess: 'Artifacts uploaded' })

  await spinner('Provisioning resources', async () => {
    await sleep(1200)
  }, { onSuccess: 'Resources ready' })

  await spinner('Switching production traffic', async () => {
    await sleep(800)
  }, { onSuccess: 'Traffic switched' })

  await sleep(400)
  process.stdout.write('\n')

  // ── 7. Pipeline summary ────────────────────────────────
  step({
    steps: [
      { label: 'Build',                  status: 'done' },
      { label: 'Test',                   status: 'done' },
      { label: 'Upload',                 status: 'done' },
      { label: 'Provision',              status: 'done' },
      { label: 'Switch traffic',         status: 'done' },
      { label: 'Smoke test (deferred)',  status: 'skipped' },
    ],
  })

  await sleep(500)
  process.stdout.write('\n')

  // ── 8. Result ──────────────────────────────────────────
  success('Deployed to production in 2m 18s')
  await sleep(300)
  process.stdout.write('\n')

  // ── 9. Summary ─────────────────────────────────────────
  banner({
    title: 'Deployment complete',
    subtitle: 'my-app v2.4.1 is live',
  })
  process.stdout.write('\n')

  keyValue({
    rows: [
      { key: 'URL',         value: link('https://my-app.deploy.dev', 'my-app.deploy.dev') },
      { key: 'Build time',  value: '2m 18s' },
      { key: 'Bundle size', value: '342 KB' },
      { key: 'Region',      value: 'us-east-1' },
      { key: 'Logs',        value: link('https://deploy.dev/logs/abc123', 'deploy.dev/logs/abc123') },
    ],
  })

  await sleep(400)
  process.stdout.write('\n')

  // ── 10. Next steps ─────────────────────────────────────
  divider({ label: 'Next steps' })
  process.stdout.write('\n')
  paragraph(
    'Your deployment is live and serving traffic. Run the commands below to monitor or roll back if needed.',
    { width: 70 },
  )
  process.stdout.write('\n')
  process.stdout.write(`  ${kbd('deploy logs')}      Stream live application logs\n`)
  process.stdout.write(`  ${kbd('deploy status')}    Check current deployment health\n`)
  process.stdout.write(`  ${kbd('deploy rollback')}  Roll back to the previous version\n`)
  process.stdout.write('\n')

  quote(
    'Tip: enable auto-rollback in .deploy.toml to revert\nautomatically if health checks fail within 5 minutes.',
    { color: 'accent' },
  )
  process.stdout.write('\n')
}

main().catch((err: unknown) => {
  process.stderr.write(`${err instanceof Error ? err.stack ?? err.message : String(err)}\n`)
  process.exit(1)
})
