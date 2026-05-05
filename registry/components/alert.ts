/**
 * Caret alert component
 *
 * A semantic callout with a single-character left gutter (│) in the
 * semantic color, a kind-labelled header, an optional title, and a
 * wrapped body. Static — renders once to stdout.
 *
 * Per specs/look.md § Borders & surfaces, callouts use a gutter, NOT a
 * full box. Full boxes are reserved for modal/dialog. The gutter is
 * the Caret "quote mark" for structured asides.
 *
 *   alert({
 *     kind: 'warning',
 *     title: 'Deprecated',
 *     body: 'This API will be removed in v3. Migrate to the new auth flow.',
 *   })
 *
 * Output:
 *   │ ⚠ warning: Deprecated
 *   │
 *   │ This API will be removed in v3. Migrate to
 *   │ the new auth flow.
 */

import { getTheme } from '../theme/global.js'
import { mergeTheme } from '../theme/merge.js'
import type { PartialTheme } from '../theme/types.js'
import { capability } from '../lib/capability.js'
import { paintSemantic, visibleLength } from '../lib/paint.js'

export type AlertKind = 'info' | 'success' | 'warning' | 'danger'

export type AlertOptions = {
  kind: AlertKind
  title?: string
  body: string
  /** Override body wrap width. Default: fit to terminal, capped at 80. */
  width?: number
  theme?: PartialTheme
}

const KIND_SYMBOLS: Record<AlertKind, keyof ReturnType<typeof getTheme>['symbols']['state']> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'failure',
}

const KIND_SEMANTIC: Record<AlertKind, 'info' | 'success' | 'warning' | 'danger'> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
}

export function alert(options: AlertOptions): void {
  const theme = mergeTheme(getTheme(), options.theme)
  const cap = capability()
  const paint = paintSemantic(theme, KIND_SEMANTIC[options.kind])

  const symbolKey = KIND_SYMBOLS[options.kind]
  const symbol = theme.symbols.state[symbolKey]
  const label = options.kind

  const header = options.title !== undefined
    ? `${symbol} ${label}: ${options.title}`
    : `${symbol} ${label}`

  // Wrap body to fit: leave room for gutter (1) + space (1) = 2 chars
  const maxWidth = Math.min(options.width ?? 80, cap.columns)
  const bodyInner = Math.max(20, maxWidth - 2)
  const bodyLines = wrap(options.body, bodyInner)

  const gutterChar = cap.unicode ? theme.symbols.structure.gutter : '|'
  const gutter = paint(gutterChar)

  const lines: string[] = []

  // Header row — gutter + header in semantic color
  lines.push(`${gutter} ${paint.bold(header)}`)

  // Separator row — just the gutter (creates one-blank breathing)
  lines.push(gutter)

  // Body rows — gutter + plain body text (no color; color is reinforcement)
  for (const line of bodyLines) {
    lines.push(`${gutter} ${line}`)
  }

  process.stdout.write(lines.join('\n') + '\n')
}

function wrap(text: string, width: number): string[] {
  const paragraphs = text.split('\n')
  const out: string[] = []
  for (const para of paragraphs) {
    if (para === '') {
      out.push('')
      continue
    }
    const words = para.split(' ')
    let current = ''
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word
      if (visibleLength(candidate) > width && current) {
        out.push(current)
        current = word
      } else {
        current = candidate
      }
    }
    if (current) out.push(current)
  }
  return out.length > 0 ? out : ['']
}
