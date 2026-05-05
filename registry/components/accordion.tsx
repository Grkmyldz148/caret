/**
 * Caret accordion component
 *
 * Interactive collapsible sections. Navigate with ↑/↓, toggle with
 * Space or ↵, quit with q or Esc.
 *
 *   await accordion({
 *     sections: [
 *       { title: 'General',  content: 'Name: my-app\nVersion: 1.0' },
 *       { title: 'Advanced', content: 'Debug: false\nVerbose: true' },
 *       { title: 'About',    content: 'Caret design system v0.1' },
 *     ],
 *   })
 *
 * Renders:
 *   ▸ General
 *   │ Name: my-app
 *   │ Version: 1.0
 *
 *   · Advanced
 *   · About
 */

import React, { useState } from 'react'
import { Box, Text, render, useInput } from 'ink'
import { ThemeProvider, useTheme } from '../theme/index.js'
import type { PartialTheme } from '../theme/types.js'

export type AccordionSection = {
  title: string
  content: string
}

export type AccordionOptions = {
  sections: ReadonlyArray<AccordionSection>
  /** Initially expanded section indices. Default: [0]. */
  defaultExpanded?: number[]
  /** Allow multiple sections open at once. Default: true. */
  multiple?: boolean
  theme?: PartialTheme
}

export type AccordionViewProps = AccordionOptions & {
  onExit: () => void
}

export function AccordionView(props: AccordionViewProps) {
  const theme = useTheme()
  const [cursor, setCursor] = useState<number>(0)
  const [expanded, setExpanded] = useState<Set<number>>(
    new Set(props.defaultExpanded ?? [0]),
  )

  const multiple = props.multiple !== false

  useInput((input, key) => {
    if (key.escape || input === 'q') {
      props.onExit()
      return
    }

    if (key.upArrow || input === 'k') {
      setCursor((c) => Math.max(0, c - 1))
      return
    }
    if (key.downArrow || input === 'j') {
      setCursor((c) => Math.min(props.sections.length - 1, c + 1))
      return
    }

    if (key.return || input === ' ') {
      setExpanded((prev) => {
        const next = new Set(prev)
        if (next.has(cursor)) {
          next.delete(cursor)
        } else {
          if (!multiple) next.clear()
          next.add(cursor)
        }
        return next
      })
      return
    }
  })

  return (
    <Box flexDirection="column">
      {props.sections.map((section, i) => {
        const isCursor = i === cursor
        const isOpen = expanded.has(i)
        const prefix = isCursor ? theme.symbols.prefix.focused : theme.symbols.prefix.idle

        return (
          <Box key={i} flexDirection="column">
            <Box>
              {isCursor ? (
                <Text color={theme.colors.accent.default} bold>
                  {prefix} {section.title}
                </Text>
              ) : (
                <Text dimColor={!isOpen}>
                  {prefix} {section.title}
                </Text>
              )}
            </Box>

            {isOpen && (
              <Box flexDirection="column" marginLeft={2}>
                {section.content.split('\n').map((line, li) => (
                  <Box key={li}>
                    <Text dimColor>{theme.symbols.structure.gutter}</Text>
                    <Text> {line}</Text>
                  </Box>
                ))}
              </Box>
            )}

            {i < props.sections.length - 1 && <Box height={isOpen ? 1 : 0} />}
          </Box>
        )
      })}

      <Box marginTop={1}>
        <Text dimColor italic>
          ↑↓ navigate · space/↵ toggle · q/esc quit
        </Text>
      </Box>
    </Box>
  )
}

export async function accordion(options: AccordionOptions): Promise<void> {
  if (options.sections.length === 0) return

  return new Promise<void>((resolve) => {
    const app = render(
      <ThemeProvider theme={options.theme}>
        <AccordionView
          {...options}
          onExit={() => {
            app.unmount()
          }}
        />
      </ThemeProvider>,
    )

    app.waitUntilExit().then(
      () => resolve(),
      () => resolve(),
    )
  })
}
