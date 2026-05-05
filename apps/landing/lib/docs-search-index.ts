/**
 * Flat search index for the docs ⌘K palette.
 *
 * Pages are added by hand instead of crawled at build time — keeps
 * the modal's results curated (titles match what's in the sidebar)
 * and skips stub `soon` pages that don't have content yet.
 *
 * When a doc page lands, append a SearchEntry here. Anchors within
 * a page are listed individually so users can jump straight to the
 * relevant section instead of scrolling.
 */

export type SearchEntry = {
  /** Bold primary line. */
  title: string
  /** Dim breadcrumb shown after the title — usually section · context. */
  section: string
  /** Body sentence shown when the entry is the active result. */
  description: string
  /** Where the entry navigates on click / Enter. */
  href: string
}

export const SEARCH_INDEX: readonly SearchEntry[] = [
  // ── Overview ────────────────────────────────────────────────────
  {
    title: 'Getting started',
    section: 'Overview',
    description:
      'A quick tour of Caret — what it is, what you copy into your repo, and how to ship a CLI that looks like a design-led product on day one.',
    href: '/docs',
  },
  {
    title: 'Install',
    section: 'Overview',
    description:
      'Install the CLI, scaffold a project, or add Caret to an existing repo. Includes the registry layout and how component lookup resolves.',
    href: '/docs/install',
  },
  {
    title: 'Your first CLI',
    section: 'Overview',
    description:
      'Build a tiny but real CLI with Caret in five minutes — prompts, async work with a spinner, structured errors.',
    href: '/docs/first-cli',
  },
  {
    title: 'How it works',
    section: 'Overview',
    description:
      'The four layers of Caret — components, tokens, capability, spec — and how they coordinate.',
    href: '/docs/how-it-works',
  },

  // ── Concepts ────────────────────────────────────────────────────
  {
    title: 'Principles',
    section: 'Concepts',
    description:
      'The ten rules every Caret design decision comes back to. The manifesto in detail.',
    href: '/docs/concepts/principles',
  },
  {
    title: 'Tokens',
    section: 'Concepts',
    description:
      'Colors, motion, symbols, spacing, typography. The visual contract every component reads.',
    href: '/docs/concepts/tokens',
  },
  {
    title: 'Colors',
    section: 'Concepts · Tokens',
    description:
      'Brand accent (truecolor, fixed) versus semantic colors (ANSI-named, theme-aware).',
    href: '/docs/concepts/tokens#colors',
  },
  {
    title: 'Motion',
    section: 'Concepts · Tokens',
    description:
      'Bounded animation tokens — durations, frame rates, reduced-motion gates.',
    href: '/docs/concepts/tokens#motion',
  },
  {
    title: 'Symbols',
    section: 'Concepts · Tokens',
    description:
      'The brand glyph set: ^, ▸, ●, ○, ✓, ✗, ⚠, ℹ, —, │. Manifesto says: never customize.',
    href: '/docs/concepts/tokens#symbols',
  },
  {
    title: 'Theme system',
    section: 'Concepts',
    description:
      'setTheme, ThemeProvider, useTheme, per-call overrides — the four ways to apply a Caret theme.',
    href: '/docs/concepts/theme',
  },
  {
    title: 'Symbol set',
    section: 'Concepts',
    description:
      'The ten brand glyphs every Caret CLI must use without customizing. State, marker, and structure.',
    href: '/docs/concepts/symbols',
  },
  {
    title: 'Capability detection',
    section: 'Concepts',
    description:
      'NO_COLOR, isTTY, narrow widths, reduced motion. The single read every component consults before painting.',
    href: '/docs/concepts/capability',
  },
  {
    title: 'Motion tokens',
    section: 'Concepts',
    description:
      'Bounded durations, frame rates, and the rules animation must follow.',
    href: '/docs/concepts/motion',
  },

  // ── CLI ─────────────────────────────────────────────────────────
  {
    title: 'CLI overview',
    section: 'CLI',
    description:
      'Every command, flag, and exit code for the caret-cli binary.',
    href: '/docs/cli',
  },
  {
    title: 'caret init',
    section: 'CLI',
    description:
      'Scaffold a new CLI project with Caret preinstalled — package.json, tsconfig, src entry, caret.md.',
    href: '/docs/cli#init',
  },
  {
    title: 'caret add',
    section: 'CLI',
    description:
      'Copy a registered component into your project. Files land under caret/ by default.',
    href: '/docs/cli#add',
  },
  {
    title: 'caret list',
    section: 'CLI',
    description:
      'Print every component in the bundled registry, grouped by kind.',
    href: '/docs/cli#list',
  },

  // ── Authoring ───────────────────────────────────────────────────
  {
    title: 'AI-native workflow',
    section: 'Authoring',
    description:
      'How Caret stays on-brand when an LLM is writing your CLI. The caret.md instruction file.',
    href: '/docs/authoring/ai-native',
  },
  {
    title: 'Custom theme',
    section: 'Authoring',
    description:
      'Build a Caret theme from a brand color: derive a palette, ensure WCAG contrast, ship it as a single object.',
    href: '/docs/authoring/custom-theme',
  },
  {
    title: 'Porting Caret',
    section: 'Authoring',
    description:
      'Port Caret to another language. The spec is the contract; TypeScript is one possible binding.',
    href: '/docs/authoring/porting',
  },

  // ── Reference ───────────────────────────────────────────────────
  {
    title: 'Component catalog',
    section: 'Reference',
    description:
      '80+ primitives — prompts, spinners, errors, tables, charts, animations — with live previews.',
    href: '/components',
  },
  {
    title: 'Spec',
    section: 'Reference',
    description:
      'The Caret specification: rules behind the components, designed for porting to other languages.',
    href: '/spec',
  },
  {
    title: 'FAQ',
    section: 'Reference',
    description:
      'Frequent questions — runtime model, scope, AI workflow, theming, ports.',
    href: '/docs/reference/faq',
  },
  {
    title: 'Troubleshooting',
    section: 'Reference',
    description:
      'Common issues and how to fix them — installer errors, alignment, missing colors, broken animations.',
    href: '/docs/reference/troubleshooting',
  },
]
