import { symbols } from '@/lib/tokens'
import { Accent, Dim, Row } from './Terminal'

/**
 * Mirror of registry/components/table.ts
 *
 * The only line Caret tables allow is a dim horizontal rule under the header.
 * No rounded box borders — that's reserved for modals/dialogs.
 *
 *   NAME          STATUS    AGE
 *   ──────────────────────────────
 *   my-app        running    3d
 *   my-other-app  starting   5h
 *   billing-svc   failed     1m
 */
export type TableColumn<T> = {
  header: string
  accessor: (row: T) => string
  align?: 'left' | 'right' | 'center'
  width?: number
}

function pad(text: string, width: number, align: 'left' | 'right' | 'center') {
  const diff = width - text.length
  if (diff <= 0) return text
  if (align === 'right') return ' '.repeat(diff) + text
  if (align === 'center') {
    const left = Math.floor(diff / 2)
    return ' '.repeat(left) + text + ' '.repeat(diff - left)
  }
  return text + ' '.repeat(diff)
}

export function Table<T>({
  columns,
  rows,
  rule = true,
  gap = 2,
}: {
  columns: ReadonlyArray<TableColumn<T>>
  rows: ReadonlyArray<T>
  rule?: boolean
  gap?: number
}) {
  const cells = rows.map((row) => columns.map((c) => c.accessor(row)))
  const widths = columns.map((col, ci) => {
    if (col.width !== undefined) return col.width
    let max = col.header.length
    for (const r of cells) {
      const w = r[ci]?.length ?? 0
      if (w > max) max = w
    }
    return max
  })

  const gapStr = ' '.repeat(gap)
  const totalWidth =
    widths.reduce((sum, w) => sum + w, 0) + gap * (widths.length - 1)

  return (
    <>
      <Row>
        <Accent bold>
          {columns
            .map((col, ci) => pad(col.header, widths[ci]!, col.align ?? 'left'))
            .join(gapStr)}
        </Accent>
      </Row>
      {rule && (
        <Row>
          <Dim>{symbols.ruler.repeat(totalWidth)}</Dim>
        </Row>
      )}
      {cells.map((r, ri) => (
        <Row key={ri}>
          {columns
            .map((col, ci) => pad(r[ci] ?? '', widths[ci]!, col.align ?? 'left'))
            .join(gapStr)}
        </Row>
      ))}
    </>
  )
}
