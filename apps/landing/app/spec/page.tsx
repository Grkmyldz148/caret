import type { Metadata } from 'next'
import { groupSpecsByKind, loadSpecs } from '@/lib/spec-data'

export const metadata: Metadata = {
  title: 'Spec — Caret',
  description:
    'The complete Caret component specification. Anatomy, API, keyboard shortcuts, and design guidelines for every primitive.',
}

export default function SpecIndexPage() {
  const specs = loadSpecs()
  const groups = groupSpecsByKind(specs)

  return (
    <main data-doc-main className="min-w-0 pt-10 pb-10">
      {/* Header */}
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-3">
        Reference · {specs.length} specs
      </div>
      <h1 className="text-[clamp(2.25rem,4vw+1rem,3.5rem)] font-light tracking-tightest leading-[1.05] mb-4">
        Every component, specified
        <span className="text-accent">.</span>
      </h1>
      <p className="text-[17px] text-muted leading-relaxed max-w-2xl mb-16">
        Anatomy, API surface, keyboard shortcuts, capability fallbacks. The
        single source of truth for what every Caret component does and why —
        the document an AI assistant or another implementer reads when they
        need exact behaviour, not vibes.
      </p>

      {/* Grouped index */}
      <div className="flex flex-col gap-16 max-w-3xl">
        {groups.map((g) => (
          <section key={g.kind} id={g.kind}>
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="text-xl font-medium tracking-tight">{g.label}</h2>
              <span className="font-mono text-[11px] text-subtle uppercase tracking-[0.18em]">
                {g.items.length} {g.items.length === 1 ? 'spec' : 'specs'}
              </span>
            </div>

            <ul className="border-t border-hairline">
              {g.items.map((s) => (
                <li key={s.slug}>
                  <a
                    href={`/spec/${s.slug}`}
                    className="group flex items-baseline gap-6 py-4 border-b border-hairline hover:bg-surface px-2 -mx-2 transition-colors"
                  >
                    <span className="font-mono text-xs text-subtle uppercase tracking-[0.18em] w-28 shrink-0">
                      {s.slug}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="text-[15px] text-fg group-hover:text-accent transition-colors">
                        {s.title}
                      </span>
                      {s.description !== '' && (
                        <span className="block text-[13px] text-muted mt-1 line-clamp-2">
                          {s.description}
                        </span>
                      )}
                    </span>
                    <span className="font-mono text-muted text-sm group-hover:text-accent transition-colors shrink-0">
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* Closing line */}
      <div className="mt-24 pt-12 border-t border-hairline max-w-2xl">
        <p className="text-[15px] text-muted leading-relaxed">
          Every spec lives in <code className="font-mono text-fg bg-surface border border-hairline px-1.5 py-0.5 rounded text-[13px]">specs/&lt;name&gt;.md</code>. Edit the markdown,
          rebuild, and the rendered page picks the change up.
        </p>
      </div>
    </main>
  )
}
