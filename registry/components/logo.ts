/**
 * Caret logo component
 *
 * Renders a multi-line ASCII art logo in accent color (or terminal
 * default). Three input modes:
 *
 *   1. Pre-rendered ASCII string:
 *      logo('  ___  ...')
 *      logo({ art: '  ___  ...' })
 *
 *   2. Plain text — converted to ASCII via figlet:
 *      logo({ text: 'nibgat' })
 *      logo({ text: 'nibgat', font: 'Big' })
 *
 * Static — writes to stdout once and returns.
 *
 * Use with `splash()` for an animated reveal, or alone as a static
 * logo at the top of your CLI's `--help` output.
 */

import { getTheme } from '../theme/global.js'
import { mergeTheme } from '../theme/merge.js'
import type { PartialTheme } from '../theme/types.js'
import { paintAccent } from '../lib/paint.js'
import { textToArt } from '../lib/text-to-art.js'

export type LogoArtOptions = {
  art: string
  color?: 'accent' | 'default'
  theme?: PartialTheme
}

export type LogoTextOptions = {
  /** Plain text to render via figlet into ASCII art. */
  text: string
  /** figlet font name. Default: 'ANSI Shadow'. */
  font?: string
  color?: 'accent' | 'default'
  theme?: PartialTheme
}

export type LogoOptions = LogoArtOptions | LogoTextOptions

function isTextOptions(o: LogoOptions): o is LogoTextOptions {
  return 'text' in o
}

export function logo(input: string | LogoOptions): void {
  let art: string
  let color: 'accent' | 'default' | undefined
  let themeOverride: PartialTheme | undefined

  if (typeof input === 'string') {
    art = input
  } else if (isTextOptions(input)) {
    art = textToArt(input.text, { font: input.font })
    color = input.color
    themeOverride = input.theme
  } else {
    art = input.art
    color = input.color
    themeOverride = input.theme
  }

  const theme = mergeTheme(getTheme(), themeOverride)
  const accent = paintAccent(theme)

  const trimmed = art.replace(/^\n/, '').replace(/\n$/, '')

  // Detect existing ANSI escape sequences (e.g. from imageToArt) and
  // pass them through without overwriting the embedded colors.
  const hasAnsi = /\x1b\[/.test(trimmed)

  const painted =
    color === 'default' || hasAnsi
      ? trimmed
      : trimmed
          .split('\n')
          .map((line) => accent(line))
          .join('\n')

  process.stdout.write(painted + '\n')
}
