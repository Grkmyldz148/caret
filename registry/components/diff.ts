/**
 * Caret diff component
 *
 * Renders unified-diff style lines with colored markers.
 *
 * Two modes:
 *
 *   1. Inline — no frame. Each line is `marker<space>text`. Use for
 *      short config/value diffs inside a larger output.
 *
 *      diff({ lines: [...] })
 *
 *   2. File — wrapped in a thin top/bottom rule frame with the filename
 *      in the top rule (same visual language as codeBlock). Use when the
 *      diff represents a file change.
 *
 *      diff({ filename: 'greet.ts', lines: [...] })
 *
 * Inline output:
 *     host: api.example.com
 *   - port: 80
 *   + port: 443
 *     timeout: 30s
 *
 * File output:
 *   ── greet.ts ──────────────────
 *       function greet(name: string) {
 *     - console.log(`Hello, ${name}!`)
 *     + return `Hello, ${name}!`
 *       }
 *   ──────────────────────────────
 */

import { getTheme } from '../theme/global.js'
import { mergeTheme } from '../theme/merge.js'
import type { PartialTheme } from '../theme/types.js'
import { paintAccent, paintSemantic, paintDim, visibleLength } from '../lib/paint.js'

export type DiffKind = 'added' | 'removed' | 'unchanged' | 'context'

export type DiffLine = {
  kind: DiffKind
  text: string
}

export type DiffOptions = {
  lines: ReadonlyArray<DiffLine>
  /**
   * When provided, renders the diff wrapped in a top/bottom rule frame
   * with the filename shown in the top rule. Matches codeBlock's visual
   * language. Omit for an inline diff with no frame.
   */
  filename?: string
  /** Override total rule width (file mode only). Default: fit content. */
  width?: number
  theme?: PartialTheme
}

export function diff(options: DiffOptions): void {
  const theme = mergeTheme(getTheme(), options.theme)
  const accent = paintAccent(theme)
  const success = paintSemantic(theme, 'success')
  const danger = paintSemantic(theme, 'danger')
  const dim = paintDim()

  const sym = theme.symbols.diff
  const out: string[] = []

  const fileMode = options.filename !== undefined

  // ─── FILE MODE ───────────────────────────────────────────────
  // Each row gets a 2-space left gutter, then a marker, then a space,
  // then the text. Added/removed rows are colored on the entire row
  // so the marker and text read as one block.
  if (fileMode) {
    const ruler = theme.symbols.ruler

    // Compute width from the longest rendered line
    let longest = 0
    for (const line of options.lines) {
      const rendered = `  ${markerFor(line.kind, sym)} ${line.text}`
      const len = visibleLength(rendered)
      if (len > longest) longest = len
    }
    const ruleWidth = Math.max(options.width ?? longest, 20)

    // Top rule — filename inside
    const label = ` ${options.filename} `
    const remaining = Math.max(0, ruleWidth - 3 - visibleLength(label))
    out.push(dim(ruler.repeat(2)) + accent.bold(label) + dim(ruler.repeat(remaining)))

    // Body
    for (const line of options.lines) {
      const marker = markerFor(line.kind, sym)
      const row = `  ${marker} ${line.text}`
      if (line.kind === 'added') {
        out.push(success(row))
      } else if (line.kind === 'removed') {
        out.push(danger(row))
      } else if (line.kind === 'context') {
        out.push(dim(row))
      } else {
        out.push(row)
      }
    }

    // Bottom rule
    out.push(dim(ruler.repeat(ruleWidth)))

    process.stdout.write(out.join('\n') + '\n')
    return
  }

  // ─── INLINE MODE ─────────────────────────────────────────────
  for (const line of options.lines) {
    if (line.kind === 'added') {
      out.push(success(`${sym.added} ${line.text}`))
    } else if (line.kind === 'removed') {
      out.push(danger(`${sym.removed} ${line.text}`))
    } else if (line.kind === 'context') {
      out.push(dim(`${sym.unchanged} ${line.text}`))
    } else {
      out.push(`${sym.unchanged} ${line.text}`)
    }
  }

  process.stdout.write(out.join('\n') + '\n')
}

function markerFor(kind: DiffKind, sym: { added: string; removed: string; unchanged: string }): string {
  if (kind === 'added') return sym.added
  if (kind === 'removed') return sym.removed
  return sym.unchanged
}
