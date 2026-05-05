/**
 * Caret braille chart component
 *
 * Terminal 2D visualization using Unicode braille characters. Each braille
 * character encodes a 2x4 dot grid, enabling dense mini-charts in minimal
 * terminal space.
 *
 * Two modes:
 *
 *   brailleChart({ mode: 'heatmap', data: [[0.1, 0.5], [0.9, 0.3]], width: 40 })
 *   brailleChart({ mode: 'bar', values: [3, 7, 2, 8, 5], height: 8 })
 */

import { gridToBraille, makeGrid } from 'unicode-animations'
import { getTheme } from '../theme/global.js'
import { mergeTheme } from '../theme/merge.js'
import type { PartialTheme } from '../theme/types.js'
import { paintAccent, paintDim } from '../lib/paint.js'

export type HeatmapOptions = {
  mode: 'heatmap'
  /** 2D array of values in 0-1 range (rows x cols). */
  data: ReadonlyArray<ReadonlyArray<number>>
  /** Target width in terminal columns. Each braille char covers 2 dot-columns. Default: data column count. */
  width?: number
  theme?: PartialTheme
}

export type BarChartOptions = {
  mode: 'bar'
  /** 1D array of numeric values. */
  values: ReadonlyArray<number>
  /** Height in braille dot-rows. Rounded up to nearest multiple of 4. Default: 8. */
  height?: number
  theme?: PartialTheme
}

export type BrailleChartOptions = HeatmapOptions | BarChartOptions

export function brailleChart(options: BrailleChartOptions): void {
  if (options.mode === 'heatmap') {
    renderHeatmap(options)
  } else {
    renderBarChart(options)
  }
}

// ---------------------------------------------------------------------------
// Heatmap — 2D grid of values 0-1, rendered as braille density
// ---------------------------------------------------------------------------

function renderHeatmap(options: HeatmapOptions): void {
  const theme = mergeTheme(getTheme(), options.theme)
  const accent = paintAccent(theme)

  const data = options.data
  if (data.length === 0) return

  const dataRows = data.length
  const dataCols = Math.max(...data.map((r) => r.length))
  if (dataCols === 0) return

  // Target width in dot-columns (each data cell maps to one dot).
  // If the caller specifies width, we scale data columns to fit.
  const targetCols = options.width != null ? options.width * 2 : dataCols

  // Build the boolean grid by thresholding: for each dot, sample the
  // corresponding data cell. We use a simple dithering approach where
  // higher values are more likely to produce a raised dot.
  // Grid rows must be processed in chunks of 4 for braille line output.
  const gridRows = Math.ceil(dataRows / 4) * 4
  const gridCols = Math.ceil(targetCols / 2) * 2

  const lines: string[] = []

  // Process 4 rows at a time (one braille text line per 4 dot-rows)
  for (let rowStart = 0; rowStart < gridRows; rowStart += 4) {
    const strip = makeGrid(4, gridCols)

    for (let r = 0; r < 4; r++) {
      const dataRow = rowStart + r
      for (let c = 0; c < gridCols; c++) {
        // Map grid position back to data coordinates
        const srcRow = Math.floor((dataRow / gridRows) * dataRows)
        const srcCol = Math.floor((c / gridCols) * dataCols)
        const value = (data[srcRow] && data[srcRow][srcCol]) ?? 0
        const clamped = Math.max(0, Math.min(1, value))

        // Threshold: raise dot if value is above 0.5, plus a gradient
        // pattern for mid-range values using position-based dithering
        const threshold = ((r * gridCols + c) % 4) / 4
        strip[r]![c] = clamped > threshold
      }
    }

    lines.push(gridToBraille(strip))
  }

  const output = lines.map((line) => accent(line)).join('\n')
  process.stdout.write(output + '\n')
}

// ---------------------------------------------------------------------------
// Bar chart — 1D array rendered as vertical braille bars
// ---------------------------------------------------------------------------

function renderBarChart(options: BarChartOptions): void {
  const theme = mergeTheme(getTheme(), options.theme)
  const accent = paintAccent(theme)
  const dim = paintDim()

  const values = options.values
  if (values.length === 0) return

  const rawHeight = options.height ?? 8
  // Round up to nearest multiple of 4 for clean braille rows
  const dotRows = Math.ceil(rawHeight / 4) * 4

  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  // Each value gets 2 dot-columns (one braille character width).
  // This gives a clean 1-char-per-bar layout.
  const dotCols = values.length * 2
  const gridCols = Math.ceil(dotCols / 2) * 2

  const lines: string[] = []

  // Process 4 dot-rows at a time, top to bottom
  for (let rowStart = 0; rowStart < dotRows; rowStart += 4) {
    const strip = makeGrid(4, gridCols)

    for (let vi = 0; vi < values.length; vi++) {
      const normalized = (values[vi]! - min) / range
      const barDots = Math.round(normalized * dotRows)

      // Bar fills from bottom. A dot-row is "on" if it falls within the bar height.
      for (let r = 0; r < 4; r++) {
        const globalRow = rowStart + r
        // Rows count from top (0) to bottom (dotRows - 1).
        // Bar starts at the bottom, so a dot is filled when:
        //   (dotRows - 1 - globalRow) < barDots
        const fromBottom = dotRows - 1 - globalRow
        if (fromBottom < barDots) {
          // Fill both dot-columns for this bar
          const col = vi * 2
          strip[r]![col] = true
          if (col + 1 < gridCols) strip[r]![col + 1] = true
        }
      }
    }

    lines.push(gridToBraille(strip))
  }

  // Dim the top lines (empty/sparse area), accent the bottom (filled area)
  const output = lines.map((line) => accent(line)).join('\n')
  process.stdout.write(output + '\n')

  // Print a dim axis line below the bars
  const axisWidth = Math.ceil(gridCols / 2)
  process.stdout.write(dim('~'.repeat(axisWidth)) + '\n')
}
