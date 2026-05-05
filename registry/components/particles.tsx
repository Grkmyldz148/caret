/**
 * Caret particles component
 *
 * Text that explodes into braille particles and reassembles — a dramatic
 * reveal animation. Three phases:
 *   1. Show     — display the text normally
 *   2. Explode  — each char flies outward as a braille particle
 *   3. Reassemble — particles are pulled back and morph to their char
 *
 *   await particles({ text: 'READY', duration: 2000 })
 *
 * Auto-instant under reduced motion or non-TTY (prints the text bold).
 */

import React, { useState, useEffect, useMemo } from 'react'
import { Box, Text, render } from 'ink'
import { ThemeProvider, useTheme } from '../theme/index.js'
import type { PartialTheme } from '../theme/types.js'
import { capability } from '../lib/capability.js'

function randomBraille(): string {
  return String.fromCharCode(0x2800 + Math.floor(Math.random() * 256))
}

type Particle = {
  /** Original character (final destination char). */
  ch: string
  /** Initial position (anchor / target). */
  targetX: number
  targetY: number
  /** Current position (float). */
  x: number
  y: number
  /** Velocity vector. */
  vx: number
  vy: number
}

type Phase = 'show' | 'explode' | 'reassemble'

function makeParticles(text: string, originX: number, originY: number): Particle[] {
  const particles: Particle[] = []
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!
    if (ch === ' ') continue
    const angle = Math.random() * Math.PI * 2
    const speed = 0.6 + Math.random() * 1.4
    particles.push({
      ch,
      targetX: originX + i,
      targetY: originY,
      x: originX + i,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed * 0.6, // vertical squash — rows are taller
    })
  }
  return particles
}

type ViewProps = {
  text: string
  width: number
  height: number
  duration: number
  onComplete: () => void
}

function ParticlesView({ text, width, height, duration, onComplete }: ViewProps) {
  const theme = useTheme()
  const cap = capability()
  const reduced = cap.reducedMotion || !cap.isTTY

  // Phase durations (sum to `duration`)
  const showMs = Math.round(duration * 0.1 + 100) // ~200ms at default 2000
  const explodeMs = Math.round(duration * 0.4)
  const reassembleMs = duration - showMs - explodeMs

  // Anchor the text horizontally centered on a middle row
  const originX = Math.max(0, Math.floor((width - text.length) / 2))
  const originY = Math.floor(height / 2)

  const particles = useMemo<Particle[]>(
    () => makeParticles(text, originX, originY),
    [text, originX, originY],
  )

  const [phase, setPhase] = useState<Phase>(reduced ? 'show' : 'show')
  const [frameTick, setFrameTick] = useState(0)
  const [positions, setPositions] = useState<Particle[]>(particles)

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(onComplete, 50)
      return () => clearTimeout(t)
    }

    const FRAME_MS = 40
    const start = Date.now()

    const interval = setInterval(() => {
      const elapsed = Date.now() - start

      if (elapsed < showMs) {
        setPhase('show')
      } else if (elapsed < showMs + explodeMs) {
        setPhase('explode')
        const t = (elapsed - showMs) / explodeMs // 0 -> 1
        const decel = 1 - t * 0.6 // particles slow over time
        setPositions((prev) =>
          prev.map((p) => ({
            ...p,
            x: p.x + p.vx * decel,
            y: p.y + p.vy * decel,
          })),
        )
      } else if (elapsed < duration) {
        setPhase('reassemble')
        const t = (elapsed - showMs - explodeMs) / reassembleMs // 0 -> 1
        // Ease-out cubic — strong pull near the end
        const ease = 1 - Math.pow(1 - t, 3)
        setPositions((prev) =>
          prev.map((p) => ({
            ...p,
            x: p.x + (p.targetX - p.x) * (0.12 + ease * 0.25),
            y: p.y + (p.targetY - p.y) * (0.12 + ease * 0.25),
          })),
        )
      } else {
        clearInterval(interval)
        setTimeout(onComplete, 50)
        return
      }

      setFrameTick((f) => (f + 1) % 1_000_000)
    }, FRAME_MS)

    return () => clearInterval(interval)
  }, [reduced, duration, showMs, explodeMs, reassembleMs, onComplete])

  if (reduced) {
    // Still render the text so it's visible under reduced motion
    return (
      <Box flexDirection="column">
        {Array.from({ length: originY }, (_, i) => (
          <Text key={`pad-${i}`}> </Text>
        ))}
        <Text color={theme.colors.accent.default} bold>
          {' '.repeat(originX)}
          {text}
        </Text>
      </Box>
    )
  }

  // Build grid
  const grid: string[][] = []
  for (let r = 0; r < height; r++) {
    const row: string[] = []
    for (let c = 0; c < width; c++) row.push(' ')
    grid.push(row)
  }

  // Snap particles into the grid
  for (const p of positions) {
    const col = Math.round(p.x)
    const row = Math.round(p.y)
    if (row < 0 || row >= height || col < 0 || col >= width) continue
    const gridRow = grid[row]
    if (!gridRow) continue

    if (phase === 'show') {
      gridRow[col] = p.ch
    } else if (phase === 'explode') {
      // Flickering braille noise during flight
      gridRow[col] = randomBraille()
    } else {
      // reassemble — snap to real char when close to target
      const dx = p.targetX - p.x
      const dy = p.targetY - p.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      gridRow[col] = dist < 0.6 ? p.ch : randomBraille()
    }
  }

  // Ensure frameTick is referenced for renders
  void frameTick

  return (
    <Box flexDirection="column">
      {grid.map((row, rIdx) => (
        <Text key={rIdx} color={theme.colors.accent.default} bold={phase !== 'explode'}>
          {row.join('')}
        </Text>
      ))}
    </Box>
  )
}

export type ParticlesOptions = {
  /** Text to reveal. */
  text: string
  /** Total animation duration in ms. Default: 2000. */
  duration?: number
  /** Viewport width. Default: 60. */
  width?: number
  /** Viewport height. Default: 12. */
  height?: number
  theme?: PartialTheme
}

export async function particles(options: ParticlesOptions): Promise<void> {
  const text = options.text
  const duration = options.duration ?? 2000
  const width = options.width ?? 60
  const height = options.height ?? 12

  return new Promise<void>((resolve) => {
    const app = render(
      <ThemeProvider theme={options.theme}>
        <ParticlesView
          text={text}
          width={width}
          height={height}
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
