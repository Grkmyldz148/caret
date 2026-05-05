'use client'

import { SearchPalette } from '@/components/SearchPalette'
import { SEARCH_INDEX } from '@/lib/docs-search-index'

export function DocsSearch() {
  return (
    <SearchPalette
      dataset={SEARCH_INDEX}
      triggerLabel="Search"
      placeholder="Search documentation…"
      ariaLabel="Search documentation"
    />
  )
}
