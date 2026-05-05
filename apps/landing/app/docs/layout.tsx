import type { ReactNode } from 'react'
import { Nav } from '@/components/sections/Nav'
import { Footer } from '@/components/sections/Footer'
import { DocsSidebar } from '@/components/docs/DocsSidebar'
import { DocsTOC } from '@/components/docs/DocsTOC'

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Nav showSearch />
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_200px] gap-x-10 xl:gap-x-12">
          <aside className="hidden lg:block sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto scroll-fade pr-2">
            <DocsSidebar />
          </aside>
          <main
            data-doc-main
            className="min-w-0 pt-10 pb-24"
          >
            {children}
          </main>
          <aside className="hidden lg:block sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto scroll-fade">
            <DocsTOC />
          </aside>
        </div>
      </div>
      <Footer />
    </>
  )
}
