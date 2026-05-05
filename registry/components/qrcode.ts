/**
 * Caret QR code component
 *
 * Generates a scannable QR code rendered with Unicode block characters
 * (default) or braille characters (compact alternative).
 *
 * Two styles:
 *
 *   'blocks' — Upper/lower half-block characters (▀ ▄ █). Each column is
 *     one terminal character wide and packs 2 vertical modules. Reliable
 *     phone-camera scanning on most monospace terminal fonts.
 *
 *   'braille' — Braille dot pattern. Each glyph packs a 2×4 module block,
 *     making the symbol ~half as wide and a quarter as tall as 'blocks'.
 *     Beautiful but harder to scan since braille dots are round and spaced.
 *
 *   qrcode({ data: 'https://example.com' })
 *   qrcode({ data: 'https://example.com', style: 'braille' })
 *   qrcode({ data: 'caret://demo', label: 'caret://demo', errorCorrection: 'H' })
 */

import * as QR from 'qrcode'
import { getTheme } from '../theme/global.js'
import { mergeTheme } from '../theme/merge.js'
import type { PartialTheme, Theme } from '../theme/types.js'
import { paintAccent, paintDim } from '../lib/paint.js'

export type QRCodeStyle = 'blocks' | 'braille'

export type QRCodeOptions = {
  /** The data to encode into the QR code. */
  data: string
  /**
   * Rendering style:
   *   'blocks'  — half-block characters, reliably scannable (default)
   *   'braille' — compact braille pattern, decorative
   */
  style?: QRCodeStyle
  /** Quiet zone size in modules around the symbol. Default: 4. */
  quiet?: number
  /** Optional label printed below the QR code, centered and dimmed. */
  label?: string
  /** Error correction level. Higher = more robust, bigger symbol. Default: 'M'. */
  errorCorrection?: 'L' | 'M' | 'Q' | 'H'
  /** Theme overrides. */
  theme?: PartialTheme
}

export function qrcode(options: QRCodeOptions): void {
  if (!options.data) return

  const theme = mergeTheme(getTheme(), options.theme)
  const style: QRCodeStyle = options.style ?? 'blocks'

  // Generate the QR matrix via the `qrcode` package.
  const symbol = QR.create(options.data, {
    errorCorrectionLevel: options.errorCorrection ?? 'M',
  })
  const modules = symbol.modules
  const size = modules.size

  if (style === 'braille') {
    renderBraille(modules, size, options, theme)
  } else {
    renderBlocks(modules, size, options, theme)
  }
}

// ---------------------------------------------------------------------------
// Block rendering — half-block characters, most scannable
// ---------------------------------------------------------------------------

function renderBlocks(
  modules: QR.QRCode['modules'],
  size: number,
  options: QRCodeOptions,
  theme: Theme,
): void {
  const accent = paintAccent(theme)
  const dim = paintDim()

  // Quiet zone in modules. QR spec minimum is 4.
  const quiet = Math.max(0, options.quiet ?? 4)
  const padded = size + quiet * 2

  // Each character row covers 2 module rows (upper/lower half block).
  // Pad the module grid down to an even number of rows.
  const gridRows = Math.ceil(padded / 2) * 2
  const gridCols = padded

  const isDark = (r: number, c: number): boolean => {
    const sr = r - quiet
    const sc = c - quiet
    if (sr < 0 || sc < 0 || sr >= size || sc >= size) return false
    return modules.get(sr, sc) === 1
  }

  const lines: string[] = []
  for (let rowStart = 0; rowStart < gridRows; rowStart += 2) {
    let line = ''
    for (let c = 0; c < gridCols; c++) {
      const top = isDark(rowStart, c)
      const bot = isDark(rowStart + 1, c)
      if (top && bot) line += '\u2588' // █ full block
      else if (top) line += '\u2580'   // ▀ upper half
      else if (bot) line += '\u2584'   // ▄ lower half
      else line += ' '
    }
    lines.push(line)
  }

  const output = lines.map((l) => accent(l)).join('\n')
  process.stdout.write(output + '\n')

  writeLabel(options.label, gridCols, dim)
}

// ---------------------------------------------------------------------------
// Braille rendering — compact, decorative
// ---------------------------------------------------------------------------

function renderBraille(
  modules: QR.QRCode['modules'],
  size: number,
  options: QRCodeOptions,
  theme: Theme,
): void {
  const accent = paintAccent(theme)
  const dim = paintDim()

  // Quiet zone in modules. Padding is rounded up to multiples of 2 cols /
  // 4 rows so every braille glyph fits exactly on a block boundary.
  const quiet = Math.max(0, options.quiet ?? 4)
  const paddedCols = size + quiet * 2
  const paddedRows = size + quiet * 2
  const gridCols = Math.ceil(paddedCols / 2) * 2
  const gridRows = Math.ceil(paddedRows / 4) * 4

  const isDark = (r: number, c: number): boolean => {
    const sr = r - quiet
    const sc = c - quiet
    if (sr < 0 || sc < 0 || sr >= size || sc >= size) return false
    return modules.get(sr, sc) === 1
  }

  // Braille dot bitmap — (col, row) within a 2x4 block maps to a bit in
  // the Unicode braille pattern byte. Unicode U+2800 + sum(bits).
  const bitFor: ReadonlyArray<ReadonlyArray<number>> = [
    [0x01, 0x02, 0x04, 0x40],
    [0x08, 0x10, 0x20, 0x80],
  ]

  const lines: string[] = []
  for (let rowStart = 0; rowStart < gridRows; rowStart += 4) {
    let line = ''
    for (let colStart = 0; colStart < gridCols; colStart += 2) {
      let bits = 0
      for (let c = 0; c < 2; c++) {
        for (let r = 0; r < 4; r++) {
          if (isDark(rowStart + r, colStart + c)) {
            bits |= bitFor[c]![r]!
          }
        }
      }
      line += String.fromCharCode(0x2800 + bits)
    }
    lines.push(line)
  }

  const output = lines.map((l) => accent(l)).join('\n')
  process.stdout.write(output + '\n')

  writeLabel(options.label, gridCols / 2, dim)
}

// ---------------------------------------------------------------------------

function writeLabel(
  label: string | undefined,
  width: number,
  dim: (s: string) => string,
): void {
  if (label == null || label.length === 0) return
  const leftPad = label.length >= width ? 0 : Math.floor((width - label.length) / 2)
  process.stdout.write(' '.repeat(leftPad) + dim(label) + '\n')
}
