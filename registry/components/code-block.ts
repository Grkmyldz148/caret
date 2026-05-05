/**
 * Caret code-block component
 *
 * Renders a multi-line code block with a thin top and bottom rule
 * (no side borders — per specs/look.md § Borders & surfaces), an
 * optional language label inside the top rule, and dim line numbers.
 *
 * No syntax highlighting in v0 — code is rendered as plain monospace.
 *
 *   codeBlock(`function hello() {
 *     return 'world'
 *   }`, { language: 'ts' })
 *
 * Output:
 *   ── ts ─────────────────────
 *    1  function hello() {
 *    2    return 'world'
 *    3  }
 *   ───────────────────────────
 */

import { getTheme } from '../theme/global.js'
import { mergeTheme } from '../theme/merge.js'
import type { PartialTheme } from '../theme/types.js'
import { paintAccent, paintDim, visibleLength } from '../lib/paint.js'

export type CodeBlockOptions = {
  /** Language label shown in the top rule. */
  language?: string
  /** Show line numbers. Default: true. */
  showLineNumbers?: boolean
  /** Override total rule width. Default: longest content line + padding. */
  width?: number
  theme?: PartialTheme
}

export function codeBlock(code: string, options: CodeBlockOptions = {}): void {
  const theme = mergeTheme(getTheme(), options.theme)
  const accent = paintAccent(theme)
  const dim = paintDim()

  const lines = code.replace(/^\n/, '').replace(/\n$/, '').split('\n')
  const showLineNumbers = options.showLineNumbers !== false
  const lineNumWidth = showLineNumbers ? String(lines.length).length : 0

  // Each rendered content line is: " " + <line-num-column> + "  " + <code>
  // Leading space is the left-gutter breathing room.
  const leftPad = 1
  const gutter = showLineNumbers ? lineNumWidth + 2 : 0
  const longest = lines.reduce((acc, l) => Math.max(acc, visibleLength(l)), 0)
  const contentWidth = longest + leftPad + gutter
  const ruleWidth = Math.max(options.width ?? contentWidth, 20)

  const out: string[] = []
  const ruler = theme.symbols.ruler

  // Top rule — optionally with language label inside
  if (options.language !== undefined) {
    const label = ` ${options.language} `
    const remaining = Math.max(0, ruleWidth - 3 - visibleLength(label))
    out.push(dim(ruler.repeat(2)) + accent.bold(label) + dim(ruler.repeat(remaining)))
  } else {
    out.push(dim(ruler.repeat(ruleWidth)))
  }

  // Code lines
  lines.forEach((line, i) => {
    const num = showLineNumbers ? dim(String(i + 1).padStart(lineNumWidth) + '  ') : ''
    out.push(' '.repeat(leftPad) + num + line)
  })

  // Bottom rule
  out.push(dim(ruler.repeat(ruleWidth)))

  process.stdout.write(out.join('\n') + '\n')
}
