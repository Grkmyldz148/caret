import { symbols } from '@/lib/tokens'
import { Info, Row, Success, Warning } from './Terminal'

/**
 * Mirror of registry/components/message.ts
 *
 *   ℹ info: Cache cleared
 *   ✓ success: Build complete
 *   ⚠ warning: Deprecated config syntax
 */
export function InfoMessage({ children }: { children: string }) {
  return (
    <Row>
      <Info>{symbols.state.info}</Info>{' '}
      <Info bold>info:</Info> <span>{children}</span>
    </Row>
  )
}

export function SuccessMessage({ children }: { children: string }) {
  return (
    <Row>
      <Success>{symbols.state.success}</Success>{' '}
      <Success bold>success:</Success> <span>{children}</span>
    </Row>
  )
}

export function WarningMessage({ children }: { children: string }) {
  return (
    <Row>
      <Warning>{symbols.state.warning}</Warning>{' '}
      <Warning bold>warning:</Warning> <span>{children}</span>
    </Row>
  )
}
