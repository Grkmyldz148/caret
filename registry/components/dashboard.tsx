/**
 * Caret dashboard component
 *
 * A grid layout that arranges pre-rendered string content blocks
 * side-by-side in the terminal. This is a layout primitive — it takes
 * the output of other components (gauges, charts, key-values, etc.)
 * and composes them into a bordered grid.
 *
 *   dashboard({
 *     cols: 2,
 *     gap: 2,
 *     cells: [
 *       { title: 'CPU',     content: gaugeOutput },
 *       { title: 'Memory',  content: memoryOutput },
 *       { title: 'Network', content: networkOutput },
 *       { title: 'Disk',    content: diskOutput },
 *     ],
 *   })
 *
 * Each cell gets a tracked accent title and a thin dim border. Cells
 * fill left-to-right, top-to-bottom. Content that exceeds the cell
 * width is truncated; content shorter than the cell width is padded.
 *
 * Static: renders once and writes to stdout.
 */

import { getTheme } from '../theme/global.js'
import { mergeTheme } from '../theme/merge.js'
import type { PartialTheme } from '../theme/types.js'
import { paintAccent, paintDim, paintBold, visibleLength, truncate } from '../lib/paint.js'
import { tracking } from '../lib/typography.js'

export type DashboardCell = {
  title: string
  /** Pre-rendered string content (may be multi-line). */
  content: string
}

export type DashboardOptions = {
  cells: DashboardCell[]
  /** Number of columns in the grid. Default: 2. */
  cols?: number
  /** Total width in characters. Default: 80. */
  width?: number
  /** Horizontal gap between cells in characters. Default: 2. */
  gap?: number
  theme?: PartialTheme
}

/** Pad a possibly-ANSI-colored string to an exact visible width (left-align). */
function padVisible(text: string, width: number): string {
  const len = visibleLength(text)
  if (len >= width) return text
  return text + ' '.repeat(width - len)
}

export function dashboard(options: DashboardOptions): void {
  const theme = mergeTheme(getTheme(), options.theme)
  const accent = paintAccent(theme)
  const dim = paintDim()
  const bold = paintBold()

  const cells = options.cells
  if (cells.length === 0) return

  const cols = Math.max(1, options.cols ?? 2)
  const totalWidth = options.width ?? 80
  const gap = Math.max(0, options.gap ?? 2)

  // Each cell width = floor((totalWidth - gaps) / cols).
  const totalGap = gap * (cols - 1)
  const cellWidth = Math.max(6, Math.floor((totalWidth - totalGap) / cols))

  // Inner content area inside the border (borders take 1 char each side).
  const innerWidth = Math.max(1, cellWidth - 2)

  // Box drawing characters — use thin line style from theme if available,
  // otherwise the standard defaults.
  const b = theme.symbols.borders
  const TL = b.topLeft
  const TR = b.topRight
  const BL = b.bottomLeft
  const BR = b.bottomRight
  const H = b.horizontal
  const V = b.vertical

  // Split each row of cells
  const rowCount = Math.ceil(cells.length / cols)
  const gapStr = ' '.repeat(gap)
  const outLines: string[] = []

  for (let r = 0; r < rowCount; r++) {
    const rowCells = cells.slice(r * cols, r * cols + cols)

    // Build each cell's rendered lines first (top border, title, separator?, content, bottom border)
    // We decided on a simple layout:
    //   ┌────────────┐
    //   │ TRACKED    │
    //   │ content 1  │
    //   │ content 2  │
    //   └────────────┘
    const perCellLines: string[][] = rowCells.map((cell) => {
      // Top border
      const top = dim(TL + H.repeat(innerWidth) + TR)

      // Title — tracked CAPS, accent bold, with 1-char left gutter.
      const tracked = tracking(cell.title)
      const gutterWidth = Math.max(0, innerWidth - 1)
      const trackedLen = visibleLength(tracked)
      let paintedTitle: string
      if (trackedLen >= gutterWidth) {
        paintedTitle = accent(bold(truncate(tracked, gutterWidth)))
      } else {
        paintedTitle = accent(bold(tracked)) + ' '.repeat(gutterWidth - trackedLen)
      }
      const titleRowFinal = dim(V) + ' ' + paintedTitle + dim(V)

      // Content lines — split, fit, and pad each to innerWidth - 2 (1 char pad each side)
      const contentInner = Math.max(0, innerWidth - 2)
      const rawLines = cell.content.split('\n')
      const contentRows: string[] = rawLines.map((line) => {
        const visLen = visibleLength(line)
        let fitted: string
        if (visLen > contentInner) {
          fitted = truncate(line, contentInner)
        } else {
          fitted = line + ' '.repeat(contentInner - visLen)
        }
        return dim(V) + ' ' + fitted + ' ' + dim(V)
      })

      // Bottom border
      const bottom = dim(BL + H.repeat(innerWidth) + BR)

      const cellLines: string[] = []
      cellLines.push(top)
      cellLines.push(titleRowFinal)
      for (const cr of contentRows) cellLines.push(cr)
      cellLines.push(bottom)
      return cellLines
    })

    // Equalize cell heights within the row by padding shorter cells with
    // empty bordered rows (inserted just before the bottom border).
    const maxHeight = perCellLines.reduce((m, l) => Math.max(m, l.length), 0)
    const equalized: string[][] = perCellLines.map((lines) => {
      if (lines.length >= maxHeight) return lines
      const padded = [...lines]
      const bottom = padded.pop()!
      const emptyInner = ' '.repeat(Math.max(0, innerWidth))
      const emptyRow = dim(V) + emptyInner + dim(V)
      while (padded.length < maxHeight - 1) {
        padded.push(emptyRow)
      }
      padded.push(bottom)
      return padded
    })

    // Pad the row to `cols` columns with fully blank cells so the grid
    // is rectangular even on the final row.
    while (equalized.length < cols) {
      const blankCellLines: string[] = []
      for (let i = 0; i < maxHeight; i++) {
        blankCellLines.push(' '.repeat(cellWidth))
      }
      equalized.push(blankCellLines)
    }

    // Stitch the row of cells together line-by-line.
    for (let line = 0; line < maxHeight; line++) {
      const parts = equalized.map((cellLines) => {
        const raw = cellLines[line] ?? ''
        // Ensure the visible width matches cellWidth exactly.
        return padVisible(raw, cellWidth)
      })
      outLines.push(parts.join(gapStr))
    }

    // Blank line between rows of cells (except after the last row)
    if (r < rowCount - 1) {
      outLines.push('')
    }
  }

  process.stdout.write(outLines.join('\n') + '\n')
}
