/**
 * Caret file-picker component
 *
 * Interactive file/directory browser. Navigate with ↑/↓, ↵ to enter
 * directory or select file, Backspace to go up, Esc to cancel.
 *
 *   const file = await filePicker({
 *     cwd: process.cwd(),
 *     filter: (name) => name.endsWith('.ts'),
 *   })
 *
 * Renders:
 *   ▸ src/
 *   · package.json
 *   · tsconfig.json
 *   · README.md
 *
 * Returns the absolute path of the selected file, or null if cancelled.
 */

import React, { useState, useEffect } from 'react'
import { Box, Text, render, useInput } from 'ink'
import { ThemeProvider, useTheme } from '../theme/index.js'
import type { PartialTheme } from '../theme/types.js'
import * as fs from 'node:fs'
import * as path from 'node:path'

export type FilePickerOptions = {
  /** Starting directory. Default: process.cwd(). */
  cwd?: string
  /** Filter entries. Return true to include. */
  filter?: (name: string, isDirectory: boolean) => boolean
  /** Show hidden files (dotfiles). Default: false. */
  showHidden?: boolean
  /** Max visible items. Default: 15. */
  limit?: number
  /** Allow selecting directories too. Default: false (files only). */
  selectDirectories?: boolean
  theme?: PartialTheme
}

type Entry = {
  name: string
  isDirectory: boolean
  fullPath: string
}

function readEntries(dir: string, showHidden: boolean, filter?: (name: string, isDir: boolean) => boolean): Entry[] {
  try {
    const names = fs.readdirSync(dir)
    const entries: Entry[] = []

    for (const name of names) {
      if (!showHidden && name.startsWith('.')) continue
      const fullPath = path.join(dir, name)
      try {
        const stat = fs.statSync(fullPath)
        const isDirectory = stat.isDirectory()
        if (filter && !filter(name, isDirectory)) continue
        entries.push({ name, isDirectory, fullPath })
      } catch {
        // Skip entries we can't stat (permission errors, etc.)
      }
    }

    // Directories first, then alphabetical
    entries.sort((a, b) => {
      if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1
      return a.name.localeCompare(b.name)
    })

    return entries
  } catch {
    return []
  }
}

type FilePickerViewProps = FilePickerOptions & {
  onResolve: (path: string | null) => void
}

function FilePickerView(props: FilePickerViewProps) {
  const theme = useTheme()
  const limit = props.limit ?? 15

  const [cwd, setCwd] = useState<string>(props.cwd ?? process.cwd())
  const [cursor, setCursor] = useState<number>(0)
  const [entries, setEntries] = useState<Entry[]>([])

  useEffect(() => {
    const items = readEntries(cwd, props.showHidden ?? false, props.filter)
    setEntries(items)
    setCursor(0)
  }, [cwd])

  const visibleStart = Math.max(0, Math.min(cursor - Math.floor(limit / 2), entries.length - limit))
  const visible = entries.slice(visibleStart, visibleStart + limit)
  const activeCursor = Math.min(cursor, Math.max(0, entries.length - 1))

  useInput((_input, key) => {
    if (key.escape) {
      props.onResolve(null)
      return
    }

    if (key.upArrow) {
      setCursor((c) => Math.max(0, c - 1))
      return
    }
    if (key.downArrow) {
      setCursor((c) => Math.min(entries.length - 1, c + 1))
      return
    }

    if (key.return) {
      const entry = entries[activeCursor]
      if (!entry) return
      if (entry.isDirectory) {
        if (props.selectDirectories) {
          props.onResolve(entry.fullPath)
        } else {
          setCwd(entry.fullPath)
        }
      } else {
        props.onResolve(entry.fullPath)
      }
      return
    }

    if (key.backspace || key.delete) {
      const parent = path.dirname(cwd)
      if (parent !== cwd) {
        setCwd(parent)
      }
      return
    }
  })

  // Shorten cwd for display
  const home = process.env['HOME'] ?? ''
  const displayCwd = home && cwd.startsWith(home) ? '~' + cwd.slice(home.length) : cwd

  return (
    <Box flexDirection="column">
      {/* Current directory */}
      <Box>
        <Text color={theme.colors.accent.default} bold>
          {displayCwd}
        </Text>
      </Box>

      <Box height={1} />

      {entries.length === 0 ? (
        <Text dimColor italic>  empty directory</Text>
      ) : (
        visible.map((entry) => {
          const globalIdx = entries.indexOf(entry)
          const isCursor = globalIdx === activeCursor
          const prefix = isCursor ? theme.symbols.prefix.focused : theme.symbols.prefix.idle
          const label = entry.isDirectory ? entry.name + '/' : entry.name

          return (
            <Box key={entry.fullPath}>
              {isCursor ? (
                <Text color={theme.colors.accent.default} bold>
                  {prefix} {label}
                </Text>
              ) : (
                <Text dimColor={!entry.isDirectory}>
                  {prefix} {entry.isDirectory ? label : label}
                </Text>
              )}
            </Box>
          )
        })
      )}

      {entries.length > limit && (
        <Box marginTop={0}>
          <Text dimColor>  {entries.length} items</Text>
        </Box>
      )}

      <Box height={1} />
      <Text dimColor italic>
        ↑↓ navigate · ↵ select/enter · backspace up · esc cancel
      </Text>
    </Box>
  )
}

export async function filePicker(
  options: FilePickerOptions = {},
): Promise<string | null> {
  return new Promise<string | null>((resolve) => {
    const app = render(
      <ThemeProvider theme={options.theme}>
        <FilePickerView
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
