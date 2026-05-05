/**
 * Caret braille radar chart component
 *
 * Circular radar / spider chart rendered with Unicode braille characters.
 * N axes radiate from a center point at equal angles. Data values are
 * plotted along each axis and connected to form a polygon.
 *
 *   radar({
 *     axes: ['Speed', 'Power', 'Range', 'Defense', 'Magic'],
 *     values: [0.8, 0.6, 0.9, 0.4, 0.7],
 *   })
 */

import { gridToBraille, makeGrid } from 'unicode-animations'
import { getTheme } from '../theme/global.js'
import { mergeTheme } from '../theme/merge.js'
import type { PartialTheme } from '../theme/types.js'
import { paintAccent, paintDim, pad } from '../lib/paint.js'

export type RadarOptions = {
  /** Axis labels. */
  axes: string[]
  /** Values in 0-1 range, same length as axes. */
  values: number[]
  /** Width in terminal columns. Default: 20. */
  width?: number
  theme?: PartialTheme
}

export function radar(options: RadarOptions): void {
  const theme = mergeTheme(getTheme(), options.theme)
  const accent = paintAccent(theme)
  const dim = paintDim()

  const n = options.axes.length
  if (n < 3) return // need at least 3 axes for a polygon

  const charWidth = options.width ?? 20
  const dotCols = charWidth * 2
  const dotRows = Math.ceil((charWidth) / 4) * 4 // roughly square in dot space

  const cx = dotCols / 2
  const cy = dotRows / 2
  const radius = Math.min(cx, cy) - 2

  // Compute axis angles: start from top (-pi/2), go clockwise
  const angles: number[] = []
  for (let i = 0; i < n; i++) {
    angles.push(-Math.PI / 2 + (2 * Math.PI * i) / n)
  }

  // Compute data points in dot coordinates
  const dataPoints: Array<{ x: number; y: number }> = []
  for (let i = 0; i < n; i++) {
    const v = Math.max(0, Math.min(1, options.values[i] ?? 0))
    const angle = angles[i]!
    dataPoints.push({
      x: cx + Math.cos(angle) * radius * v,
      y: cy + Math.sin(angle) * radius * v,
    })
  }

  // Two grids: one for axis lines (dim), one for data polygon (accent)
  const axisGrid: boolean[][] = []
  const dataGrid: boolean[][] = []
  for (let r = 0; r < dotRows; r++) {
    axisGrid.push(new Array<boolean>(dotCols).fill(false))
    dataGrid.push(new Array<boolean>(dotCols).fill(false))
  }

  // --- Draw axis lines from center to edge ---
  for (let i = 0; i < n; i++) {
    const angle = angles[i]!
    const ex = cx + Math.cos(angle) * radius
    const ey = cy + Math.sin(angle) * radius
    drawLine(axisGrid, Math.round(cx), Math.round(cy), Math.round(ex), Math.round(ey), dotCols, dotRows)
  }

  // --- Draw data polygon ---
  for (let i = 0; i < n; i++) {
    const p1 = dataPoints[i]!
    const p2 = dataPoints[(i + 1) % n]!
    drawLine(dataGrid, Math.round(p1.x), Math.round(p1.y), Math.round(p2.x), Math.round(p2.y), dotCols, dotRows)
  }

  // --- Render braille strips ---
  const dimLines: string[] = []
  const accentLines: string[] = []

  for (let rowStart = 0; rowStart < dotRows; rowStart += 4) {
    const axisStrip = makeGrid(4, dotCols)
    const dataStrip = makeGrid(4, dotCols)

    for (let r = 0; r < 4; r++) {
      const dotRow = rowStart + r
      if (dotRow >= dotRows) break
      const axRow = axisGrid[dotRow]
      const dtRow = dataGrid[dotRow]
      for (let c = 0; c < dotCols; c++) {
        const aRow = axisStrip[r]
        if (aRow && axRow) {
          aRow[c] = axRow[c] ?? false
        }
        const dRow = dataStrip[r]
        if (dRow && dtRow) {
          dRow[c] = dtRow[c] ?? false
        }
      }
    }

    dimLines.push(gridToBraille(axisStrip))
    accentLines.push(gridToBraille(dataStrip))
  }

  // Merge: for each character position, if the data grid has a non-blank
  // braille char use accent coloring, otherwise use dim for axis lines.
  const BRAILLE_EMPTY = '\u2800' // Unicode braille blank
  const merged = dimLines.map((dLine, i) => {
    const aLine = accentLines[i] ?? ''
    let result = ''
    const len = Math.max(dLine.length, aLine.length)
    for (let j = 0; j < len; j++) {
      const ac = aLine[j] ?? BRAILLE_EMPTY
      const dc = dLine[j] ?? BRAILLE_EMPTY
      if (ac !== BRAILLE_EMPTY) {
        // OR the braille code points for overlay
        const merged_cp = (dc.codePointAt(0) ?? 0x2800) | (ac.codePointAt(0) ?? 0x2800)
        result += accent(String.fromCodePoint(merged_cp))
      } else if (dc !== BRAILLE_EMPTY) {
        result += dim(dc)
      } else {
        result += BRAILLE_EMPTY
      }
    }
    return result
  })

  process.stdout.write(merged.join('\n') + '\n')

  // --- Print axis labels around the chart ---
  // Map each axis to a row in the output and position left/right/center
  const lineCount = merged.length
  for (let i = 0; i < n; i++) {
    const angle = angles[i]!
    const label = options.axes[i] ?? ''
    // Vertical position: map angle's y-component to line index
    const normY = (Math.sin(angle) + 1) / 2 // 0=top, 1=bottom
    const lineIdx = Math.min(lineCount - 1, Math.max(0, Math.round(normY * (lineCount - 1))))
    // Horizontal: left, center, or right
    const normX = Math.cos(angle)
    let align: 'left' | 'right' | 'center'
    if (normX < -0.3) align = 'left'
    else if (normX > 0.3) align = 'right'
    else align = 'center'

    const paddedLabel = pad(dim(label), charWidth, align)
    // We print labels on separate lines after the chart
    // to avoid overwriting braille content
    void lineIdx // computed but used only conceptually
    void paddedLabel
  }

  // Simpler approach: just list labels below the chart
  const labelLine = options.axes.map((a) => dim(a)).join(dim('  '))
  const centered = pad(labelLine, charWidth, 'center')
  process.stdout.write(centered + '\n')
}

// ---------------------------------------------------------------------------
// Bresenham's line algorithm — plot dots on a boolean grid
// ---------------------------------------------------------------------------

function drawLine(
  grid: boolean[][],
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  maxCols: number,
  maxRows: number,
): void {
  let dx = Math.abs(x1 - x0)
  let dy = -Math.abs(y1 - y0)
  const sx = x0 < x1 ? 1 : -1
  const sy = y0 < y1 ? 1 : -1
  let err = dx + dy

  let cx = x0
  let cy = y0

  for (;;) {
    if (cx >= 0 && cx < maxCols && cy >= 0 && cy < maxRows) {
      const row = grid[cy]
      if (row) {
        row[cx] = true
      }
    }

    if (cx === x1 && cy === y1) break

    const e2 = 2 * err
    if (e2 >= dy) {
      err += dy
      cx += sx
    }
    if (e2 <= dx) {
      err += dx
      cy += sy
    }
  }
}
