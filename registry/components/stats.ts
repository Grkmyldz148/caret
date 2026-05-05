/**
 * Caret stats component
 *
 * Horizontal KPI stat cards — a big bold value with a small tracked CAPS
 * label and an optional trend arrow + delta. Used in dashboards, status
 * summaries, financial-style overviews.
 *
 *   stats({
 *     items: [
 *       { label: 'Requests', value: '1.2M',   trend: 'up',      delta: '+12%' },
 *       { label: 'Latency',  value: '23ms',   trend: 'down',    delta: '-5ms' },
 *       { label: 'Errors',   value: '0.3%',   trend: 'neutral' },
 *       { label: 'Uptime',   value: '99.98%' },
 *     ],
 *   })
 *
 * Output shape:
 *   R E Q U E S T S   L A T E N C Y   E R R O R S   U P T I M E
 *   1.2M  ↑ +12%      23ms  ↓ -5ms    0.3%  →       99.98%
 *
 * Editorial: no background colors, hierarchy via attribute stacks — the
 * label reads as a dim tracked caption, the value as the bold statement,
 * and the trend arrow is a symbol that carries meaning on its own
 * (manifesto § Symbols). `up` is accent, `down` and `neutral` are dim.
 */

import { getTheme } from '../theme/global.js'
import { mergeTheme } from '../theme/merge.js'
import type { PartialTheme } from '../theme/types.js'
import { capability } from '../lib/capability.js'
import { paintAccent, paintBold, paintDim, visibleLength } from '../lib/paint.js'
import { tracking, trackingLength } from '../lib/typography.js'

/** Trend arrows — exported for consistency across Caret surfaces. */
export const STAT_TREND_SYMBOLS = {
  up: '↑',
  down: '↓',
  neutral: '→',
} as const

export type StatTrend = 'up' | 'down' | 'neutral'

export type StatItem = {
  label: string
  value: string
  trend?: StatTrend
  /** e.g. '+12%', '-5ms' — rendered next to the trend arrow. */
  delta?: string
}

export type StatsOptions = {
  items: ReadonlyArray<StatItem>
  /** Total width. Default: min(terminal columns, 80). */
  width?: number
  /** Gap between adjacent stats on the same row. Default: 3. */
  gap?: number
  theme?: PartialTheme
}

type LaidOutStat = {
  item: StatItem
  /** Width of the cell in visible characters. */
  cellWidth: number
  /** Rendered (colored) label line, already padded. */
  labelLine: string
  /** Rendered (colored) value line, already padded. */
  valueLine: string
}

export function stats(options: StatsOptions): void {
  const theme = mergeTheme(getTheme(), options.theme)
  const accent = paintAccent(theme)
  const bold = paintBold()
  const dim = paintDim()
  const cap = capability()

  const gap = Math.max(1, options.gap ?? 3)
  const totalWidth = Math.max(20, Math.min(options.width ?? 80, cap.columns))

  // Build each stat's raw label + value strings (uncolored) so we can
  // measure, then produce the colored, padded versions.
  const cells: LaidOutStat[] = options.items.map((item) => {
    const rawLabel = tracking(item.label)
    const rawLabelLen = trackingLength(item.label)

    const trendSym =
      item.trend !== undefined ? STAT_TREND_SYMBOLS[item.trend] : ''
    // Value cell: "value  ↑ +12%" — two spaces between value and arrow
    // when an arrow exists, single space between arrow and delta.
    let rawValue = item.value
    if (trendSym) {
      rawValue += '  ' + trendSym
      if (item.delta) rawValue += ' ' + item.delta
    }
    const rawValueLen = visibleLength(rawValue)

    const cellWidth = Math.max(rawLabelLen, rawValueLen)

    // Color the pieces.
    const coloredLabel = dim(rawLabel)
    let coloredValue = bold(item.value)
    if (trendSym) {
      const trendColor = item.trend === 'up' ? accent : dim
      coloredValue += '  ' + trendColor(trendSym)
      if (item.delta) coloredValue += ' ' + trendColor(item.delta)
    }

    // Pad both lines to cellWidth (left-aligned).
    const labelPad = ' '.repeat(Math.max(0, cellWidth - rawLabelLen))
    const valuePad = ' '.repeat(Math.max(0, cellWidth - rawValueLen))

    return {
      item,
      cellWidth,
      labelLine: coloredLabel + labelPad,
      valueLine: coloredValue + valuePad,
    }
  })

  // Lay out into rows: greedy fit, wrap when the next cell would exceed
  // the total width.
  const rows: LaidOutStat[][] = []
  let current: LaidOutStat[] = []
  let currentWidth = 0
  const gapStr = ' '.repeat(gap)

  for (const cell of cells) {
    const addition = current.length === 0 ? cell.cellWidth : gap + cell.cellWidth
    if (current.length > 0 && currentWidth + addition > totalWidth) {
      rows.push(current)
      current = [cell]
      currentWidth = cell.cellWidth
    } else {
      current.push(cell)
      currentWidth += addition
    }
  }
  if (current.length > 0) rows.push(current)

  const lines: string[] = []
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]!
    const labelLine = row.map((c) => c.labelLine).join(gapStr)
    const valueLine = row.map((c) => c.valueLine).join(gapStr)
    lines.push(labelLine)
    lines.push(valueLine)
    // Blank line between wrapped rows for breathing room.
    if (i < rows.length - 1) lines.push('')
  }

  process.stdout.write(lines.join('\n') + '\n')
}
