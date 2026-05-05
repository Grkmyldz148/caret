/**
 * Caret logo — demo
 *
 *   pnpm --filter @caret/examples logo
 */

import { logo } from '@caret/registry'

// 1. From plain text — figlet converts it for us (default font: ANSI Shadow)
process.stdout.write('From text (default ANSI Shadow):\n')
logo({ text: 'caret' })

process.stdout.write('\nFrom text with Big font:\n')
logo({ text: 'caret', font: 'Big' })

process.stdout.write('\nFrom text with Slant font:\n')
logo({ text: 'caret', font: 'Slant' })

process.stdout.write('\nFrom text in default terminal color:\n')
logo({ text: 'caret', color: 'default' })

// 2. From a pre-rendered ASCII string (manual control)
process.stdout.write('\nFrom pre-rendered art string:\n')
logo(`
   /\\  /\\
  /  \\/  \\
 /        \\
 \\        /
  \\______/
`)
