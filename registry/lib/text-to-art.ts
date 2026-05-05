/**
 * Caret text-to-ASCII-art helper
 *
 * Wraps `figlet` to convert plain strings into multi-line ASCII art logos.
 * Used by `logo({ text })` and `splash({ logo: { text } })`. Available
 * standalone for users who want raw conversion.
 *
 *   import { textToArt } from '@caret/registry'
 *
 *   const art = textToArt('nibgat')
 *   const art2 = textToArt('nibgat', { font: 'Big' })
 *   const art3 = textToArt('nibgat', { font: 'Slant' })
 *
 * Default font is 'ANSI Shadow' — bold, modern, fits Caret's voice.
 * If the requested font fails to load, falls back to 'Standard'. If
 * even that fails, returns the original text unchanged so callers
 * never crash.
 *
 * Common fonts you can pass:
 *   'ANSI Shadow' (default, bold modern)
 *   'Big'         (chunky, friendly)
 *   'Standard'    (classic figlet)
 *   'Slant'       (italic-ish)
 *   'Small'       (compact)
 *   'Doom'        (retro game vibe)
 *   'Ghost'       (outlined)
 *   'Block'       (filled blocks)
 *   'Banner'      (wide single-line)
 *   '3-D'         (extruded)
 *
 * See https://github.com/patorjk/figlet.js for the full font catalog
 * (100+ fonts shipped with figlet).
 */

import figlet from 'figlet'

export type TextToArtOptions = {
  /** figlet font name. Default: 'ANSI Shadow'. */
  font?: string
  /** Horizontal kerning. Default: 'default' (figlet's natural spacing). */
  horizontalLayout?: 'default' | 'full' | 'fitted' | 'controlled smushing' | 'universal smushing'
  /** Maximum width before figlet wraps. Default: unbounded. */
  width?: number
}

export function textToArt(text: string, options: TextToArtOptions = {}): string {
  // figlet ships its `Fonts` and `Options` types under a TS namespace;
  // accessing them as `figlet.Fonts` requires `esModuleInterop`-aware
  // tsconfigs that we don't enforce on every consumer. Treat figletOptions
  // as Parameters<typeof figlet.textSync>[1] — TypeScript can read that
  // shape from the default export without the namespace dance.
  type FigletOptions = NonNullable<Parameters<typeof figlet.textSync>[1]>
  const font = (options.font ?? 'ANSI Shadow') as FigletOptions['font']
  const figletOptions: FigletOptions = {
    font,
    ...(options.horizontalLayout ? { horizontalLayout: options.horizontalLayout } : {}),
    ...(options.width ? { width: options.width } : {}),
  }

  try {
    return figlet.textSync(text, figletOptions)
  } catch {
    // Fallback 1: Standard font (always available)
    try {
      return figlet.textSync(text, { font: 'Standard' })
    } catch {
      // Fallback 2: plain text — never crash
      return text
    }
  }
}
