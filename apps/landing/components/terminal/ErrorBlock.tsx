import { symbols } from '@/lib/tokens'
import { Accent, Dim, Row } from './Terminal'

/**
 * Mirror of registry/components/error.ts
 *
 *   ✗ error: missing required flag '--output'
 *   │
 *   │ The deploy command requires an output directory.
 *   │
 *   │ hint: pass --output=./dist or set caret.outDir
 *   │ see: https://caret.dev/docs/errors/E102
 */
export function ErrorBlock({
  title,
  body,
  hint,
  see,
}: {
  title: string
  body?: string
  hint?: string
  see?: string
}) {
  const hasBlock = body !== undefined || hint !== undefined || see !== undefined

  return (
    <>
      <Row>
        <span className="text-danger">{symbols.state.failure}</span>
        {' '}
        <span className="text-danger font-medium">error:</span>{' '}
        <span>{title}</span>
      </Row>
      {hasBlock && (
        <>
          <Row>
            <span className="text-danger">{symbols.structure.gutter}</span>
          </Row>
          {body && (
            <Row>
              <span className="text-danger">{symbols.structure.gutter}</span>
              {' '}
              <span>{body}</span>
            </Row>
          )}
          {hint && (
            <>
              <Row>
                <span className="text-danger">{symbols.structure.gutter}</span>
              </Row>
              <Row>
                <span className="text-danger">{symbols.structure.gutter}</span>
                {' '}
                <Accent>hint:</Accent> <span>{hint}</span>
              </Row>
            </>
          )}
          {see && (
            <Row>
              <span className="text-danger">{symbols.structure.gutter}</span>
              {' '}
              <Dim>see: </Dim>
              <Accent>
                <span className="underline underline-offset-4 decoration-accent">
                  {see}
                </span>
              </Accent>
            </Row>
          )}
        </>
      )}
    </>
  )
}
