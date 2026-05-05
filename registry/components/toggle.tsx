/**
 * Caret toggle component
 *
 * An interactive boolean switch. Space or ↵ to toggle, ↵ to confirm,
 * Esc to cancel (returns null).
 *
 *   const value = await toggle({
 *     label: 'Enable dark mode',
 *     defaultValue: false,
 *   })
 *
 * Renders:
 *   ^ Enable dark mode  ○ off
 *
 * When on:
 *   ^ Enable dark mode  ● on
 */

import React, { useState } from 'react'
import { Box, Text, render, useInput } from 'ink'
import { ThemeProvider, useTheme } from '../theme/index.js'
import type { PartialTheme } from '../theme/types.js'

export type ToggleOptions = {
  label: string
  /** Initial value. Default: false. */
  defaultValue?: boolean
  /** Custom labels for on/off states. */
  onLabel?: string
  offLabel?: string
  theme?: PartialTheme
}

type Status = 'active' | 'submitted' | 'cancelled'

export type ToggleViewProps = ToggleOptions & {
  onResolve: (value: boolean | null) => void
}

export function ToggleView(props: ToggleViewProps) {
  const theme = useTheme()
  const [value, setValue] = useState<boolean>(props.defaultValue ?? false)
  const [status, setStatus] = useState<Status>('active')

  const onLabel = props.onLabel ?? 'on'
  const offLabel = props.offLabel ?? 'off'

  useInput((input, key) => {
    if (status !== 'active') return

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

    if (input === ' ' || key.leftArrow || key.rightArrow) {
      setValue((v) => !v)
      return
    }
  })

  if (status !== 'active') {
    const display =
      status === 'submitted'
        ? value
          ? onLabel
          : offLabel
        : theme.symbols.state.cancelled

    return (
      <Box>
        <Text color={theme.colors.accent.default}>{theme.symbols.anchor} </Text>
        <Text dimColor>{props.label}: </Text>
        {status === 'submitted' ? (
          <Text>{display}</Text>
        ) : (
          <Text dimColor italic>
            {display}
          </Text>
        )}
      </Box>
    )
  }

  return (
    <Box flexDirection="column">
      <Box>
        <Text color={theme.colors.accent.default}>{theme.symbols.anchor} </Text>
        <Text>{props.label}  </Text>
        {value ? (
          <Text color={theme.colors.accent.default} bold>
            {theme.symbols.marker.selected} {onLabel}
          </Text>
        ) : (
          <Text dimColor>
            {theme.symbols.marker.unselected} {offLabel}
          </Text>
        )}
      </Box>
      <Box marginTop={1} marginLeft={2}>
        <Text dimColor italic>
          space toggle · ↵ confirm · esc cancel
        </Text>
      </Box>
    </Box>
  )
}

export async function toggle(options: ToggleOptions): Promise<boolean | null> {
  return new Promise<boolean | null>((resolve) => {
    const app = render(
      <ThemeProvider theme={options.theme}>
        <ToggleView
          {...options}
          onResolve={(value) => {
            app.unmount()
            resolve(value)
          }}
        />
      </ThemeProvider>,
    )
  })
}
