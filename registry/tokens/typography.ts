/**
 * Caret typography tokens
 *
 * Terminal typography is constrained to attributes (bold, dim, italic).
 * These tokens map semantic roles onto attribute combinations.
 *
 * NOTE — Tracking CAPS is NOT encoded in these tokens.
 * Tracking is a string transformation (`tracking()` in lib/typography.ts),
 * not a text attribute. The convention is: roles marked here with
 * "(tracking)" in their comment MUST be wrapped with `tracking()` at the
 * call site. See specs/look.md § Typography for the full rule.
 *
 * The canonical set used by the manifesto is:
 *   display, heading, label, body, strong, muted, subtle, code
 * The older roles (quiet, emphasis, description, hintFooter) are kept
 * for backward compatibility and may be removed in a future revision.
 */

export const typography = {
  /** Display brand title (once per output, at the top) — bold + tracking */
  display: { bold: true, dim: false, italic: false },
  /** Section heading — bold + tracking */
  heading: { bold: true, dim: false, italic: false },
  /** Component label / form field name — bold */
  label: { bold: true, dim: false, italic: false },
  /** Default body text — no attribute */
  body: { bold: false, dim: false, italic: false },
  /** Strong / important — bold */
  strong: { bold: true, dim: false, italic: false },
  /** Secondary / meta / timestamps — dim (manifesto canonical name) */
  muted: { bold: false, dim: true, italic: false },
  /** Subtle / tertiary / hint footers / placeholders — dim + italic */
  subtle: { bold: false, dim: true, italic: true },
  /** Inline code — terminal is already monospace */
  code: { bold: false, dim: false, italic: false },

  // ── Legacy aliases (kept for backward compatibility) ─────────────
  /** @deprecated use `muted` */
  quiet: { bold: false, dim: true, italic: false },
  /** Emphasis — italic */
  emphasis: { bold: false, dim: false, italic: true },
  /** @deprecated use `muted` */
  description: { bold: false, dim: true, italic: false },
  /** @deprecated use `subtle` */
  hintFooter: { bold: false, dim: true, italic: true },
} as const

export type TypographyTokens = typeof typography
