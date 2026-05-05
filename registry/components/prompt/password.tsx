/**
 * Prompt — password variant
 *
 * Masked text input. See specs/prompt.md.
 */

import React, { useState } from 'react'
import { Box, Text, useInput } from 'ink'
import { useTheme } from '../../theme/index.js'
import { PromptShell, PromptResolved } from './shared.js'

export type PromptPasswordOptions = {
  label: string
  description?: string
  /** Mask character. Default: '•'. Strongly discouraged to override. */
  mask?: string
}

type Status = 'editing' | 'submitted' | 'cancelled'

type Props = PromptPasswordOptions & {
  onResolve: (value: string | null) => void
}

export function PromptPassword(props: Props) {
  const theme = useTheme()
  const [value, setValue] = useState<string>('')
  const [status, setStatus] = useState<Status>('editing')
  const mask = props.mask ?? '•'

  useInput((input, key) => {
    if (status !== 'editing') return

    if (key.escape) {
      setStatus('cancelled')
      props.onResolve(null)
      return
    }
    if (key.return) {
      setStatus('submitted')
      props.onResolve(value)
      return
    }
    if (key.backspace || key.delete) {
      setValue((v) => v.slice(0, -1))
      return
    }
    if (input && !key.ctrl && !key.meta && input.length >= 1) {
      const printable = input
        .split('')
        .filter((ch) => ch >= ' ' && ch !== '\x7f')
        .join('')
      if (printable) setValue((v) => v + printable)
    }
  })

  if (status === 'submitted') {
    return <PromptResolved label={props.label} value={mask.repeat(value.length)} />
  }
  if (status === 'cancelled') {
    return <PromptResolved label={props.label} cancelled />
  }

  return (
    <PromptShell label={props.label} description={props.description}>
      <Box>
        <Text color={theme.colors.accent.default}>{theme.symbols.prefix.focused} </Text>
        <Text>{mask.repeat(value.length)}</Text>
        <Text>█</Text>
      </Box>
    </PromptShell>
  )
}
