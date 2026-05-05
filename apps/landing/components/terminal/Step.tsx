import { symbols } from '@/lib/tokens'
import { Accent, Dim, Row, Success } from './Terminal'

/**
 * Mirror of registry/components/step.ts
 *
 *   ✓ Validate inputs
 *   ✓ Compile assets
 *   ● Deploy to production        <- active, accent, selected marker
 *   ○ Run smoke tests             <- pending, dim, unselected marker
 *   — Send notification           <- skipped, dim cancelled
 */
export type StepStatus = 'pending' | 'active' | 'done' | 'failed' | 'skipped'

export function Step({
  steps,
}: {
  steps: ReadonlyArray<{ label: string; status?: StepStatus }>
}) {
  return (
    <>
      {steps.map((s, i) => {
        const status: StepStatus = s.status ?? 'pending'
        switch (status) {
          case 'done':
            return (
              <Row key={i}>
                <Success>{symbols.state.success}</Success>{' '}
                <span>{s.label}</span>
              </Row>
            )
          case 'active':
            return (
              <Row key={i}>
                <Accent>{symbols.marker.selected}</Accent>{' '}
                <span>{s.label}</span>
              </Row>
            )
          case 'failed':
            return (
              <Row key={i}>
                <span className="text-danger">{symbols.state.failure}</span>{' '}
                <span className="text-danger">{s.label}</span>
              </Row>
            )
          case 'skipped':
            return (
              <Row key={i}>
                <Dim>
                  {symbols.state.cancelled} {s.label}
                </Dim>
              </Row>
            )
          case 'pending':
          default:
            return (
              <Row key={i}>
                <Dim>
                  {symbols.marker.unselected} {s.label}
                </Dim>
              </Row>
            )
        }
      })}
    </>
  )
}
