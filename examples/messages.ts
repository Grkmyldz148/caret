/**
 * Caret message helpers — demo
 *
 *   pnpm --filter @caret/examples messages
 */

import { info, success, warning, error } from '@caret/registry/components/index.js'

info('Cache cleared')
info('Skipping prebuild step (cached)')

success('Build complete')
success('Deployment successful')

warning('Deprecated config syntax — see migration guide')
warning('Node 18 is in maintenance mode; consider upgrading')

error('Failed to deploy', {
  body: 'The Vercel API returned 401 Unauthorized.',
  hint: 'Run `my-cli login` to refresh your token.',
  see: 'https://my-cli.dev/docs/auth',
})
