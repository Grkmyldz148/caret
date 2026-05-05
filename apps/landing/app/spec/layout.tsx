import type { ReactNode } from 'react'
import { Nav } from '@/components/sections/Nav'
import { Footer } from '@/components/sections/Footer'
import { SpecSidebar } from '@/components/spec/SpecSidebar'
import { DocsTOC } from '@/components/docs/DocsTOC'
import { groupSpecsByKind, loadSpecs } from '@/lib/spec-data'

export default function SpecLayout({ children }: { children: ReactNode }) {
  const groups = groupSpecsByKind(loadSpecs()).map((g) => ({
    kind: g.kind,
    label: g.label,
    items: g.items.map((s) => ({ slug: s.slug, title: s.title })),
  }))

  return (
    <>
      <Nav />
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12">
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
