/**
 * Caret virtualized-list component
 *
 * Performance-oriented scrollable list for large datasets. Only
 * renders visible items. Navigate with ↑/↓, select with ↵, quit
 * with q or Esc.
 *
 *   const item = await virtualizedList({
 *     items: thousandsOfItems,
 *     renderItem: (item) => `${item.name}  ${item.status}`,
 *     height: 20,
 *   })
 *
 * Supports:
 * - Thousands of items without lag
 * - Windowed rendering (only visible items mount)
 * - Keyboard navigation with smooth scrolling
 * - Optional search filter
 */

import React, { useState, useMemo } from 'react'
import { Box, Text, render, useInput } from 'ink'
import { ThemeProvider, useTheme } from '../theme/index.js'
import type { PartialTheme } from '../theme/types.js'
import { capability } from '../lib/capability.js'

export type VirtualizedItem<T extends string = string> = {
  value: T
  label: string
  description?: string
}

export type VirtualizedListOptions<T extends string = string> = {
  items: ReadonlyArray<VirtualizedItem<T>>
  /** Visible item count. Default: terminal rows − 4. */
  height?: number
  /** Enable inline search/filter. Default: false. */
  searchable?: boolean
  /** Custom filter. Default: case-insensitive fuzzy on label + description. */
  filter?: (query: string, item: VirtualizedItem<T>) => boolean
  theme?: PartialTheme
}

function defaultFilter<T extends string>(query: string, item: VirtualizedItem<T>): boolean {
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

type VListViewProps<T extends string> = VirtualizedListOptions<T> & {
  viewHeight: number
  onResolve: (value: T | null) => void
}

function VListView<T extends string>(props: VListViewProps<T>) {
  const theme = useTheme()
  const cap = capability()
  const filterFn = props.filter ?? defaultFilter
  const searchable = props.searchable ?? false

  const [cursor, setCursor] = useState<number>(0)
  const [query, setQuery] = useState<string>('')

  const filtered = useMemo(() => {
    if (!searchable || query === '') return props.items as VirtualizedItem<T>[]
    return props.items.filter((item) => filterFn(query, item))
  }, [query, props.items, searchable, filterFn])

  const totalItems = filtered.length
  const viewHeight = props.viewHeight
  const activeCursor = Math.min(cursor, Math.max(0, totalItems - 1))

  // Compute visible window
  const halfView = Math.floor(viewHeight / 2)
  let windowStart = activeCursor - halfView
  if (windowStart < 0) windowStart = 0
  if (windowStart + viewHeight > totalItems) {
    windowStart = Math.max(0, totalItems - viewHeight)
  }
  const windowEnd = Math.min(windowStart + viewHeight, totalItems)
  const visible = filtered.slice(windowStart, windowEnd)

  // Scrollbar
  const scrollbarChar = cap.unicode ? '▎' : '|'
  const canScroll = totalItems > viewHeight
  let scrollTop = 0
  let scrollHeight = viewHeight
  if (canScroll) {
    scrollHeight = Math.max(1, Math.round((viewHeight / totalItems) * viewHeight))
    const maxStart = totalItems - viewHeight
    const currentStart = windowStart
    scrollTop = maxStart > 0 ? Math.round((currentStart / maxStart) * (viewHeight - scrollHeight)) : 0
  }

  useInput((input, key) => {
    if (key.escape || (!searchable && input === 'q')) {
      props.onResolve(null)
      return
    }

    if (key.return) {
      const item = filtered[activeCursor]
      props.onResolve(item ? item.value : null)
      return
    }

    if (key.upArrow) {
      setCursor((c) => Math.max(0, c - 1))
      return
    }
    if (key.downArrow) {
      setCursor((c) => Math.min(totalItems - 1, c + 1))
      return
    }

    if (key.ctrl && input === 'u') {
      setCursor((c) => Math.max(0, c - halfView))
      return
    }
    if (key.ctrl && input === 'd') {
      setCursor((c) => Math.min(totalItems - 1, c + halfView))
      return
    }

    // Search input
    if (searchable) {
      if (key.backspace || key.delete) {
        if (query.length > 0) {
          setQuery((q) => q.slice(0, -1))
          setCursor(0)
        }
        return
      }

      if (key.ctrl && input === 'u') {
        setQuery('')
        setCursor(0)
        return
      }

      if (input && !key.ctrl && !key.meta && input.length >= 1) {
        const printable = input
          .split('')
          .filter((ch) => ch >= ' ' && ch !== '\x7f')
          .join('')
        if (printable) {
          setQuery((q) => q + printable)
          setCursor(0)
        }
      }
    }
  })

  return (
    <Box flexDirection="column">
      {/* Search bar */}
      {searchable && (
        <Box marginBottom={1}>
          <Text color={theme.colors.accent.default}>{theme.symbols.prefix.focused} </Text>
          {query === '' ? (
            <Text dimColor>type to filter…</Text>
          ) : (
            <Text>{query}</Text>
          )}
          <Text dimColor>  {totalItems}/{props.items.length}</Text>
        </Box>
      )}

      {/* List */}
      {totalItems === 0 ? (
        <Text dimColor italic>  no items</Text>
      ) : (
        visible.map((item, viewIdx) => {
          const globalIdx = windowStart + viewIdx
          const isCursor = globalIdx === activeCursor
          const prefix = isCursor ? theme.symbols.prefix.focused : theme.symbols.prefix.idle
          const showScrollbar = canScroll && viewIdx >= scrollTop && viewIdx < scrollTop + scrollHeight

          return (
            <Box key={item.value}>
              {isCursor ? (
                <Box>
                  <Text color={theme.colors.accent.default} bold>
                    {prefix} {item.label}
                  </Text>
                  {item.description && (
                    <Text dimColor>  {item.description}</Text>
                  )}
                </Box>
              ) : (
                <Box>
                  <Text dimColor>
                    {prefix} {item.label}
                  </Text>
                  {item.description && (
                    <Text dimColor italic>  {item.description}</Text>
                  )}
                </Box>
              )}
              {canScroll && (
                <Text dimColor>{showScrollbar ? scrollbarChar : ' '}</Text>
              )}
            </Box>
          )
        })
      )}

      <Box marginTop={1}>
        <Text dimColor italic>
          ↑↓ navigate  ctrl+u/d page  ↵ select  esc cancel  {totalItems} items
        </Text>
      </Box>
    </Box>
  )
}

export async function virtualizedList<T extends string = string>(
  options: VirtualizedListOptions<T>,
): Promise<T | null> {
  const termHeight = process.stdout.rows || 24
  const viewHeight = options.height ?? Math.max(5, termHeight - 4)

  return new Promise<T | null>((resolve) => {
    const app = render(
      <ThemeProvider theme={options.theme}>
        <VListView<T>
          {...options}
          viewHeight={viewHeight}
          onResolve={(value) => {
            app.unmount()
            resolve(value)
          }}
        />
      </ThemeProvider>,
    )
  })
}
