/**
 * Caret slider component
 *
 * Interactive numeric range input. Navigate with ←/→, ↵ to confirm,
 * Esc to cancel (returns null).
 *
 *   const value = await slider({
 *     label: 'Volume',
 *     min: 0,
 *     max: 100,
 *     step: 5,
 *     defaultValue: 50,
 *   })
 *
 * Renders:
 *   ^ Volume  ━━━━━━━━━━╸──────────  50
 */

import React, { useState } from 'react'
import { Box, Text, render, useInput } from 'ink'
import { ThemeProvider, useTheme } from '../theme/index.js'
import type { PartialTheme } from '../theme/types.js'
import { capability } from '../lib/capability.js'

export type SliderOptions = {
  label: string
  /** Minimum value. Default: 0. */
  min?: number
  /** Maximum value. Default: 100. */
  max?: number
  /** Step size. Default: 1. */
  step?: number
  /** Initial value. Default: min. */
  defaultValue?: number
  /** Track width in characters. Default: 20. */
  width?: number
  /** Show numeric value. Default: true. */
  showValue?: boolean
  theme?: PartialTheme
}

type Status = 'active' | 'submitted' | 'cancelled'

export type SliderViewProps = SliderOptions & {
  onResolve: (value: number | null) => void
}

export function SliderView(props: SliderViewProps) {
  const theme = useTheme()
  const cap = capability()

  const min = props.min ?? 0
  const max = props.max ?? 100
  const step = props.step ?? 1
  const trackWidth = props.width ?? 20
  const showValue = props.showValue !== false

  const [value, setValue] = useState<number>(props.defaultValue ?? min)
  const [status, setStatus] = useState<Status>('active')

  const filledChar = cap.unicode ? theme.symbols.progress.filled : '='
  const emptyChar = cap.unicode ? theme.symbols.progress.empty : '-'
  const headChar = cap.unicode ? theme.symbols.progress.head : '>'

  useInput((_input, key) => {
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

    if (key.leftArrow) {
      setValue((v) => Math.max(min, v - step))
      return
    }
    if (key.rightArrow) {
      setValue((v) => Math.min(max, v + step))
      return
    }

    // Shift+← / Shift+→ for big jumps (10× step)
    if (key.ctrl && _input === 'b') {
      setValue((v) => Math.max(min, v - step * 10))
      return
    }
    if (key.ctrl && _input === 'f') {
      setValue((v) => Math.min(max, v + step * 10))
      return
    }
  })

  if (status !== 'active') {
    return (
      <Box>
        <Text color={theme.colors.accent.default}>{theme.symbols.anchor} </Text>
        <Text dimColor>{props.label}: </Text>
        {status === 'submitted' ? (
          <Text>{value}</Text>
        ) : (
          <Text dimColor italic>
            {theme.symbols.state.cancelled}
          </Text>
        )}
      </Box>
    )
  }

  // Compute track
  const ratio = max > min ? (value - min) / (max - min) : 0
  const filledLen = Math.round(ratio * (trackWidth - 1))
  const emptyLen = trackWidth - 1 - filledLen

  const track =
    filledChar.repeat(filledLen) +
    headChar +
    emptyChar.repeat(emptyLen)

  return (
    <Box flexDirection="column">
      <Box>
        <Text color={theme.colors.accent.default}>{theme.symbols.anchor} </Text>
        <Text>{props.label}  </Text>
        <Text color={theme.colors.accent.default}>{track}</Text>
        {showValue && <Text bold>  {value}</Text>}
      </Box>
      <Box marginTop={1} marginLeft={2}>
        <Text dimColor italic>
          ←→ adjust · ctrl+b/f big jump · ↵ confirm · esc cancel
        </Text>
      </Box>
    </Box>
  )
}

export async function slider(options: SliderOptions): Promise<number | null> {
  return new Promise<number | null>((resolve) => {
    const app = render(
      <ThemeProvider theme={options.theme}>
        <SliderView
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
