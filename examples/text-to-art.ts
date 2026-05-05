/**
 * Caret text-to-art — font showcase
 *
 *   pnpm --filter @caret/examples text-to-art
 *
 * Renders the same text in several figlet fonts so you can pick one.
 * figlet ships with 100+ fonts; these are the most commonly useful for
 * a CLI splash logo.
 */

import { textToArt, logo } from '@caret/registry'

const SAMPLE = 'nibgat'

const FONTS = [
  'ANSI Shadow',
  'Big',
  'Standard',
  'Slant',
  'Small',
  'Doom',
  'Ghost',
  'Block',
] as const

for (const font of FONTS) {
  process.stdout.write(`\n── ${font} ──\n`)
  logo({ text: SAMPLE, font })
}

process.stdout.write('\n── raw textToArt() return value ──\n')
const art = textToArt('nibgat', { font: 'ANSI Shadow' })
process.stdout.write(art + '\n')
