/**
 * Caret search component
 *
 * Interactive search/filter over a dataset. Type to filter,
 * navigate with ↑/↓, ↵ to select. Standalone component — not
 * a prompt variant.
 *
 *   const result = await search({
 *     items: [
 *       { value: 'api',     label: 'api-gateway',  description: 'running · us-east-1' },
 *       { value: 'billing', label: 'billing-svc',  description: 'failed · eu-west-1' },
 *       { value: 'auth',    label: 'auth-service', description: 'running · us-east-1' },
 *     ],
 *     placeholder: 'Search services…',
 *   })
 */

import React, { useState, useMemo } from 'react'
import { Box, Text, render, useInput } from 'ink'
import { ThemeProvider, useTheme } from '../theme/index.js'
import type { PartialTheme } from '../theme/types.js'

export type SearchItem<T extends string = string> = {
  value: T
  label: string
  description?: string
}

export type SearchOptions<T extends string = string> = {
  items: ReadonlyArray<SearchItem<T>>
  /** Placeholder shown when query is empty. */
  placeholder?: string
  /** Maximum visible results. Default: 10. */
  limit?: number
  /** Custom filter. Default: case-insensitive fuzzy match on label + description. */
  filter?: (query: string, item: SearchItem<T>) => boolean
  theme?: PartialTheme
}

function defaultFilter<T extends string>(query: string, item: SearchItem<T>): boolean {
  const haystack = (item.label + (item.description ? ' ' + item.description : '')).toLowerCase()
  const q = query.toLowerCase()
  let idx = 0
  for (const ch of q) {
    idx = haystack.indexOf(ch, idx)
    if (idx === -1) return false
    idx++
  }
  return true
}

export type SearchViewProps<T extends string> = SearchOptions<T> & {
  onResolve: (value: T | null) => void
}

export function SearchView<T extends string>(props: SearchViewProps<T>) {
  const theme = useTheme()
  const limit = props.limit ?? 10
  const filterFn = props.filter ?? defaultFilter

  const [query, setQuery] = useState<string>('')
  const [cursor, setCursor] = useState<number>(0)
  const [inputCursor, setInputCursor] = useState<number>(0)

  const filtered = useMemo(() => {
    if (query === '') return props.items.slice(0, limit)
    return props.items.filter((item) => filterFn(query, item)).slice(0, limit)
  }, [query, props.items, limit, filterFn])

  const activeCursor = Math.min(cursor, Math.max(0, filtered.length - 1))

  useInput((input, key) => {
    if (key.escape) {
      props.onResolve(null)
      return
    }

    if (key.return) {
      const item = filtered[activeCursor]
      props.onResolve(item ? item.value : null)
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

    if (key.leftArrow) {
      setInputCursor((c) => Math.max(0, c - 1))
      return
    }
    if (key.rightArrow) {
      setInputCursor((c) => Math.min(query.length, c + 1))
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
        <Text dimColor>  {filtered.length}/{props.items.length}</Text>
      </Box>

      <Box height={1} />

      {/* Results */}
      {filtered.length === 0 ? (
        <Text dimColor italic>  no matches</Text>
      ) : (
        filtered.map((item, i) => {
          const isCursor = i === activeCursor
          return (
            <Box key={item.value}>
              {isCursor ? (
                <Box>
                  <Text color={theme.colors.accent.default}>
                    {theme.symbols.prefix.focused} {item.label}
                  </Text>
                  {item.description && (
                    <Text dimColor>  {item.description}</Text>
                  )}
                </Box>
              ) : (
                <Box>
                  <Text dimColor>
                    {theme.symbols.prefix.idle} {item.label}
                  </Text>
                  {item.description && (
                    <Text dimColor italic>  {item.description}</Text>
                  )}
                </Box>
              )}
            </Box>
          )
        })
      )}

      <Box height={1} />
      <Text dimColor italic>type to filter  ↑↓ navigate  ↵ select  esc cancel</Text>
    </Box>
  )
}

export async function search<T extends string = string>(
  options: SearchOptions<T>,
): Promise<T | null> {
  return new Promise<T | null>((resolve) => {
    const app = render(
      <ThemeProvider theme={options.theme}>
        <SearchView<T>
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
