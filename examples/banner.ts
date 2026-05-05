/**
 * Caret banner — demo
 *
 *   pnpm --filter @caret/examples banner
 */

import { banner } from '@caret/registry/components/index.js'

banner({
  title: 'Caret CLI',
  subtitle: 'The design system for modern command-line tools',
})

process.stdout.write('\n')

banner({
  title: 'Deployment Summary',
  subtitle: 'Production · us-east-1',
})
