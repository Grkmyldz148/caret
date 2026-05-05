/**
 * Caret link component
 *
 * Returns an OSC 8 hyperlink-encoded string. Modern terminals (iTerm2,
 * Wezterm, Kitty, GNOME Terminal, Windows Terminal) render the result
 * as a clickable link with the visible label.
 *
 *   link('https://caret.dev')
 *   link('https://caret.dev', 'caret.dev')
 *   link({ url: 'https://caret.dev', text: 'Read the docs' })
 *
 * `link` returns a string instead of writing to stdout, so you can compose
 * it inside other Caret components or your own log messages:
 *
 *   keyValue({
 *     rows: [{ key: 'Docs', value: link('https://caret.dev', 'caret.dev') }],
 *   })
 *
 * On terminals that don't support OSC 8 (or in piped output), the link
 * collapses to plain text — never a broken escape sequence.
 */

import { capability } from '../lib/capability.js'
import { paintAccent } from '../lib/paint.js'
import { getTheme } from '../theme/global.js'
import { mergeTheme } from '../theme/merge.js'
import type { PartialTheme } from '../theme/types.js'

export type LinkInput =
  | string
  | {
      url: string
      text?: string
      theme?: PartialTheme
    }

export function link(input: LinkInput, text?: string): string {
  const url = typeof input === 'string' ? input : input.url
  const display = typeof input === 'string' ? text ?? url : input.text ?? url
  const themeOverride = typeof input === 'object' ? input.theme : undefined

  const theme = mergeTheme(getTheme(), themeOverride)
  const cap = capability()
  const accent = paintAccent(theme)

  // No TTY → plain text. Pipe-safe.
  if (!cap.isTTY || cap.dumb) {
    return display
  }

  // OSC 8 hyperlink: ESC ] 8 ; ; URL BEL TEXT ESC ] 8 ; ; BEL
  const ESC = '\x1b'
  const BEL = '\x07'
  const start = `${ESC}]8;;${url}${BEL}`
  const end = `${ESC}]8;;${BEL}`

  return start + accent.underline(display) + end
}
