/**
 * Caret progress component
 *
 * Renders a single horizontal progress bar line. Uses thin heavy/light
 * horizontal characters (━ ─) so multiple bars stack cleanly without
 * looking like a wall.
 *
 *   progress({ value: 42, total: 100, label: 'Building' })
 *
 * Output:
 *   Building  ━━━━━━━━╸──────────────  42%
 */

import { getTheme } from '../theme/global.js'
import { mergeTheme } from '../theme/merge.js'
import type { PartialTheme } from '../theme/types.js'
import { capability } from '../lib/capability.js'
import { paintAccent, paintDim, pad, visibleLength } from '../lib/paint.js'

/** Default maximum bar width in characters. */
const DEFAULT_BAR_WIDTH = 32

export type ProgressOptions = {
  value: number
  total: number
  label?: string
  /** Width of the bar in characters. Default: 32 (auto-shrinks for narrow terminals). */
  width?: number
  /** Show percent label. Default: true. */
  showPercent?: boolean
  /** Show count label like "42/100". Default: false. */
  showCount?: boolean
  /** Show a head character at the filled/empty boundary. Default: true. */
  showHead?: boolean
  theme?: PartialTheme
}

export function progress(options: ProgressOptions): void {
  const theme = mergeTheme(getTheme(), options.theme)
  const accent = paintAccent(theme)
  const dim = paintDim()
  const cap = capability()

  const value = Math.max(0, Math.min(options.value, options.total))
  const ratio = options.total > 0 ? value / options.total : 0
  const percent = Math.round(ratio * 100)

  const labelText = options.label ?? ''
  const showPercent = options.showPercent !== false
  const showCount = options.showCount === true
  const showHead = options.showHead !== false

  const percentText = showPercent ? `${pad(`${percent}%`, 4, 'right')}` : ''
  const countText = showCount ? `${value}/${options.total}` : ''
  const suffix = [percentText, countText].filter(Boolean).join('  ')

  // Compute bar width — capped at DEFAULT_BAR_WIDTH unless explicitly overridden,
  // and shrunk to fit the terminal if needed.
  const labelWidth = labelText ? visibleLength(labelText) + 2 : 0
  const suffixWidth = suffix ? visibleLength(suffix) + 2 : 0
  const availableWidth = Math.max(8, cap.columns - labelWidth - suffixWidth - 2)
  const requestedWidth = options.width ?? Math.min(DEFAULT_BAR_WIDTH, availableWidth)
  const barWidth = Math.min(requestedWidth, availableWidth)

  const filledCount = Math.round(barWidth * ratio)
  const emptyCount = barWidth - filledCount

  // Build the bar with optional head character
  let filledBar: string
  let emptyBar: string

  if (showHead && filledCount > 0 && emptyCount > 0) {
    // Replace the last filled char with the head character for a cleaner edge
    const filledMain = theme.symbols.progress.filled.repeat(filledCount - 1)
    const head = theme.symbols.progress.head
    filledBar = accent(filledMain + head)
    emptyBar = dim(theme.symbols.progress.empty.repeat(emptyCount))
  } else {
    filledBar = accent(theme.symbols.progress.filled.repeat(filledCount))
    emptyBar = dim(theme.symbols.progress.empty.repeat(emptyCount))
  }

  const parts: string[] = []
  if (labelText) parts.push(labelText)
  parts.push(filledBar + emptyBar)
  if (suffix) parts.push(dim(suffix))

  process.stdout.write(parts.join('  ') + '\n')
}
