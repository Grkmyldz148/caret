/**
 * Caret image-to-ASCII art helper
 *
 * Converts an image file (PNG, JPG, etc.) into a multi-line ASCII /
 * truecolor-blocks string suitable for use as a CLI splash logo.
 *
 *   const art = await imageToArt('/path/to/logo.png')
 *   const art2 = await imageToArt('logo.png', { mode: 'color', width: 60 })
 *   const art3 = await imageToArt('logo.png', { mode: 'ascii', width: 80 })
 *
 * Three modes:
 *   - 'color' (default) — truecolor half-block (▀) rendering. Looks like
 *     the actual image at low resolution. Two pixels per character via
 *     setting fg=top and bg=bottom of the same character cell.
 *   - 'ascii' — character density mapping (' .:-=+*#%@'). No color, just
 *     brightness as density. Classic ASCII art look.
 *   - 'mono' — same as 'ascii' but the whole result is colored with a
 *     single accent color.
 *
 * Conversion is heavy. Convert ONCE at setup time, cache the result to a
 * file, and load the cached string at runtime. See examples/nibgat-splash.tsx
 * for the canonical caching pattern.
 *
 * jimp is required. It's listed as a regular dependency of @caret/registry.
 */

import { Jimp } from 'jimp'

export type ImageToArtMode = 'color' | 'ascii' | 'mono'

export type ImageToArtOptions = {
  /** Render mode. Default: 'ascii' (rich character density). */
  mode?: ImageToArtMode
  /** Output width in characters. Default: 60. */
  width?: number
  /** Output height in characters. Default: auto from aspect ratio. */
  height?: number
  /** For 'mono' mode: hex color string. Default: '#5882F7' (Caret accent). */
  color?: string
  /**
   * Invert the brightness ramp. Use this for images with light backgrounds
   * and dark foregrounds where you want the foreground to appear dense.
   * Default: false.
   */
  invert?: boolean
  /**
   * Threshold (0–1) below which a pixel's alpha is treated as transparent
   * and rendered as a space. Default: 0.0625 (16/255).
   */
  alphaThreshold?: number
}

type JimpImage = Awaited<ReturnType<typeof Jimp.read>>

export async function imageToArt(
  source: string | Buffer | URL,
  options: ImageToArtOptions = {},
): Promise<string> {
  const mode = options.mode ?? 'ascii'
  const targetWidth = options.width ?? 60
  const invert = options.invert ?? false
  const alphaThreshold = Math.round((options.alphaThreshold ?? 0.0625) * 255)

  // Strip file:// prefix if present
  let normalizedSource: string | Buffer | URL = source
  if (typeof source === 'string') {
    normalizedSource = source.replace(/^file:\/\//, '')
  }

  const image = (await Jimp.read(normalizedSource as string)) as JimpImage

  // Terminal characters are ~2x taller than wide. The half-block trick
  // doubles vertical resolution: each character cell renders TWO pixels
  // (top via fg color, bottom via bg color, character is ▀).
  const aspectRatio = image.bitmap.height / image.bitmap.width
  const targetCharHeight = options.height ?? Math.round(targetWidth * aspectRatio * 0.5)

  image.resize({ w: targetWidth, h: targetCharHeight * 2 })

  if (mode === 'color') return renderColor(image, alphaThreshold)
  if (mode === 'ascii') return renderAscii(image, invert, alphaThreshold)
  return renderMono(image, options.color ?? '#5882F7', invert, alphaThreshold)
}

// === RENDERERS ===

function renderColor(image: JimpImage, alphaThreshold: number): string {
  const { width, height, data } = image.bitmap
  const lines: string[] = []

  for (let y = 0; y < height; y += 2) {
    let line = ''
    for (let x = 0; x < width; x++) {
      const topIdx = (y * width + x) * 4
      const botIdx = ((y + 1) * width + x) * 4

      const topR = data[topIdx]!
      const topG = data[topIdx + 1]!
      const topB = data[topIdx + 2]!
      const topA = data[topIdx + 3]!

      const hasBot = y + 1 < height
      const botR = hasBot ? data[botIdx]! : 0
      const botG = hasBot ? data[botIdx + 1]! : 0
      const botB = hasBot ? data[botIdx + 2]! : 0
      const botA = hasBot ? data[botIdx + 3]! : 0

      // Both transparent → space
      if (topA < alphaThreshold && botA < alphaThreshold) {
        line += '\x1b[0m '
        continue
      }

      // Only bottom opaque → use ▄ (lower half block) with bottom as fg
      if (topA < alphaThreshold) {
        line += `\x1b[0m\x1b[38;2;${botR};${botG};${botB}m▄`
        continue
      }

      // Only top opaque → use ▀ (upper half block) with top as fg, no bg
      if (botA < alphaThreshold) {
        line += `\x1b[0m\x1b[38;2;${topR};${topG};${topB}m▀`
        continue
      }

      // Both opaque → ▀ with top as fg, bottom as bg
      line += `\x1b[38;2;${topR};${topG};${topB}m\x1b[48;2;${botR};${botG};${botB}m▀`
    }
    line += '\x1b[0m'
    lines.push(line)
  }

  return lines.join('\n')
}

/**
 * Standard 70-character ASCII brightness ramp, sparse → dense.
 * Used by `ascii` and `mono` modes for high-detail rendering.
 */
const ASCII_RAMP = ` .'\`^",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$`

function renderAscii(image: JimpImage, invert: boolean, alphaThreshold: number): string {
  const { width, height, data } = image.bitmap
  const ramp = invert ? ASCII_RAMP.split('').reverse().join('') : ASCII_RAMP
  const rampLen = ramp.length
  const lines: string[] = []

  for (let y = 0; y < height; y += 2) {
    let line = ''
    for (let x = 0; x < width; x++) {
      // Sample two vertically adjacent pixels and average them
      const idx1 = (y * width + x) * 4
      const hasNext = y + 1 < height
      const idx2 = hasNext ? ((y + 1) * width + x) * 4 : idx1

      const a1 = data[idx1 + 3]!
      const a2 = data[idx2 + 3]!

      if (a1 < alphaThreshold && a2 < alphaThreshold) {
        line += ' '
        continue
      }

      const r = (data[idx1]! + data[idx2]!) / 2
      const g = (data[idx1 + 1]! + data[idx2 + 1]!) / 2
      const b = (data[idx1 + 2]! + data[idx2 + 2]!) / 2

      // Perceptual luminance
      const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
      const charIdx = Math.min(rampLen - 1, Math.max(0, Math.floor(lum * rampLen)))
      line += ramp[charIdx]
    }
    lines.push(line)
  }

  // Wrap output with ANSI reset codes so consumers (like splash) detect
  // the string as "has ANSI" and skip applying their own coloring. This
  // keeps the ASCII art in the terminal's default foreground color, which
  // gives the cleanest white-on-black look.
  return '\x1b[0m' + lines.join('\n') + '\x1b[0m'
}

function renderMono(
  image: JimpImage,
  hexColor: string,
  invert: boolean,
  alphaThreshold: number,
): string {
  const ascii = renderAscii(image, invert, alphaThreshold)
  // renderAscii already wraps with reset codes — strip them, recolor, rewrap.
  const inner = ascii.replace(/^\x1b\[0m/, '').replace(/\x1b\[0m$/, '')
  const { r, g, b } = hexToRgb(hexColor)
  const colorStart = `\x1b[38;2;${r};${g};${b}m`
  const reset = '\x1b[0m'
  return inner
    .split('\n')
    .map((line) => colorStart + line + reset)
    .join('\n')
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleaned = hex.replace('#', '')
  const r = parseInt(cleaned.substring(0, 2), 16) || 0
  const g = parseInt(cleaned.substring(2, 4), 16) || 0
  const b = parseInt(cleaned.substring(4, 6), 16) || 0
  return { r, g, b }
}
