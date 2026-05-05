/**
 * Caret typewriter — demo
 *
 *   pnpm --filter @caret/examples typewriter
 */

import { typewriter, sleep } from '@caret/registry'

async function main(): Promise<void> {
  await typewriter('Welcome to my CLI v2.0')
  await sleep(300)

  await typewriter({ text: 'Loading configuration…', speed: 30 })
  await sleep(200)

  await typewriter({ text: 'Ready.', speed: 60 })
}

main()
