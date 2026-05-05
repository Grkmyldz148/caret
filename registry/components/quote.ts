/**
 * Caret quote component
 *
 * Renders a blockquote — text indented behind a vertical bar gutter.
 * Static — writes to stdout once.
 *
 *   quote('This is a quoted line.')
 *   quote('Multi-line\nquoted text\nblock')
 *   quote(text, { color: 'accent' })
 */

import { getTheme } from '../theme/global.js'
import { mergeTheme } from '../theme/merge.js'
import type { PartialTheme } from '../theme/types.js'
import { paintAccent, paintDim, paintSemantic } from '../lib/paint.js'

export type QuoteColor = 'dim' | 'accent' | 'success' | 'warning' | 'danger' | 'info'

export type QuoteOptions = {
  color?: QuoteColor
  theme?: PartialTheme
}

export function quote(text: string, options: QuoteOptions = {}): void {
  const theme = mergeTheme(getTheme(), options.theme)
  const color = options.color ?? 'dim'

  let paintGutter
  if (color === 'dim') paintGutter = paintDim()
  else if (color === 'accent') paintGutter = paintAccent(theme)
  else paintGutter = paintSemantic(theme, color)

  const gutter = paintGutter(theme.symbols.structure.gutter)
  const lines = text.split('\n').map((line) => `${gutter} ${line}`)
  process.stdout.write(lines.join('\n') + '\n')
}
