/**
 * Caret game-of-life component
 *
 * Conway's Game of Life rendered with braille characters. Each braille
 * character packs a 2×4 grid of cells, so a 40-char wide display simulates
 * 80 cells wide × (rows*4) cells tall — a high-resolution cellular
 * automaton in a tiny footprint.
 *
 *   await gameOfLife({ duration: 5000, width: 40, height: 10 })
 *
 * Auto-instant under reduced motion or non-TTY.
 */

import React, { useState, useEffect, useRef } from 'react'
import { Box, Text, render } from 'ink'
import { gridToBraille, makeGrid } from 'unicode-animations'
import { ThemeProvider, useTheme } from '../theme/index.js'
import type { PartialTheme } from '../theme/types.js'
import { capability } from '../lib/capability.js'

function randomGrid(rows: number, cols: number, density: number): boolean[][] {
  const grid = makeGrid(rows, cols)
  for (let r = 0; r < rows; r++) {
    const row = grid[r]
    if (!row) continue
    for (let c = 0; c < cols; c++) {
      row[c] = Math.random() < density
    }
  }
  return grid
}

function step(grid: boolean[][]): boolean[][] {
  const rows = grid.length
  const cols = grid[0]?.length ?? 0
  const next = makeGrid(rows, cols)

  for (let r = 0; r < rows; r++) {
    const nextRow = next[r]
    if (!nextRow) continue
    for (let c = 0; c < cols; c++) {
      let neighbors = 0
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue
          // Toroidal (wrap) boundaries — patterns can travel off the edge
          const rr = (r + dr + rows) % rows
          const cc = (c + dc + cols) % cols
          const nRow = grid[rr]
          if (nRow && nRow[cc]) neighbors++
        }
      }
      const row = grid[r]
      const alive = row ? row[c] === true : false
      // Conway's rules
      if (alive && (neighbors === 2 || neighbors === 3)) nextRow[c] = true
      else if (!alive && neighbors === 3) nextRow[c] = true
      else nextRow[c] = false
    }
  }

  return next
}

/** Slice a full boolean grid into a 4-row strip for gridToBraille. */
function sliceStrip(grid: boolean[][], rowStart: number, cols: number): boolean[][] {
  const strip = makeGrid(4, cols)
  for (let r = 0; r < 4; r++) {
    const src = grid[rowStart + r]
    const dst = strip[r]
    if (!src || !dst) continue
    for (let c = 0; c < cols; c++) {
      dst[c] = src[c] === true
    }
  }
  return strip
}

type ViewProps = {
  charWidth: number
  charHeight: number
  duration: number
  density: number
  onComplete: () => void
}

function GameOfLifeView({ charWidth, charHeight, duration, density, onComplete }: ViewProps) {
  const theme = useTheme()
  const cap = capability()
  const reduced = cap.reducedMotion || !cap.isTTY

  const dotCols = charWidth * 2
  const dotRows = charHeight * 4

  const gridRef = useRef<boolean[][]>([])
  const [lines, setLines] = useState<string[]>(() => {
    if (reduced) return []
    const g = randomGrid(dotRows, dotCols, density)
    gridRef.current = g
    const out: string[] = []
    for (let r = 0; r < dotRows; r += 4) {
      out.push(gridToBraille(sliceStrip(g, r, dotCols)))
    }
    return out
  })

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(onComplete, 50)
      return () => clearTimeout(t)
    }

    const FRAME_MS = 100
    const start = Date.now()

    const interval = setInterval(() => {
      const elapsed = Date.now() - start
      if (elapsed >= duration) {
        clearInterval(interval)
        setTimeout(onComplete, 50)
        return
      }

      const next = step(gridRef.current)
      gridRef.current = next

      const out: string[] = []
      for (let r = 0; r < dotRows; r += 4) {
        out.push(gridToBraille(sliceStrip(next, r, dotCols)))
      }
      setLines(out)
    }, FRAME_MS)

    return () => clearInterval(interval)
  }, [reduced, duration, dotRows, dotCols, onComplete])

  if (reduced) return null

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

export type GameOfLifeOptions = {
  /** Total animation duration in ms. Default: 5000. */
  duration?: number
  /** Width in braille characters (dot-width = width × 2). Default: 40. */
  width?: number
  /** Height in braille lines (dot-height = height × 4). Default: 10. */
  height?: number
  /** Initial cell density 0-1. Default: 0.3. */
  density?: number
  theme?: PartialTheme
}

export async function gameOfLife(options: GameOfLifeOptions = {}): Promise<void> {
  const duration = options.duration ?? 5000
  const width = options.width ?? 40
  const height = options.height ?? 10
  const density = Math.max(0, Math.min(1, options.density ?? 0.3))

  const cap = capability()
  if (cap.reducedMotion || !cap.isTTY) {
    return
  }

  return new Promise<void>((resolve) => {
    const app = render(
      <ThemeProvider theme={options.theme}>
        <GameOfLifeView
          charWidth={width}
          charHeight={height}
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
