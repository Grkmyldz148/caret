/**
 * Caret pager component
 *
 * Interactive scrollable viewport for long content. Navigate with
 * j/k or ↑/↓, q to quit. If content fits the viewport, prints
 * directly without entering interactive mode.
 *
 *   await pager({ content: longString, title: 'Help' })
 */

import React, { useState } from 'react'
import { Box, Text, render, useInput } from 'ink'
import { ThemeProvider, useTheme } from '../theme/index.js'
import type { PartialTheme } from '../theme/types.js'
import { tracking } from '../lib/typography.js'

export type PagerOptions = {
  content: string
  /** Optional title displayed at the top. */
  title?: string
  /** Visible line count. Default: terminal height − 3. */
  height?: number
  theme?: PartialTheme
}

type PagerViewProps = {
  lines: string[]
  title?: string
  height: number
  onExit: () => void
}

function PagerView({ lines, title, height, onExit }: PagerViewProps) {
  const theme = useTheme()
  const [offset, setOffset] = useState<number>(0)
  const maxOffset = Math.max(0, lines.length - height)

  useInput((input, key) => {
    if (input === 'q' || key.escape) {
      onExit()
      return
    }
    if (key.upArrow || input === 'k') {
      setOffset((o) => Math.max(0, o - 1))
      return
    }
    if (key.downArrow || input === 'j') {
      setOffset((o) => Math.min(maxOffset, o + 1))
      return
    }
    if (key.ctrl && input === 'u') {
      setOffset((o) => Math.max(0, o - Math.floor(height / 2)))
      return
    }
    if (key.ctrl && input === 'd') {
      setOffset((o) => Math.min(maxOffset, o + Math.floor(height / 2)))
      return
    }
    if (input === 'g') {
      setOffset(0)
      return
    }
    if (input === 'G') {
      setOffset(maxOffset)
      return
    }
  })

  const visible = lines.slice(offset, offset + height)
  const progress =
    lines.length <= height
      ? '100%'
      : `${Math.round(((offset + height) / lines.length) * 100)}%`

  return (
    <Box flexDirection="column">
      {title && (
        <Box marginBottom={1}>
          <Text color={theme.colors.accent.default} bold>
            {tracking(title)}
          </Text>
        </Box>
      )}

      <Box flexDirection="column" height={height}>
        {visible.map((line, i) => (
          <Text key={`${offset + i}`}>{line || ' '}</Text>
        ))}
      </Box>

      <Box>
        <Text dimColor italic>
          ↑↓/jk scroll  ctrl+u/d page  g/G top/bottom  q quit  {progress}
        </Text>
      </Box>
    </Box>
  )
}

export async function pager(options: PagerOptions): Promise<void> {
  const lines = options.content.split('\n')
  const termHeight = process.stdout.rows || 24
  const height = options.height ?? Math.max(5, termHeight - 3)

  // If content fits, just print it — no interactive mode needed
  if (lines.length <= height) {
    if (options.title) {
      // Use paint utilities for non-interactive fallback
      const { paintAccent, paintBold } = await import('../lib/paint.js')
      const { getTheme } = await import('../theme/global.js')
      const { mergeTheme } = await import('../theme/merge.js')
      const theme = mergeTheme(getTheme(), options.theme)
      process.stdout.write(paintAccent(theme)(paintBold()(tracking(options.title))) + '\n\n')
    }
    process.stdout.write(options.content + '\n')
    return
  }

  return new Promise<void>((resolve) => {
    const app = render(
      <ThemeProvider theme={options.theme}>
        <PagerView
          lines={lines}
          title={options.title}
          height={height}
          onExit={() => app.unmount()}
        />
      </ThemeProvider>,
    )

    app.waitUntilExit().then(
      () => resolve(),
      () => resolve(),
    )
  })
}
