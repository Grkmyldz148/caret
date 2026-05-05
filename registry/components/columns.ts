/**
 * Caret columns component
 *
 * Renders content in side-by-side columns. Useful for dashboards,
 * comparison views, and multi-panel layouts.
 *
 *   columns({
 *     items: [
 *       { title: 'Server A', content: 'CPU: 45%\nMem: 2.1GB' },
 *       { title: 'Server B', content: 'CPU: 82%\nMem: 3.7GB' },
 *     ],
 *   })
 *
 *   columns({
 *     items: [
 *       { title: 'Before', content: oldConfig },
 *       { title: 'After',  content: newConfig },
 *     ],
 *     separator: true,
 *   })
 */

import { getTheme } from '../theme/global.js'
import { mergeTheme } from '../theme/merge.js'
import type { PartialTheme } from '../theme/types.js'
import { paintAccent, paintBold, paintDim, visibleLength } from '../lib/paint.js'
import { tracking } from '../lib/typography.js'

export type ColumnItem = {
  /** Optional column title — rendered as tracked CAPS heading. */
  title?: string
  /** Content string — may contain newlines. */
  content: string
  /** Fixed width in characters. Auto-calculated if omitted. */
  width?: number
}

export type ColumnsOptions = {
  items: ReadonlyArray<ColumnItem>
  /** Gap between columns in characters. Default: 4. */
  gap?: number
  /** Show a vertical gutter between columns. Default: false. */
  separator?: boolean
  theme?: PartialTheme
}

export function columns(options: ColumnsOptions): void {
  const theme = mergeTheme(getTheme(), options.theme)
  const accent = paintAccent(theme)
  const bold = paintBold()
  const dim = paintDim()

  const gap = options.gap ?? theme.spacing.gap * 2
  const showSep = options.separator === true

  // Split content into lines for each column, prepend title if present
  const columnLines: string[][] = options.items.map((item) => {
    const lines: string[] = []
    if (item.title) {
      lines.push(accent(bold(tracking(item.title))))
      lines.push('')
    }
    lines.push(...item.content.split('\n'))
    return lines
  })

  // Calculate column widths
  const columnWidths: number[] = options.items.map((item, i) => {
    if (item.width) return item.width
    let maxWidth = 0
    for (const line of columnLines[i]!) {
      const w = visibleLength(line)
      if (w > maxWidth) maxWidth = w
    }
    return maxWidth
  })

  const maxRows = Math.max(...columnLines.map((lines) => lines.length))

  // Build the gap/separator string
  const gapStr = showSep
    ? ' '.repeat(Math.floor((gap - 1) / 2)) +
      dim(theme.symbols.structure.gutter) +
      ' '.repeat(Math.ceil((gap - 1) / 2))
    : ' '.repeat(gap)

  const output: string[] = []
  for (let row = 0; row < maxRows; row++) {
    const parts: string[] = []
    for (let col = 0; col < options.items.length; col++) {
      const line = columnLines[col]?.[row] ?? ''
      const width = columnWidths[col]!
      const padding = Math.max(0, width - visibleLength(line))
      parts.push(line + ' '.repeat(padding))
    }
    output.push(parts.join(gapStr))
  }

  process.stdout.write(output.join('\n') + '\n')
}
