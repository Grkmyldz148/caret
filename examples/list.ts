/**
 * Caret list — demo
 *
 *   pnpm --filter @caret/examples list
 */

import { list } from '@caret/registry/components/index.js'

process.stdout.write('Bullet:\n')
list({
  items: ['First item', 'Second item', 'Third item'],
})

process.stdout.write('\nNumbered:\n')
list({
  items: ['Install dependencies', 'Configure environment', 'Run migrations', 'Start server'],
  variant: 'numbered',
})

process.stdout.write('\nArrow with descriptions:\n')
list({
  items: [
    { label: 'Authentication', description: 'Sign in with email or OAuth' },
    { label: 'Database', description: 'PostgreSQL on Neon, fully managed' },
    { label: 'Email', description: 'Transactional email via Resend' },
    { label: 'File storage', description: 'S3-compatible object storage' },
  ],
  variant: 'arrow',
})

process.stdout.write('\nDash:\n')
list({
  items: ['quick', 'simple', 'minimal'],
  variant: 'dash',
})
