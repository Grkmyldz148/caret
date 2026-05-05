/**
 * Caret motion utilities — sleep, easing, frame loops.
 *
 * Used by animated components and available standalone for custom
 * animations. Respects CARET_REDUCED_MOTION via the capability layer.
 *
 *   await sleep(200)
 *
 *   await frameLoop(300, (t) => {
 *     // t is eased progress 0 → 1, called ~60fps
 *     setOpacity(t)
 *   }, easing.easeOut)
 */

import { capability } from './capability.js'

/** Resolves after `ms` milliseconds. */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export type EasingFn = (t: number) => number

/** Standard easing functions. Input and output are in [0, 1]. */
export const easing = {
  linear: ((t) => t) as EasingFn,
  easeIn: ((t) => t * t * t) as EasingFn,
  easeOut: ((t) => 1 - Math.pow(1 - t, 3)) as EasingFn,
  easeInOut: ((t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2) as EasingFn,
}

/**
 * Run a callback at ~60fps for `duration` ms, passing eased progress
 * (0 → 1). Resolves when complete. Auto-skips to final frame when
 * reduced motion is requested or when stdout isn't a TTY.
 */
export function frameLoop(
  duration: number,
  onFrame: (progress: number) => void,
  easingFn: EasingFn = easing.linear,
): Promise<void> {
  const cap = capability()
  if (cap.reducedMotion || !cap.isTTY || duration <= 0) {
    onFrame(1)
    return Promise.resolve()
  }
  return new Promise((resolve) => {
    const start = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - start
      const t = Math.min(elapsed / duration, 1)
      onFrame(easingFn(t))
      if (t >= 1) {
        clearInterval(interval)
        resolve()
      }
    }, 16)
  })
}
