import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { loadSpec, loadSpecs, groupSpecsByKind } from '@/lib/spec-data'
import { SpecRenderer } from '@/components/spec/SpecRenderer'

type Params = { slug: string }

export async function generateStaticParams() {
  return loadSpecs().map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({
  params,
}: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  const spec = loadSpec(slug)
  if (!spec) return { title: 'Spec — Caret' }
  return {
    title: `${spec.title} — Spec — Caret`,
    description:
      spec.description ||
      `The Caret specification for ${spec.title}: anatomy, API, and behaviour.`,
  }
}

export default async function SpecDetailPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const spec = loadSpec(slug)
  if (!spec) notFound()

  // Build prev / next links inside the same kind for the footer pager.
  const all = loadSpecs()
  const groups = groupSpecsByKind(all)
  const here = groups.find((g) => g.items.some((s) => s.slug === slug))
  const idx = here ? here.items.findIndex((s) => s.slug === slug) : -1
  const prev = here && idx > 0 ? here.items[idx - 1]! : null
  const next = here && idx < (here?.items.length ?? 0) - 1 ? here.items[idx + 1]! : null

  return (
    <div className="min-w-0 pb-10">
      <SpecRenderer spec={spec} />

      {/* Prev / next inside the same kind */}
      {(prev || next) && (
        <div className="max-w-2xl mt-12 pt-8 border-t border-hairline grid grid-cols-2 gap-4">
          {prev ? (
            <a
              href={`/spec/${prev.slug}`}
              className="group flex flex-col gap-1 text-left p-4 border border-hairline rounded-md hover:border-accent transition-colors"
            >
              <span className="font-mono text-[10px] text-subtle uppercase tracking-[0.18em]">
                ← Previous
              </span>
              <span className="text-sm text-fg group-hover:text-accent transition-colors">
                {prev.title}
              </span>
            </a>
          ) : (
            <div />
          )}
          {next ? (
            <a
              href={`/spec/${next.slug}`}
              className="group flex flex-col gap-1 text-right p-4 border border-hairline rounded-md hover:border-accent transition-colors"
            >
              <span className="font-mono text-[10px] text-subtle uppercase tracking-[0.18em]">
                Next →
              </span>
              <span className="text-sm text-fg group-hover:text-accent transition-colors">
                {next.title}
              </span>
            </a>
          ) : (
            <div />
          )}
        </div>
      )}
    </div>
  )
}
