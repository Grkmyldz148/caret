import { symbols } from '@/lib/tokens'
import { Accent, Dim, Row } from './Terminal'

/**
 * Mirror of registry/components/progress.ts
 *
 *   Building  ━━━━━━━━╸──────────────  42%
 *
 * Uses thin heavy ━ for filled, light ─ for empty, ╸ as the boundary head.
 */
export function Progress({
  value,
  total,
  label,
  width = 24,
  showHead = true,
  showPercent = true,
  showCount = false,
}: {
  value: number
  total: number
  label?: string
  width?: number
  showHead?: boolean
  showPercent?: boolean
  showCount?: boolean
}) {
  const clamped = Math.max(0, Math.min(value, total))
  const ratio = total > 0 ? clamped / total : 0
  const percent = Math.round(ratio * 100)
  const filledCount = Math.round(width * ratio)
  const emptyCount = width - filledCount

  const renderBar = () => {
    if (showHead && filledCount > 0 && emptyCount > 0) {
      return (
        <>
          <Accent>
            {symbols.progress.filled.repeat(filledCount - 1)}
            {symbols.progress.head}
          </Accent>
          <Dim>{symbols.progress.empty.repeat(emptyCount)}</Dim>
        </>
      )
    }
    return (
      <>
        <Accent>{symbols.progress.filled.repeat(filledCount)}</Accent>
        <Dim>{symbols.progress.empty.repeat(emptyCount)}</Dim>
      </>
    )
  }

  const percentText = showPercent ? `${percent}%`.padStart(4, ' ') : ''
  const countText = showCount ? `${clamped}/${total}` : ''
  const suffix = [percentText, countText].filter(Boolean).join('  ')

  return (
    <Row>
      {label && (
        <>
          <span>{label}</span>
          {'  '}
        </>
      )}
      {renderBar()}
      {suffix && (
        <>
          {'  '}
          <Dim>{suffix}</Dim>
        </>
      )}
    </Row>
  )
}
