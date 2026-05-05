/**
 * Caret avatar component
 *
 * An initials-based user representation for terminal UIs.
 * Returns a string for inline composition.
 *
 *   avatar('Görkem Yıldız')                      // [GY]
 *   avatar('Alice', { color: 'success' })         // [A]  in green
 *   avatar('Bob Carter', { color: 'accent' })     // [BC] in accent
 *
 * Use inside chat messages, lists, or alongside usernames.
 */

import { getTheme } from '../theme/global.js'
import { mergeTheme } from '../theme/merge.js'
import type { PartialTheme } from '../theme/types.js'
import { paintAccent, paintDim, paintSemantic } from '../lib/paint.js'

export type AvatarColor = 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'muted'

export type AvatarOptions = {
  color?: AvatarColor
  /** Max initials count. Default: 2. */
  maxInitials?: number
  theme?: PartialTheme
}

function extractInitials(name: string, max: number): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0 || parts[0] === '') return '?'
  return parts
    .slice(0, max)
    .map((p) => p.charAt(0).toUpperCase())
    .join('')
}

export function avatar(name: string, options: AvatarOptions = {}): string {
  const theme = mergeTheme(getTheme(), options.theme)
  const color = options.color ?? 'accent'
  const maxInitials = options.maxInitials ?? 2

  const initials = extractInitials(name, maxInitials)
  const label = `[${initials}]`

  if (color === 'muted') {
    return paintDim()(label)
  }

  const paint = color === 'accent' ? paintAccent(theme) : paintSemantic(theme, color)
  return paint.bold(label)
}
