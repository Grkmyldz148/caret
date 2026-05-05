/**
 * Caret code-block — demo
 *
 *   pnpm --filter @caret/examples code-block
 */

import { codeBlock } from '@caret/registry'

process.stdout.write('TypeScript example:\n')
codeBlock(
  `function greet(name: string): string {
  return \`Hello, \${name}!\`
}

const message = greet('Caret')`,
  { language: 'ts' },
)

process.stdout.write('\nBash example, no line numbers:\n')
codeBlock('npx caret init my-cli\ncd my-cli\nnpm install', {
  language: 'bash',
  showLineNumbers: false,
})

process.stdout.write('\nPlain code block, no language:\n')
codeBlock('cat config.json | jq .')
