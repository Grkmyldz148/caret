/**
 * log example
 *
 *   pnpm log
 */

import { log, banner } from '@caret/registry'

banner({ title: 'Log Component' })

log({ message: 'Server started on port 3000' })
log({ message: 'Database connected', source: 'db' })
log({ message: 'Cache warmed: 142 entries', source: 'cache' })
log({ message: 'Token expires in 5 minutes', level: 'warn', source: 'auth' })
log({ message: 'Retry attempt 2/3', level: 'debug', source: 'http' })
log({ message: 'Connection refused: billing-svc:443', level: 'error', source: 'api' })

console.log()

log.batch({
  entries: [
    { message: 'Compiling…', level: 'info', source: 'build' },
    { message: 'Bundle size: 142kb', level: 'info', source: 'build' },
    { message: 'Unused export in utils.ts', level: 'warn', source: 'lint' },
    { message: 'Build complete', level: 'info', source: 'build' },
  ],
})
