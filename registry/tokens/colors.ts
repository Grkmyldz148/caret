/**
 * Caret color tokens
 *
 * Runtime-safe sRGB values used by components. Components import these
 * directly and pass them to Ink's <Text color={...}>; Ink/chalk handles
 * the truecolor → 256 → ANSI 16 → none downgrade and respects NO_COLOR.
 *
 * AUTHORING:
 * The Caret palette is designed in Helmlab GenSpace (helmlab.space).
 * The Helmlab inputs that produce each token are documented in comments.
 * To regenerate this file from those inputs, run `pnpm tokens:generate`.
 *
 * (The generation pipeline is not yet implemented; the values below are
 * hand-picked starting proposals matching the documented Helmlab inputs.
 * Görkem will replace them with actual Helmlab-computed values.)
 *
 * EMISSION RULES:
 *   - Background is never set (Caret's golden rule).
 *   - Foreground hierarchy uses ANSI attributes (dim, bold, italic), never RGB,
 *     so user terminal themes are respected.
 *   - Semantic states emit ANSI 16 named colors so user themes harmonize.
 *   - Brand accent emits fixed truecolor as Caret's recognizable signature.
 */

// === BRAND ACCENT (truecolor, fixed Caret signature) ===
//
// The Caret accent — clean modern blue.
// Helmlab inputs:  { hue: 250, chroma: 0.20 }
//
// See specs/look.md § Palette for the full rationale and the table of
// rejected alternatives. The short list, frozen but documented:
//   Purple (hue 295, chroma 0.22) — too "premium SaaS", competes with Linear
//   Cyan   (hue 200, chroma 0.15) — too common in dev tools, not distinctive
//   Indigo (hue 270, chroma 0.20) — close to default but less confident
//   Green  (hue 150, chroma 0.18) — cliché Matrix look
//   Amber  (hue 25,  chroma 0.21) — reserved for the rejected Hybrid A voice

export const accent = {
  /** Default accent — anchor, focused prefix, selected markers */
  default: '#5882F7',
  /** Muted accent — for de-emphasized brand moments */
  muted: '#3A5FB8',
  /** Emphasized accent — for hover, focus pulse */
  emphasized: '#7B9DFF',
} as const

// === SEMANTIC STATES ===
//
// Default emission is the ANSI 16 named color so user terminal themes
// harmonize naturally. Truecolor fallbacks are documented for opt-in use.
//
// Helmlab inputs (PROPOSED):
//   success: { hue: 155, chroma: 0.16 }
//   warning: { hue: 85,  chroma: 0.17 }
//   danger:  { hue: 25,  chroma: 0.21 }
//   info:    { hue: 235, chroma: 0.12 }

export const semantic = {
  success: { ansi: 'green' as const, truecolor: '#3FBF6F' },
  warning: { ansi: 'yellow' as const, truecolor: '#E5A823' },
  danger: { ansi: 'red' as const, truecolor: '#E5482D' },
  info: { ansi: 'blue' as const, truecolor: '#5A9CD8' },
} as const

// === FOREGROUND HIERARCHY ===
//
// Attribute-based — never RGB. Components map these to Ink's
// <Text dimColor> / <Text bold> / <Text italic> props.

export const fg = {
  /** Use the terminal's default foreground (no override) */
  default: { dim: false, italic: false, bold: false },
  /** ANSI dim — secondary text, hints, idle prefixes */
  muted: { dim: true, italic: false, bold: false },
  /** ANSI dim + italic — tertiary text, footers, cancelled placeholders */
  subtle: { dim: true, italic: true, bold: false },
  /** ANSI bold — labels, titles */
  bold: { dim: false, italic: false, bold: true },
} as const

export type ColorTokens = {
  accent: typeof accent
  semantic: typeof semantic
  fg: typeof fg
}
