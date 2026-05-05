import type { ReactNode } from 'react'
import { Nav } from '@/components/sections/Nav'
import { Footer } from '@/components/sections/Footer'
import { SpecSearch } from '@/components/SpecSearch'
import { SpecSidebar } from '@/components/spec/SpecSidebar'
import { DocsTOC } from '@/components/docs/DocsTOC'
import { groupSpecsByKind, loadSpecs } from '@/lib/spec-data'
import { buildSpecSearchIndex } from '@/lib/spec-search-index'

export default function SpecLayout({ children }: { children: ReactNode }) {
  const groups = groupSpecsByKind(loadSpecs()).map((g) => ({
    kind: g.kind,
    label: g.label,
    items: g.items.map((s) => ({ slug: s.slug, title: s.title })),
  }))

  const searchIndex = buildSpecSearchIndex()

  return (
    <>
      <Nav search={<SpecSearch dataset={searchIndex} />} />
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12">
        {/* Mobile sidebar — collapsed by default. Mirrors the docs
            layout so users get the same affordance everywhere. */}
        <details className="lg:hidden hairline-b group py-3">
          <summary className="flex items-center justify-between cursor-pointer text-fg font-medium select-none list-none">
            <span>All specs</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted transition-transform group-open:rotate-180"
              aria-hidden
            >
              <path d="M6 9L12 15L18 9" />
            </svg>
          </summary>
          <div className="mt-4 max-h-[60vh] overflow-y-auto pb-2">
            <SpecSidebar groups={groups} />
          </div>
        </details>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_200px] gap-x-10 xl:gap-x-12">
          <aside className="hidden lg:block sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto scroll-fade pr-2">
            <SpecSidebar groups={groups} />
          </aside>
          {children}
          <aside className="hidden lg:block sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto scroll-fade">
            <DocsTOC />
          </aside>
        </div>
      </div>
      <Footer />
    </>
  )
}
