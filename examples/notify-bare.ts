/**
 * Bare notification test — fires 3 notification types with sound.
 *
 *   pnpm --filter @caret/examples notify-bare
 */

import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

async function main() {
  console.log('Test 1: "waiting" notification (Glass sound)...')
  await execAsync(
    `osascript -e 'display notification "Waiting for input: Your name" with title "Caret" sound name "Glass"'`,
  )
  console.log('  → Sent. Did you hear Glass?\n')

  await new Promise((r) => setTimeout(r, 2000))

  console.log('Test 2: "done" notification (Hero sound)...')
  await execAsync(
    `osascript -e 'display notification "Build complete" with title "Caret" sound name "Hero"'`,
  )
  console.log('  → Sent. Did you hear Hero?\n')

  await new Promise((r) => setTimeout(r, 2000))

  console.log('Test 3: "error" notification (Basso sound)...')
  await execAsync(
    `osascript -e 'display notification "Build failed" with title "Caret" sound name "Basso"'`,
  )
  console.log('  → Sent. Did you hear Basso?\n')

  console.log('If no sounds/notifications:')
  console.log('  → System Settings → Notifications → Script Editor → Allow Notifications: ON')
  console.log('  → Also check: System Settings → Sound → Alert volume is not muted')
}

main().catch(console.error)
