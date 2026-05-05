/**
 * Caret confetti component
 *
 * Terminal confetti celebration using braille particles with gravity physics.
 * Spawns particles near the top that fall with gravity and fade through
 * braille density levels.
 *
 *   await confetti({ duration: 2000, density: 30 })
 *
 * Auto-instant under reduced motion or non-TTY.
 */

import React, { useState, useEffect } from 'react'
import { Box, Text, render } from 'ink'
import { ThemeProvider, useTheme } from '../theme/index.js'
import type { PartialTheme } from '../theme/types.js'
import { capability } from '../lib/capability.js'

// Braille density levels — dense to sparse (used for fade-out)
const BRAILLE_DENSE = ['⣿', '⣇', '⡇', '⠇', '⠃', '⠂', '⠁', '⠀'] as const

// Random braille characters for visual variety
const BRAILLE_CHARS = ['⣿', '⣷', '⣇', '⣯', '⡿', '⢿', '⣻', '⣽', '⣾', '⣶'] as const

function randomBrailleChar(): string {
  return BRAILLE_CHARS[Math.floor(Math.random() * BRAILLE_CHARS.length)]!
}

function fadedBraille(life: number): string {
  // life: 1 = fresh, 0 = dead
  const idx = Math.min(
    BRAILLE_DENSE.length - 1,
    Math.max(0, Math.floor((1 - life) * BRAILLE_DENSE.length)),
  )
  return BRAILLE_DENSE[idx]!
}

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  char: string
  born: number
  lifespan: number
}

function spawnParticle(width: number, born: number): Particle {
  return {
    x: Math.random() * (width - 2) + 1,
    y: Math.random() * 2, // spawn near the top
    vx: (Math.random() - 0.5) * 2, // horizontal drift
    vy: Math.random() * 0.5 + 0.2, // initial downward velocity
    char: randomBrailleChar(),
    born,
    lifespan: 800 + Math.random() * 1200, // 800–2000ms lifespan
  }
}

type ViewProps = {
  width: number
  height: number
  duration: number
  density: number
  onComplete: () => void
}

function ConfettiView({ width, height, duration, density, onComplete }: ViewProps) {
  const theme = useTheme()
  const cap = capability()
  const reduced = cap.reducedMotion || !cap.isTTY

  const [particles, setParticles] = useState<Particle[]>([])
  const [startTime] = useState(() => Date.now())

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(onComplete, 50)
      return () => clearTimeout(t)
    }

    // Spawn initial particles staggered over the first portion of the duration
    const spawnInterval = Math.min(duration * 0.6, duration) / density
    const spawnTimers: ReturnType<typeof setTimeout>[] = []

    for (let i = 0; i < density; i++) {
      const timer = setTimeout(() => {
        setParticles((prev) => [...prev, spawnParticle(width, Date.now())])
      }, i * spawnInterval)
      spawnTimers.push(timer)
    }

    // Animation loop
    const GRAVITY = 0.08
    const FRAME_MS = 40

    const interval = setInterval(() => {
      const now = Date.now()
      const elapsed = now - startTime

      if (elapsed >= duration) {
        clearInterval(interval)
        setTimeout(onComplete, 50)
        return
      }

      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + GRAVITY,
            vx: p.vx * 0.98, // slight air resistance
          }))
          .filter((p) => {
            const age = now - p.born
            return age < p.lifespan && p.y < height && p.x >= 0 && p.x < width
          }),
      )
    }, FRAME_MS)

    return () => {
      clearInterval(interval)
      for (const t of spawnTimers) clearTimeout(t)
    }
  }, [reduced, duration, density, width, height, onComplete, startTime])

  if (reduced) {
    return null
  }

  // Render viewport as a grid
  const now = Date.now()
  const grid: string[][] = []
  for (let row = 0; row < height; row++) {
    const line: string[] = []
    for (let col = 0; col < width; col++) {
      line.push(' ')
    }
    grid.push(line)
  }

  // Place particles on the grid
  for (const p of particles) {
    const col = Math.round(p.x)
    const row = Math.round(p.y)
    if (row >= 0 && row < height && col >= 0 && col < width) {
      const gridRow = grid[row]
      if (gridRow) {
        const age = now - p.born
        const life = Math.max(0, 1 - age / p.lifespan)
        gridRow[col] = fadedBraille(life)
      }
    }
  }

  const lines = grid.map((row) => row.join(''))

  return (
    <Box flexDirection="column">
      {lines.map((line, i) => (
        <Text key={i} color={theme.colors.accent.default}>
          {line}
        </Text>
      ))}
    </Box>
  )
}

export type ConfettiOptions = {
  /** Total animation duration in ms. Default: 2000. */
  duration?: number
  /** Number of particles. Default: 30. */
  density?: number
  /** Viewport width in columns. Default: 60. */
  width?: number
  /** Viewport height in rows. Default: 15. */
  height?: number
  theme?: PartialTheme
}

export async function confetti(options: ConfettiOptions = {}): Promise<void> {
  const duration = options.duration ?? 2000
  const density = options.density ?? 30
  const width = options.width ?? 60
  const height = options.height ?? 15

  const cap = capability()
  if (cap.reducedMotion || !cap.isTTY) {
    return
  }

  return new Promise<void>((resolve) => {
    const app = render(
      <ThemeProvider theme={options.theme}>
        <ConfettiView
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
