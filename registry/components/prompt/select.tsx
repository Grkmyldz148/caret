/**
 * Prompt — select variant
 *
 * Single choice from a list. Navigate with ↑/↓. See specs/prompt.md.
 */

import React, { useState } from 'react'
import { Box, Text, useInput } from 'ink'
import { useTheme } from '../../theme/index.js'
import { PromptShell, PromptResolved } from './shared.js'

export type PromptSelectOption<T extends string> = {
  value: T
  label: string
}

export type PromptSelectOptions<T extends string = string> = {
  label: string
  description?: string
  options: ReadonlyArray<PromptSelectOption<T>>
  default?: T
}

type Status = 'editing' | 'submitted' | 'cancelled'

type Props<T extends string> = PromptSelectOptions<T> & {
  onResolve: (value: T | null) => void
}

export function PromptSelect<T extends string>(props: Props<T>) {
  const theme = useTheme()
  const initialIdx = Math.max(
    0,
    props.options.findIndex((o) => o.value === props.default),
  )
  const [cursorIdx, setCursorIdx] = useState<number>(initialIdx)
  const [status, setStatus] = useState<Status>('editing')

  useInput((_input, key) => {
    if (status !== 'editing') return

    if (key.escape) {
      setStatus('cancelled')
      props.onResolve(null)
      return
    }
    if (key.return) {
      setStatus('submitted')
      const opt = props.options[cursorIdx]
      props.onResolve(opt ? opt.value : null)
      return
    }
    if (key.upArrow) {
      setCursorIdx((i) => (i - 1 + props.options.length) % props.options.length)
      return
    }
    if (key.downArrow || key.tab) {
      setCursorIdx((i) => (i + 1) % props.options.length)
      return
    }
  })

  if (status === 'submitted') {
    const opt = props.options[cursorIdx]
    return <PromptResolved label={props.label} value={opt?.label ?? ''} />
  }
  if (status === 'cancelled') {
    return <PromptResolved label={props.label} cancelled />
  }

  return (
    <PromptShell
      label={props.label}
      description={props.description}
      footer="↑↓ navigate  ↵ select  esc cancel"
    >
      {props.options.map((opt, i) => {
        const isCursor = i === cursorIdx
        return (
          <Box key={opt.value}>
            {isCursor ? (
              <Text color={theme.colors.accent.default}>
                {theme.symbols.marker.selected} {opt.label}
              </Text>
            ) : (
              <Text dimColor>
                {theme.symbols.marker.unselected} {opt.label}
              </Text>
            )}
          </Box>
        )
      })}
    </PromptShell>
  )
}
