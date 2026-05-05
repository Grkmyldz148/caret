'use client'

/**
 * Web mirrors of the Caret registry effect components.
 *
 * Each of these is a direct port of the tick loop logic in
 * `registry/components/{confetti,fireworks,matrix,particles,celebrate,game-of-life}.tsx`
 * — same particle systems, same braille vocabulary, same timing feel —
 * but rendered into a compact HTML grid sized to fit a catalog card.
 *
 * Shared design decisions:
 *
 *   - Every effect is a `'use client'` React component with its own
 *     `setInterval` animation loop. No CSS keyframes.
 *   - Effects loop forever so the cards animate even without hover.
 *     `TerminalStage` remounts the subtree on hover (via a `key` bump),
 *     which effectively restarts the current loop from frame zero.
 *   - Grids are rendered as `Row` elements (divs under `.term`'s
 *     `white-space: pre`) so every cell is one monospace character.
 *     The fixed width × height is chosen so the result still fits the
 *     intrinsic-width stage in a narrow card.
 *   - `prefers-reduced-motion` is respected by the parent `TerminalStage`
 *     via a CSS rule that freezes animations; here we additionally short
 *     circuit the tick loop so no work happens in the background.
 */

import { useEffect, useRef, useState } from 'react'
import { Row } from './Terminal'

// ---------------------------------------------------------------------------
// Small shared helpers
// ---------------------------------------------------------------------------

/** Full braille range U+2800-U+28FF for noise-style glyphs. */
function randomBraille(): string {
  return String.fromCharCode(0x2800 + Math.floor(Math.random() * 256))
}

/** Density ladder used by confetti / fireworks for fade-out. */
const BRAILLE_DENSE = ['⣿', '⣇', '⡇', '⠇', '⠃', '⠂', '⠁', ' '] as const
const BRAILLE_HEADS = ['⣿', '⣷', '⣇', '⣯', '⡿', '⢿', '⣻', '⣽', '⣾', '⣶'] as const

function fadedBraille(life: number): string {
  const idx = Math.min(
    BRAILLE_DENSE.length - 1,
    Math.max(0, Math.floor((1 - life) * BRAILLE_DENSE.length)),
  )
  return BRAILLE_DENSE[idx]!
}

function randomHead(): string {
  return BRAILLE_HEADS[Math.floor(Math.random() * BRAILLE_HEADS.length)]!
}

/**
 * Hook: runs a tick callback on an interval, respects reduced motion,
 * cleans up on unmount. The tick receives the epoch-relative time.
 */
function useTickLoop(cb: (elapsed: number) => void, frameMs: number) {
  const ref = useRef(cb)
  ref.current = cb
  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const start = Date.now()
    const id = setInterval(() => ref.current(Date.now() - start), frameMs)
    return () => clearInterval(id)
  }, [frameMs])
}

/**
 * Flips from `false` to `true` after the first client-side mount.
 * We use this to gate any rendering that depends on `Math.random()`
 * or other non-deterministic state, so that the SSR'd HTML and the
 * first client render agree and React's hydration doesn't complain.
 */
function useMounted(): boolean {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  return mounted
}

/**
 * Renders a 2D grid of cells — each cell has a `char` and a color class.
 * We build contiguous same-color runs into `<span>` segments so a 24×8
 * grid doesn't produce 192 DOM nodes per frame.
 */
type CellColor = 'fg' | 'accent' | 'muted' | 'success' | 'warning' | 'danger'

function colorClass(c: CellColor): string {
  switch (c) {
    case 'accent':
      return 'text-accent'
    case 'muted':
      return 'dim'
    case 'success':
      return 'text-success'
    case 'warning':
      return 'text-warning'
    case 'danger':
      return 'text-danger'
    default:
      return ''
  }
}

function GridView({
  chars,
  colors,
}: {
  chars: string[][]
  colors: CellColor[][]
}) {
  return (
    <>
      {chars.map((row, rIdx) => {
        const colorRow = colors[rIdx]!
        // Coalesce consecutive cells of the same color into runs.
        const segments: { text: string; color: CellColor }[] = []
        for (let c = 0; c < row.length; c++) {
          const ch = row[c]!
          const clr = colorRow[c]!
          const last = segments[segments.length - 1]
          if (last && last.color === clr) last.text += ch
          else segments.push({ text: ch, color: clr })
        }
        return (
          <Row key={rIdx}>
            {segments.map((s, i) => {
              const cls = colorClass(s.color)
              return cls ? (
                <span key={i} className={cls}>
                  {s.text}
                </span>
              ) : (
                <span key={i}>{s.text}</span>
              )
            })}
          </Row>
        )
      })}
    </>
  )
}

/**
 * Builds an empty `width × height` grid, pre-filled with the given char
 * and the given color class.
 */
function makeCellGrid(
  width: number,
  height: number,
  char: string,
  color: CellColor,
): { chars: string[][]; colors: CellColor[][] } {
  const chars: string[][] = []
  const colors: CellColor[][] = []
  for (let r = 0; r < height; r++) {
    const rowChars: string[] = []
    const rowColors: CellColor[] = []
    for (let c = 0; c < width; c++) {
      rowChars.push(char)
      rowColors.push(color)
    }
    chars.push(rowChars)
    colors.push(rowColors)
  }
  return { chars, colors }
}

// ---------------------------------------------------------------------------
// confetti
// ---------------------------------------------------------------------------
// Port of registry/components/confetti.tsx — particles spawn at the top
// with a small horizontal velocity, gravity pulls them down, they fade
// through the `BRAILLE_DENSE` ladder, then die. Loops forever so the
// card stays alive.

type ConfettiParticle = {
  x: number
  y: number
  vx: number
  vy: number
  color: CellColor
  born: number
  lifespan: number
}

const CONFETTI_COLORS: CellColor[] = [
  'accent',
  'success',
  'warning',
  'danger',
  'accent',
]

function spawnConfettiParticle(width: number, born: number): ConfettiParticle {
  return {
    x: Math.random() * (width - 2) + 1,
    y: Math.random() * 1.5,
    vx: (Math.random() - 0.5) * 1.4,
    vy: Math.random() * 0.3 + 0.15,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]!,
    born,
    lifespan: 1200 + Math.random() * 1000,
  }
}

export function ConfettiEffect({
  width = 24,
  height = 8,
  density = 14,
  loopMs = 2400,
}: {
  width?: number
  height?: number
  density?: number
  loopMs?: number
}) {
  const [particles, setParticles] = useState<ConfettiParticle[]>([])
  // cycle counter so the effect can restart itself on a loop
  const cycleRef = useRef(0)
  const loopStartRef = useRef(Date.now())

  useTickLoop((elapsed) => {
    const cycleElapsed = elapsed - cycleRef.current * loopMs
    if (cycleElapsed >= loopMs) {
      cycleRef.current += 1
      loopStartRef.current = Date.now()
      setParticles([])
      return
    }
    setParticles((prev) => {
      // Top up to `density` over the first ~60% of the cycle.
      const targetCount = Math.min(
        density,
        Math.floor((cycleElapsed / (loopMs * 0.6)) * density),
      )
      const topped = [...prev]
      while (topped.length < targetCount) {
        topped.push(spawnConfettiParticle(width, Date.now()))
      }
      const now = Date.now()
      return topped
        .map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.05, // gravity
          vx: p.vx * 0.98,
        }))
        .filter(
          (p) =>
            now - p.born < p.lifespan &&
            p.y < height &&
            p.x >= 0 &&
            p.x < width,
        )
    })
  }, 40)

  // Fresh grid each render — we mutate it below as we paint particles,
  // so memoizing would leak the previous frame's characters.
  const grid = makeCellGrid(width, height, ' ', 'fg')

  // Paint particles onto the grid
  const now = Date.now()
  for (const p of particles) {
    const col = Math.round(p.x)
    const row = Math.round(p.y)
    if (row < 0 || row >= height || col < 0 || col >= width) continue
    const life = Math.max(0, 1 - (now - p.born) / p.lifespan)
    grid.chars[row]![col] = fadedBraille(life)
    grid.colors[row]![col] = p.color
  }

  return <GridView chars={grid.chars} colors={grid.colors} />
}

// ---------------------------------------------------------------------------
// fireworks
// ---------------------------------------------------------------------------
// Port of registry/components/fireworks.tsx — rockets rise from the
// bottom, explode at a target altitude into radial particles that fall
// back with gravity. Loops with a small pause between bursts.

type Rocket = {
  kind: 'rocket'
  x: number
  y: number
  targetY: number
  born: number
  burstIdx: number
}
type Spark = {
  kind: 'spark'
  x: number
  y: number
  vx: number
  vy: number
  born: number
  lifespan: number
}

type FireworkParticle = Rocket | Spark

function spawnSparks(cx: number, cy: number, count: number, now: number): Spark[] {
  const out: Spark[] = []
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4
    const speed = 0.35 + Math.random() * 0.8
    out.push({
      kind: 'spark',
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed * 0.55,
      born: now,
      lifespan: 700 + Math.random() * 500,
    })
  }
  return out
}

export function FireworksEffect({
  width = 24,
  height = 8,
  bursts = 2,
  loopMs = 2800,
}: {
  width?: number
  height?: number
  bursts?: number
  loopMs?: number
}) {
  const [particles, setParticles] = useState<FireworkParticle[]>([])
  const cycleRef = useRef(0)
  const explodedRef = useRef<Set<string>>(new Set())
  const rocketDuration = 450

  // Seed the first batch of rockets on mount.
  useEffect(() => {
    const initial: Rocket[] = []
    const stagger = Math.min(700, (loopMs * 0.6) / Math.max(1, bursts))
    const now = Date.now()
    for (let i = 0; i < bursts; i++) {
      initial.push({
        kind: 'rocket',
        x: Math.floor(width * 0.25 + Math.random() * width * 0.5),
        y: height - 1,
        targetY: 1 + Math.floor(Math.random() * Math.floor(height * 0.4)),
        born: now + i * stagger,
        burstIdx: i,
      })
    }
    setParticles(initial)
    explodedRef.current = new Set()
    cycleRef.current = 0
  }, [bursts, width, height, loopMs])

  useTickLoop((elapsed) => {
    // Loop — every `loopMs` start a fresh round of rockets.
    const cycleIdx = Math.floor(elapsed / loopMs)
    if (cycleIdx > cycleRef.current) {
      cycleRef.current = cycleIdx
      const now = Date.now()
      const stagger = Math.min(700, (loopMs * 0.6) / Math.max(1, bursts))
      const fresh: Rocket[] = []
      for (let i = 0; i < bursts; i++) {
        fresh.push({
          kind: 'rocket',
          x: Math.floor(width * 0.25 + Math.random() * width * 0.5),
          y: height - 1,
          targetY: 1 + Math.floor(Math.random() * Math.floor(height * 0.4)),
          born: now + i * stagger,
          burstIdx: cycleIdx * 100 + i,
        })
      }
      setParticles((prev) => [...prev, ...fresh])
    }

    setParticles((prev) => {
      const now = Date.now()
      const next: FireworkParticle[] = []
      const fresh: Spark[] = []
      for (const p of prev) {
        if (p.kind === 'rocket') {
          const age = now - p.born
          if (age < 0) {
            next.push(p)
            continue
          }
          const t = Math.min(1, age / rocketDuration)
          const curY = height - 1 - t * (height - 1 - p.targetY)
          if (t >= 1) {
            const key = String(p.burstIdx)
            if (!explodedRef.current.has(key)) {
              explodedRef.current.add(key)
              fresh.push(...spawnSparks(p.x, p.targetY, 12, now))
            }
          } else {
            next.push({ ...p, y: curY })
          }
        } else {
          const age = now - p.born
          if (age >= p.lifespan || p.y >= height || p.x < 0 || p.x >= width) {
            continue
          }
          next.push({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.04,
            vx: p.vx * 0.97,
          })
        }
      }
      return [...next, ...fresh]
    })
  }, 40)

  // Fresh grid each render — we mutate it below as we paint particles,
  // so memoizing would leak the previous frame's characters.
  const grid = makeCellGrid(width, height, ' ', 'fg')
  const now = Date.now()
  for (const p of particles) {
    const col = Math.round(p.x)
    const row = Math.round(p.y)
    if (row < 0 || row >= height || col < 0 || col >= width) continue
    if (p.kind === 'rocket') {
      if (now - p.born < 0) continue
      grid.chars[row]![col] = '⣿'
      grid.colors[row]![col] = 'accent'
    } else {
      const life = Math.max(0, 1 - (now - p.born) / p.lifespan)
      grid.chars[row]![col] = fadedBraille(life)
      grid.colors[row]![col] = life > 0.5 ? 'accent' : 'muted'
    }
  }

  return <GridView chars={grid.chars} colors={grid.colors} />
}

// ---------------------------------------------------------------------------
// matrix
// ---------------------------------------------------------------------------
// Port of registry/components/matrix.tsx — vertical braille streams fall,
// head is bright, tail dimmed. Streams are randomly respawned.

type MatrixStream = {
  col: number
  head: number
  length: number
  speed: number
  chars: string[]
}

function spawnStream(width: number, height: number): MatrixStream {
  const length = 3 + Math.floor(Math.random() * Math.min(height, 6))
  const chars: string[] = []
  for (let i = 0; i < length; i++) chars.push(randomBraille())
  return {
    col: Math.floor(Math.random() * width),
    head: -Math.floor(Math.random() * height),
    length,
    speed: 0.25 + Math.random() * 0.55,
    chars,
  }
}

export function MatrixEffect({
  width = 22,
  height = 8,
  density = 8,
}: {
  width?: number
  height?: number
  density?: number
}) {
  // Streams are seeded via Math.random, so we must not touch them
  // during the first render — otherwise SSR and the first client
  // render disagree and React's hydration check yells. The initial
  // render produces an empty grid; the `useEffect` below runs only
  // in the browser and seeds the streams before the tick loop starts
  // moving anything.
  const streamsRef = useRef<MatrixStream[]>([])
  const [, setTick] = useState(0)

  useEffect(() => {
    const init: MatrixStream[] = []
    for (let i = 0; i < density; i++) init.push(spawnStream(width, height))
    streamsRef.current = init
    setTick((t) => (t + 1) % 1_000_000)
  }, [density, width, height])

  useTickLoop(() => {
    const next: MatrixStream[] = []
    for (const s of streamsRef.current) {
      const nextHead = s.head + s.speed
      const nextChars = s.chars.map((c) =>
        Math.random() < 0.15 ? randomBraille() : c,
      )
      if (nextHead - s.length > height) continue
      next.push({ ...s, head: nextHead, chars: nextChars })
    }
    while (next.length < density) next.push(spawnStream(width, height))
    streamsRef.current = next
    setTick((t) => (t + 1) % 1_000_000)
  }, 60)

  // Fresh grid each render — we mutate it below as we paint particles,
  // so memoizing would leak the previous frame's characters.
  const grid = makeCellGrid(width, height, ' ', 'fg')
  for (const s of streamsRef.current) {
    if (s.col < 0 || s.col >= width) continue
    for (let i = 0; i < s.length; i++) {
      const row = Math.floor(s.head - i)
      if (row < 0 || row >= height) continue
      const ch = s.chars[i] ?? randomBraille()
      const kind: CellColor =
        i === 0 ? 'accent' : i < Math.max(2, s.length * 0.4) ? 'accent' : 'muted'
      grid.chars[row]![s.col] = ch
      grid.colors[row]![s.col] = kind
    }
  }

  return <GridView chars={grid.chars} colors={grid.colors} />
}

// ---------------------------------------------------------------------------
// particles (the "text explode and reassemble" one)
// ---------------------------------------------------------------------------
// Port of registry/components/particles.tsx — show, explode, reassemble.

type TextParticle = {
  ch: string
  targetX: number
  targetY: number
  x: number
  y: number
  vx: number
  vy: number
}

function makeTextParticles(
  text: string,
  originX: number,
  originY: number,
): TextParticle[] {
  const out: TextParticle[] = []
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!
    if (ch === ' ') continue
    const angle = Math.random() * Math.PI * 2
    const speed = 0.45 + Math.random() * 1.0
    out.push({
      ch,
      targetX: originX + i,
      targetY: originY,
      x: originX + i,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed * 0.55,
    })
  }
  return out
}

export function ParticlesEffect({
  text = 'READY',
  width = 22,
  height = 7,
  loopMs = 2800,
}: {
  text?: string
  width?: number
  height?: number
  loopMs?: number
}) {
  const originX = Math.max(0, Math.floor((width - text.length) / 2))
  const originY = Math.floor(height / 2)

  const particlesRef = useRef<TextParticle[]>(
    makeTextParticles(text, originX, originY),
  )
  const [phase, setPhase] = useState<'show' | 'explode' | 'reassemble'>('show')
  const [, setTick] = useState(0)
  const cycleRef = useRef(0)

  const showMs = Math.round(loopMs * 0.15)
  const explodeMs = Math.round(loopMs * 0.4)
  const reassembleMs = loopMs - showMs - explodeMs

  useTickLoop((elapsed) => {
    const cycleElapsed = elapsed - cycleRef.current * loopMs
    if (cycleElapsed >= loopMs) {
      cycleRef.current += 1
      particlesRef.current = makeTextParticles(text, originX, originY)
      setPhase('show')
      setTick((t) => (t + 1) % 1_000_000)
      return
    }
    if (cycleElapsed < showMs) {
      setPhase('show')
    } else if (cycleElapsed < showMs + explodeMs) {
      setPhase('explode')
      const t = (cycleElapsed - showMs) / explodeMs
      const decel = 1 - t * 0.6
      particlesRef.current = particlesRef.current.map((p) => ({
        ...p,
        x: p.x + p.vx * decel,
        y: p.y + p.vy * decel,
      }))
    } else {
      setPhase('reassemble')
      const t = (cycleElapsed - showMs - explodeMs) / reassembleMs
      const ease = 1 - Math.pow(1 - t, 3)
      particlesRef.current = particlesRef.current.map((p) => ({
        ...p,
        x: p.x + (p.targetX - p.x) * (0.12 + ease * 0.3),
        y: p.y + (p.targetY - p.y) * (0.12 + ease * 0.3),
      }))
    }
    setTick((t) => (t + 1) % 1_000_000)
  }, 40)

  // Fresh grid each render — we mutate it below as we paint particles,
  // so memoizing would leak the previous frame's characters.
  const grid = makeCellGrid(width, height, ' ', 'fg')
  for (const p of particlesRef.current) {
    const col = Math.round(p.x)
    const row = Math.round(p.y)
    if (row < 0 || row >= height || col < 0 || col >= width) continue
    if (phase === 'show') {
      grid.chars[row]![col] = p.ch
      grid.colors[row]![col] = 'accent'
    } else if (phase === 'explode') {
      grid.chars[row]![col] = randomBraille()
      grid.colors[row]![col] = 'accent'
    } else {
      const dx = p.targetX - p.x
      const dy = p.targetY - p.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      grid.chars[row]![col] = dist < 0.6 ? p.ch : randomBraille()
      grid.colors[row]![col] = 'accent'
    }
  }

  return <GridView chars={grid.chars} colors={grid.colors} />
}

// ---------------------------------------------------------------------------
// game-of-life
// ---------------------------------------------------------------------------
// Port of registry/components/game-of-life.tsx — Conway's Game of Life
// on a toroidal grid, packed 2×4 into braille characters. We don't pull
// in `unicode-animations` here; the braille packing is re-implemented
// inline because it's only ~15 lines.

// Braille dot bit positions — see https://en.wikipedia.org/wiki/Braille_Patterns
// Dots are addressed as a 2×4 grid; bits in the braille pattern are:
//   (col 0, row 0) = 0x01
//   (col 0, row 1) = 0x02
//   (col 0, row 2) = 0x04
//   (col 1, row 0) = 0x08
//   (col 1, row 1) = 0x10
//   (col 1, row 2) = 0x20
//   (col 0, row 3) = 0x40
//   (col 1, row 3) = 0x80
const BRAILLE_BITS = [
  [0x01, 0x08],
  [0x02, 0x10],
  [0x04, 0x20],
  [0x40, 0x80],
]

function packBraille(strip: boolean[][], colStart: number): string {
  let bits = 0
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 2; c++) {
      if (strip[r]?.[colStart + c]) {
        bits |= BRAILLE_BITS[r]![c]!
      }
    }
  }
  return String.fromCharCode(0x2800 + bits)
}

function randomLifeGrid(rows: number, cols: number, density: number): boolean[][] {
  const grid: boolean[][] = []
  for (let r = 0; r < rows; r++) {
    const row: boolean[] = []
    for (let c = 0; c < cols; c++) row.push(Math.random() < density)
    grid.push(row)
  }
  return grid
}

function stepLife(grid: boolean[][]): boolean[][] {
  const rows = grid.length
  const cols = grid[0]?.length ?? 0
  const next: boolean[][] = []
  for (let r = 0; r < rows; r++) {
    const row: boolean[] = []
    for (let c = 0; c < cols; c++) {
      let n = 0
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue
          const rr = (r + dr + rows) % rows
          const cc = (c + dc + cols) % cols
          if (grid[rr]![cc]) n++
        }
      }
      const alive = grid[r]![c]!
      row.push((alive && (n === 2 || n === 3)) || (!alive && n === 3))
    }
    next.push(row)
  }
  return next
}

export function GameOfLifeEffect({
  charWidth = 11,
  charHeight = 4,
  density = 0.3,
  resetMs = 5000,
}: {
  charWidth?: number
  charHeight?: number
  density?: number
  resetMs?: number
}) {
  const dotCols = charWidth * 2
  const dotRows = charHeight * 4

  // Everything that touches Math.random lives inside useEffect so the
  // SSR'd HTML (which is just a column of blank braille rows) matches
  // the first client render, then the browser seeds a real starting
  // grid before the tick loop begins.
  const gridRef = useRef<boolean[][]>([])
  const [lines, setLines] = useState<string[]>(() => {
    const out: string[] = []
    const blank = String.fromCharCode(0x2800)
    for (let r = 0; r < dotRows; r += 4) {
      out.push(blank.repeat(Math.ceil(dotCols / 2)))
    }
    return out
  })

  useEffect(() => {
    gridRef.current = randomLifeGrid(dotRows, dotCols, density)
    const out: string[] = []
    for (let r = 0; r < dotRows; r += 4) {
      let line = ''
      for (let c = 0; c < dotCols; c += 2) {
        line += packBraille(gridRef.current.slice(r, r + 4), c)
      }
      out.push(line)
    }
    setLines(out)
  }, [dotCols, dotRows, density])

  useTickLoop((elapsed) => {
    if (gridRef.current.length === 0) return
    // Reseed periodically so cards that stall on a still-life pattern
    // don't look frozen to anyone glancing at them.
    if (Math.floor(elapsed / resetMs) > 0 && elapsed % resetMs < 120) {
      gridRef.current = randomLifeGrid(dotRows, dotCols, density)
    } else {
      gridRef.current = stepLife(gridRef.current)
    }
    const out: string[] = []
    for (let r = 0; r < dotRows; r += 4) {
      let line = ''
      for (let c = 0; c < dotCols; c += 2) {
        line += packBraille(gridRef.current.slice(r, r + 4), c)
      }
      out.push(line)
    }
    setLines(out)
  }, 120)

  return (
    <>
      {lines.map((line, i) => (
        <Row key={i}>
          <span className="text-accent">{line}</span>
        </Row>
      ))}
    </>
  )
}

// ---------------------------------------------------------------------------
// celebrate — short braille-transition into a message, then confetti.
// ---------------------------------------------------------------------------

export function CelebrateEffect({
  message = '1.0.0 released',
  width = 24,
  height = 7,
  loopMs = 3200,
}: {
  message?: string
  width?: number
  height?: number
  loopMs?: number
}) {
  const [particles, setParticles] = useState<ConfettiParticle[]>([])
  const [revealed, setRevealed] = useState(0)
  const cycleRef = useRef(0)

  const textRow = Math.floor(height / 2)
  const textCol = Math.max(0, Math.floor((width - (message.length + 2)) / 2))

  useTickLoop((elapsed) => {
    const cycleElapsed = elapsed - cycleRef.current * loopMs
    if (cycleElapsed >= loopMs) {
      cycleRef.current += 1
      setRevealed(0)
      setParticles([])
      return
    }

    // Phase 1: reveal text char-by-char (first 40% of the cycle)
    const revealMs = loopMs * 0.35
    if (cycleElapsed < revealMs) {
      const target = Math.floor((cycleElapsed / revealMs) * message.length)
      setRevealed((prev) => (target > prev ? target : prev))
    } else {
      setRevealed(message.length)
    }

    // Phase 2: confetti begins once text is revealed
    if (cycleElapsed > revealMs * 0.5) {
      setParticles((prev) => {
        const target = Math.min(
          12,
          Math.floor(((cycleElapsed - revealMs * 0.5) / (loopMs * 0.6)) * 14),
        )
        const topped = [...prev]
        while (topped.length < target) {
          topped.push(spawnConfettiParticle(width, Date.now()))
        }
        const now = Date.now()
        return topped
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.05,
            vx: p.vx * 0.98,
          }))
          .filter(
            (p) =>
              now - p.born < p.lifespan &&
              p.y < height &&
              p.x >= 0 &&
              p.x < width,
          )
      })
    }
  }, 40)

  // Fresh grid each render — we mutate it below as we paint particles,
  // so memoizing would leak the previous frame's characters.
  const grid = makeCellGrid(width, height, ' ', 'fg')

  // Paint confetti first so the text overlays it.
  const now = Date.now()
  for (const p of particles) {
    const col = Math.round(p.x)
    const row = Math.round(p.y)
    if (row === textRow && col >= textCol && col < textCol + message.length + 2) {
      continue // don't let confetti occlude the message row
    }
    if (row < 0 || row >= height || col < 0 || col >= width) continue
    const life = Math.max(0, 1 - (now - p.born) / p.lifespan)
    grid.chars[row]![col] = fadedBraille(life)
    grid.colors[row]![col] = p.color
  }

  // Paint text: "✓ " + revealed prefix of message
  const prefix = '✓ '
  const full = prefix + message
  for (let i = 0; i < full.length; i++) {
    const col = textCol + i
    if (col < 0 || col >= width) continue
    if (i < prefix.length + revealed) {
      grid.chars[textRow]![col] = full[i]!
      grid.colors[textRow]![col] = 'success'
    }
  }

  return <GridView chars={grid.chars} colors={grid.colors} />
}
