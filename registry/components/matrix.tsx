/**
 * Caret matrix component
 *
 * Matrix-style digital rain using braille characters. Vertical streams
 * of braille fall down the viewport — heads glow bright, tails fade out.
 *
 *   await matrix({ duration: 3000 })
 *
 * Auto-instant under reduced motion or non-TTY.
 */

import React, { useState, useEffect, useRef } from 'react'
import { Box, Text, render } from 'ink'
import { ThemeProvider, useTheme } from '../theme/index.js'
import type { PartialTheme } from '../theme/types.js'
import { capability } from '../lib/capability.js'

// Full braille range: U+2800 - U+28FF (256 chars)
function randomBraille(): string {
  return String.fromCharCode(0x2800 + Math.floor(Math.random() * 256))
}

type Stream = {
  col: number
  /** Head row position in characters (floating point for sub-char movement) */
  head: number
  /** Length of the tail */
  length: number
  /** Rows advanced per frame */
  speed: number
  /** Characters along the stream (index 0 is head). */
  chars: string[]
  /** Stream is active */
  alive: boolean
}

function spawnStream(width: number, height: number): Stream {
  const length = 4 + Math.floor(Math.random() * Math.min(height, 12))
  const chars: string[] = []
  for (let i = 0; i < length; i++) chars.push(randomBraille())
  return {
    col: Math.floor(Math.random() * width),
    head: -Math.floor(Math.random() * height),
    length,
    speed: 0.3 + Math.random() * 0.9,
    chars,
    alive: true,
  }
}

type CellKind = 'empty' | 'head' | 'body' | 'tail'

type Cell = {
  kind: CellKind
  char: string
}

type ViewProps = {
  width: number
  height: number
  duration: number
  density: number
  onComplete: () => void
}

function MatrixView({ width, height, duration, density, onComplete }: ViewProps) {
  const theme = useTheme()
  const cap = capability()
  const reduced = cap.reducedMotion || !cap.isTTY

  const [, setTick] = useState(0)
  const streamsRef = useRef<Stream[]>([])
  const startRef = useRef<number>(Date.now())

  // Initialize streams once
  if (streamsRef.current.length === 0 && !reduced) {
    const init: Stream[] = []
    for (let i = 0; i < density; i++) init.push(spawnStream(width, height))
    streamsRef.current = init
  }

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(onComplete, 50)
      return () => clearTimeout(t)
    }

    const FRAME_MS = 50
    startRef.current = Date.now()

    const interval = setInterval(() => {
      const now = Date.now()
      const elapsed = now - startRef.current

      // Fade-out phase over the last 300ms — new streams stop spawning
      const fadeStart = duration - 300
      const fading = elapsed >= fadeStart

      if (elapsed >= duration) {
        clearInterval(interval)
        setTimeout(onComplete, 50)
        return
      }

      const next: Stream[] = []
      for (const s of streamsRef.current) {
        const nextHead = s.head + s.speed
        // Flicker characters along the stream — each char has a small
        // chance of changing each frame.
        const nextChars = s.chars.map((c) =>
          Math.random() < 0.15 ? randomBraille() : c,
        )
        // A stream dies when its tail has fully left the viewport
        const tailRow = nextHead - s.length
        if (tailRow > height) continue
        next.push({ ...s, head: nextHead, chars: nextChars })
      }

      // Respawn to maintain density (unless fading out)
      if (!fading) {
        while (next.length < density) {
          next.push(spawnStream(width, height))
        }
      }

      streamsRef.current = next
      setTick((t) => (t + 1) % 1_000_000)
    }, FRAME_MS)
    return () => clearInterval(interval)
  }, [reduced, duration, density, width, height, onComplete])

  if (reduced) return null

  // Build cell grid
  const cells: Cell[][] = []
  for (let r = 0; r < height; r++) {
    const row: Cell[] = []
    for (let c = 0; c < width; c++) row.push({ kind: 'empty', char: ' ' })
    cells.push(row)
  }

  for (const s of streamsRef.current) {
    if (s.col < 0 || s.col >= width) continue
    for (let i = 0; i < s.length; i++) {
      const row = Math.floor(s.head - i)
      if (row < 0 || row >= height) continue
      const ch = s.chars[i] ?? randomBraille()
      let kind: CellKind
      if (i === 0) kind = 'head'
      else if (i < Math.max(2, Math.floor(s.length * 0.4))) kind = 'body'
      else kind = 'tail'
      const gridRow = cells[row]
      if (!gridRow) continue
      const existing = gridRow[s.col]
      // Prefer brighter cell kinds when streams overlap
      if (!existing || kind === 'head' || (kind === 'body' && existing.kind === 'tail') || existing.kind === 'empty') {
        gridRow[s.col] = { kind, char: ch }
      }
    }
  }

  // Render — one <Text> per contiguous same-kind run for efficiency
  const accent = theme.colors.accent.default
  const lines = cells.map((row, rIdx) => {
    const segments: { kind: CellKind; text: string }[] = []
    for (const cell of row) {
      const last = segments[segments.length - 1]
      if (last && last.kind === cell.kind) {
        last.text += cell.char
      } else {
        segments.push({ kind: cell.kind, text: cell.char })
      }
    }
    return (
      <Text key={rIdx}>
        {segments.map((seg, i) => {
          if (seg.kind === 'empty') {
            return <Text key={i}>{seg.text}</Text>
          }
          if (seg.kind === 'head') {
            return (
              <Text key={i} color={accent} bold>
                {seg.text}
              </Text>
            )
          }
          if (seg.kind === 'body') {
            return (
              <Text key={i} color={accent}>
                {seg.text}
              </Text>
            )
          }
          return (
            <Text key={i} color={accent} dimColor>
              {seg.text}
            </Text>
          )
        })}
      </Text>
    )
  })

  return <Box flexDirection="column">{lines}</Box>
}

export type MatrixOptions = {
  /** Total animation duration in ms. Default: 3000. */
  duration?: number
  /** Viewport width in columns. Default: 60. */
  width?: number
  /** Viewport height in rows. Default: 15. */
  height?: number
  /** Number of active streams. Default: 15. */
  density?: number
  theme?: PartialTheme
}

export async function matrix(options: MatrixOptions = {}): Promise<void> {
  const duration = options.duration ?? 3000
  const width = options.width ?? 60
  const height = options.height ?? 15
  const density = options.density ?? 15

  const cap = capability()
  if (cap.reducedMotion || !cap.isTTY) {
    return
  }

  return new Promise<void>((resolve) => {
    const app = render(
      <ThemeProvider theme={options.theme}>
        <MatrixView
          width={width}
          height={height}
          duration={duration}
          density={density}
          onComplete={() => {
            app.unmount()
            resolve()
          }}
        />
      </ThemeProvider>,
    )
  })
}
