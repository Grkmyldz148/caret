/**
 * Caret kbd component
 *
 * Renders a keyboard shortcut as a bracketed label. Returns a string for
 * inline composition.
 *
 *   kbd('Ctrl+C')           // [Ctrl+C]
 *   kbd(['Cmd', 'K'])       // [Cmd]+[K]
 *   kbd('↵')                // [↵]
 *
 * Use with paragraph, info, list, or anywhere else you reference keys:
 *
 *   info(`Press ${kbd('Ctrl+C')} to cancel`)
 */

import { getTheme } from '../theme/global.js'
import { mergeTheme } from '../theme/merge.js'
import type { PartialTheme } from '../theme/types.js'
import { paintAccent, paintDim } from '../lib/paint.js'

export type KbdOptions = {
  theme?: PartialTheme
}

export function kbd(input: string | ReadonlyArray<string>, options: KbdOptions = {}): string {
  const theme = mergeTheme(getTheme(), options.theme)
  const accent = paintAccent(theme)
  const dim = paintDim()

  if (Array.isArray(input)) {
    return (input as ReadonlyArray<string>)
      .map((k) => `${dim('[')}${accent.bold(k)}${dim(']')}`)
      .join(dim('+'))
  }

  return `${dim('[')}${accent.bold(input as string)}${dim(']')}`
}
