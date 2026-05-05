/**
 * Caret reveal — demo
 *
 *   pnpm --filter @caret/examples reveal
 */

import { reveal } from '@caret/registry'

async function main(): Promise<void> {
  await reveal([
    'Initializing Caret CLI…',
    'Loading configuration from ~/.caret/config.toml',
    'Authenticating with caret.dev',
    'Fetching latest registry manifest',
    'Verifying component integrity',
    'Ready.',
  ])
}

main()
