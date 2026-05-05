/**
 * Caret context-menu component
 *
 * A keyboard-triggered action menu. Navigate with ↑/↓, select with ↵,
 * dismiss with Esc.
 *
 *   const action = await contextMenu({
 *     items: [
 *       { label: 'Edit',     value: 'edit' },
 *       { label: 'Duplicate', value: 'duplicate' },
 *       { separator: true },
 *       { label: 'Delete',   value: 'delete', danger: true },
 *     ],
 *   })
 *
 * Renders with a bordered frame (only component besides modal to use box):
 *   ╭────────────────╮
 *   │ ▸ Edit         │
 *   │ · Duplicate    │
 *   │ ──────────     │
 *   │ · Delete       │
 *   ╰────────────────╯
 */

import React, { useState } from 'react'
import { Box, Text, render, useInput } from 'ink'
import { ThemeProvider, useTheme } from '../theme/index.js'
import type { PartialTheme } from '../theme/types.js'
import { capability } from '../lib/capability.js'

export type ContextMenuItem<T extends string = string> =
  | { label: string; value: T; danger?: boolean; separator?: never }
  | { separator: true; label?: never; value?: never; danger?: never }

export type ContextMenuOptions<T extends string = string> = {
  items: ReadonlyArray<ContextMenuItem<T>>
  /** Optional title for the menu. */
  title?: string
  theme?: PartialTheme
}

type MenuViewProps<T extends string> = ContextMenuOptions<T> & {
  onResolve: (value: T | null) => void
}

function MenuView<T extends string>(props: MenuViewProps<T>) {
  const theme = useTheme()
  const cap = capability()

  // Filter out separators for navigation
  const selectableIndices = props.items
    .map((item, i) => (item.separator ? -1 : i))
    .filter((i) => i >= 0)

  const [cursorIdx, setCursorIdx] = useState<number>(0)
  const activeCursor = selectableIndices[cursorIdx] ?? 0

  useInput((_input, key) => {
    if (key.escape) {
      props.onResolve(null)
      return
    }

    if (key.return) {
      const item = props.items[activeCursor]
      if (item && !item.separator) {
        props.onResolve(item.value)
      }
      return
    }

    if (key.upArrow) {
      setCursorIdx((c) => Math.max(0, c - 1))
      return
    }
    if (key.downArrow) {
      setCursorIdx((c) => Math.min(selectableIndices.length - 1, c + 1))
      return
    }
  })

  const b = cap.unicode
    ? theme.symbols.borders
    : { topLeft: '+', topRight: '+', bottomLeft: '+', bottomRight: '+', horizontal: '-', vertical: '|' }
  const ruler = cap.unicode ? theme.symbols.ruler : '-'

  // Compute inner width
  let maxLen = props.title ? props.title.length : 0
  for (const item of props.items) {
    if (!item.separator && item.label) {
      const len = item.label.length + 4 // prefix + spaces
      if (len > maxLen) maxLen = len
    }
  }
  const inner = Math.max(maxLen + 2, 12)

  return (
    <Box flexDirection="column">
      <Text dimColor>
        {b.topLeft}{b.horizontal.repeat(inner)}{b.topRight}
      </Text>

      {props.title && (
        <>
          <Text dimColor>
            {b.vertical} <Text bold>{props.title.padEnd(inner - 2)}</Text> {b.vertical}
          </Text>
          <Text dimColor>
            {b.vertical}{ruler.repeat(inner)}{b.vertical}
          </Text>
        </>
      )}

      {props.items.map((item, i) => {
        if (item.separator) {
          return (
            <Text key={`sep-${i}`} dimColor>
              {b.vertical} {ruler.repeat(inner - 2)} {b.vertical}
            </Text>
          )
        }

        const isCursor = i === activeCursor
        const prefix = isCursor ? theme.symbols.prefix.focused : theme.symbols.prefix.idle
        const label = `${prefix} ${item.label}`.padEnd(inner - 1)

        if (isCursor) {
          const color = item.danger
            ? theme.colors.semantic.danger.truecolor
            : theme.colors.accent.default
          return (
            <Box key={item.value}>
              <Text dimColor>{b.vertical}</Text>
              <Text color={color} bold>{label}</Text>
              <Text dimColor>{b.vertical}</Text>
            </Box>
          )
        }

        return (
          <Box key={item.value}>
            <Text dimColor>
              {b.vertical}{label}{b.vertical}
            </Text>
          </Box>
        )
      })}

      <Text dimColor>
        {b.bottomLeft}{b.horizontal.repeat(inner)}{b.bottomRight}
      </Text>

      <Box marginTop={1}>
        <Text dimColor italic>
          ↑↓ navigate · ↵ select · esc dismiss
        </Text>
      </Box>
    </Box>
  )
}

export async function contextMenu<T extends string = string>(
  options: ContextMenuOptions<T>,
): Promise<T | null> {
  const selectableItems = options.items.filter((i) => !i.separator)
  if (selectableItems.length === 0) return null

  return new Promise<T | null>((resolve) => {
    const app = render(
      <ThemeProvider theme={options.theme}>
        <MenuView<T>
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
