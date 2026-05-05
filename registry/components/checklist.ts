/**
 * Caret checklist component
 *
 * A static TODO-style list with checkbox markers. Each item can be
 * done or pending. For interactive checklists use `prompt.multiSelect`.
 *
 *   checklist({
 *     items: [
 *       { label: 'Install dependencies', done: true },
 *       { label: 'Configure environment', done: true },
 *       { label: 'Run migrations' },
 *       { label: 'Start server' },
 *     ],
 *   })
 *
 * Output:
 *   ✓ Install dependencies
 *   ✓ Configure environment
 *   ○ Run migrations
 *   ○ Start server
 */

import { getTheme } from '../theme/global.js'
import { mergeTheme } from '../theme/merge.js'
import type { PartialTheme } from '../theme/types.js'
import { paintDim, paintSemantic } from '../lib/paint.js'

export type ChecklistItem = {
  label: string
  done?: boolean
  description?: string
}

export type ChecklistOptions = {
  items: ReadonlyArray<ChecklistItem>
  theme?: PartialTheme
}

export function checklist(options: ChecklistOptions): void {
  const theme = mergeTheme(getTheme(), options.theme)
  const success = paintSemantic(theme, 'success')
  const dim = paintDim()

  const lines: string[] = []

  for (const item of options.items) {
    const done = item.done === true
    const mark = done ? success(theme.symbols.state.success) : dim(theme.symbols.marker.unselected)
    const labelRender = done ? item.label : dim(item.label)
    let line = `${mark} ${labelRender}`
    if (item.description !== undefined) {
      line += dim(` — ${item.description}`)
    }
    lines.push(line)
  }

  process.stdout.write(lines.join('\n') + '\n')
}
