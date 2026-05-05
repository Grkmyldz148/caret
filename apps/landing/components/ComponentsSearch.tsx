'use client'

import { SearchPalette, type SearchEntry } from '@/components/SearchPalette'
import { CATALOG, CATEGORIES } from '@/lib/component-catalog'

/**
 * Components catalog ⌘K palette. The dataset is derived from the
 * static `CATALOG` array in `lib/component-catalog.tsx`; jumps land
 * on the in-page anchor (`/components#<slug>`) since the catalog is
 * one long page.
 */
export function ComponentsSearch() {
  const dataset: readonly SearchEntry[] = CATALOG.map((entry) => ({
    title: entry.name,
    section: CATEGORIES[entry.category].label,
    description: entry.description,
    href: `/components#${entry.slug}`,
  }))

  return (
    <SearchPalette
      dataset={dataset}
      triggerLabel="Search components"
      placeholder="Search components…"
      ariaLabel="Search components"
    />
  )
}
