/**
 * Caret split-pane component
 *
 * Side-by-side layout with an optional gutter separator. Interactive
 * — Tab switches focus between panes, q/Esc to exit. Pane content
 * is scrollable independently.
 *
 *   await splitPane({
 *     left: { title: 'Source', content: sourceCode },
 *     right: { title: 'Output', content: buildOutput },
 *   })
 *
 * Renders:
 *   Source              │ Output
 *   ─────────────────── │ ───────────────────
 *   const x = 1        │ > Building...
 *   const y = 2        │ > Done.
 */

import React, { useState } from 'react'
import { Box, Text, render, useInput } from 'ink'
import { ThemeProvider, useTheme } from '../theme/index.js'
import type { PartialTheme } from '../theme/types.js'
import { capability } from '../lib/capability.js'

export type PaneContent = {
  title?: string
  content: string | string[]
}

export type SplitPaneOptions = {
  left: PaneContent
  right: PaneContent
  /** Ratio of left pane width. Default: 0.5. Range: 0.2–0.8. */
  ratio?: number
  /** Height of the viewport in lines. Default: terminal rows − 4. */
  height?: number
  theme?: PartialTheme
}

type SplitPaneViewProps = SplitPaneOptions & {
  leftLines: string[]
  rightLines: string[]
  leftWidth: number
  rightWidth: number
  height: number
  onExit: () => void
}

function SplitPaneView(props: SplitPaneViewProps) {
  const theme = useTheme()
  const cap = capability()

  const [focus, setFocus] = useState<'left' | 'right'>('left')
  const [leftOffset, setLeftOffset] = useState<number>(0)
  const [rightOffset, setRightOffset] = useState<number>(0)

  const leftMaxOffset = Math.max(0, props.leftLines.length - props.height)
  const rightMaxOffset = Math.max(0, props.rightLines.length - props.height)

  const gutter = cap.unicode ? theme.symbols.structure.gutter : '|'

  useInput((input, key) => {
    if (input === 'q' || key.escape) {
      props.onExit()
      return
    }

    if (key.tab) {
      setFocus((f) => (f === 'left' ? 'right' : 'left'))
      return
    }

    const setter = focus === 'left' ? setLeftOffset : setRightOffset
    const maxOff = focus === 'left' ? leftMaxOffset : rightMaxOffset

    if (key.upArrow || input === 'k') {
      setter((o) => Math.max(0, o - 1))
      return
    }
    if (key.downArrow || input === 'j') {
      setter((o) => Math.min(maxOff, o + 1))
      return
    }
    if (key.ctrl && input === 'u') {
      setter((o) => Math.max(0, o - Math.floor(props.height / 2)))
      return
    }
    if (key.ctrl && input === 'd') {
      setter((o) => Math.min(maxOff, o + Math.floor(props.height / 2)))
      return
    }
  })

  const leftVisible = props.leftLines.slice(leftOffset, leftOffset + props.height)
  const rightVisible = props.rightLines.slice(rightOffset, rightOffset + props.height)

  // Pad to full height
  while (leftVisible.length < props.height) leftVisible.push('')
  while (rightVisible.length < props.height) rightVisible.push('')

  const truncLine = (line: string, width: number): string => {
    if (line.length > width) return line.slice(0, width - 1) + '…'
    return line.padEnd(width)
  }

  return (
    <Box flexDirection="column">
      {/* Titles */}
      <Box>
        <Box width={props.leftWidth}>
          {props.left.title && (
            <Text color={focus === 'left' ? theme.colors.accent.default : undefined} bold={focus === 'left'}>
              {props.left.title}
            </Text>
          )}
        </Box>
        <Text dimColor> {gutter} </Text>
        <Box width={props.rightWidth}>
          {props.right.title && (
            <Text color={focus === 'right' ? theme.colors.accent.default : undefined} bold={focus === 'right'}>
              {props.right.title}
            </Text>
          )}
        </Box>
      </Box>

      {/* Content rows */}
      {leftVisible.map((leftLine, i) => {
        const rightLine = rightVisible[i] ?? ''
        return (
          <Box key={i}>
            <Text>{truncLine(leftLine, props.leftWidth)}</Text>
            <Text dimColor> {gutter} </Text>
            <Text>{truncLine(rightLine, props.rightWidth)}</Text>
          </Box>
        )
      })}

      <Box marginTop={1}>
        <Text dimColor italic>
          tab switch pane · ↑↓/jk scroll · ctrl+u/d page · q quit
        </Text>
      </Box>
    </Box>
  )
}

export async function splitPane(options: SplitPaneOptions): Promise<void> {
  const cap = capability()
  const termWidth = cap.columns
  const termHeight = process.stdout.rows || 24

  const ratio = Math.max(0.2, Math.min(0.8, options.ratio ?? 0.5))
  const gutterWidth = 3 // " │ "
  const availableWidth = termWidth - gutterWidth
  const leftWidth = Math.floor(availableWidth * ratio)
  const rightWidth = availableWidth - leftWidth
  const height = options.height ?? Math.max(5, termHeight - 4)

  const leftLines = Array.isArray(options.left.content)
    ? options.left.content
    : options.left.content.split('\n')
  const rightLines = Array.isArray(options.right.content)
    ? options.right.content
    : options.right.content.split('\n')

  return new Promise<void>((resolve) => {
    const app = render(
      <ThemeProvider theme={options.theme}>
        <SplitPaneView
          {...options}
          leftLines={leftLines}
          rightLines={rightLines}
          leftWidth={leftWidth}
          rightWidth={rightWidth}
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
