/**
 * Caret calendar component
 *
 * A month-view calendar for date display. Static — renders once
 * to stdout. Highlights today and optionally marks specific dates.
 *
 *   calendar({ month: 3, year: 2026 })
 *   calendar({ month: 4, year: 2026, marked: [5, 12, 19] })
 *
 * Output:
 *   A P R I L   2 0 2 6
 *   Mo  Tu  We  Th  Fr  Sa  Su
 *         1   2   3   4   5
 *    6   7   8   9  10  11  12
 *   13  14  15  16  17  18  19
 *   20  21  22  23  24  25  26
 *   27  28  29  30
 */

import { getTheme } from '../theme/global.js'
import { mergeTheme } from '../theme/merge.js'
import type { PartialTheme } from '../theme/types.js'
import { paintAccent, paintDim, paintBold, paintSemantic } from '../lib/paint.js'
import { tracking } from '../lib/typography.js'

export type CalendarOptions = {
  /** Month (1-12). Default: current month. */
  month?: number
  /** Year. Default: current year. */
  year?: number
  /** Days to highlight with accent. */
  marked?: number[]
  /** Highlight today. Default: true. */
  highlightToday?: boolean
  theme?: PartialTheme
}

const MONTH_NAMES = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
]

const DAY_HEADERS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

export function calendar(options: CalendarOptions = {}): void {
  const theme = mergeTheme(getTheme(), options.theme)
  const accent = paintAccent(theme)
  const bold = paintBold()
  const dim = paintDim()

  const now = new Date()
  const month = (options.month ?? now.getMonth() + 1) - 1 // 0-indexed
  const year = options.year ?? now.getFullYear()
  const markedSet = new Set(options.marked ?? [])
  const highlightToday = options.highlightToday !== false

  const todayDay =
    highlightToday && now.getMonth() === month && now.getFullYear() === year
      ? now.getDate()
      : -1

  const cellWidth = 4 // "  1 " or " 12 "

  // Title
  const title = tracking(`${MONTH_NAMES[month]!} ${year}`)
  const lines: string[] = [accent(bold(title))]

  // Day headers
  const headerLine = DAY_HEADERS.map((d) => d.padStart(cellWidth)).join('')
  lines.push(dim(headerLine))

  // Compute first day of month (0=Sun, 1=Mon, ..., 6=Sat)
  const firstDate = new Date(year, month, 1)
  let firstDow = firstDate.getDay() // 0=Sun
  firstDow = firstDow === 0 ? 6 : firstDow - 1 // Convert to Mon=0

  const daysInMonth = new Date(year, month + 1, 0).getDate()

  let row = ''
  // Leading blanks
  for (let i = 0; i < firstDow; i++) {
    row += ' '.repeat(cellWidth)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = String(day).padStart(cellWidth)

    if (day === todayDay) {
      row += accent(bold(dayStr))
    } else if (markedSet.has(day)) {
      row += accent(dayStr)
    } else {
      row += dayStr
    }

    const dow = (firstDow + day - 1) % 7
    if (dow === 6 || day === daysInMonth) {
      lines.push(row)
      row = ''
    }
  }

  process.stdout.write(lines.join('\n') + '\n')
}
