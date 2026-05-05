/**
 * Caret badge component
 *
 * A small inline label, like a GitHub status badge. Returns a string for
 * inline composition.
 *
 *   badge('beta', { color: 'warning' })       // [beta]  in yellow
 *   badge('new', { color: 'accent' })         // [new]   in accent
 *   badge('failed', { color: 'danger' })      // [failed] in red
 *   badge('passing', { color: 'success' })    // [passing] in green
 *
 * Use inside paragraph, list, table cells, or alongside titles.
 */

import { getTheme } from '../theme/global.js'
import { mergeTheme } from '../theme/merge.js'
import type { PartialTheme } from '../theme/types.js'
import { paintAccent, paintDim, paintSemantic } from '../lib/paint.js'

export type BadgeColor = 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'muted'

export type BadgeOptions = {
  color?: BadgeColor
  theme?: PartialTheme
}

export function badge(label: string, options: BadgeOptions = {}): string {
  const theme = mergeTheme(getTheme(), options.theme)
  const color = options.color ?? 'accent'

  // Manifesto: no background colors. Hierarchy comes from bold + color
  // on the bracketed label, with `muted` using dim as the lowest tier.
  if (color === 'muted') {
    return paintDim()(`[${label}]`)
  }

  const paint = color === 'accent' ? paintAccent(theme) : paintSemantic(theme, color)
  return paint.bold(`[${label}]`)
}
