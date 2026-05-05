/**
 * Caret diff — demo
 *
 *   pnpm --filter @caret/examples diff
 */

import { diff } from '@caret/registry/components/index.js'

process.stdout.write('Configuration changes:\n')
diff({
  lines: [
    { kind: 'unchanged', text: 'host: api.example.com' },
    { kind: 'removed',   text: 'port: 80' },
    { kind: 'added',     text: 'port: 443' },
    { kind: 'unchanged', text: 'timeout: 30s' },
    { kind: 'removed',   text: 'debug: true' },
    { kind: 'added',     text: 'debug: false' },
    { kind: 'added',     text: 'tls: true' },
  ],
})

process.stdout.write('\nFile diff:\n')
diff({
  filename: 'greet.ts',
  lines: [
    { kind: 'unchanged', text: 'function greet(name: string) {' },
    { kind: 'removed',   text: '  console.log(`Hello, ${name}!`)' },
    { kind: 'added',     text: '  return `Hello, ${name}!`' },
    { kind: 'unchanged', text: '}' },
  ],
})
