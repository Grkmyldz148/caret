/**
 * Caret design tokens — raw building blocks
 *
 * These are the atomic token modules. They are composed into a Theme
 * by the theme/ layer. Components consume from theme via useTheme(),
 * not from these modules directly — but you can import these as
 * starting points for custom themes.
 */

export { fg, accent, semantic, type ColorTokens } from './colors.js'
export { motion, type MotionTokens } from './motion.js'
export { symbols, type SymbolTokens } from './symbols.js'
export { spacing, type SpacingTokens } from './spacing.js'
export { typography, type TypographyTokens } from './typography.js'
