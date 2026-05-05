/**
 * Caret scrollable component
 *
 * A scrollable viewport container for long content. Like pager but
 * designed to be embedded — shows a scroll indicator on the right.
 * Navigate with ↑/↓ or j/k, q or Esc to exit.
 *
 *   await scrollable({
 *     content: longLogOutput,
 *     height: 15,
 *     title: 'Build output',
 *   })
 *
 * Also accepts content as string[]. Shows a thin scroll indicator
 * on the right edge: ▎ for the visible region.
 */

import React, { useState } from 'react'
import { Box, Text, render, useInput } from 'ink'
import { ThemeProvider, useTheme } from '../theme/index.js'
import type { PartialTheme } from '../theme/types.js'
import { capability } from '../lib/capability.js'

export type ScrollableOptions = {
  /** Content to display. String (split by \n) or array of lines. */
  content: string | string[]
  /** Visible height in lines. Default: terminal rows − 4, min 5. */
  height?: number
  /** Optional title at the top. */
  title?: string
  /** Show line numbers. Default: false. */
  lineNumbers?: boolean
  /** Show scroll indicator. Default: true. */
  showScrollbar?: boolean
  theme?: PartialTheme
}

type ScrollableViewProps = {
  lines: string[]
  height: number
  title?: string
  lineNumbers: boolean
  showScrollbar: boolean
  onExit: () => void
}

function ScrollableView(props: ScrollableViewProps) {
  const theme = useTheme()
  const cap = capability()
  const [offset, setOffset] = useState<number>(0)
  const maxOffset = Math.max(0, props.lines.length - props.height)

  useInput((input, key) => {
    if (input === 'q' || key.escape) {
      props.onExit()
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
      setOffset((o) => Math.max(0, o - Math.floor(props.height / 2)))
      return
    }
    if (key.ctrl && input === 'd') {
      setOffset((o) => Math.min(maxOffset, o + Math.floor(props.height / 2)))
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

  const visible = props.lines.slice(offset, offset + props.height)
  const gutterWidth = props.lineNumbers ? String(props.lines.length).length + 1 : 0

  // Scroll indicator
  const scrollbarChar = cap.unicode ? '▎' : '|'
  const totalLines = props.lines.length
  const canScroll = totalLines > props.height

  // Compute scrollbar position
  let scrollTop = 0
  let scrollHeight = props.height
  if (canScroll) {
    scrollHeight = Math.max(1, Math.round((props.height / totalLines) * props.height))
    scrollTop = Math.round((offset / maxOffset) * (props.height - scrollHeight))
  }

  const progress =
    totalLines <= props.height
      ? '100%'
      : `${Math.round(((offset + props.height) / totalLines) * 100)}%`

  return (
    <Box flexDirection="column">
      {props.title && (
        <Box marginBottom={1}>
          <Text color={theme.colors.accent.default} bold>
            {props.title}
          </Text>
        </Box>
      )}

      <Box flexDirection="column">
        {visible.map((line, i) => {
          const lineNum = offset + i + 1
          const showIndicator =
            props.showScrollbar && canScroll && i >= scrollTop && i < scrollTop + scrollHeight

          return (
            <Box key={`${offset + i}`}>
              {props.lineNumbers && (
                <Text dimColor>
                  {String(lineNum).padStart(gutterWidth)}{' '}
                  {theme.symbols.structure.gutter}{' '}
                </Text>
              )}
              <Text>{line || ' '}</Text>
              {props.showScrollbar && canScroll && (
                <Text dimColor>{showIndicator ? scrollbarChar : ' '}</Text>
              )}
            </Box>
          )
        })}
      </Box>

      <Box marginTop={1}>
        <Text dimColor italic>
          ↑↓/jk scroll  ctrl+u/d page  g/G ends  q quit  {props.lines.length}L  {progress}
        </Text>
      </Box>
    </Box>
  )
}

export async function scrollable(options: ScrollableOptions): Promise<void> {
  const lines = Array.isArray(options.content)
    ? options.content
    : options.content.split('\n')

  const termHeight = process.stdout.rows || 24
  const height = options.height ?? Math.max(5, termHeight - 4)

  // If content fits, just print — no interactive mode needed
  if (lines.length <= height) {
    if (options.title) {
      const { paintAccent, paintBold } = await import('../lib/paint.js')
      const { getTheme } = await import('../theme/global.js')
      const { mergeTheme } = await import('../theme/merge.js')
      const theme = mergeTheme(getTheme(), options.theme)
      process.stdout.write(paintAccent(theme)(paintBold()(options.title)) + '\n\n')
    }
    process.stdout.write(lines.join('\n') + '\n')
    return
  }

  return new Promise<void>((resolve) => {
    const app = render(
      <ThemeProvider theme={options.theme}>
        <ScrollableView
          lines={lines}
          height={height}
          title={options.title}
          lineNumbers={options.lineNumbers ?? false}
          showScrollbar={options.showScrollbar !== false}
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
