/**
 * Caret chat component
 *
 * Role-based chat message display for AI / LLM CLI tools (Claude,
 * GPT, Ollama wrappers, Aider-like agents). Renders each message
 * as an editorial quote block: a vertical gutter, a tracked CAPS
 * role label, an optional dim timestamp, and word-wrapped content
 * indented past the gutter.
 *
 *   chat({
 *     messages: [
 *       { role: 'user', content: 'What is the meaning of life?' },
 *       { role: 'assistant', content: 'According to Douglas Adams, it is 42.' },
 *       { role: 'system', content: 'Session started at 10:30 AM' },
 *     ],
 *   })
 *
 * Output shape:
 *   │ YOU                                            10:30
 *   │ What is the meaning of life?
 *
 *   │ CLAUDE                                         10:30
 *   │ According to Douglas Adams, the answer to life,
 *   │ the universe, and everything is 42.
 *
 *   ⋯ SYSTEM · Session started at 10:30 AM
 *
 * Static — writes to stdout once. Follows specs/look.md: no
 * background colors, FG hierarchy via ANSI attributes, vertical
 * bar as the only routine border, tracked CAPS for role labels.
 */

import { getTheme } from '../theme/global.js'
import { mergeTheme } from '../theme/merge.js'
import type { PartialTheme } from '../theme/types.js'
import { capability } from '../lib/capability.js'
import { paintAccent, paintBold, paintDim, visibleLength } from '../lib/paint.js'
import { tracking, trackingLength } from '../lib/typography.js'

export type ChatRole = 'user' | 'assistant' | 'system'

export type ChatMessage = {
  role: ChatRole
  content: string
  /** Override display name (e.g. 'claude' instead of 'assistant'). */
  name?: string
  /** Optional timestamp string — printed dim, right-aligned in the header row. */
  timestamp?: string
}

export type ChatOptions = {
  messages: ReadonlyArray<ChatMessage>
  /** Maximum line width. Default: min(terminal columns, 80). */
  width?: number
  theme?: PartialTheme
}

export function chat(options: ChatOptions): void {
  const theme = mergeTheme(getTheme(), options.theme)
  const accent = paintAccent(theme)
  const bold = paintBold()
  const dim = paintDim()
  const cap = capability()

  const totalWidth = Math.min(options.width ?? 80, cap.columns)
  const gutterChar = theme.symbols.structure.gutter
  // "│ " — gutter plus single space before content
  const gutterIndent = 2
  const contentWidth = Math.max(20, totalWidth - gutterIndent)

  const lines: string[] = []

  options.messages.forEach((message, index) => {
    if (index > 0) lines.push('')

    if (message.role === 'system') {
      // System messages are a single subtle line — no block, no gutter.
      // Form: "⋯ SYSTEM · content" in dim italic.
      const label = tracking(message.name ?? 'system')
      const head = `${theme.symbols.ellipsis} ${label}`
      const body = ` ${theme.symbols.leader} ${message.content}`
      const tsTail =
        message.timestamp !== undefined ? `  ${message.timestamp}` : ''
      lines.push(dim(head + body + tsTail))
      return
    }

    const isUser = message.role === 'user'
    const displayName =
      message.name ?? (isUser ? 'you' : message.role)
    const trackedName = tracking(displayName)

    // Gutter color: accent for user, dim for assistant.
    const paintGutter = isUser ? accent : dim
    const gutter = paintGutter(gutterChar)

    // Header: "│ YOU                          10:30"
    // User label: accent bold. Assistant label: dim (restrained).
    const paintedLabel = isUser ? accent(bold(trackedName)) : dim(trackedName)
    const labelLen = trackingLength(displayName)

    let header = `${gutter} ${paintedLabel}`
    if (message.timestamp !== undefined) {
      const tsLen = visibleLength(message.timestamp)
      const used = gutterIndent + labelLen
      const pad = Math.max(2, totalWidth - used - tsLen)
      header += ' '.repeat(pad) + dim(message.timestamp)
    }
    lines.push(header)

    // Content: word-wrapped, each line prefixed with "│ ".
    const wrapped = wrap(message.content, contentWidth)
    for (const line of wrapped) {
      lines.push(`${gutter} ${line}`)
    }
  })

  process.stdout.write(lines.join('\n') + '\n')
}

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
