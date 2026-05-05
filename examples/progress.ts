/**
 * Caret progress — demo
 *
 *   pnpm --filter @caret/examples progress
 */

import { progress } from '@caret/registry/components/index.js'

process.stdout.write('Default (percent only):\n')
progress({ value: 0, total: 100, label: 'Idle      ' })
progress({ value: 25, total: 100, label: 'Starting  ' })
progress({ value: 50, total: 100, label: 'Halfway   ' })
progress({ value: 75, total: 100, label: 'Almost    ' })
progress({ value: 100, total: 100, label: 'Complete  ' })

process.stdout.write('\nWith count:\n')
progress({ value: 3, total: 10, label: 'Files', showCount: true })
progress({ value: 47, total: 100, label: 'Tests', showCount: true })
progress({ value: 1234, total: 5000, label: 'Bytes', showCount: true })

process.stdout.write('\nFixed width, no label:\n')
progress({ value: 33, total: 100, width: 30 })
progress({ value: 66, total: 100, width: 30 })
progress({ value: 99, total: 100, width: 30 })
