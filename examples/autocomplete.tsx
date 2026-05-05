/**
 * prompt.autocomplete example
 *
 *   pnpm autocomplete
 */

import { prompt, success } from '@caret/registry'

const branches = [
  'main',
  'develop',
  'feature/auth-flow',
  'feature/billing-api',
  'feature/dashboard-v2',
  'feature/dark-mode',
  'feature/export-csv',
  'feature/i18n',
  'feature/notifications',
  'feature/onboarding',
  'feature/search-v3',
  'feature/settings-page',
  'fix/header-overflow',
  'fix/login-redirect',
  'fix/memory-leak',
  'fix/timezone-bug',
  'hotfix/critical-auth',
  'release/v2.0.0',
  'release/v2.1.0',
]

const branch = await prompt.autocomplete({
  label: 'Branch',
  description: 'Select a branch to deploy',
  options: branches.map((b) => ({ value: b, label: b })),
  placeholder: 'Type to search…',
  limit: 8,
})

success(`Selected: ${branch}`)
