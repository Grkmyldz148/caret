/**
 * Caret spacing tokens
 *
 * Spacing in terminal is measured in characters, not pixels. Components
 * use these for indentation, gaps, and margins.
 *
 * The manifesto (specs/look.md § Spacing & rhythm) defines:
 *   - Page indent: 4 (magazine-like left margin for top-level lines)
 *   - Component indent: 2 (inside a prompt, after the `^` anchor)
 *   - Inline gap: 2 ("the Caret number is 2" — not 1, not 3)
 *   - Section rhythm: 2 blank lines before a heading, 1 after
 */

export const spacing = {
  none: 0,
  xs: 1,
  sm: 2,
  md: 4,
  lg: 6,
  xl: 8,

  /** Top-level page indent — every root line starts at this column */
  page: 4,
  /** Standard component indent — used after the anchor inside a prompt */
  indent: 2,
  /** The Caret inline gap — label↔value, bullet↔text, icon↔label */
  gap: 2,
  /** Blank lines before a section heading */
  sectionBefore: 2,
  /** Blank lines after a section heading (before its content) */
  sectionAfter: 1,

  /** @deprecated use sectionBefore / sectionAfter */
  section: 1,
} as const

export type SpacingTokens = typeof spacing
