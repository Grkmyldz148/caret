/**
 * Prompt — text variant
 *
 * See specs/prompt.md for the full specification.
 */

import React, { useState } from 'react'
import { Box, Text, useInput } from 'ink'
import { useTheme } from '../../theme/index.js'
import { PromptShell, PromptResolved } from './shared.js'

export type PromptTextOptions = {
  label: string
  description?: string
  placeholder?: string
  default?: string
  validate?: (value: string) => string | null | Promise<string | null>
}

type Status = 'editing' | 'validating' | 'error' | 'submitted' | 'cancelled'

type Props = PromptTextOptions & {
  onResolve: (value: string | null) => void
}

export function PromptText(props: Props) {
  const theme = useTheme()
  const initial = props.default ?? ''
  const [value, setValue] = useState<string>(initial)
  const [cursor, setCursor] = useState<number>(initial.length)
  const [status, setStatus] = useState<Status>('editing')
  const [error, setError] = useState<string | null>(null)

  useInput(async (input, key) => {
    if (status === 'submitted' || status === 'cancelled' || status === 'validating') return

    if (key.escape) {
      setStatus('cancelled')
      props.onResolve(null)
      return
    }

    if (key.return) {
      const validateFn = props.validate
      if (validateFn) {
        setStatus('validating')
        try {
          const result = await validateFn(value)
          if (result) {
            setError(result)
            setStatus('error')
            return
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : String(err))
          setStatus('error')
          return
        }
      }
      setStatus('submitted')
      props.onResolve(value)
      return
    }

    // Cursor navigation
    if (key.leftArrow) {
      setCursor((c) => Math.max(0, c - 1))
      return
    }
    if (key.rightArrow) {
      setCursor((c) => Math.min(value.length, c + 1))
      return
    }

    // ctrl+a → start, ctrl+e → end, ctrl+u → clear line
    if (key.ctrl && input === 'a') {
      setCursor(0)
      return
    }
    if (key.ctrl && input === 'e') {
      setCursor(value.length)
      return
    }
    if (key.ctrl && input === 'u') {
      setValue('')
      setCursor(0)
      if (status === 'error') {
        setError(null)
        setStatus('editing')
      }
      return
    }

    if (key.backspace || key.delete) {
      if (cursor > 0) {
        setValue((v) => v.slice(0, cursor - 1) + v.slice(cursor))
        setCursor((c) => c - 1)
        if (status === 'error') {
          setError(null)
          setStatus('editing')
        }
      }
      return
    }

    if (input && !key.ctrl && !key.meta && input.length >= 1) {
      const printable = input
        .split('')
        .filter((ch) => ch >= ' ' && ch !== '\x7f')
        .join('')
      if (printable) {
        setValue((v) => v.slice(0, cursor) + printable + v.slice(cursor))
        setCursor((c) => c + printable.length)
        if (status === 'error') {
          setError(null)
          setStatus('editing')
        }
      }
    }
  })

  if (status === 'submitted') {
    return <PromptResolved label={props.label} value={value} />
  }
  if (status === 'cancelled') {
    return <PromptResolved label={props.label} cancelled />
  }

  const prefixColor = status === 'error' ? theme.colors.semantic.danger.ansi : theme.colors.accent.default
  const showPlaceholder = value === '' && props.placeholder !== undefined

  // Render text with the cursor positioned at `cursor`
  const beforeCursor = value.slice(0, cursor)
  const atCursor = value[cursor] ?? ' '
  const afterCursor = value.slice(cursor + 1)

  return (
    <PromptShell label={props.label} description={props.description}>
      <Box>
        <Text color={prefixColor}>{theme.symbols.prefix.focused} </Text>
        {showPlaceholder ? (
          <>
            <Text inverse> </Text>
            <Text dimColor>{props.placeholder!.slice(1)}</Text>
          </>
        ) : (
          <>
            <Text>{beforeCursor}</Text>
            <Text inverse>{atCursor}</Text>
            <Text>{afterCursor}</Text>
          </>
        )}
        {status === 'validating' && <Text dimColor> validating…</Text>}
      </Box>

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
