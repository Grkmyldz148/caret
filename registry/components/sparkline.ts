/**
 * Caret sparkline component
 *
 * Returns an inline mini chart string, mapping numeric values to Unicode
 * block characters. Useful for trends, activity, small histograms.
 *
 *   sparkline([1, 2, 4, 7, 8, 6, 3, 2])
 *   → "▁▂▃▆█▆▃▂"
 *
 *   info(`CPU usage: ${sparkline(cpuHistory)} ${cpuHistory.at(-1)}%`)
 *
 * Returns a string — compose with other components.
 */

import { getTheme } from '../theme/global.js'
import { mergeTheme } from '../theme/merge.js'
import type { PartialTheme } from '../theme/types.js'
import { paintAccent } from '../lib/paint.js'

const BARS = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'] as const

export type SparklineOptions = {
  /** Override the min/max range. Default: auto from values. */
  min?: number
  max?: number
  /** Color the sparkline in accent. Default: true. */
  color?: boolean
  theme?: PartialTheme
}

export function sparkline(values: ReadonlyArray<number>, options: SparklineOptions = {}): string {
  if (values.length === 0) return ''
  const theme = mergeTheme(getTheme(), options.theme)

  const min = options.min ?? Math.min(...values)
  const max = options.max ?? Math.max(...values)
  const range = max - min || 1

  const chars = values.map((v) => {
    const clamped = Math.max(min, Math.min(max, v))
    const normalized = (clamped - min) / range
    const idx = Math.min(BARS.length - 1, Math.max(0, Math.round(normalized * (BARS.length - 1))))
    return BARS[idx] ?? ' '
  })

  const result = chars.join('')
  if (options.color === false) return result
  return paintAccent(theme)(result)
}
