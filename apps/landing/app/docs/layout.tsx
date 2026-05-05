import type { ReactNode } from 'react'
import { Nav } from '@/components/sections/Nav'
import { Footer } from '@/components/sections/Footer'
import { DocsSearch } from '@/components/DocsSearch'
import { DocsSidebar } from '@/components/docs/DocsSidebar'
import { DocsTOC } from '@/components/docs/DocsTOC'

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Nav search={<DocsSearch />} />
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12">
        {/* Mobile sidebar — collapsed by default. Native <details>
            keeps it CSS-only; the desktop aside stays primary. */}
        <details className="lg:hidden hairline-b group py-3">
          <summary className="flex items-center justify-between cursor-pointer text-fg font-medium select-none list-none">
            <span>All docs</span>
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
            <DocsSidebar />
          </div>
        </details>

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
