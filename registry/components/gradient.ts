/**
 * Caret gradient component
 *
 * Creates a visual gradient effect on text using ANSI attributes.
 * Since the Caret manifesto says "never set background, FG hierarchy
 * via ANSI attributes", we create gradients by varying bold/normal/dim
 * across characters.
 *
 * Modes:
 *   fade  — bold at start, normal in middle, dim at end
 *   shine — dim everywhere except a bright band (useful for animation)
 *   edges — bold at both edges, dim in center
 *
 * Returns a string for inline composition.
 *
 *   gradient('Hello World', { mode: 'fade' })
 *   gradient('Hello World', { mode: 'fade', reverse: true })
 *   gradient('Loading...', { mode: 'shine', position: 0.3 })
 *   gradient('Section Title', { mode: 'edges' })
 */

import chalk from 'chalk'
import { getTheme } from '../theme/global.js'
import { mergeTheme } from '../theme/merge.js'
import type { PartialTheme } from '../theme/types.js'
import { paintAccent, paintDim, paintBold } from '../lib/paint.js'

export type GradientMode = 'fade' | 'shine' | 'edges'

export type GradientOptions = {
  mode?: GradientMode
  /** Reverse the gradient direction. Default: false. */
  reverse?: boolean
  /**
   * Position of the bright band for 'shine' mode, from 0 to 1.
   * 0 = left edge, 1 = right edge. Default: 0.5.
   */
  position?: number
  /** Use accent color for bold/normal tiers. Default: false. */
  accent?: boolean
  /** Width of the shine band as a fraction of total length. Default: 0.2. */
  bandWidth?: number
  theme?: PartialTheme
}

/**
 * Compute a weight (0–1) for each character position based on
 * the gradient mode.
 *
 * Weight mapping:
 *   > 0.66 → bold
 *   0.33–0.66 → normal
 *   < 0.33 → dim
 */
function computeWeights(length: number, mode: GradientMode, options: GradientOptions): number[] {
  const weights: number[] = []

  for (let i = 0; i < length; i++) {
    const t = length > 1 ? i / (length - 1) : 0.5
    let w: number

    switch (mode) {
      case 'fade':
        // Linear fade from 1 (bold) to 0 (dim)
        w = 1 - t
        break

      case 'shine': {
        // Dim everywhere except a bright gaussian-like band at `position`
        const pos = options.position ?? 0.5
        const band = options.bandWidth ?? 0.2
        const sigma = band / 2
        const dist = Math.abs(t - pos)
        w = Math.exp(-(dist * dist) / (2 * sigma * sigma))
        break
      }

      case 'edges':
        // Bold at edges (t=0 and t=1), dim at center (t=0.5)
        w = Math.abs(2 * t - 1)
        break

      default:
        w = 0.5
    }

    weights.push(w)
  }

  return weights
}

export function gradient(text: string, options: GradientOptions = {}): string {
  if (text.length === 0) return ''

  const theme = mergeTheme(getTheme(), options.theme)
  const mode = options.mode ?? 'fade'
  const useAccent = options.accent === true

  const chars = [...text]
  let weights = computeWeights(chars.length, mode, options)

  if (options.reverse) {
    weights = weights.reverse()
  }

  // Build styled painters
  const accentPaint = paintAccent(theme)
  const boldPaint = paintBold()
  const dimPaint = paintDim()

  const result = chars.map((ch, i) => {
    const w = weights[i] ?? 0.5

    // Skip styling for whitespace — keeps output cleaner
    if (ch === ' ' || ch === '\t') return ch

    if (w > 0.66) {
      // Bold tier
      if (useAccent) return accentPaint.bold(ch)
      return boldPaint(ch)
    }

    if (w >= 0.33) {
      // Normal tier
      if (useAccent) return accentPaint(ch)
      return ch
    }

    // Dim tier
    if (useAccent) return chalk.dim(accentPaint(ch))
    return dimPaint(ch)
  })

  return result.join('')
}
