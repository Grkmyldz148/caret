/**
 * Prompt — number variant
 *
 * Numeric input with optional bounds. See specs/prompt.md.
 */

import React, { useState } from 'react'
import { Box, Text, useInput } from 'ink'
import { useTheme } from '../../theme/index.js'
import { PromptShell, PromptResolved } from './shared.js'

export type PromptNumberOptions = {
  label: string
  description?: string
  placeholder?: string
  default?: number
  min?: number
  max?: number
}

type Status = 'editing' | 'error' | 'submitted' | 'cancelled'

type Props = PromptNumberOptions & {
  onResolve: (value: number | null) => void
}

export function PromptNumber(props: Props) {
  const theme = useTheme()
  const [value, setValue] = useState<string>(
    props.default !== undefined ? String(props.default) : '',
  )
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
      if (value === '') {
        setError('Required')
        setStatus('error')
        return
      }
      const num = Number(value)
      if (!Number.isFinite(num)) {
        setError('Not a valid number')
        setStatus('error')
        return
      }
      if (props.min !== undefined && num < props.min) {
        setError(`Must be ≥ ${props.min}`)
        setStatus('error')
        return
      }
      if (props.max !== undefined && num > props.max) {
        setError(`Must be ≤ ${props.max}`)
        setStatus('error')
        return
      }
      setStatus('submitted')
      props.onResolve(num)
      return
    }

    if (key.backspace || key.delete) {
      setValue((v) => v.slice(0, -1))
      if (status === 'error') {
        setError(null)
        setStatus('editing')
      }
      return
    }

    // Accept digits, dot, minus
    if (input && !key.ctrl && !key.meta && /^[\d.\-]+$/.test(input)) {
      setValue((v) => v + input)
      if (status === 'error') {
        setError(null)
        setStatus('editing')
      }
    }
  })

  if (status === 'submitted') {
    return <PromptResolved label={props.label} value={value} />
  }
  if (status === 'cancelled') {
    return <PromptResolved label={props.label} cancelled />
  }

  const prefixColor =
    status === 'error' ? theme.colors.semantic.danger.ansi : theme.colors.accent.default
  const showPlaceholder = value === '' && props.placeholder !== undefined

  return (
    <PromptShell label={props.label} description={props.description}>
      <Box>
        <Text color={prefixColor}>{theme.symbols.prefix.focused} </Text>
        {showPlaceholder ? (
          <Text dimColor>{props.placeholder}</Text>
        ) : (
          <Text>{value}</Text>
        )}
        <Text>█</Text>
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
