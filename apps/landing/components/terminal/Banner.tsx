import { symbols, tracking } from '@/lib/tokens'
import { Accent, Bold, Dim, Row } from './Terminal'

/**
 * Mirror of registry/components/banner.ts
 *
 *   ^ M Y   C L I
 *     v2.0.0 — production
 *   ──────────────────────
 */
export function Banner({
  title,
  subtitle,
  width,
}: {
  title: string
  subtitle?: string
  width?: number
}) {
  const tracked = tracking(title)
  const titleRowW = 2 + tracked.length
  const subtitleRowW = subtitle ? 2 + subtitle.length : 0
  const contentW = Math.max(titleRowW, subtitleRowW, 20)
  const ruleWidth = width ?? contentW

  return (
    <>
      <Row>
        <Accent>{symbols.anchor}</Accent>
        {' '}
        <Bold>{tracked}</Bold>
      </Row>
      {subtitle && (
        <Row>
          {'  '}
          <Dim>{subtitle}</Dim>
        </Row>
      )}
      <Row>
        <Dim>{symbols.ruler.repeat(ruleWidth)}</Dim>
      </Row>
    </>
  )
}
