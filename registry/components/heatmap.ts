/**
 * Caret heatmap component
 *
 * A grid-based heatmap using block characters. Maps numeric values
 * to intensity levels via dim → normal → bold → accent.
 *
 *   heatmap({
 *     data: [
 *       [0, 1, 3, 5, 2],
 *       [1, 4, 5, 3, 0],
 *       [2, 3, 4, 5, 1],
 *     ],
 *     rowLabels: ['Mon', 'Tue', 'Wed'],
 *     colLabels: ['9am', '10am', '11am', '12pm', '1pm'],
 *   })
 *
 * Output:
 *   Mon  ░ ▒ ▓ █ ▒
 *   Tue  ▒ ▓ █ ▓ ░
 *   Wed  ▒ ▓ ▓ █ ░
 *        9am 10am 11am 12pm 1pm
 */

import { getTheme } from '../theme/global.js'
import { mergeTheme } from '../theme/merge.js'
import type { PartialTheme } from '../theme/types.js'
import { capability } from '../lib/capability.js'
import { paintAccent, paintDim, paintBold } from '../lib/paint.js'

export type HeatmapOptions = {
  /** 2D array of numeric values. Rows × Columns. */
  data: number[][]
  /** Labels for each row. */
  rowLabels?: string[]
  /** Labels for each column. */
  colLabels?: string[]
  /** Custom min value. Default: auto from data. */
  min?: number
  /** Custom max value. Default: auto from data. */
  max?: number
  /** Cell width in characters. Default: 2. */
  cellWidth?: number
  theme?: PartialTheme
}

// Block characters for 5 intensity levels
const BLOCKS_UNICODE = [' ', '░', '▒', '▓', '█']
const BLOCKS_ASCII = [' ', '.', ':', '#', '@']

export function heatmap(options: HeatmapOptions): void {
  const theme = mergeTheme(getTheme(), options.theme)
  const cap = capability()
  const accent = paintAccent(theme)
  const dim = paintDim()
  const bold = paintBold()

  const blocks = cap.unicode ? BLOCKS_UNICODE : BLOCKS_ASCII
  const cellW = options.cellWidth ?? 2

  // Compute min/max
  let dataMin = options.min ?? Infinity
  let dataMax = options.max ?? -Infinity
  for (const row of options.data) {
    for (const val of row) {
      if (val < dataMin) dataMin = val
      if (val > dataMax) dataMax = val
    }
  }
  if (!isFinite(dataMin)) dataMin = 0
  if (!isFinite(dataMax)) dataMax = 1
  const range = dataMax - dataMin || 1

  // Row label padding
  const rowLabelWidth = options.rowLabels
    ? Math.max(...options.rowLabels.map((l) => l.length)) + 2
    : 0

  const lines: string[] = []

  for (let r = 0; r < options.data.length; r++) {
    const row = options.data[r]!
    let line = ''

    if (options.rowLabels && options.rowLabels[r]) {
      line += dim(options.rowLabels[r]!.padEnd(rowLabelWidth))
    }

    for (const val of row) {
      const normalized = (val - dataMin) / range
      const level = Math.min(blocks.length - 1, Math.floor(normalized * (blocks.length - 0.01)))
      const block = blocks[level]!.repeat(cellW)

      if (level >= blocks.length - 1) {
        line += accent(block)
      } else if (level >= blocks.length - 2) {
        line += bold(block)
      } else if (level <= 0) {
        line += dim(block)
      } else {
        line += block
      }

      line += ' ' // gap between cells
    }

    lines.push(line)
  }

  // Column labels
  if (options.colLabels) {
    const pad = ' '.repeat(rowLabelWidth)
    const colLine = options.colLabels
      .map((l) => l.padEnd(cellW + 1))
      .join('')
    lines.push(dim(pad + colLine))
  }

  process.stdout.write(lines.join('\n') + '\n')
}
