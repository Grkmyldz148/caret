/**
 * Prompt — multiSelect variant
 *
 * Multiple choices from a list. Space to toggle, enter to submit.
 * See specs/prompt.md.
 */

import React, { useState } from 'react'
import { Box, Text, useInput } from 'ink'
import { useTheme } from '../../theme/index.js'
import { PromptShell, PromptResolved } from './shared.js'

export type PromptMultiSelectOption<T extends string> = {
  value: T
  label: string
}

export type PromptMultiSelectOptions<T extends string = string> = {
  label: string
  description?: string
  options: ReadonlyArray<PromptMultiSelectOption<T>>
  defaults?: ReadonlyArray<T>
  min?: number
  max?: number
}

type Status = 'editing' | 'error' | 'submitted' | 'cancelled'

type Props<T extends string> = PromptMultiSelectOptions<T> & {
  onResolve: (value: T[] | null) => void
}

export function PromptMultiSelect<T extends string>(props: Props<T>) {
  const theme = useTheme()
  const [cursorIdx, setCursorIdx] = useState<number>(0)
  const [selected, setSelected] = useState<Set<number>>(() => {
    const set = new Set<number>()
    if (props.defaults) {
      props.options.forEach((opt, i) => {
        if (props.defaults!.includes(opt.value)) set.add(i)
      })
    }
    return set
  })
  const [status, setStatus] = useState<Status>('editing')
  const [error, setError] = useState<string | null>(null)

  useInput((input, key) => {
    if (status === 'submitted' || status === 'cancelled') return

    if (key.escape) {
      setStatus('cancelled')
      props.onResolve(null)
      return
    }

    if (key.return) {
      const count = selected.size
      if (props.min !== undefined && count < props.min) {
        setError(`Select at least ${props.min}`)
        setStatus('error')
        return
      }
      if (props.max !== undefined && count > props.max) {
        setError(`Select at most ${props.max}`)
        setStatus('error')
        return
      }
      const values = Array.from(selected)
        .sort((a, b) => a - b)
        .map((i) => props.options[i]!.value)
      setStatus('submitted')
      props.onResolve(values)
      return
    }

    if (key.upArrow) {
      setCursorIdx((i) => (i - 1 + props.options.length) % props.options.length)
      return
    }
    if (key.downArrow) {
      setCursorIdx((i) => (i + 1) % props.options.length)
      return
    }
    if (input === ' ' || key.tab) {
      setSelected((prev) => {
        const next = new Set(prev)
        if (next.has(cursorIdx)) next.delete(cursorIdx)
        else next.add(cursorIdx)
        return next
      })
      if (status === 'error') {
        setError(null)
        setStatus('editing')
      }
    }
  })

  if (status === 'submitted') {
    const values = Array.from(selected)
      .sort((a, b) => a - b)
      .map((i) => props.options[i]!.label)
      .join(', ')
    return <PromptResolved label={props.label} value={values || '(none)'} />
  }
  if (status === 'cancelled') {
    return <PromptResolved label={props.label} cancelled />
  }

  return (
    <PromptShell
      label={props.label}
      description={props.description}
      footer="↑↓ navigate  space toggle  ↵ submit  esc cancel"
    >
      {props.options.map((opt, i) => {
        const isCursor = i === cursorIdx
        const isSelected = selected.has(i)
        const marker = isSelected ? theme.symbols.marker.selected : theme.symbols.marker.unselected
        return (
          <Box key={opt.value}>
            {isCursor ? (
              <Text color={theme.colors.accent.default}>
                {marker} {opt.label}
              </Text>
            ) : isSelected ? (
              <Text>
                {marker} {opt.label}
              </Text>
            ) : (
              <Text dimColor>
                {marker} {opt.label}
              </Text>
            )}
          </Box>
        )
      })}

      {error !== null && (
        <Box marginTop={1}>
          <Text color={theme.colors.semantic.danger.ansi}>
            {theme.symbols.state.warning} {error}
          </Text>
        </Box>
      )}
    </PromptShell>
  )
}
