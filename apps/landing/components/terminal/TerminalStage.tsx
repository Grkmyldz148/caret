'use client'

import {
  Children,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { Terminal } from './Terminal'

/**
 * TerminalStage — the single rendering surface we use for previewing
 * Caret components anywhere on the landing site (catalog cards, homepage
 * grid, docs examples).
 *
 * Two jobs:
 *
 * 1. Render the Caret components into a `Terminal` surface without
 *    letting their natural character-grid width push siblings around.
 *    `.terminal-stage` clips overflow, `.terminal-stage-inner` is sized
 *    to the intrinsic monospace width (`width: max-content`) and
 *    centered horizontally so narrow and wide previews sit in the
 *    same visual column. The `.term` block inside still left-aligns
 *    each row so character cells stay on the grid.
 *
 * 2. Play the component's own reveal animation on mount and replay it
 *    on hover. The logic is a direct port of
 *    registry/components/reveal.tsx — progressively mount the top-level
 *    children one per tick using a `count` state + setInterval. We
 *    never write a custom CSS keyframe; CSS animations that each
 *    Caret primitive owns (Spinner braille rotation, cursor blink,
 *    etc.) still run naturally inside because the subtree is just
 *    remounted with a fresh `key`.
 */
export function TerminalStage({
  children,
  className = '',
  /** Milliseconds between each revealed row. Mirrors `reveal.delay`. */
  stagger = 45,
}: {
  children: ReactNode
  className?: string
  stagger?: number
}) {
  const [generation, setGeneration] = useState(0)

  const replay = useCallback(() => {
    setGeneration((g) => g + 1)
  }, [])

  return (
    <div
      className={`terminal-stage ${className}`}
      onMouseEnter={replay}
      onFocus={replay}
    >
      <div className="terminal-stage-inner">
        <Terminal>
          <Reveal key={generation} stagger={stagger}>
            {children}
          </Reveal>
        </Terminal>
      </div>
    </div>
  )
}

/**
 * Reveal — port of registry/components/reveal.tsx for the browser.
 *
 * Progressively reveals top-level children one per tick, driven by
 * `useState` + `useEffect` (no CSS keyframes). Unlike the Ink version
 * we never unmount hidden rows: every child is rendered from frame 0
 * and toggled via `visibility`, so the card's layout is stable and
 * `width: max-content` doesn't jitter while the reveal plays out.
 * Respects `prefers-reduced-motion` by skipping straight to the end.
 */
function Reveal({
  children,
  stagger,
}: {
  children: ReactNode
  stagger: number
}) {
  const items = useMemo(() => Children.toArray(children), [children])
  const [count, setCount] = useState(items.length)

  useEffect(() => {
    // Nothing to reveal, or a single top-level child (Banner, Progress,
    // Spinner, etc.): show it immediately — flashing a lone component
    // invisible for one frame on every hover looks like a bug.
    if (items.length <= 1) {
      setCount(items.length)
      return
    }

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      setCount(items.length)
      return
    }

    // Start with just the first row visible, then tick up the rest.
    setCount(1)
    let c = 1
    const interval = setInterval(() => {
      c += 1
      setCount(c)
      if (c >= items.length) {
        clearInterval(interval)
      }
    }, stagger)

    return () => clearInterval(interval)
  }, [items, stagger])

  return (
    <>
      {items.map((item, i) => (
        <div
          key={i}
          style={{ visibility: i < count ? 'visible' : 'hidden' }}
        >
          {item}
        </div>
      ))}
    </>
  )
}
