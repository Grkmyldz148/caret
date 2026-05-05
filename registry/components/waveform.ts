/**
 * Caret waveform component
 *
 * Audio-style waveform visualization using Unicode braille characters.
 * Values in the -1 to 1 range are rendered as a signal wave: positive
 * values extend upward from the center line, negative values extend
 * downward. Each sample maps to one braille character width (2 dot-columns).
 *
 *   waveform({ values: [0.2, 0.5, 0.8, 0.3, -0.2, -0.7, 0.1, 0.6] })
 */

import { gridToBraille, makeGrid } from 'unicode-animations'
import { getTheme } from '../theme/global.js'
import { mergeTheme } from '../theme/merge.js'
import type { PartialTheme } from '../theme/types.js'
import { paintAccent, paintDim } from '../lib/paint.js'

export type WaveformOptions = {
  /** Sample values, typically in -1 to 1 range. */
  values: ReadonlyArray<number>
  /** Total height in dot-rows. Rounded up to nearest multiple of 4. Default: 8. */
  height?: number
  /** If set, resample values to fit this many braille characters wide. */
  width?: number
  theme?: PartialTheme
}

export function waveform(options: WaveformOptions): void {
  const theme = mergeTheme(getTheme(), options.theme)
  const accent = paintAccent(theme)
  const dim = paintDim()

  const values = options.values
  if (values.length === 0) return

  const rawHeight = options.height ?? 8
  // Round up to nearest multiple of 4 for clean braille rows
  const dotRows = Math.ceil(rawHeight / 4) * 4

  // Determine how many samples to render (each sample = 2 dot-columns = 1 braille char)
  const sampleCount = options.width != null ? options.width : values.length

  // Resample values to fit the target width
  const resampled: number[] = []
  for (let i = 0; i < sampleCount; i++) {
    const srcIndex = (i / sampleCount) * values.length
    const lo = Math.floor(srcIndex)
    const hi = Math.min(lo + 1, values.length - 1)
    const t = srcIndex - lo
    const v = (values[lo]! * (1 - t)) + (values[hi]! * t)
    resampled.push(v)
  }

  // Detect value range: if all values are 0-1, treat as unipolar; otherwise bipolar (-1 to 1)
  const minVal = Math.min(...resampled)
  const maxVal = Math.max(...resampled)
  const isBipolar = minVal < 0

  // The center row (in dot-row space) is the zero line
  // For bipolar: center is at dotRows / 2
  // For unipolar (0-1): center is at the bottom (dotRows - 1), values extend upward
  const centerRow = isBipolar ? dotRows / 2 : dotRows

  // Grid dimensions: 2 dot-columns per sample
  const gridCols = sampleCount * 2

  const lines: string[] = []

  // Process 4 dot-rows at a time, top to bottom
  for (let rowStart = 0; rowStart < dotRows; rowStart += 4) {
    const strip = makeGrid(4, gridCols)

    for (let si = 0; si < sampleCount; si++) {
      const v = resampled[si]!
      // Clamp to -1..1
      const clamped = Math.max(-1, Math.min(1, v))

      if (isBipolar) {
        // Bipolar: positive goes up from center, negative goes down
        // Convert amplitude to dot-rows from center
        const amplitude = Math.abs(clamped)
        const halfHeight = dotRows / 2
        const extentDots = Math.round(amplitude * halfHeight)

        for (let r = 0; r < 4; r++) {
          const globalRow = rowStart + r

          let fill = false
          if (clamped >= 0) {
            // Positive: fill from centerRow upward
            // globalRow should be between (centerRow - extentDots) and (centerRow - 1)
            fill = globalRow >= centerRow - extentDots && globalRow < centerRow
          } else {
            // Negative: fill from centerRow downward
            // globalRow should be between centerRow and (centerRow + extentDots - 1)
            fill = globalRow >= centerRow && globalRow < centerRow + extentDots
          }

          if (fill) {
            const col = si * 2
            strip[r]![col] = true
            if (col + 1 < gridCols) strip[r]![col + 1] = true
          }
        }
      } else {
        // Unipolar (0-1): bars extend upward from bottom
        const barDots = Math.round(clamped * dotRows)

        for (let r = 0; r < 4; r++) {
          const globalRow = rowStart + r
          const fromBottom = dotRows - 1 - globalRow
          if (fromBottom < barDots) {
            const col = si * 2
            strip[r]![col] = true
            if (col + 1 < gridCols) strip[r]![col + 1] = true
          }
        }
      }
    }

    lines.push(gridToBraille(strip))
  }

  // Build output with accent color for waveform lines
  const charWidth = Math.ceil(gridCols / 2)
  const output: string[] = []

  if (isBipolar) {
    // Find which text line contains the center row
    const centerTextLine = Math.floor(centerRow / 4)

    for (let i = 0; i < lines.length; i++) {
      if (i === centerTextLine) {
        // Overlay a dim center indicator on empty positions
        const brailleLine = lines[i]!
        // Build a combined line: use dim dash where braille is blank, accent where filled
        let combined = ''
        for (let c = 0; c < charWidth; c++) {
          const ch = c < brailleLine.length ? brailleLine[c]! : '\u2800'
          if (ch === '\u2800') {
            combined += dim('\u2500')
          } else {
            combined += accent(ch)
          }
        }
        output.push(combined)
      } else {
        output.push(accent(lines[i]!))
      }
    }
  } else {
    for (const line of lines) {
      output.push(accent(line))
    }
    // Print a dim baseline
    output.push(dim('\u2500'.repeat(charWidth)))
  }

  process.stdout.write(output.join('\n') + '\n')
}
