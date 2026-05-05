/**
 * Caret modal — demo
 *
 *   pnpm --filter @caret/examples modal
 */

import { modal, success, info } from '@caret/registry'

async function main(): Promise<void> {
  const action = await modal({
    title: 'Confirm deletion',
    body: 'This will permanently delete 47 files from production.\nThis action cannot be undone.',
    actions: [
      { label: 'Cancel', value: 'cancel' },
      { label: 'Delete', value: 'delete', danger: true },
    ],
  })

  process.stdout.write('\n')
  if (action === 'delete') {
    success('Files deleted')
  } else if (action === 'cancel') {
    info('Cancelled — no files deleted')
  } else {
    info('Dismissed (esc)')
  }
}

main().catch((err: unknown) => {
  process.stderr.write(`${err instanceof Error ? err.stack ?? err.message : String(err)}\n`)
  process.exit(1)
})
