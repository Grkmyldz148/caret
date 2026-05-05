import { symbols, tracking } from '@/lib/tokens'
import { Accent, Bold, Dim, Row } from './Terminal'

/**
 * Mirror of registry/components/prompt/shared.tsx + text.tsx
 *
 * Anatomy:
 *   ^ P R O J E C T   N A M E          <- anchor + tracked CAPS bold
 *     description text                 <- dim, indented 2
 *
 *     ▸ my-app▎                        <- focused prefix + value + inverse cursor
 */
export function Prompt({
  label,
  description,
  value,
  placeholder,
  state = 'editing',
  showCursor = true,
}: {
  label: string
  description?: string
  value?: string
  placeholder?: string
  state?: 'editing' | 'error'
  showCursor?: boolean
}) {
  const prefix = symbols.prefix.focused
  const isEmpty = !value || value.length === 0

  return (
    <>
      <Row>
        <Accent>{symbols.anchor}</Accent>
        {' '}
        <Bold>{tracking(label)}</Bold>
      </Row>
      <div className="pl-[2ch]">
        {description && (
          <Row>
            <Dim>{description}</Dim>
          </Row>
        )}
        <Row>{'\u00a0'}</Row>
        <Row>
          {state === 'error' ? (
            <span className="text-danger">{prefix} </span>
          ) : (
            <Accent>{prefix} </Accent>
          )}
          {isEmpty ? (
            <>
              {showCursor && <span className="cursor-cell">&nbsp;</span>}
              {placeholder && <Dim>{placeholder}</Dim>}
            </>
          ) : (
            <>
              <span>{value}</span>
              {showCursor && <span className="cursor-cell caret-blink">&nbsp;</span>}
            </>
          )}
        </Row>
      </div>
    </>
  )
}
