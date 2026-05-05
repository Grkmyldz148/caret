/**
 * Caret link — demo
 *
 *   pnpm --filter @caret/examples link
 *
 * Modern terminals (iTerm2, Wezterm, Kitty, GNOME Terminal, Windows Terminal)
 * render the output as clickable underlined links. In other terminals it
 * collapses to plain text.
 */

import { link, keyValue, list } from '@caret/registry/components/index.js'

process.stdout.write('Inline link:\n')
process.stdout.write(`See the ${link('https://caret.dev/docs', 'docs')} for usage.\n`)

process.stdout.write('\nLink in a keyValue block:\n')
keyValue({
  rows: [
    { key: 'Project', value: 'caret' },
    { key: 'Docs',    value: link('https://caret.dev', 'caret.dev') },
    { key: 'Source',  value: link('https://github.com/gorkemyildiz/caret', 'github.com/gorkemyildiz/caret') },
  ],
})

process.stdout.write('\nLinks in a list:\n')
list({
  items: [
    { label: 'Docs',     description: link('https://caret.dev/docs') },
    { label: 'Examples', description: link('https://caret.dev/examples') },
    { label: 'Discord',  description: link('https://discord.gg/caret') },
  ],
  variant: 'arrow',
})
