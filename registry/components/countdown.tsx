/**
 * Caret countdown component
 *
 * Big braille-digit countdown timer. Displays large numbers counting
 * down, rendered with braille-character digits (3 lines tall, 2-3
 * chars wide).
 *
 *   await countdown({ seconds: 10, label: 'Deploying in' })
 *   await countdown({ seconds: 3 })
 *
 * Each second tick renders the remaining time as big braille digits.
 * When the countdown reaches 0, the digits briefly flash bold.
 *
 * Under reduced motion or non-TTY: immediately writes "0" and resolves.
 */

import React, { useState, useEffect } from 'react'
import { Box, Text, render } from 'ink'
import { ThemeProvider, useTheme } from '../theme/index.js'
import type { PartialTheme } from '../theme/types.js'
import { capability } from '../lib/capability.js'

// ─── Braille digit font ──────────────────────────────────────
// Each digit is 3 rows tall, 2 braille characters wide.
// Colon separator is 1 character wide.

const DIGIT_FONT: Record<string, readonly [string, string, string]> = {
  '0': ['⣰⣆', '⡇⢸', '⠓⠚'],
  '1': ['⢰⠀', '⢸⠀', '⠚⠀'],
  '2': ['⣰⣆', '⣰⠝', '⠓⠒'],
  '3': ['⣰⣆', '⠈⢼', '⠓⠚'],
  '4': ['⡆⡆', '⠓⢼', '⠀⠘'],
  '5': ['⣶⡄', '⠈⢼', '⠓⠚'],
  '6': ['⣰⡄', '⣧⢼', '⠓⠚'],
  '7': ['⣶⣆', '⠀⢸', '⠀⠘'],
  '8': ['⣰⣆', '⣬⢼', '⠓⠚'],
  '9': ['⣰⣆', '⠓⢼', '⠀⠘'],
  ':': ['⠀', '⠒', '⠀'],
}

/** Render seconds as an array of digit/colon keys. */
function timeToKeys(seconds: number): string[] {
  if (seconds < 0) seconds = 0
  if (seconds >= 60) {
    const mm = Math.floor(seconds / 60)
    const ss = seconds % 60
    const mmStr = String(mm).padStart(2, '0')
    const ssStr = String(ss).padStart(2, '0')
    return [...mmStr.split(''), ':', ...ssStr.split('')]
  }
  const ssStr = String(seconds).padStart(2, '0')
  return ssStr.split('')
}

/** Build the three display lines for a set of digit keys. */
function renderBigDigits(keys: string[]): [string, string, string] {
  const lines: [string[], string[], string[]] = [[], [], []]
  for (let i = 0; i < keys.length; i++) {
    const glyph = DIGIT_FONT[keys[i]!]
    if (!glyph) continue
    lines[0].push(glyph[0])
    lines[1].push(glyph[1])
    lines[2].push(glyph[2])
    // Add a space gap between digits (but not after colon, and not at the end)
    if (i < keys.length - 1 && keys[i] !== ':' && keys[i + 1] !== ':') {
      lines[0].push(' ')
      lines[1].push(' ')
      lines[2].push(' ')
    }
  }
  return [lines[0].join(''), lines[1].join(''), lines[2].join('')]
}

type CountdownViewProps = {
  seconds: number
  label?: string
  onComplete: () => void
}

function CountdownView({ seconds, label, onComplete }: CountdownViewProps) {
  const theme = useTheme()
  const cap = capability()
  const reduced = cap.reducedMotion || !cap.isTTY

  const [remaining, setRemaining] = useState<number>(reduced ? 0 : seconds)
  const [done, setDone] = useState<boolean>(reduced)

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(onComplete, 50)
      return () => clearTimeout(t)
    }

    const interval = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1
        if (next <= 0) {
          clearInterval(interval)
          // Brief pause at 0 before completing
          setTimeout(() => {
            setDone(true)
            setTimeout(onComplete, 200)
          }, 400)
          return 0
        }
        return next
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [reduced, seconds, onComplete])

  const keys = timeToKeys(remaining)
  const [line0, line1, line2] = renderBigDigits(keys)

  const accentColor = theme.colors.accent.default
  const isBold = remaining === 0

  return (
    <Box flexDirection="column">
      {label != null && (
        <Text dimColor>{label}</Text>
      )}
      <Text color={accentColor} bold={isBold}>{line0}</Text>
      <Text color={accentColor} bold={isBold}>{line1}</Text>
      <Text color={accentColor} bold={isBold}>{line2}</Text>
      {done && remaining === 0 && (
        <Text dimColor>done</Text>
      )}
    </Box>
  )
}

export type CountdownOptions = {
  seconds: number
  label?: string
  theme?: PartialTheme
}

export async function countdown(options: CountdownOptions): Promise<void> {
  const cap = capability()
  const reduced = cap.reducedMotion || !cap.isTTY

  if (reduced) {
    process.stdout.write(`${options.label ? options.label + ' ' : ''}0\n`)
    return
  }

  return new Promise<void>((resolve) => {
    const app = render(
      <ThemeProvider theme={options.theme}>
        <CountdownView
          seconds={options.seconds}
          label={options.label}
          onComplete={() => {
            app.unmount()
            resolve()
          }}
        />
      </ThemeProvider>,
    )
  })
}
