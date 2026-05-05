/**
 * Caret panel component
 *
 * A bordered container with optional title. The fundamental layout
 * primitive for grouping related content in a box frame.
 *
 *   panel({
 *     title: 'Configuration',
 *     body: 'key: value\nother: value',
 *   })
 *
 * Output:
 *   ╭─ Configuration ──────────────────╮
 *   │ key: value                       │
 *   │ other: value                     │
 *   ╰──────────────────────────────────╯
 *
 * Per specs/look.md § Borders & surfaces, panels use a thin rounded
 * box. The title sits on the top border with a gap before and after.
 */

import { getTheme } from '../theme/global.js'
import { mergeTheme } from '../theme/merge.js'
import type { PartialTheme } from '../theme/types.js'
import { capability } from '../lib/capability.js'
import { paintAccent, paintDim, visibleLength } from '../lib/paint.js'

export type PanelOptions = {
  /** Optional title rendered on the top border. */
  title?: string
  /** Body content — string or array of lines. */
  body: string | string[]
  /**
   * Override content width. Default: fit to terminal, capped at 60.
   * The final box width is inner + 4 (border + padding each side).
   */
  width?: number
  /** Padding inside the box (left/right). Default: 1. */
  padding?: number
  theme?: PartialTheme
}

export function panel(options: PanelOptions): void {
  const theme = mergeTheme(getTheme(), options.theme)
  const cap = capability()
  const accent = paintAccent(theme)
  const dim = paintDim()

  const pad = options.padding ?? 1
  const padStr = ' '.repeat(pad)

  const bodyLines = Array.isArray(options.body)
    ? options.body
    : options.body.split('\n')

  // Compute inner width
  const bodyMaxLen = bodyLines.reduce((m, l) => Math.max(m, visibleLength(l)), 0)
  const titleLen = options.title ? visibleLength(options.title) + 3 : 0 // "─ title "
  const preferredInner = Math.max(bodyMaxLen, titleLen, 10)
  const maxInner = Math.max(10, (options.width ?? Math.min(60, cap.columns - 4)) - pad * 2)
  const inner = Math.min(preferredInner, maxInner)
  const boxWidth = inner + pad * 2 + 2 // +2 for border chars

  const b = cap.unicode
    ? theme.symbols.borders
    : { topLeft: '+', topRight: '+', bottomLeft: '+', bottomRight: '+', horizontal: '-', vertical: '|' }

  const paintBorder = cap.hasColor ? accent : (s: string) => s

  // Top border
  let topRule: string
  if (options.title) {
    const titleStr = ` ${options.title} `
    const afterLen = Math.max(0, boxWidth - 2 - 1 - visibleLength(titleStr))
    topRule = paintBorder(
      `${b.topLeft}${b.horizontal}${titleStr}${b.horizontal.repeat(afterLen)}${b.topRight}`,
    )
  } else {
    topRule = paintBorder(`${b.topLeft}${b.horizontal.repeat(boxWidth - 2)}${b.topRight}`)
  }

  // Bottom border
  const bottomRule = paintBorder(
    `${b.bottomLeft}${b.horizontal.repeat(boxWidth - 2)}${b.bottomRight}`,
  )

  const lines: string[] = []
  lines.push(topRule)

  for (const line of bodyLines) {
    const contentLen = visibleLength(line)
    const rightPad = Math.max(0, inner - contentLen)
    lines.push(
      `${paintBorder(b.vertical)}${padStr}${line}${' '.repeat(rightPad)}${padStr}${paintBorder(b.vertical)}`,
    )
  }

  lines.push(bottomRule)

  process.stdout.write(lines.join('\n') + '\n')
}
