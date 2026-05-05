/**
 * Caret timeline component
 *
 * A vertical event log — perfect for deploy histories, git log summaries,
 * audit trails, activity feeds. Distinct from `step` (which models a
 * sequential process with per-step status): a timeline is a series of
 * events in time, each with its own timestamp and a node marker.
 *
 *   timeline({
 *     events: [
 *       { time: '10:30', title: 'Deploy started',      body: 'Build #4521 triggered by push to main' },
 *       { time: '10:31', title: 'Tests passed',        body: '247 tests passed in 42.3s' },
 *       { time: '10:34', title: 'Deploy complete',     body: 'v1.2.4 is live on production' },
 *       { time: '10:45', title: 'User reported issue', body: 'Login form shows validation error', kind: 'muted' },
 *     ],
 *   })
 *
 * Output shape:
 *   10:30  ●  Deploy started
 *          │  Build #4521 triggered by push to main
 *          │
 *   10:31  ●  Tests passed
 *          │  247 tests passed in 42.3s
 *          │
 *   10:34  ●  Deploy complete
 *          │  v1.2.4 is live on production
 *          │
 *   10:45  ○  User reported issue
 *             Login form shows validation error
 *
 * Left column: right-aligned timestamp in dim. Middle column: node +
 * vertical gutter `│` connecting events. Right column: bold accent
 * title and optional wrapped body.
 */

import { getTheme } from '../theme/global.js'
import { mergeTheme } from '../theme/merge.js'
import type { PartialTheme } from '../theme/types.js'
import { capability } from '../lib/capability.js'
import {
  paintAccent,
  paintBold,
  paintDim,
  paintSemantic,
  visibleLength,
} from '../lib/paint.js'

export type TimelineEventKind =
  | 'default'
  | 'muted'
  | 'success'
  | 'failure'
  | 'warning'

export type TimelineEvent = {
  time?: string
  title: string
  body?: string
  kind?: TimelineEventKind
}

export type TimelineOptions = {
  events: ReadonlyArray<TimelineEvent>
  /** Max total width. Default: min(terminal columns, 80). */
  width?: number
  theme?: PartialTheme
}

export function timeline(options: TimelineOptions): void {
  const theme = mergeTheme(getTheme(), options.theme)
  const accent = paintAccent(theme)
  const bold = paintBold()
  const dim = paintDim()
  const cap = capability()

  const totalWidth = Math.max(20, Math.min(options.width ?? 80, cap.columns))

  // Time column width — max visible length of any timestamp.
  let timeColWidth = 0
  for (const ev of options.events) {
    if (ev.time) {
      const w = visibleLength(ev.time)
      if (w > timeColWidth) timeColWidth = w
    }
  }

  // Column geometry:
  //   [time] "  " [node] "  " [content]
  // When no events have a time, the time column collapses to 0 width
  // and the leading "  " gap disappears.
  const hasTime = timeColWidth > 0
  const timeGap = hasTime ? 2 : 0
  const nodeColWidth = 1
  const nodeGap = 2
  const prefixWidth = timeColWidth + timeGap + nodeColWidth + nodeGap
  const contentWidth = Math.max(10, totalWidth - prefixWidth)

  // Continuation prefix (the `│` gutter + alignment) used for body lines
  // and the blank spacer between events.
  const timePad = ' '.repeat(timeColWidth + timeGap)
  const gutterSym = theme.symbols.structure.gutter
  const gutterCell = dim(gutterSym)
  const gapCell = ' '.repeat(nodeGap)
  const blankNode = ' '
  const contIndent = timePad + gutterCell + gapCell
  const lastContIndent = timePad + blankNode + gapCell

  const lines: string[] = []

  for (let i = 0; i < options.events.length; i++) {
    const ev = options.events[i]!
    const isLast = i === options.events.length - 1
    const kind: TimelineEventKind = ev.kind ?? 'default'

    // Node symbol + color per kind.
    let nodeGlyph: string
    switch (kind) {
      case 'muted':
        nodeGlyph = dim(theme.symbols.marker.unselected)
        break
      case 'success':
        nodeGlyph = paintSemantic(theme, 'success')(
          theme.symbols.state.success,
        )
        break
      case 'failure':
        nodeGlyph = paintSemantic(theme, 'danger')(
          theme.symbols.state.failure,
        )
        break
      case 'warning':
        nodeGlyph = paintSemantic(theme, 'warning')(
          theme.symbols.state.warning,
        )
        break
      case 'default':
      default:
        nodeGlyph = accent(bold(theme.symbols.marker.selected))
        break
    }

    // Time cell — right-aligned, dim.
    let timeCell = ''
    if (hasTime) {
      const raw = ev.time ?? ''
      const rawLen = visibleLength(raw)
      const pad = ' '.repeat(Math.max(0, timeColWidth - rawLen))
      timeCell = pad + dim(raw) + '  '
    }

    // Title line.
    const titleRender = kind === 'muted' ? dim(ev.title) : bold(accent(ev.title))
    lines.push(timeCell + nodeGlyph + gapCell + titleRender)

    // Body lines — wrapped to content width.
    if (ev.body) {
      const wrapped = wrap(ev.body, contentWidth)
      const bodyIndent = isLast ? lastContIndent : contIndent
      for (const line of wrapped) {
        lines.push(bodyIndent + line)
      }
    }

    // Trailing gutter line between events (not after the last one).
    if (!isLast) {
      lines.push(timePad + gutterCell)
    }
  }

  process.stdout.write(lines.join('\n') + '\n')
}

/**
 * Word-wrap `text` into lines no wider than `width` visible characters.
 * Respects explicit newlines in the input.
 */
function wrap(text: string, width: number): string[] {
  const paragraphs = text.split('\n')
  const out: string[] = []

  for (const para of paragraphs) {
    if (para === '') {
      out.push('')
      continue
    }
    const words = para.split(' ')
    let current = ''
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word
      if (visibleLength(candidate) > width && current) {
        out.push(current)
        current = word
      } else {
        current = candidate
      }
    }
    if (current) out.push(current)
  }

  return out
}
