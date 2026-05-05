import type { SearchEntry } from '@/components/SearchPalette'
import { groupSpecsByKind, loadSpecs } from '@/lib/spec-data'

const KIND_LABEL = {
  interactive: 'Interactive',
  display: 'Display',
  utility: 'Utility',
  other: 'Other',
} as const

/**
 * Builds the spec ⌘K dataset at request time. Server-only — the
 * `loadSpecs` helper reads from disk. Returned entries get serialised
 * down to the client `<SpecSearch>` component.
 */
export function buildSpecSearchIndex(): SearchEntry[] {
  const groups = groupSpecsByKind(loadSpecs())
  const out: SearchEntry[] = []
  for (const g of groups) {
    for (const s of g.items) {
      out.push({
        title: s.title,
        section: KIND_LABEL[g.kind],
        description: s.description,
        href: `/spec/${s.slug}`,
      })
    }
  }
  return out
}
