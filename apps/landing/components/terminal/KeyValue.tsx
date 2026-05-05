import { symbols } from '@/lib/tokens'
import { Dim, Row } from './Terminal'

/**
 * Mirror of registry/components/key-value.ts
 *
 *   Environment  ·················  production
 *   Region       ·················  us-east-1
 *
 * The dotted leader (U+00B7) is the Caret signature for label/value rows.
 */
export function KeyValue({
  rows,
  width = 48,
}: {
  rows: ReadonlyArray<{ key: string; value: string }>
  width?: number
}) {
  const maxKey = rows.reduce((m, r) => Math.max(m, r.key.length), 0)
  const labelCol = maxKey + 2

  return (
    <>
      {rows.map((r, i) => {
        const valueStart = width - r.value.length
        const leaderStart = labelCol
        const leaderEnd = valueStart - 1
        const leaderLen = Math.max(3, leaderEnd - leaderStart)
        const leader = ' ' + symbols.leader.repeat(leaderLen) + ' '

        return (
          <Row key={i}>
            <Dim>{r.key.padEnd(maxKey, ' ')}</Dim>
            <Dim>{leader}</Dim>
            <span>{r.value}</span>
          </Row>
        )
      })}
    </>
  )
}
