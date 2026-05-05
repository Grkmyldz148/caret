/**
 * Caret code component
 *
 * Inline code formatting. Returns a string for inline composition.
 *
 *   code('npm install caret')
 *   info(`Run ${code('caret init')} to scaffold a new project`)
 *
 * Per manifesto (specs/look.md § Borders & surfaces): never set a
 * background color. Inline code is wrapped in dim backticks with the
 * text itself rendered in accent bold — the visual weight comes from
 * the hierarchy of ANSI attributes, not a chip background.
 */

import { getTheme } from '../theme/global.js'
import { mergeTheme } from '../theme/merge.js'
import type { PartialTheme } from '../theme/types.js'
import { capability } from '../lib/capability.js'
import { paintAccent, paintDim } from '../lib/paint.js'

export type CodeOptions = {
  theme?: PartialTheme
}

export function code(text: string, options: CodeOptions = {}): string {
  const theme = mergeTheme(getTheme(), options.theme)
  const cap = capability()
  if (!cap.hasColor) return `\`${text}\``
  const accent = paintAccent(theme)
  const dim = paintDim()
  return `${dim('`')}${accent.bold(text)}${dim('`')}`
}
