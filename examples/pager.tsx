/**
 * pager example
 *
 *   pnpm pager
 */

import { pager } from '@caret/registry'

const content = Array.from({ length: 80 }, (_, i) => {
  if (i === 0) return 'Usage: my-cli <command> [options]'
  if (i === 1) return ''
  if (i === 2) return 'Commands:'
  if (i < 20) return `  command-${i - 2}     Description for command ${i - 2}`
  if (i === 20) return ''
  if (i === 21) return 'Options:'
  if (i < 40) return `  --option-${i - 21}     Description for option ${i - 21}`
  if (i === 40) return ''
  if (i === 41) return 'Examples:'
  return `  $ my-cli command-${i - 41} --option-1 value`
}).join('\n')

await pager({
  content,
  title: 'Help',
})
