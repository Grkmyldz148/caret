/**
 * Caret time helpers — timestamp() and timeAgo()
 *
 * Return styled time strings for composition with other components.
 *
 *   timestamp()                       // "12:34:56"
 *   timestamp({ format: 'iso' })      // "2026-04-08T12:34:56"
 *   timestamp({ format: 'full' })     // "Apr 8, 2026 12:34:56"
 *
 *   timeAgo(new Date())                                // "just now"
 *   timeAgo(new Date(Date.now() - 1000 * 60 * 5))      // "5 minutes ago"
 *   timeAgo(new Date('2026-01-01'))                    // "3 months ago"
 *
 * Both return dim-colored strings suitable for composition with
 * messages, lists, tables, and paragraphs.
 */

import { getTheme } from '../theme/global.js'
import { mergeTheme } from '../theme/merge.js'
import type { PartialTheme } from '../theme/types.js'
import { paintDim } from '../lib/paint.js'

export type TimestampFormat = 'time' | 'iso' | 'full'

export type TimestampOptions = {
  format?: TimestampFormat
  date?: Date
  colored?: boolean
  theme?: PartialTheme
}

export function timestamp(options: TimestampOptions = {}): string {
  const theme = mergeTheme(getTheme(), options.theme)
  const date = options.date ?? new Date()
  const format = options.format ?? 'time'

  let formatted: string
  switch (format) {
    case 'iso':
      formatted = date.toISOString().replace(/\.\d+Z$/, '')
      break
    case 'full':
      formatted = date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
      break
    case 'time':
    default:
      formatted = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
      break
  }

  if (options.colored === false) return formatted
  return paintDim()(formatted)
  // theme is used to read theme context in paintDim indirectly
  void theme
}

export type TimeAgoOptions = {
  from?: Date
  colored?: boolean
  theme?: PartialTheme
}

export function timeAgo(date: Date, options: TimeAgoOptions = {}): string {
  const theme = mergeTheme(getTheme(), options.theme)
  const from = options.from ?? new Date()
  const diffMs = from.getTime() - date.getTime()
  const absSeconds = Math.abs(diffMs) / 1000

  const future = diffMs < 0
  const suffix = future ? 'from now' : 'ago'

  let formatted: string

  if (absSeconds < 10) {
    formatted = future ? 'in a moment' : 'just now'
  } else if (absSeconds < 60) {
    formatted = `${Math.floor(absSeconds)} seconds ${suffix}`
  } else if (absSeconds < 3600) {
    const n = Math.floor(absSeconds / 60)
    formatted = `${n} minute${n === 1 ? '' : 's'} ${suffix}`
  } else if (absSeconds < 86400) {
    const n = Math.floor(absSeconds / 3600)
    formatted = `${n} hour${n === 1 ? '' : 's'} ${suffix}`
  } else if (absSeconds < 2592000) {
    const n = Math.floor(absSeconds / 86400)
    formatted = `${n} day${n === 1 ? '' : 's'} ${suffix}`
  } else if (absSeconds < 31536000) {
    const n = Math.floor(absSeconds / 2592000)
    formatted = `${n} month${n === 1 ? '' : 's'} ${suffix}`
  } else {
    const n = Math.floor(absSeconds / 31536000)
    formatted = `${n} year${n === 1 ? '' : 's'} ${suffix}`
  }

  if (options.colored === false) return formatted
  return paintDim()(formatted)
  void theme
}
