'use client'

import { SearchPalette, type SearchEntry } from '@/components/SearchPalette'

const KIND_LABEL: Record<string, string> = {
  interactive: 'Interactive',
  display: 'Display',
  utility: 'Utility',
  other: 'Other',
}

/**
 * Spec ⌘K palette. Index is built at the server boundary
 * (`buildSpecSearchIndex` in `lib/spec-search-index.ts`) and passed
 * down so the client never re-reads `specs/` at runtime.
 */
export function SpecSearch({ dataset }: { dataset: readonly SearchEntry[] }) {
  return (
    <SearchPalette
      dataset={dataset}
      triggerLabel="Search specs"
      placeholder="Search component specs…"
      ariaLabel="Search component specs"
    />
  )
}

export { KIND_LABEL as SPEC_KIND_LABEL }
