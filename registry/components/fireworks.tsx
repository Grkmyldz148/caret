/**
 * Caret fireworks component
 *
 * Terminal fireworks using braille particles — a rocket goes up, then
 * explodes into particles radiating outward with gravity and fade.
 *
 *   await fireworks({ bursts: 3, duration: 3000 })
 *
 * Auto-instant under reduced motion or non-TTY.
 */

import React, { useState, useEffect, useCallback } from 'react'
import { Box, Text, render } from 'ink'
import { ThemeProvider, useTheme } from '../theme/index.js'
import type { PartialTheme } from '../theme/types.js'
import { capability } from '../lib/capability.js'

// Braille density levels — dense to sparse (used for fade-out)
const BRAILLE_DENSE = ['⣿', '⣇', '⡇', '⠇', '⠃', '⠂', '⠁', '⠀'] as const

function fadedBraille(life: number): string {
  // life: 1 = fresh, 0 = dead
  const idx = Math.min(
    BRAILLE_DENSE.length - 1,
    Math.max(0, Math.floor((1 - life) * BRAILLE_DENSE.length)),
  )
  return BRAILLE_DENSE[idx]!
}

type RocketParticle = {
  x: number
  y: number
  targetY: number
  phase: 'rising'
  born: number
  burstIndex: number
}

type ExplosionParticle = {
  x: number
  y: number
  vx: number
  vy: number
  phase: 'exploding'
  born: number
  lifespan: number
  burstIndex: number
}

type AnyParticle = RocketParticle | ExplosionParticle

function spawnExplosionParticles(
  cx: number,
  cy: number,
  count: number,
  now: number,
  burstIndex: number,
): ExplosionParticle[] {
  const particles: ExplosionParticle[] = []
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4
    const speed = 0.5 + Math.random() * 1.5
    particles.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed * 0.6, // squash vertically for terminal aspect
      phase: 'exploding',
      born: now,
      lifespan: 600 + Math.random() * 800,
      burstIndex,
    })
  }
  return particles
}

type ViewProps = {
  width: number
  height: number
  duration: number
  bursts: number
  onComplete: () => void
}

function FireworksView({ width, height, duration, bursts, onComplete }: ViewProps) {
  const theme = useTheme()
  const cap = capability()
  const reduced = cap.reducedMotion || !cap.isTTY

  const [particles, setParticles] = useState<AnyParticle[]>([])
  const [startTime] = useState(() => Date.now())
  const [explodedBursts, setExplodedBursts] = useState<Set<number>>(() => new Set())

  const staggerInterval = Math.min(800, (duration * 0.7) / Math.max(1, bursts))
  const rocketDuration = 500

  const scheduleRockets = useCallback(() => {
    const now = Date.now()
    const rockets: RocketParticle[] = []
    for (let i = 0; i < bursts; i++) {
      const launchX = Math.floor(width * 0.2 + Math.random() * width * 0.6)
      const targetY = 1 + Math.floor(Math.random() * Math.floor(height * 0.4))
      rockets.push({
        x: launchX,
        y: height - 1,
        targetY,
        phase: 'rising',
        born: now + i * staggerInterval,
        burstIndex: i,
      })
    }
    return rockets
  }, [bursts, width, height, staggerInterval])

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(onComplete, 50)
      return () => clearTimeout(t)
    }

    // Create rockets at mount
    const rockets = scheduleRockets()
    setParticles(rockets)

    const GRAVITY = 0.05
    const FRAME_MS = 40

    const interval = setInterval(() => {
      const now = Date.now()
      const elapsed = now - startTime

      if (elapsed >= duration) {
        clearInterval(interval)
        setTimeout(onComplete, 50)
        return
      }

      setParticles((prev) => {
        const next: AnyParticle[] = []
        const newExplosions: ExplosionParticle[] = []

        for (const p of prev) {
          if (p.phase === 'rising') {
            const rocketAge = now - p.born
            if (rocketAge < 0) {
              // Not launched yet
              next.push(p)
              continue
            }

            // Animate rocket upward
            const progress = Math.min(1, rocketAge / rocketDuration)
            const currentY = (height - 1) - progress * ((height - 1) - p.targetY)

            if (progress >= 1) {
              // Explode! Check if already exploded
              setExplodedBursts((prevSet) => {
                if (prevSet.has(p.burstIndex)) return prevSet
                const newSet = new Set(prevSet)
                newSet.add(p.burstIndex)
                // Spawn explosion particles
                const count = 15 + Math.floor(Math.random() * 6)
                const ep = spawnExplosionParticles(p.x, p.targetY, count, now, p.burstIndex)
                newExplosions.push(...ep)
                return newSet
              })
              // Rocket is consumed — don't push it
            } else {
              next.push({ ...p, y: currentY })
            }
          } else {
            // Exploding particle — apply physics
            const age = now - p.born
            if (age >= p.lifespan || p.y >= height || p.x < 0 || p.x >= width) {
              continue // dead
            }
            next.push({
              ...p,
              x: p.x + p.vx,
              y: p.y + p.vy,
              vy: p.vy + GRAVITY,
              vx: p.vx * 0.97,
            })
          }
        }

        return [...next, ...newExplosions]
      })
    }, FRAME_MS)

    return () => {
      clearInterval(interval)
    }
  }, [reduced, duration, bursts, width, height, onComplete, startTime, scheduleRockets, rocketDuration])

  if (reduced) {
    return null
  }

  // Render viewport as a grid
  const now = Date.now()
  const grid: string[][] = []
  const colorGrid: ('accent' | 'dim')[][] = []
  for (let row = 0; row < height; row++) {
    const line: string[] = []
    const colors: ('accent' | 'dim')[] = []
    for (let col = 0; col < width; col++) {
      line.push(' ')
      colors.push('dim')
    }
    grid.push(line)
    colorGrid.push(colors)
  }

  // Place particles on the grid
  for (const p of particles) {
    const col = Math.round(p.x)
    const row = Math.round(p.y)
    if (row >= 0 && row < height && col >= 0 && col < width) {
      const gridRow = grid[row]
      const colorRow = colorGrid[row]
      if (gridRow && colorRow) {
        if (p.phase === 'rising') {
          const rocketAge = now - p.born
          if (rocketAge >= 0) {
            gridRow[col] = '⣿'
            colorRow[col] = 'accent'
          }
        } else {
          const age = now - p.born
          const life = Math.max(0, 1 - age / p.lifespan)
          gridRow[col] = fadedBraille(life)
          colorRow[col] = life > 0.5 ? 'accent' : 'dim'
        }
      }
    }
  }

  return (
    <Box flexDirection="column">
      {grid.map((row, rowIdx) => {
        // Build segments of same-colored characters for efficient rendering
        const colorRow = colorGrid[rowIdx]
        if (!colorRow) return <Text key={rowIdx}>{row.join('')}</Text>

        const segments: { text: string; color: 'accent' | 'dim' }[] = []
        let currentText = ''
        let currentColor: 'accent' | 'dim' = 'dim'

        for (let col = 0; col < row.length; col++) {
          const ch = row[col] ?? ' '
          const clr = colorRow[col] ?? 'dim'
          if (col === 0) {
            currentText = ch
            currentColor = clr
          } else if (clr === currentColor) {
            currentText += ch
          } else {
            segments.push({ text: currentText, color: currentColor })
            currentText = ch
            currentColor = clr
          }
        }
        segments.push({ text: currentText, color: currentColor })

        return (
          <Text key={rowIdx}>
            {segments.map((seg, si) => (
              <Text
                key={si}
                color={
                  seg.color === 'accent'
                    ? theme.colors.accent.default
                    : theme.colors.accent.muted
                }
                bold={seg.color === 'accent'}
              >
                {seg.text}
              </Text>
            ))}
          </Text>
        )
      })}
    </Box>
  )
}

export type FireworksOptions = {
  /** Number of firework bursts. Default: 3. */
  bursts?: number
  /** Total animation duration in ms. Default: 3000. */
  duration?: number
  /** Viewport width in columns. Default: 60. */
  width?: number
  /** Viewport height in rows. Default: 15. */
  height?: number
  theme?: PartialTheme
}

export async function fireworks(options: FireworksOptions = {}): Promise<void> {
  const burstCount = options.bursts ?? 3
  const duration = options.duration ?? 3000
  const width = options.width ?? 60
  const height = options.height ?? 15

  const cap = capability()
  if (cap.reducedMotion || !cap.isTTY) {
    return
  }

  return new Promise<void>((resolve) => {
    const app = render(
      <ThemeProvider theme={options.theme}>
        <FireworksView
          width={width}
          height={height}
          duration={duration}
          bursts={burstCount}
          onComplete={() => {
            app.unmount()
            resolve()
          }}
        />
      </ThemeProvider>,
    )
  })
}
