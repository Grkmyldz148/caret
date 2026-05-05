/**
 * Caret flamegraph component
 *
 * Simplified flame graph visualization using Unicode braille characters.
 * Stacked horizontal bars of varying widths, rendered bottom-to-top
 * (widest at bottom, narrowest at top) to resemble a flame or mountain.
 *
 *   flamegraph({
 *     stacks: [
 *       { label: 'main', value: 1.0 },
 *       { label: 'handleRequest', value: 0.8 },
 *       { label: 'parseJSON', value: 0.4 },
 *     ]
 *   })
 */

import { gridToBraille, makeGrid } from 'unicode-animations'
import { getTheme } from '../theme/global.js'
import { mergeTheme } from '../theme/merge.js'
import type { PartialTheme } from '../theme/types.js'
import { paintAccent, paintDim } from '../lib/paint.js'

export type FlameStack = {
  label: string
  /** Width proportion, 0 to 1. */
  value: number
}

export type FlamegraphOptions = {
  stacks: ReadonlyArray<FlameStack>
  /** Total width in braille characters. Default: 40. */
  width?: number
  theme?: PartialTheme
}

export function flamegraph(options: FlamegraphOptions): void {
  const theme = mergeTheme(getTheme(), options.theme)
  const accent = paintAccent(theme)
  const dim = paintDim()

  const stacks = options.stacks
  if (stacks.length === 0) return

  const charWidth = options.width ?? 40
  // Each braille character is 2 dot-columns wide
  const gridCols = charWidth * 2

  // Each stack frame is 1 braille row tall = 4 dot-rows
  // Stacks are rendered bottom-to-top: first element is widest (bottom), last is narrowest (top)
  // We reverse so the visual output is top-to-bottom with narrowest first
  const reversed = [...stacks].reverse()

  const textLines: Array<{ braille: string; label: string }> = []

  for (const stack of reversed) {
    const value = Math.max(0, Math.min(1, stack.value))
    const barDotWidth = Math.round(value * gridCols)

    // Build a 4-row strip for this stack frame (one braille text line)
    const strip = makeGrid(4, gridCols)

    // Center the bar horizontally
    const barStart = Math.floor((gridCols - barDotWidth) / 2)
    const barEnd = barStart + barDotWidth

    // Fill all 4 dot-rows solid for this bar
    for (let r = 0; r < 4; r++) {
      for (let c = barStart; c < barEnd; c++) {
        strip[r]![c] = true
      }
    }

    textLines.push({
      braille: gridToBraille(strip),
      label: stack.label,
    })
  }

  // Output each line: accent-colored braille bar + dim label to the right
  const output: string[] = []

  for (const { braille, label } of textLines) {
    // Pad braille to charWidth so labels align
    const padded = braille.length < charWidth
      ? braille + ' '.repeat(charWidth - braille.length)
      : braille.slice(0, charWidth)
    output.push(accent(padded) + '  ' + dim(label))
  }

  process.stdout.write(output.join('\n') + '\n')
}
