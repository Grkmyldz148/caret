/**
 * Caret command-palette component
 *
 * Fuzzy command search with dispatch. Combines search input with
 * command execution — like VS Code's Ctrl+P / Ctrl+Shift+P.
 *
 *   const result = await commandPalette({
 *     commands: [
 *       { value: 'build',    label: 'Build project',     group: 'Tasks' },
 *       { value: 'test',     label: 'Run tests',         group: 'Tasks' },
 *       { value: 'deploy',   label: 'Deploy to prod',    group: 'Deploy' },
 *       { value: 'settings', label: 'Open settings',     group: 'Config' },
 *     ],
 *     placeholder: 'Type a command…',
 *   })
 *
 * Returns the selected command value, or null if cancelled.
 */

import React, { useState, useMemo } from 'react'
import { Box, Text, render, useInput } from 'ink'
import { ThemeProvider, useTheme } from '../theme/index.js'
import type { PartialTheme } from '../theme/types.js'

export type Command<T extends string = string> = {
  value: T
  label: string
  /** Optional group name for visual grouping. */
  group?: string
  /** Optional description shown after the label. */
  description?: string
  /** Optional keyboard shortcut hint. */
  shortcut?: string
}

export type CommandPaletteOptions<T extends string = string> = {
  commands: ReadonlyArray<Command<T>>
  /** Placeholder when query is empty. */
  placeholder?: string
  /** Max visible commands. Default: 10. */
  limit?: number
  /** Custom filter. Default: case-insensitive fuzzy on label + group + description. */
  filter?: (query: string, command: Command<T>) => boolean
  theme?: PartialTheme
}

function defaultFilter<T extends string>(query: string, cmd: Command<T>): boolean {
  const haystack = [cmd.label, cmd.group ?? '', cmd.description ?? '']
    .join(' ')
    .toLowerCase()
  const q = query.toLowerCase()
  let idx = 0
  for (const ch of q) {
    idx = haystack.indexOf(ch, idx)
    if (idx === -1) return false
    idx++
  }
  return true
}

type PaletteViewProps<T extends string> = CommandPaletteOptions<T> & {
  onResolve: (value: T | null) => void
}

function PaletteView<T extends string>(props: PaletteViewProps<T>) {
  const theme = useTheme()
  const limit = props.limit ?? 10
  const filterFn = props.filter ?? defaultFilter

  const [query, setQuery] = useState<string>('')
  const [cursor, setCursor] = useState<number>(0)
  const [inputCursor, setInputCursor] = useState<number>(0)

  const filtered = useMemo(() => {
    if (query === '') return props.commands.slice(0, limit)
    return props.commands.filter((cmd) => filterFn(query, cmd)).slice(0, limit)
  }, [query, props.commands, limit, filterFn])

  const activeCursor = Math.min(cursor, Math.max(0, filtered.length - 1))

  useInput((input, key) => {
    if (key.escape) {
      props.onResolve(null)
      return
    }

    if (key.return) {
      const cmd = filtered[activeCursor]
      props.onResolve(cmd ? cmd.value : null)
      return
    }

    if (key.upArrow) {
      setCursor((i) => Math.max(0, i - 1))
      return
    }
    if (key.downArrow) {
      setCursor((i) => Math.min(filtered.length - 1, i + 1))
      return
    }

    if (key.backspace || key.delete) {
      if (inputCursor > 0) {
        setQuery((v) => v.slice(0, inputCursor - 1) + v.slice(inputCursor))
        setInputCursor((c) => c - 1)
        setCursor(0)
      }
      return
    }

    if (key.ctrl && input === 'u') {
      setQuery('')
      setInputCursor(0)
      setCursor(0)
      return
    }

    if (input && !key.ctrl && !key.meta && input.length >= 1) {
      const printable = input
        .split('')
        .filter((ch) => ch >= ' ' && ch !== '\x7f')
        .join('')
      if (printable) {
        setQuery((v) => v.slice(0, inputCursor) + printable + v.slice(inputCursor))
        setInputCursor((c) => c + printable.length)
        setCursor(0)
      }
    }
  })

  const showPlaceholder = query === '' && props.placeholder !== undefined
  const beforeCursor = query.slice(0, inputCursor)
  const atCursor = query[inputCursor] ?? ' '
  const afterCursor = query.slice(inputCursor + 1)

  // Group filtered commands
  let lastGroup = ''

  return (
    <Box flexDirection="column">
      {/* Search input */}
      <Box>
        <Text color={theme.colors.accent.default}>{theme.symbols.prefix.focused} </Text>
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
        <Text dimColor>  {filtered.length}/{props.commands.length}</Text>
      </Box>

      <Box height={1} />

      {/* Results */}
      {filtered.length === 0 ? (
        <Text dimColor italic>  no matching commands</Text>
      ) : (
        filtered.map((cmd, i) => {
          const isCursor = i === activeCursor
          const showGroup = cmd.group && cmd.group !== lastGroup
          if (cmd.group) lastGroup = cmd.group

          return (
            <Box key={cmd.value} flexDirection="column">
              {showGroup && (
                <Box marginTop={i > 0 ? 1 : 0}>
                  <Text dimColor bold>  {cmd.group}</Text>
                </Box>
              )}
              <Box>
                {isCursor ? (
                  <Box>
                    <Text color={theme.colors.accent.default}>
                      {'  '}{theme.symbols.prefix.focused} {cmd.label}
                    </Text>
                    {cmd.description && (
                      <Text dimColor>  {cmd.description}</Text>
                    )}
                    {cmd.shortcut && (
                      <Text dimColor bold>  [{cmd.shortcut}]</Text>
                    )}
                  </Box>
                ) : (
                  <Box>
                    <Text dimColor>
                      {'  '}{theme.symbols.prefix.idle} {cmd.label}
                    </Text>
                    {cmd.shortcut && (
                      <Text dimColor>  [{cmd.shortcut}]</Text>
                    )}
                  </Box>
                )}
              </Box>
            </Box>
          )
        })
      )}

      <Box height={1} />
      <Text dimColor italic>type to filter  ↑↓ navigate  ↵ run  esc cancel</Text>
    </Box>
  )
}

export async function commandPalette<T extends string = string>(
  options: CommandPaletteOptions<T>,
): Promise<T | null> {
  return new Promise<T | null>((resolve) => {
    const app = render(
      <ThemeProvider theme={options.theme}>
        <PaletteView<T>
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
