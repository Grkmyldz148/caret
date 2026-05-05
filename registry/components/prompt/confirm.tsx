/**
 * Prompt — confirm variant
 *
 * Boolean yes/no choice. Toggle with ←/→ or y/n. See specs/prompt.md.
 */

import React, { useState } from 'react'
import { Box, Text, useInput } from 'ink'
import { useTheme } from '../../theme/index.js'
import { PromptShell, PromptResolved } from './shared.js'

export type PromptConfirmOptions = {
  label: string
  description?: string
  default?: boolean
}

type Status = 'editing' | 'submitted' | 'cancelled'

type Props = PromptConfirmOptions & {
  onResolve: (value: boolean | null) => void
}

export function PromptConfirm(props: Props) {
  const theme = useTheme()
  const [selected, setSelected] = useState<boolean>(props.default ?? false)
  const [status, setStatus] = useState<Status>('editing')

  useInput((input, key) => {
    if (status !== 'editing') return

    if (key.escape) {
      setStatus('cancelled')
      props.onResolve(null)
      return
    }
    if (key.return) {
      setStatus('submitted')
      props.onResolve(selected)
      return
    }
    if (key.leftArrow || key.rightArrow || key.tab || input === ' ') {
      setSelected((s) => !s)
      return
    }
    if (input === 'y' || input === 'Y') {
      setSelected(true)
      return
    }
    if (input === 'n' || input === 'N') {
      setSelected(false)
      return
    }
  })

  if (status === 'submitted') {
    return <PromptResolved label={props.label} value={selected ? 'Yes' : 'No'} />
  }
  if (status === 'cancelled') {
    return <PromptResolved label={props.label} cancelled />
  }

  return (
    <PromptShell
      label={props.label}
      description={props.description}
      footer="←→ toggle  ↵ confirm  esc cancel"
    >
      <Box>
        {selected ? (
          <Text color={theme.colors.accent.default}>
            {theme.symbols.marker.selected} Yes
          </Text>
        ) : (
          <Text dimColor>{theme.symbols.marker.unselected} Yes</Text>
        )}
        <Text>    </Text>
        {!selected ? (
          <Text color={theme.colors.accent.default}>
            {theme.symbols.marker.selected} No
          </Text>
        ) : (
          <Text dimColor>{theme.symbols.marker.unselected} No</Text>
        )}
      </Box>
    </PromptShell>
  )
}
