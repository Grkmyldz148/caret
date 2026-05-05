/**
 * Caret snippet component
 *
 * A code block with an optional copy-to-clipboard hint and language
 * label. Wraps code in a gutter with line numbers. Unlike code-block,
 * snippet adds a "copy" affordance line at the bottom.
 *
 *   snippet({
 *     code: 'npm install @caret/cli',
 *     language: 'bash',
 *   })
 *
 * Output:
 *   ─ bash ────────────────────────
 *   │ npm install @caret/cli
 *   ────────────── ↵ copied to clipboard
 *
 * If `copyToClipboard` is true (default: false), it will attempt to
 * copy the code to the system clipboard.
 */

import { getTheme } from '../theme/global.js'
import { mergeTheme } from '../theme/merge.js'
import type { PartialTheme } from '../theme/types.js'
import { capability } from '../lib/capability.js'
import { paintAccent, paintDim, visibleLength } from '../lib/paint.js'

export type SnippetOptions = {
  code: string
  /** Language label shown on the top rule. */
  language?: string
  /** Show line numbers. Default: false for single-line, true for multi-line. */
  lineNumbers?: boolean
  /** Copy code to system clipboard. Default: false. */
  copyToClipboard?: boolean
  /** Override display width. Default: fit to terminal, capped at 80. */
  width?: number
  theme?: PartialTheme
}

async function copyToSystemClipboard(text: string): Promise<boolean> {
  try {
    const { exec } = await import('node:child_process')
    const { promisify } = await import('node:util')
    const execAsync = promisify(exec)

    if (process.platform === 'darwin') {
      await execAsync('pbcopy', { input: text } as never)
      return true
    }
    if (process.platform === 'linux') {
      // Try xclip first, then xsel
      try {
        await execAsync('xclip -selection clipboard', { input: text } as never)
        return true
      } catch {
        await execAsync('xsel --clipboard --input', { input: text } as never)
        return true
      }
    }
    return false
  } catch {
    return false
  }
}

export function snippet(options: SnippetOptions): void {
  const theme = mergeTheme(getTheme(), options.theme)
  const cap = capability()
  const accent = paintAccent(theme)
  const dim = paintDim()

  const codeLines = options.code.split('\n')
  const isMultiLine = codeLines.length > 1
  const showLineNums = options.lineNumbers ?? isMultiLine

  const gutterChar = cap.unicode ? theme.symbols.structure.gutter : '|'
  const ruler = cap.unicode ? theme.symbols.ruler : '-'

  const maxWidth = Math.min(options.width ?? 80, cap.columns)
  const gutterWidth = showLineNums ? String(codeLines.length).length + 1 : 0

  const lines: string[] = []

  // Top rule with language label
  if (options.language) {
    const label = ` ${options.language} `
    const ruleLen = Math.max(0, maxWidth - visibleLength(label) - 1)
    lines.push(dim(`${ruler}${label}${ruler.repeat(ruleLen)}`))
  } else {
    lines.push(dim(ruler.repeat(maxWidth)))
  }

  // Code lines
  for (let i = 0; i < codeLines.length; i++) {
    const line = codeLines[i]!
    if (showLineNums) {
      const num = dim(String(i + 1).padStart(gutterWidth))
      lines.push(`${num} ${dim(gutterChar)} ${line}`)
    } else {
      lines.push(`${dim(gutterChar)} ${line}`)
    }
  }

  // Bottom rule with copy hint
  const bottomRule = dim(ruler.repeat(Math.min(14, maxWidth)))
  lines.push(bottomRule)

  process.stdout.write(lines.join('\n') + '\n')

  // Attempt clipboard copy (fire-and-forget, no terminal output)
  if (options.copyToClipboard) {
    copyToSystemClipboard(options.code).catch(() => {})
  }
}
