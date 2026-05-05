/**
 * Caret boot — demo
 *
 *   pnpm --filter @caret/examples boot
 *
 * systemd-style sequential loader: each step transitions from pending
 * to active to done (or failed). The whole sequence stays visible in
 * the scrollback at the end.
 */

import { boot, sleep } from '@caret/registry'

function task(ms: number, shouldFail = false): () => Promise<void> {
  return async () => {
    await sleep(ms)
    if (shouldFail) throw new Error('Task failed')
  }
}

async function main(): Promise<void> {
  await boot({
    steps: [
      { label: 'Loading configuration',     task: task(600) },
      { label: 'Connecting to API',          task: task(800) },
      { label: 'Authenticating user',        task: task(500) },
      { label: 'Fetching workspace state',   task: task(700) },
      { label: 'Warming local caches',       task: task(400) },
      { label: 'Initializing plugins',       task: task(600) },
    ],
  })
}

main().catch(() => {
  process.exit(1)
})
