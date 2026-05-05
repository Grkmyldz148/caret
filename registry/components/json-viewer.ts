/**
 * Caret json-viewer component
 *
 * Formatted JSON display with syntax highlighting and indentation.
 * Static — renders once to stdout.
 *
 *   jsonViewer({ data: { name: 'caret', version: '0.1.0', tags: ['cli', 'ui'] } })
 *
 * Output:
 *   {
 *     "name": "caret",
 *     "version": "0.1.0",
 *     "tags": [
 *       "cli",
 *       "ui"
 *     ]
 *   }
 *
 * Keys are accented, strings are default, numbers bold, booleans
 * semantic, null dim.
 */

import { getTheme } from '../theme/global.js'
import { mergeTheme } from '../theme/merge.js'
import type { PartialTheme } from '../theme/types.js'
import { capability } from '../lib/capability.js'
import { paintAccent, paintDim, paintBold, paintSemantic } from '../lib/paint.js'

export type JsonViewerOptions = {
  /** The data to display. Any JSON-serializable value. */
  data: unknown
  /** Indentation width. Default: 2. */
  indent?: number
  /** Max depth before collapsing to inline. Default: 10. */
  maxDepth?: number
  /** Max string length before truncating. Default: 80. */
  maxStringLength?: number
  theme?: PartialTheme
}

export function jsonViewer(options: JsonViewerOptions): void {
  const theme = mergeTheme(getTheme(), options.theme)
  const cap = capability()

  const accent = paintAccent(theme)
  const dim = paintDim()
  const bold = paintBold()
  const successPaint = paintSemantic(theme, 'success')
  const dangerPaint = paintSemantic(theme, 'danger')

  const indentSize = options.indent ?? 2
  const maxDepth = options.maxDepth ?? 10
  const maxStr = options.maxStringLength ?? 80

  function render(value: unknown, depth: number): string[] {
    const prefix = ' '.repeat(depth * indentSize)
    const childPrefix = ' '.repeat((depth + 1) * indentSize)

    if (value === null) {
      return [prefix + dim('null')]
    }

    if (value === undefined) {
      return [prefix + dim('undefined')]
    }

    if (typeof value === 'string') {
      let str = value
      if (str.length > maxStr) {
        str = str.slice(0, maxStr - 1) + '…'
      }
      // Escape special chars in display
      str = str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\t/g, '\\t')
      return [prefix + `"${str}"`]
    }

    if (typeof value === 'number') {
      return [prefix + bold(String(value))]
    }

    if (typeof value === 'boolean') {
      return [prefix + (value ? successPaint(String(value)) : dangerPaint(String(value)))]
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return [prefix + dim('[]')]
      }

      if (depth >= maxDepth) {
        return [prefix + dim(`[…${value.length} items]`)]
      }

      const lines: string[] = [prefix + '[']
      for (let i = 0; i < value.length; i++) {
        const itemLines = render(value[i], depth + 1)
        const last = i === value.length - 1
        if (itemLines.length === 1) {
          lines.push(itemLines[0]! + (last ? '' : ','))
        } else {
          for (let j = 0; j < itemLines.length; j++) {
            if (j === itemLines.length - 1 && !last) {
              lines.push(itemLines[j]! + ',')
            } else {
              lines.push(itemLines[j]!)
            }
          }
        }
      }
      lines.push(prefix + ']')
      return lines
    }

    if (typeof value === 'object') {
      const entries = Object.entries(value as Record<string, unknown>)
      if (entries.length === 0) {
        return [prefix + dim('{}')]
      }

      if (depth >= maxDepth) {
        return [prefix + dim(`{…${entries.length} keys}`)]
      }

      const lines: string[] = [prefix + '{']
      for (let i = 0; i < entries.length; i++) {
        const [key, val] = entries[i]!
        const keyStr = accent(`"${key}"`)
        const valLines = render(val, depth + 1)
        const last = i === entries.length - 1

        if (valLines.length === 1) {
          // Inline: "key": value
          const valStr = valLines[0]!.trimStart()
          lines.push(childPrefix + keyStr + ': ' + valStr + (last ? '' : ','))
        } else {
          // Multi-line value
          lines.push(childPrefix + keyStr + ':')
          for (let j = 0; j < valLines.length; j++) {
            if (j === valLines.length - 1 && !last) {
              lines.push(valLines[j]! + ',')
            } else {
              lines.push(valLines[j]!)
            }
          }
        }
      }
      lines.push(prefix + '}')
      return lines
    }

    return [prefix + String(value)]
  }

  const output = render(options.data, 0)
  process.stdout.write(output.join('\n') + '\n')
}
