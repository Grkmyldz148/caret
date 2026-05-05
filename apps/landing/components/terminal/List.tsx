import { symbols } from '@/lib/tokens'
import { Accent, Dim, Row } from './Terminal'

/**
 * Mirror of registry/components/list.ts
 *
 *   •  Authentication
 *   •  Database — PostgreSQL on Neon
 *
 * 2-space gap between marker and label — Caret's canonical inline gap.
 */
export type ListVariant = 'bullet' | 'numbered' | 'arrow' | 'dash'

export function List({
  items,
  variant = 'bullet',
}: {
  items: ReadonlyArray<string | { label: string; description?: string }>
  variant?: ListVariant
}) {
  return (
    <>
      {items.map((it, i) => {
        const item = typeof it === 'string' ? { label: it } : it
        let marker: string
        if (variant === 'numbered') marker = `${i + 1}.`
        else if (variant === 'arrow') marker = symbols.progress.arrow
        else if (variant === 'dash') marker = '-'
        else marker = symbols.bullet

        return (
          <Row key={i}>
            <Accent>{marker}</Accent>
            {'  '}
            <span>{item.label}</span>
            {item.description !== undefined && (
              <Dim> — {item.description}</Dim>
            )}
          </Row>
        )
      })}
    </>
  )
}
