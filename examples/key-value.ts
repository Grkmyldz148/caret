/**
 * Caret keyValue — demo
 *
 *   pnpm --filter @caret/examples key-value
 */

import { keyValue } from '@caret/registry/components/index.js'

process.stdout.write('Default (left-aligned, dim keys):\n')
keyValue({
  rows: [
    { key: 'Project', value: 'my-app' },
    { key: 'Environment', value: 'production' },
    { key: 'Region', value: 'us-east-1' },
    { key: 'Version', value: '2.4.1' },
    { key: 'Deployed', value: '3 minutes ago' },
  ],
})

process.stdout.write('\nRight-aligned, accent keys:\n')
keyValue({
  rows: [
    { key: 'Build time', value: '12.4s' },
    { key: 'Bundle size', value: '342 KB' },
    { key: 'Routes', value: 24 },
    { key: 'Cache hit rate', value: '87%' },
    { key: 'Errors', value: 0 },
  ],
  alignKeysRight: true,
  highlightKeys: true,
})
