/**
 * Caret morph component
 *
 * Character morphing — smooth braille transitions between two strings
 * or symbols. Uses Ink for animation.
 *
 * Given a start and end string, generates intermediate braille frames
 * that visually transition between them. For simple cases (symbol to
 * symbol like spinner to checkmark), randomly raises/lowers braille
 * dots to create a dissolve effect.
 *
 *   await morph('Processing', 'Complete', { duration: 500 })
 *   await morph('⠋', '✓', { duration: 300 })
 *
 * Auto-instant under reduced motion or non-TTY.
 */

import React, { useState, useEffect } from 'react'
import { Text, render } from 'ink'
import { ThemeProvider, useTheme } from '../theme/index.js'
import type { PartialTheme } from '../theme/types.js'
import { capability } from '../lib/capability.js'

/** Braille noise characters used during the dissolve transition */
const BRAILLE_NOISE = [
  '⠁', '⠂', '⠄', '⡀', '⠃', '⠅', '⡁', '⠇', '⡃', '⡇', '⣇', '⣿',
]

function pickNoise(): string {
  return BRAILLE_NOISE[Math.floor(Math.random() * BRAILLE_NOISE.length)]!
}

/**
 * Build a single morphed frame.
 *
 * @param start  - array of start characters (padded to maxLen)
 * @param end    - array of end characters (padded to maxLen)
 * @param t      - progress 0 → 1
 * @param maxLen - length of the character arrays
 */
function buildFrame(
  start: string[],
  end: string[],
  t: number,
  maxLen: number,
): string {
  const result: string[] = []

  for (let i = 0; i < maxLen; i++) {
    const s = start[i] ?? ' '
    const e = end[i] ?? ' '

    if (s === e) {
      // Characters match — no morphing needed
      result.push(s)
      continue
    }

    const roll = Math.random()

    if (t < 0.15) {
      // Very early — almost entirely start
      result.push(s)
    } else if (t > 0.85) {
      // Very late — almost entirely end
      result.push(e)
    } else if (t < 0.4) {
      // Early phase: mostly start, some noise
      result.push(roll < t * 1.5 ? pickNoise() : s)
    } else if (t > 0.6) {
      // Late phase: mostly end, some noise
      result.push(roll < (1 - t) * 1.5 ? pickNoise() : e)
    } else {
      // Middle phase: heavy noise dissolve
      if (roll < 0.15) {
        result.push(s)
      } else if (roll > 0.85) {
        result.push(e)
      } else {
        result.push(pickNoise())
      }
    }
  }

  return result.join('')
}

type MorphViewProps = {
  from: string
  to: string
  duration: number
  onComplete: () => void
}

function MorphView({ from, to, duration, onComplete }: MorphViewProps) {
  const theme = useTheme()
  const [displayed, setDisplayed] = useState<string>(from)
  const [progress, setProgress] = useState<number>(0)
  const cap = capability()

  const maxLen = Math.max(from.length, to.length)
  const startChars = Array.from(from.padEnd(maxLen))
  const endChars = Array.from(to.padEnd(maxLen))

  useEffect(() => {
    if (cap.reducedMotion || !cap.isTTY) {
      setDisplayed(to)
      setProgress(1)
      const t = setTimeout(onComplete, 50)
      return () => clearTimeout(t)
    }

    const frameMs = 60
    const startTime = Date.now()

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const t = Math.min(elapsed / duration, 1)
      setProgress(t)

      if (t >= 1) {
        setDisplayed(to)
        clearInterval(interval)
        setTimeout(onComplete, 100)
      } else {
        setDisplayed(buildFrame(startChars, endChars, t, maxLen))
      }
    }, frameMs)

    return () => clearInterval(interval)
  }, [from, to, duration])

  // Use accent color during the transition, default color at start/end
  const isTransitioning = progress > 0 && progress < 1
  const color = isTransitioning ? theme.colors.accent.default : undefined

  return <Text color={color}>{displayed}</Text>
}

export type MorphOptions = {
  /** Duration of the morph animation in milliseconds. Default: 300. */
  duration?: number
  theme?: PartialTheme
}

export async function morph(
  from: string,
  to: string,
  options: MorphOptions = {},
): Promise<void> {
  const duration = options.duration ?? 300

  return new Promise<void>((resolve) => {
    const app = render(
      <ThemeProvider theme={options.theme}>
        <MorphView
          from={from}
          to={to}
          duration={duration}
          onComplete={() => {
            app.unmount()
            resolve()
          }}
        />
      </ThemeProvider>,
    )
  })
}
