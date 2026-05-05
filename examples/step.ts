/**
 * Caret step — demo
 *
 *   pnpm --filter @caret/examples step
 */

import { step } from '@caret/registry/components/index.js'

process.stdout.write('Mid-flight deploy:\n')
step({
  steps: [
    { label: 'Validate inputs', status: 'done' },
    { label: 'Run tests', status: 'done' },
    { label: 'Compile assets', status: 'done' },
    { label: 'Deploy to production', status: 'active' },
    { label: 'Run smoke tests', status: 'pending' },
    { label: 'Send notification', status: 'pending' },
  ],
})

process.stdout.write('\nFailed deploy:\n')
step({
  steps: [
    { label: 'Validate inputs', status: 'done' },
    { label: 'Run tests', status: 'done' },
    { label: 'Compile assets', status: 'failed' },
    { label: 'Deploy to production', status: 'skipped' },
    { label: 'Run smoke tests', status: 'skipped' },
  ],
})

process.stdout.write('\nFresh checklist:\n')
step({
  steps: [
    { label: 'Sign up for an account', status: 'pending' },
    { label: 'Verify your email', status: 'pending' },
    { label: 'Connect a domain', status: 'pending' },
    { label: 'Deploy your first project', status: 'pending' },
  ],
})
