/**
 * Caret spinner — demo
 *
 *   pnpm --filter @caret/examples spinner
 */

import { spinner } from '@caret/registry/components/index.js'

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

async function main(): Promise<void> {
  // Simple wrapped form
  await spinner('Connecting to database', async () => {
    await sleep(1500)
  })

  // With label updates and explicit success message
  await spinner(
    'Preparing build',
    async (s) => {
      await sleep(700)
      s.update('Compiling TypeScript')
      await sleep(900)
      s.update('Bundling assets')
      await sleep(700)
    },
    { onSuccess: 'Build complete' },
  )

  // Failure path
  try {
    await spinner('Uploading artifacts', async () => {
      await sleep(800)
      throw new Error('Network timeout')
    }, { onFailure: 'Upload failed' })
  } catch {
    // expected
  }

  process.stdout.write('\nDone.\n')
}

main().catch((err: unknown) => {
  process.stderr.write(`${err instanceof Error ? err.stack ?? err.message : String(err)}\n`)
  process.exit(1)
})
