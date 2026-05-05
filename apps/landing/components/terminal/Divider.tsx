import { symbols, tracking } from '@/lib/tokens'
import { Accent, Bold, Dim, Row } from './Terminal'

/**
 * Mirror of registry/components/divider.ts
 *
 *   ──────────────────────────────
 *   ───── S E C T I O N ──────────
 */
export function Divider({
  label,
  align = 'center',
  width = 48,
}: {
  label?: string
  align?: 'left' | 'center' | 'right'
  width?: number
}) {
  if (label === undefined) {
    return (
      <Row>
        <Dim>{symbols.ruler.repeat(width)}</Dim>
      </Row>
    )
  }

  const tracked = tracking(label)
  const labelW = tracked.length + 2

  let leftLen: number
  let rightLen: number
  if (align === 'left') {
    leftLen = 3
    rightLen = width - leftLen - labelW
  } else if (align === 'right') {
    rightLen = 3
    leftLen = width - rightLen - labelW
  } else {
    const remaining = width - labelW
    leftLen = Math.floor(remaining / 2)
    rightLen = remaining - leftLen
  }

  return (
    <Row>
      <Dim>{symbols.ruler.repeat(Math.max(0, leftLen))}</Dim>
      {' '}
      <Accent>
        <Bold>{tracked}</Bold>
      </Accent>
      {' '}
      <Dim>{symbols.ruler.repeat(Math.max(0, rightLen))}</Dim>
    </Row>
  )
}
