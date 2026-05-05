/**
 * Caret tabs component
 *
 * Interactive tab bar navigation. Navigate with ←/→ or Tab, confirm
 * with ↵, cancel with Esc. Returns the selected tab value.
 *
 *   const tab = await tabs({
 *     items: [
 *       { label: 'Overview', value: 'overview' },
 *       { label: 'Config',   value: 'config' },
 *       { label: 'Logs',     value: 'logs' },
 *     ],
 *   })
 *
 * Renders:
 *   ▸ Overview   · Config   · Logs
 *
 * Active tab uses accent + bold, inactive uses dim.
 */

import React, { useState } from 'react'
import { Box, Text, render, useInput } from 'ink'
import { ThemeProvider, useTheme } from '../theme/index.js'
import type { PartialTheme } from '../theme/types.js'

export type TabItem<T extends string = string> = {
  label: string
  value: T
}

export type TabsOptions<T extends string = string> = {
  items: ReadonlyArray<TabItem<T>>
  /** Initially selected tab index. Default: 0. */
  defaultIndex?: number
  /** Confirm on select (immediately returns on ←/→). Default: false. */
  immediate?: boolean
  theme?: PartialTheme
}

export type TabsViewProps<T extends string> = TabsOptions<T> & {
  onResolve: (value: T | null) => void
}

export function TabsView<T extends string>(props: TabsViewProps<T>) {
  const theme = useTheme()
  const [selected, setSelected] = useState<number>(props.defaultIndex ?? 0)

  useInput((_input, key) => {
    if (key.escape) {
      props.onResolve(null)
      return
    }

    if (key.return) {
      const item = props.items[selected]
      props.onResolve(item ? item.value : null)
      return
    }

    if (key.leftArrow) {
      const next = (selected - 1 + props.items.length) % props.items.length
      setSelected(next)
      if (props.immediate) {
        props.onResolve(props.items[next]!.value)
      }
      return
    }

    if (key.rightArrow || key.tab) {
      const next = (selected + 1) % props.items.length
      setSelected(next)
      if (props.immediate) {
        props.onResolve(props.items[next]!.value)
      }
      return
    }
  })

  return (
    <Box flexDirection="column">
      <Box>
        {props.items.map((item, i) => {
          const isActive = i === selected
          const prefix = isActive ? theme.symbols.prefix.focused : theme.symbols.prefix.idle
          return (
            <Box key={item.value} marginRight={2}>
              {isActive ? (
                <Text color={theme.colors.accent.default} bold>
                  {prefix} {item.label}
                </Text>
              ) : (
                <Text dimColor>
                  {prefix} {item.label}
                </Text>
              )}
            </Box>
          )
        })}
      </Box>
      <Box marginTop={1}>
        <Text dimColor italic>
          ←→ navigate · ↵ select · esc cancel
        </Text>
      </Box>
    </Box>
  )
}

export async function tabs<T extends string = string>(
  options: TabsOptions<T>,
): Promise<T | null> {
  if (options.items.length === 0) return null

  return new Promise<T | null>((resolve) => {
    const app = render(
      <ThemeProvider theme={options.theme}>
        <TabsView<T>
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
