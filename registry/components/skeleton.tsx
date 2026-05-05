/**
 * Caret skeleton component
 *
 * Terminal skeleton loader that uses braille character density animation
 * to create a shimmer effect. Like web skeleton screens, but for the
 * terminal.
 *
 * Usage:
 *   const result = await skeleton('Loading profile...', async () => {
 *     return await fetchProfile()
 *   })
 */

import React, { useState, useEffect } from 'react'
import { Box, Text, render } from 'ink'
import { useTheme, ThemeProvider } from '../theme/index.js'
import type { PartialTheme } from '../theme/types.js'
import { capability } from '../lib/capability.js'

// Braille density levels — from sparse to full
const BRAILLE_EMPTY = '\u2800'
const BRAILLE_SPARSE = ['\u2801', '\u2802', '\u2804', '\u2840']
const BRAILLE_MEDIUM = ['\u2803', '\u2805', '\u2841', '\u2806', '\u2842', '\u2844']
const BRAILLE_DENSE = ['\u2807', '\u2843', '\u2845', '\u2846', '\u28C7', '\u28C3']
const BRAILLE_FULL = '\u28FF'

// All density levels as a flat gradient from empty to full
const DENSITY_GRADIENT = [
  BRAILLE_EMPTY,
  ...BRAILLE_SPARSE,
  ...BRAILLE_MEDIUM,
  ...BRAILLE_DENSE,
  BRAILLE_FULL,
]

type SkeletonVariant = 'wave' | 'pulse' | 'blocks'

type SkeletonViewProps = {
  label: string
  lines: number
  width: number
  variant: SkeletonVariant
}

/** Pick a character from the density gradient given a 0..1 intensity value. */
function charAtIntensity(t: number): string {
  const idx = Math.round(t * (DENSITY_GRADIENT.length - 1))
  return DENSITY_GRADIENT[Math.max(0, Math.min(idx, DENSITY_GRADIENT.length - 1))]!
}

/** Generate a single line of braille characters for the 'wave' variant. */
function waveLine(width: number, phase: number, _lineOffset: number): string {
  const bandWidth = 8
  let out = ''
  for (let i = 0; i < width; i++) {
    // Distance from the bright band center
    const bandCenter = ((phase + _lineOffset * 0.15) % 1.0) * (width + bandWidth) - bandWidth / 2
    const dist = Math.abs(i - bandCenter)
    // Smooth falloff from band center
    const intensity = Math.max(0, 1 - dist / (bandWidth / 2))
    // Base noise so the line isn't completely empty outside the band
    const base = 0.1
    const t = base + intensity * (1 - base)
    out += charAtIntensity(t)
  }
  return out
}

/** Generate a single line of braille characters for the 'pulse' variant. */
function pulseLine(width: number, phase: number): string {
  // Smooth sine pulse — all characters brighten and dim together
  const t = 0.1 + Math.abs(Math.sin(phase * Math.PI)) * 0.9
  let out = ''
  for (let i = 0; i < width; i++) {
    out += charAtIntensity(t)
  }
  return out
}

/** Generate a single line of braille characters for the 'blocks' variant. */
function blocksLine(width: number, phase: number, lineOffset: number): string {
  const blockSize = 4
  let out = ''
  for (let i = 0; i < width; i++) {
    const blockIdx = Math.floor(i / blockSize)
    // Stagger blocks using their index
    const blockPhase = (phase + blockIdx * 0.12 + lineOffset * 0.2) % 1.0
    const t = 0.1 + Math.abs(Math.sin(blockPhase * Math.PI * 2)) * 0.9
    out += charAtIntensity(t)
  }
  return out
}

function generateLine(width: number, phase: number, lineIndex: number, variant: SkeletonVariant): string {
  switch (variant) {
    case 'wave':
      return waveLine(width, phase, lineIndex)
    case 'pulse':
      return pulseLine(width, phase)
    case 'blocks':
      return blocksLine(width, phase, lineIndex)
  }
}

/** Static placeholder for reduced-motion or non-TTY contexts. */
function staticLine(width: number): string {
  return charAtIntensity(0.3).repeat(width)
}

function SkeletonView({ label, lines, width, variant }: SkeletonViewProps) {
  const theme = useTheme()
  const [phase, setPhase] = useState<number>(0)
  const cap = capability()
  const animated = cap.isTTY && !cap.reducedMotion

  useEffect(() => {
    if (!animated) return
    const frameMs = theme.motion.spinnerFrameMs
    const interval = setInterval(() => {
      setPhase((p) => (p + 0.04) % 1.0)
    }, frameMs)
    return () => clearInterval(interval)
  }, [animated, theme.motion.spinnerFrameMs])

  const accentColor = theme.colors.accent.default

  return (
    <Box flexDirection="column">
      <Text dimColor>{label}</Text>
      {Array.from({ length: lines }, (_, i) => (
        <Box key={i}>
          <Text color={accentColor}>
            {animated ? generateLine(width, phase, i, variant) : staticLine(width)}
          </Text>
        </Box>
      ))}
    </Box>
  )
}

export type SkeletonOptions = {
  lines?: number
  width?: number
  variant?: SkeletonVariant
  theme?: PartialTheme
}

export async function skeleton<T>(
  label: string,
  fn: () => Promise<T>,
  options: SkeletonOptions = {},
): Promise<T> {
  const lines = options.lines ?? 3
  const width = options.width ?? 40
  const variant = options.variant ?? 'wave'

  const renderInstance = render(
    <ThemeProvider theme={options.theme}>
      <SkeletonView label={label} lines={lines} width={width} variant={variant} />
    </ThemeProvider>,
  )

  try {
    const result = await fn()
    renderInstance.unmount()
    return result
  } catch (err) {
    renderInstance.unmount()
    throw err
  }
}
