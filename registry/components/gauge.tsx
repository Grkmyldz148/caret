/**
 * Caret braille gauge component
 *
 * Semicircular arc gauge rendered with Unicode braille characters.
 * Displays a percentage value like a speedometer — the arc fills
 * from left to right based on the value.
 *
 *   gauge({ value: 0.75, label: 'CPU' })
 *   gauge({ value: 0.3, label: 'Memory' })
 */

import { gridToBraille, makeGrid } from 'unicode-animations'
import { getTheme } from '../theme/global.js'
import { mergeTheme } from '../theme/merge.js'
import type { PartialTheme } from '../theme/types.js'
import { paintAccent, paintDim, paintBold, pad } from '../lib/paint.js'

export type GaugeOptions = {
  /** Value in 0-1 range. */
  value: number
  /** Label displayed below the gauge arc. */
  label?: string
  /** Width in terminal columns. Each braille char covers 2 dot-columns. Default: 20. */
  width?: number
  theme?: PartialTheme
}

export function gauge(options: GaugeOptions): void {
  const theme = mergeTheme(getTheme(), options.theme)
  const accent = paintAccent(theme)
  const dim = paintDim()
  const bold = paintBold()

  const charWidth = options.width ?? 20
  const dotCols = charWidth * 2
  // Semicircle height: half the width in dot-rows, rounded up to multiple of 4
  const rawDotRows = Math.ceil(dotCols / 2)
  const dotRows = Math.ceil(rawDotRows / 4) * 4

  const value = Math.max(0, Math.min(1, options.value))

  // Center and radius of the semicircle in dot coordinates
  const cx = dotCols / 2
  const cy = dotRows // bottom-center of the grid (arc opens upward)
  const outerR = Math.min(cx, cy) - 1
  const innerR = outerR - 2 // thickness of 3 dot-rows

  // Build the full boolean grid
  const lines: string[] = []

  for (let rowStart = 0; rowStart < dotRows; rowStart += 4) {
    const strip = makeGrid(4, dotCols)

    for (let r = 0; r < 4; r++) {
      const dotRow = rowStart + r
      for (let c = 0; c < dotCols; c++) {
        const dx = c - cx
        const dy = cy - dotRow // flip y so up is positive

        if (dy < 0) continue // below the center line

        const dist = Math.sqrt(dx * dx + dy * dy)

        // Check if this dot falls within the arc band
        if (dist >= innerR && dist <= outerR) {
          // Angle from left (pi) to right (0) for the semicircle
          const angle = Math.atan2(dy, dx)
          // Normalize angle: pi (left) -> 0, 0 (right) -> 1
          const progress = 1 - angle / Math.PI

          const row = strip[r]
          if (row) {
            row[c] = progress <= value
          }
        }
      }
    }

    lines.push(gridToBraille(strip))
  }

  // Render the braille arc — filled portion in accent, unfilled in dim.
  // Since individual braille characters may contain both filled and unfilled
  // dots, we colorize per-line: if the value is >= 0.5 we use accent overall.
  // For finer control, we split each line at the midpoint.
  const output = lines.map((line) => {
    // Approximate the split point: chars to the left of the fill boundary
    const splitChar = Math.round(line.length * value)
    const filled = line.slice(0, splitChar)
    const unfilled = line.slice(splitChar)
    return accent(filled) + dim(unfilled)
  }).join('\n')

  process.stdout.write(output + '\n')

  // Print the percentage and label below, centered
  const pct = `${Math.round(value * 100)}%`
  const pctLine = pad(bold(accent(pct)), charWidth, 'center')
  process.stdout.write(pctLine + '\n')

  if (options.label) {
    const labelLine = pad(dim(options.label), charWidth, 'center')
    process.stdout.write(labelLine + '\n')
  }
}
