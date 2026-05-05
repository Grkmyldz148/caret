/**
 * Caret symbol vocabulary
 *
 * These are the brand. They are not configurable. They are not negotiable.
 * Every Caret CLI uses exactly these characters in exactly these roles.
 */

export const symbols = {
  /** The Caret anchor. Marks the start of every prompt. */
  anchor: '^',

  /** Input row prefixes. */
  prefix: {
    focused: '▸',
    idle: '·',
  },

  /** Single / multi-select markers. */
  marker: {
    selected: '●',
    unselected: '○',
  },

  /** Semantic state symbols. Carry meaning when color is unavailable. */
  state: {
    success: '✓',
    failure: '✗',
    warning: '⚠',
    info: 'ℹ',
    cancelled: '—',
  },

  /** Structural characters used in error blocks and grouped output. */
  structure: {
    gutter: '│',
  },

  /** Progress indicators. */
  progress: {
    arrow: '→',
    /** Filled cell of a progress bar — heavy horizontal line */
    filled: '━',
    /** Empty cell of a progress bar — light horizontal line */
    empty: '─',
    /** Optional head character at the boundary between filled and empty */
    head: '╸',
  },

  /** Box-drawing characters for tables, banners, and bordered groups. */
  borders: {
    topLeft: '╭',
    topRight: '╮',
    bottomLeft: '╰',
    bottomRight: '╯',
    horizontal: '─',
    vertical: '│',
    tLeft: '├',
    tRight: '┤',
    tTop: '┬',
    tBottom: '┴',
    cross: '┼',
  },

  /** List bullet character. */
  bullet: '•',

  /**
   * Dotted leader character (U+00B7, middle dot).
   * The Caret signature for label/value rows — see specs/look.md §
   * Symbols — "Dotted leaders".
   */
  leader: '·',

  /**
   * Horizontal ruler used under section headings when content below is
   * dense (tables, code blocks). Same glyph as borders.horizontal, but
   * called out here for its typographic (not structural) role.
   */
  ruler: '─',

  /**
   * Input cursor block. Used after a value in an active prompt row.
   */
  cursor: '▎',

  /** Truncation indicator. */
  ellipsis: '…',

  /** Tree branch characters (sharp, classic terminal-tree style). */
  tree: {
    branch: '├──',
    lastBranch: '└──',
    vertical: '│  ',
    space: '   ',
  },

  /** Diff line markers. */
  diff: {
    added: '+',
    removed: '-',
    unchanged: ' ',
  },

  /**
   * Spinner braille rotation. 10 frames, 80ms per frame.
   * The standard cli-spinners "dots" set.
   */
  spinner: {
    braille: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'] as const,
  },

  /** Dumb terminal fallbacks (used when Unicode is unavailable). */
  fallback: {
    anchor: '^',
    prefix: { focused: '>', idle: '.' },
    marker: { selected: '*', unselected: '-' },
    state: {
      success: 'OK',
      failure: 'X',
      warning: '!',
      info: 'i',
      cancelled: '-',
    },
    structure: { gutter: '|' },
    progress: { arrow: '->', filled: '=', empty: '-', head: '>' },
    borders: {
      topLeft: '+',
      topRight: '+',
      bottomLeft: '+',
      bottomRight: '+',
      horizontal: '-',
      vertical: '|',
      tLeft: '+',
      tRight: '+',
      tTop: '+',
      tBottom: '+',
      cross: '+',
    },
    bullet: '*',
    leader: '.',
    ruler: '-',
    cursor: '_',
    ellipsis: '...',
    tree: {
      branch: '|--',
      lastBranch: '`--',
      vertical: '|  ',
      space: '   ',
    },
    diff: { added: '+', removed: '-', unchanged: ' ' },
    spinner: { rotation: ['|', '/', '-', '\\'] as const },
  },
} as const

export type SymbolTokens = typeof symbols
