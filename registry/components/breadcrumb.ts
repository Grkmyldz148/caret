/**
 * Caret breadcrumb component
 *
 * Returns a navigation path string with theme-styled separators.
 *
 *   breadcrumb(['home', 'projects', 'my-app', 'settings'])
 *   → "home › projects › my-app › settings"
 *
 * The final (current) segment is rendered in accent; earlier segments
 * are dim. Use inline — returns a string.
 */

import { getTheme } from '../theme/global.js'
import { mergeTheme } from '../theme/merge.js'
import type { PartialTheme } from '../theme/types.js'
import { paintAccent, paintDim } from '../lib/paint.js'

export type BreadcrumbOptions = {
  separator?: string
  theme?: PartialTheme
}

export function breadcrumb(
  segments: ReadonlyArray<string>,
  options: BreadcrumbOptions = {},
): string {
  if (segments.length === 0) return ''
  const theme = mergeTheme(getTheme(), options.theme)
  const accent = paintAccent(theme)
  const dim = paintDim()

  const sep = ` ${dim(options.separator ?? '›')} `

  const parts = segments.map((seg, i) => {
    const isLast = i === segments.length - 1
    return isLast ? accent.bold(seg) : dim(seg)
  })

  return parts.join(sep)
}
