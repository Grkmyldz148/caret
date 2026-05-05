/**
 * Caret reveal component
 *
 * Animates a list of lines appearing top to bottom, one per tick.
 * Useful for "boot log" style sequential output, dramatic announcements,
 * or onboarding messages.
 *
 *   await reveal([
 *     'Loading configuration…',
 *     'Connecting to API…',
 *     'Initializing workspace…',
 *     'Ready.',
 *   ])
 *
 * Auto-instant under reduced motion or non-TTY.
 */

import React, { useState, useEffect } from 'react'
import { Box, Text, render } from 'ink'
import { ThemeProvider } from '../theme/index.js'
import type { PartialTheme } from '../theme/types.js'
import { capability } from '../lib/capability.js'

type RevealViewProps = {
  lines: ReadonlyArray<string>
  delay: number
  onComplete: () => void
}

function RevealView({ lines, delay, onComplete }: RevealViewProps) {
  const [count, setCount] = useState<number>(0)
  const cap = capability()

  useEffect(() => {
    if (cap.reducedMotion || !cap.isTTY) {
      setCount(lines.length)
      const t = setTimeout(onComplete, 50)
      return () => clearTimeout(t)
    }

    const interval = setInterval(() => {
      setCount((c) => {
        if (c >= lines.length) {
          clearInterval(interval)
          setTimeout(onComplete, 100)
          return c
        }
        return c + 1
      })
    }, delay)

    return () => clearInterval(interval)
  }, [lines, delay])

  return (
    <Box flexDirection="column">
      {lines.slice(0, count).map((line, i) => (
        <Text key={i}>{line}</Text>
      ))}
    </Box>
  )
}

export type RevealOptions = {
  lines: ReadonlyArray<string>
  /** Milliseconds between each line. Default: 200. */
  delay?: number
  theme?: PartialTheme
}

export async function reveal(input: ReadonlyArray<string> | RevealOptions): Promise<void> {
  const options: RevealOptions = Array.isArray(input) ? { lines: input } : (input as RevealOptions)
  const delay = options.delay ?? 200

  return new Promise<void>((resolve) => {
    const app = render(
      <ThemeProvider theme={options.theme}>
        <RevealView
          lines={options.lines}
          delay={delay}
          onComplete={() => {
            app.unmount()
            resolve()
          }}
        />
      </ThemeProvider>,
    )
  })
}
