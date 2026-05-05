/**
 * Caret docs navigation tree.
 *
 * Single source of truth for the left sidebar AND the previous/next
 * footer pager. Pages with `soon: true` render as disabled placeholders
 * — kept here so future pages declare intent without 404'ing.
 */

export type DocsItem = {
  label: string
  href?: string
  soon?: boolean
}

export type DocsSection = {
  label: string
  items: DocsItem[]
}

export const DOCS_NAV: readonly DocsSection[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Getting started', href: '/docs' },
      { label: 'Install', href: '/docs/install' },
      { label: 'Your first CLI', href: '/docs/first-cli' },
      { label: 'How it works', href: '/docs/how-it-works' },
    ],
  },
  {
    label: 'Concepts',
    items: [
      { label: 'Principles', href: '/docs/concepts/principles' },
      { label: 'Tokens', href: '/docs/concepts/tokens' },
      { label: 'Theme', href: '/docs/concepts/theme' },
      { label: 'Symbols', href: '/docs/concepts/symbols' },
      { label: 'Capability detection', href: '/docs/concepts/capability' },
      { label: 'Motion', href: '/docs/concepts/motion' },
    ],
  },
  {
    label: 'CLI',
    items: [
      { label: 'Overview', href: '/docs/cli' },
      { label: 'caret init', href: '/docs/cli/init' },
      { label: 'caret add', href: '/docs/cli/add' },
      { label: 'caret list', href: '/docs/cli/list' },
    ],
  },
  {
    label: 'Authoring',
    items: [
      { label: 'AI-native workflow', href: '/docs/authoring/ai-native' },
      { label: 'Custom theme', href: '/docs/authoring/custom-theme' },
      { label: 'Porting Caret', href: '/docs/authoring/porting' },
    ],
  },
  {
    label: 'Reference',
    items: [
      { label: 'Components', href: '/components' },
      { label: 'Spec', href: '/spec' },
      { label: 'FAQ', href: '/docs/reference/faq' },
      { label: 'Troubleshooting', href: '/docs/reference/troubleshooting' },
    ],
  },
]
