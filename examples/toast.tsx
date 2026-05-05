/**
 * Caret toast — demo
 *
 *   pnpm --filter @caret/examples toast
 */

import { toast, sleep } from '@caret/registry'

async function main(): Promise<void> {
  process.stdout.write('Loading state…\n')
  await toast.info('Loading workspace', { duration: 1500 })

  process.stdout.write('\nSaving file…\n')
  await toast.success('File saved', { duration: 1500 })

  process.stdout.write('\nDisconnect detected…\n')
  await toast.warning('Connection lost', { duration: 1500 })

  process.stdout.write('\nFinal failure…\n')
  await toast.error('Build failed', { duration: 1500 })

  process.stdout.write('\nAll toasts shown.\n')
}

main()
