/**
 * Caret theme — public API
 *
 * Import everything you need to consume or customize Caret's visual
 * identity from this single entry point.
 *
 *   import {
 *     defaultTheme,
 *     setTheme,
 *     useTheme,
 *     ThemeProvider,
 *     type Theme,
 *     type PartialTheme,
 *   } from '@caret/registry/theme'
 */

export { defaultTheme } from './default.js'
export { mergeTheme } from './merge.js'
export { setTheme, getTheme, resetTheme } from './global.js'
export { ThemeProvider, useTheme, type ThemeProviderProps } from './context.js'

export type {
  Theme,
  PartialTheme,
  ColorPalette,
  SemanticColor,
  AnsiColor,
  FgAttribute,
  MotionTokens,
  SymbolSet,
  SpacingScale,
  TypographyScale,
} from './types.js'
