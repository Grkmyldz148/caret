/**
 * Caret braille-transition component
 *
 * Animates a block of text dissolving into (or materializing from)
 * braille noise. Creates a dramatic reveal/exit effect.
 *
 *   await brailleTransition({
 *     text: 'DEPLOY COMPLETE',
 *     direction: 'in',    // 'in' = noise→text, 'out' = text→noise
 *   })
 *
 * Each character independently transitions between braille noise and
 * its final form, with staggered timing so the effect sweeps across.
 *
 * Auto-instant under reduced motion or non-TTY.
 */

import React, { useState, useEffect, useMemo } from 'react'
import { Box, Text, render } from 'ink'
import { ThemeProvider, useTheme } from '../theme/index.js'
import type { PartialTheme } from '../theme/types.js'
import { capability } from '../lib/capability.js'

// Braille density levels — sparse to dense
const BRAILLE_NOISE = [
  '⠀', // empty
  '⠁', '⠂', '⠄', '⡀',
  '⠃', '⠅', '⡁', '⠆',
  '⠇', '⡃', '⡅', '⡆',
  '⣇', '⣃', '⣷', '⣿',
] as const

function randomBraille(): string {
  return BRAILLE_NOISE[Math.floor(Math.random() * BRAILLE_NOISE.length)]!
}

function pickBraille(density: number): string {
  // density 0 = empty, 1 = full
  const idx = Math.min(
    BRAILLE_NOISE.length - 1,
    Math.max(0, Math.floor(density * BRAILLE_NOISE.length)),
  )
  // Add some randomness within ±2 indices
  const jitter = Math.floor(Math.random() * 5) - 2
  const final = Math.min(BRAILLE_NOISE.length - 1, Math.max(0, idx + jitter))
  return BRAILLE_NOISE[final]!
}

type ViewProps = {
  lines: string[]
  direction: 'in' | 'out'
  duration: number
  stagger: number
  onComplete: () => void
}

function TransitionView({ lines, direction, duration, stagger, onComplete }: ViewProps) {
  const theme = useTheme()
  const cap = capability()
  const reduced = cap.reducedMotion || !cap.isTTY

  // Total number of characters (for stagger calculation)
  const totalChars = useMemo(() => {
    let count = 0
    for (const line of lines) count += line.length
    return count
  }, [lines])

  // Each char gets a staggered start time (0 to stagger*totalChars)
  // and transitions over `duration` ms
  const totalTime = duration + stagger * totalChars

  const [elapsed, setElapsed] = useState<number>(reduced ? totalTime : 0)

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(onComplete, 50)
      return () => clearTimeout(t)
    }

    const start = Date.now()
    const interval = setInterval(() => {
      const e = Date.now() - start
      setElapsed(e)
      if (e >= totalTime) {
        clearInterval(interval)
        setTimeout(onComplete, 50)
      }
    }, 40)
    return () => clearInterval(interval)
  }, [reduced, totalTime, onComplete])

  // Render each line
  let charIndex = 0
  const renderedLines = lines.map((line, li) => {
    const chars: string[] = []
    for (let ci = 0; ci < line.length; ci++) {
      const ch = line[ci]!
      const charStart = charIndex * stagger
      const progress = Math.min(1, Math.max(0, (elapsed - charStart) / duration))

      // direction: 'in' means noise→text (progress 0=noise, 1=text)
      // direction: 'out' means text→noise (progress 0=text, 1=noise)
      const revealProgress = direction === 'in' ? progress : 1 - progress

      if (revealProgress >= 1) {
        // Fully revealed — show original character
        chars.push(ch)
      } else if (revealProgress <= 0) {
        // Fully hidden — show noise (or space for spaces)
        chars.push(ch === ' ' ? ' ' : randomBraille())
      } else {
        // Mid-transition — probabilistic reveal
        if (ch === ' ') {
          chars.push(' ')
        } else if (Math.random() < revealProgress * revealProgress) {
          // Higher progress = higher chance of showing real char
          chars.push(ch)
        } else {
          chars.push(pickBraille(revealProgress))
        }
      }
      charIndex++
    }

    return (
      <Text key={li} color={theme.colors.accent.default} bold>
        {chars.join('')}
      </Text>
    )
  })

  return <Box flexDirection="column">{renderedLines}</Box>
}

export type BrailleTransitionOptions = {
  /** The text to reveal or dissolve. Can be multi-line. */
  text: string
  /** 'in' = noise→text (reveal), 'out' = text→noise (dissolve). Default: 'in'. */
  direction?: 'in' | 'out'
  /** Total animation duration in ms. Default: 600. */
  duration?: number
  /** Stagger delay per character in ms. Default: 15. */
  stagger?: number
  theme?: PartialTheme
}

export async function brailleTransition(options: BrailleTransitionOptions): Promise<void> {
  const lines = options.text.split('\n')
  const direction = options.direction ?? 'in'
  const duration = options.duration ?? 600
  const stagger = options.stagger ?? 15

  return new Promise<void>((resolve) => {
    const app = render(
      <ThemeProvider theme={options.theme}>
        <TransitionView
          lines={lines}
          direction={direction}
          duration={duration}
          stagger={stagger}
          onComplete={() => {
            app.unmount()
            resolve()
          }}
        />
      </ThemeProvider>,
    )
  })
}
