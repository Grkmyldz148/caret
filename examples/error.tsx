/**
 * Caret error — demo
 *
 *   pnpm --filter @caret/examples error
 */

import { error } from '@caret/registry/components/index.js'

// Minimum form
error('Failed to deploy to production')

// With body
error('Database connection refused', {
  body: 'Could not connect to postgres at localhost:5432.',
})

// Full form
error('Failed to deploy to production', {
  body: 'The Vercel API returned 401 Unauthorized.',
  hint: 'Your API token may have expired. Run `my-cli login` to refresh it.',
  see: 'https://my-cli.dev/docs/auth',
})
