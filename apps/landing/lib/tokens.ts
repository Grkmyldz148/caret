/**
 * Web mirror of Caret tokens.
 *
 * These must stay in sync with:
 *   registry/tokens/colors.ts
 *   registry/tokens/symbols.ts
 *   registry/tokens/spacing.ts
 *
 * Kept as plain constants (no import from the registry) because the
 * registry is authored for Ink/Node and ships ANSI semantics. The web
 * side re-expresses the same tokens in hex + CSS.
 */

// === BRAND ACCENT ========================================================
// Helmlab: { hue: 250, chroma: 0.20 } — clean modern blue.
// Green was explicitly rejected as "cliché Matrix look".
export const accent = {
  default: '#5882F7',
  muted: '#3A5FB8',
  emphasized: '#7B9DFF',
} as const

// === SEMANTIC STATES =====================================================
// Truecolor fallbacks — real terminals would emit ANSI names; on the web
// we pick the documented truecolor values from registry/tokens/colors.ts.
export const semantic = {
  success: '#3FBF6F',
  warning: '#E5A823',
  danger: '#E5482D',
  info: '#5A9CD8',
} as const

// === FOREGROUND HIERARCHY ================================================
// Caret never sets a background and leans on the terminal's own fg.
// On the web we simulate a dark terminal with an off-white default and
// dim via CSS opacity — mirroring the ANSI `dim` attribute.
export const fg = {
  canvas: '#0A0A0A',
  surface: '#111111',
  hairline: '#1F1F1F',
  hairlineStrong: '#2A2A2A',
  default: '#EDEDED',
  muted: '#8A8A8A', // ANSI dim
  subtle: '#5A5A5A', // dim + italic tier
} as const

// === SYMBOL VOCABULARY ===================================================
// Mirrors registry/tokens/symbols.ts exactly.
export const symbols = {
  anchor: '^',
  prefix: { focused: '▸', idle: '·' },
  marker: { selected: '●', unselected: '○' },
  state: {
    success: '✓',
    failure: '✗',
    warning: '⚠',
    info: 'ℹ',
    cancelled: '—',
  },
  structure: { gutter: '│' },
  progress: { arrow: '→', filled: '━', empty: '─', head: '╸' },
  bullet: '•',
  leader: '·',
  ruler: '─',
  cursor: '▎',
  ellipsis: '…',
  spinner: {
    braille: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'] as const,
  },
} as const

// === SPACING =============================================================
// Character-grid units. On the web these become `ch` widths.
export const spacing = {
  page: 4,
  indent: 2,
  gap: 2,
} as const

/**
 * Tracking: Caret's display/heading convention adds a U+2009 thin space
 * between every character of an uppercased label. Used by banner, divider,
 * prompt shell.
 */
export function tracking(text: string): string {
  return text.toUpperCase().split('').join('\u2009')
}
