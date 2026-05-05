/**
 * Caret statusLine component
 *
 * A compact single-line view of multiple status items. Each item has a
 * label and a status (done/active/pending/failed/skipped). Static.
 *
 *   statusLine({
 *     items: [
 *       { label: 'built',     status: 'done' },
 *       { label: 'tested',    status: 'done' },
 *       { label: 'deploying', status: 'active' },
 *       { label: 'verified',  status: 'pending' },
 *     ],
 *   })
 *
 * Output:
 *   ✓ built  ✓ tested  ● deploying  ○ verified
 *
 * Use for summary bars, pipeline-at-a-glance, state dashboards. For
 * multi-line detailed view use `step`.
 */

import { getTheme } from '../theme/global.js'
import { mergeTheme } from '../theme/merge.js'
import type { PartialTheme } from '../theme/types.js'
import { paintAccent, paintDim, paintSemantic } from '../lib/paint.js'

export type StatusLineStatus = 'done' | 'active' | 'pending' | 'failed' | 'skipped'

export type StatusLineItem = {
  label: string
  status: StatusLineStatus
}

export type StatusLineOptions = {
  items: ReadonlyArray<StatusLineItem>
  /** Separator between items. Default: two spaces. */
  separator?: string
  theme?: PartialTheme
}

export function statusLine(options: StatusLineOptions): void {
  const theme = mergeTheme(getTheme(), options.theme)
  const accent = paintAccent(theme)
  const dim = paintDim()
  const success = paintSemantic(theme, 'success')
  const danger = paintSemantic(theme, 'danger')

  const sep = options.separator ?? '  '
  const parts: string[] = []

  for (const item of options.items) {
    let mark: string
    let label: string
    switch (item.status) {
      case 'done':
        mark = success(theme.symbols.state.success)
        label = item.label
        break
      case 'active':
        mark = accent(theme.symbols.marker.selected)
        label = accent.bold(item.label)
        break
      case 'failed':
        mark = danger(theme.symbols.state.failure)
        label = danger(item.label)
        break
      case 'skipped':
        mark = dim(theme.symbols.state.cancelled)
        label = dim(item.label)
        break
      case 'pending':
      default:
        mark = dim(theme.symbols.marker.unselected)
        label = dim(item.label)
        break
    }
    parts.push(`${mark} ${label}`)
  }

  process.stdout.write(parts.join(sep) + '\n')
}
