import { Accent, Dim, Row, Success } from './Terminal'
import { symbols } from '@/lib/tokens'

/**
 * Mirror of registry/components/spinner.tsx
 *
 *   ⠋ Building packages... (2/7)   <- spinning (accent braille rotation)
 *   ✓ Build complete · 2.3s        <- success (green ✓, dim suffix)
 *   ✗ Build failed · 5.1s          <- failure (red ✗)
 */
export function Spinner({
  label,
  state = 'spinning',
  suffixTime,
}: {
  label: string
  state?: 'spinning' | 'success' | 'failure' | 'cancelled'
  suffixTime?: string
}) {
  return (
    <Row>
      {state === 'spinning' && (
        <Accent>
          <span className="spinner-braille" aria-hidden />
        </Accent>
      )}
      {state === 'success' && <Success>{symbols.state.success}</Success>}
      {state === 'failure' && (
        <span className="text-danger">{symbols.state.failure}</span>
      )}
      {state === 'cancelled' && <Dim>{symbols.state.cancelled}</Dim>}
      {' '}
      {state === 'cancelled' ? <Dim>{label}</Dim> : <span>{label}</span>}
      {suffixTime && state !== 'spinning' && (
        <>
          {' '}
          <Dim>· {suffixTime}</Dim>
        </>
      )}
    </Row>
  )
}
