/**
 * Caret log component
 *
 * Streaming log output with timestamps and severity levels.
 * Follows Caret's foreground hierarchy — error/warn go to stderr,
 * info/debug go to stdout.
 *
 *   log({ message: 'Server started on port 3000' })
 *   log({ message: 'Request took 2.3s', level: 'warn' })
 *   log({ message: 'Connection refused', level: 'error' })
 *
 *   log.batch({
 *     entries: [
 *       { message: 'Compiling…', level: 'info' },
 *       { message: 'Bundle size: 142kb', level: 'info' },
 *       { message: 'Unused export in utils.ts', level: 'warn' },
 *     ],
 *   })
 */

import { getTheme } from '../theme/global.js'
import { mergeTheme } from '../theme/merge.js'
import type { PartialTheme } from '../theme/types.js'
import { paintDim, paintSemantic, paintAccent } from '../lib/paint.js'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export type LogEntry = {
  message: string
  level?: LogLevel
  /** ISO timestamp. Auto-generated if omitted. */
  timestamp?: string
  /** Optional source label (e.g. "server", "build"). */
  source?: string
}

export type LogOptions = LogEntry & {
  /** Show timestamp. Default: true. */
  showTimestamp?: boolean
  theme?: PartialTheme
}

export type LogBatchOptions = {
  entries: ReadonlyArray<LogEntry>
  showTimestamp?: boolean
  theme?: PartialTheme
}

function formatTimestamp(iso?: string): string {
  const date = iso ? new Date(iso) : new Date()
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  const s = String(date.getSeconds()).padStart(2, '0')
  const ms = String(date.getMilliseconds()).padStart(3, '0')
  return `${h}:${m}:${s}.${ms}`
}

function levelTag(level: LogLevel): string {
  switch (level) {
    case 'debug': return 'DBG'
    case 'info':  return 'INF'
    case 'warn':  return 'WRN'
    case 'error': return 'ERR'
  }
}

function formatEntry(
  entry: LogEntry,
  showTimestamp: boolean,
  theme: ReturnType<typeof getTheme>,
): { line: string; isError: boolean } {
  const level = entry.level ?? 'info'
  const dim = paintDim()
  const accent = paintAccent(theme)

  const parts: string[] = []

  if (showTimestamp) {
    parts.push(dim(formatTimestamp(entry.timestamp)))
  }

  const tag = levelTag(level)
  if (level === 'error') {
    parts.push(paintSemantic(theme, 'danger')(tag))
  } else if (level === 'warn') {
    parts.push(paintSemantic(theme, 'warning')(tag))
  } else if (level === 'debug') {
    parts.push(dim(tag))
  } else {
    parts.push(accent(tag))
  }

  if (entry.source) {
    parts.push(dim(`[${entry.source}]`))
  }

  parts.push(level === 'debug' ? dim(entry.message) : entry.message)

  return {
    line: parts.join(' '),
    isError: level === 'error' || level === 'warn',
  }
}

export function log(options: LogOptions): void {
  const theme = mergeTheme(getTheme(), options.theme)
  const showTimestamp = options.showTimestamp !== false
  const { line, isError } = formatEntry(options, showTimestamp, theme)

  if (isError) {
    process.stderr.write(line + '\n')
  } else {
    process.stdout.write(line + '\n')
  }
}

log.batch = function batch(options: LogBatchOptions): void {
  const theme = mergeTheme(getTheme(), options.theme)
  const showTimestamp = options.showTimestamp !== false

  for (const entry of options.entries) {
    const { line, isError } = formatEntry(entry, showTimestamp, theme)
    if (isError) {
      process.stderr.write(line + '\n')
    } else {
      process.stdout.write(line + '\n')
    }
  }
}
