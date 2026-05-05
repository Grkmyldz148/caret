import type { Metadata } from 'next'
import { Nav } from '@/components/sections/Nav'
import { Footer } from '@/components/sections/Footer'
import { ComponentsSearch } from '@/components/ComponentsSearch'
import {
  CATALOG,
  CATEGORIES,
  type CatalogCategory,
  type CatalogEntry,
} from '@/lib/component-catalog'
import { CatalogCard } from './CatalogCard'

export const metadata: Metadata = {
  title: 'Components — Caret',
  description:
    'The full Caret component catalog. Prompts, spinners, tables, charts, animations, and effects — every primitive a modern CLI needs.',
}

const CATEGORY_ORDER: CatalogCategory[] = [
  'interactive',
  'display',
  'message',
  'text',
  'data',
  'animation',
  'effect',
  'layout',
  'utility',
]

function groupByCategory(entries: CatalogEntry[]) {
  const map = {} as Record<CatalogCategory, CatalogEntry[]>
  for (const key of CATEGORY_ORDER) map[key] = []
  for (const entry of entries) map[entry.category].push(entry)
  return map
}

export default function ComponentsPage() {
  const grouped = groupByCategory(CATALOG)
  const total = CATALOG.length

  return (
    <>
      <Nav search={<ComponentsSearch />} />

      <main className="w-full max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <section className="py-20 md:py-28 hairline-b">
          <div className="font-mono text-xs text-accent mb-6 uppercase tracking-[0.2em]">
            Components · {total}
          </div>
          <h1 className="text-4xl md:text-6xl font-light tracking-tightest leading-[1.02] max-w-4xl">
            The full catalog.
            <span className="text-accent">.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted leading-relaxed max-w-2xl font-light">
            {total} copy-paste components covering every surface a modern CLI
            touches — prompts and spinners, tables and dashboards, animations
            and effects. Nothing depends on a framework.
          </p>

          {/* Category index */}
          <nav className="mt-12 flex flex-wrap gap-x-6 gap-y-3 font-mono text-xs">
            {CATEGORY_ORDER.map((cat) => {
              const count = grouped[cat].length
              if (count === 0) return null
              return (
                <a
                  key={cat}
                  href={`#cat-${cat}`}
                  className="text-muted hover:text-accent transition-colors"
                >
                  {CATEGORIES[cat].label.toLowerCase()}{' '}
                  <span className="text-subtle">· {count}</span>
                </a>
              )
            })}
          </nav>
        </section>

        {/* Category sections */}
        {CATEGORY_ORDER.map((cat) => {
          const entries = grouped[cat]
          if (entries.length === 0) return null
          const meta = CATEGORIES[cat]
          return (
            <section
              key={cat}
              id={`cat-${cat}`}
              className="py-20 md:py-24 hairline-b"
            >
              <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                  <div className="font-mono text-xs text-accent mb-3 uppercase tracking-[0.2em]">
                    {meta.label} · {entries.length}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-light tracking-tight">
                    {meta.description}
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-px bg-hairline border border-hairline">
                {entries.map((entry) => (
                  <CatalogCard key={entry.slug} entry={entry} />
                ))}
              </div>
            </section>
          )
        })}

        {/* CTA */}
        <section className="py-24 md:py-32 text-center">
          <div className="font-mono text-xs text-accent mb-6 uppercase tracking-[0.2em]">
            Get started
          </div>
          <h2 className="text-3xl md:text-5xl font-light tracking-tightest max-w-2xl mx-auto">
            Copy the ones you need.
            <span className="text-accent">.</span>
          </h2>
          <p className="mt-6 text-muted font-light max-w-xl mx-auto">
            Every component is a single file. No runtime, no framework.
          </p>
          <div className="mt-10 flex items-center justify-center gap-3">
            <a
              href="/#cta"
              className="bg-fg text-canvas px-6 py-3 font-medium text-sm rounded-md hover:opacity-90 transition-opacity"
            >
              Start with `npx caret init`
            </a>
            <a
              href="/"
              className="text-sm text-muted hover:text-fg transition-colors px-4 py-3"
            >
              ← Back to home
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
