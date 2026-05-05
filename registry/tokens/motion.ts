/**
 * Caret motion tokens
 *
 * Bounded, inline-safe, auto-disabled outside a live TTY or when
 * CARET_REDUCED_MOTION=1 or terminal width < 40 columns.
 *
 * Hard cap: no micro-interaction may exceed 300ms.
 *
 * The manifesto (specs/look.md § Motion) additionally specifies:
 *   - List reveal stagger: 40ms offset per item
 *   - Default easing: linear (no easing for now — linear is a decision,
 *     not a default). The cubic-bezier curves remain for moments that
 *     specifically benefit from easing.
 */

export const motion = {
  duration: {
    /** 80ms — frame rhythm, sub-perceptual transitions */
    instant: 80,
    /** 150ms — most micro-interactions (focus, toggle, error reveal) */
    quick: 150,
    /** 200ms — standard transition (submit, resolve, label crossfade) */
    default: 200,
    /** 300ms — hard cap; do not exceed */
    max: 300,
  },
  easing: {
    /** Manifesto default — linear until a case specifically benefits from easing */
    linear: 'linear',
    /** Standard easing for most micro-interactions. Material-style. */
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    /** Emphasized easing for moments that should feel deliberate. */
    emphasized: 'cubic-bezier(0.3, 0, 0, 1)',
  },
  /**
   * Spinner braille frame tempo. Fixed; does not scale with motion tokens.
   * This is the rotation rhythm, not a micro-interaction.
   */
  spinnerFrameMs: 80,
  /**
   * List reveal stagger — offset per item when a list of steps or rows
   * is revealed sequentially (e.g., `boot` steps). 40ms is tight enough
   * to feel like a single gesture but slow enough to be perceptible.
   */
  staggerMs: 40,
} as const

export type MotionTokens = typeof motion
