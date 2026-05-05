/**
 * Notification test — demo
 *
 *   pnpm --filter @caret/examples notify-test
 *
 * Starts a prompt with a 3-second notify delay. Switch to another app
 * within 3 seconds — you should get an OS notification saying
 * "Waiting for input: Your name".
 *
 * Then answer the prompt. A spinner runs for 4 seconds with
 * notifyOnComplete enabled (threshold 2s) — switch away again to
 * test the completion notification.
 */

import { prompt, spinner } from '@caret/registry/components/index.js'

async function main() {
  process.stdout.write('📋 Test 1: Prompt notification\n')
  process.stdout.write('   Switch to another app within 3 seconds...\n\n')

  try {
    const name = await prompt.text({
      label: 'Your name',
      notifyOnWait: { delay: 3000 },
    })

    process.stdout.write(`\n✓ Got: ${name}\n\n`)
  } catch {
    process.stdout.write('\n— Cancelled\n\n')
  }

  process.stdout.write('📋 Test 2: Spinner completion notification\n')
  process.stdout.write('   Switch to another app — notification fires when done...\n\n')

  await spinner(
    'Doing work',
    async () => {
      await new Promise((r) => setTimeout(r, 4000))
    },
    { notifyOnComplete: { threshold: 2000 } },
  )

  process.stdout.write('\n📋 Test 3: Modal notification\n')
  process.stdout.write('   Switch to another app within 3 seconds...\n\n')

  const { modal } = await import('@caret/registry/components/index.js')

  try {
    const action = await modal({
      title: 'Test modal',
      body: 'Switch away — you should get a notification in 3 seconds.',
      actions: [
        { label: 'OK', value: 'ok' },
        { label: 'Cancel', value: 'cancel' },
      ],
      notifyOnWait: { delay: 3000 },
    })

    process.stdout.write(`\n✓ Action: ${action}\n`)
  } catch {
    process.stdout.write('\n— Cancelled\n')
  }

  process.stdout.write('\nAll notification tests done.\n')
}

main().catch(console.error)
