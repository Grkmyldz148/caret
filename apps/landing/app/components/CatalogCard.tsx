import Link from 'next/link'
import { TerminalStage } from '@/components/terminal'
import { CATEGORIES, type CatalogEntry } from '@/lib/component-catalog'

/**
 * CatalogCard — one tile in the /components catalog.
 *
 * Each card deep-links to the spec page (`/spec/<slug>`) where the
 * component's manifesto, props, and worked usage examples live. The
 * spec is the canonical reference; the catalog is the gateway.
 */
export function CatalogCard({ entry }: { entry: CatalogEntry }) {
  return (
    <Link
      id={entry.slug}
      href={`/spec/${entry.slug}`}
      aria-label={`View ${entry.name} spec and usage examples`}
      className="catalog-card group relative flex flex-col min-h-[280px] overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {/* Preview keeps the terminal palette regardless of page theme —
          components are demo'd in their native dark surface. */}
      <div className="flex-1 flex items-center px-5 py-8 overflow-hidden bg-terminal-canvas transition-colors group-hover:bg-terminal-surface">
        <TerminalStage>{entry.preview}</TerminalStage>
      </div>
      {/* Label bar follows the page theme so the metadata is legible
          in both light and dark mode. */}
      <div className="px-5 py-4 bg-canvas hairline-t flex items-baseline justify-between gap-4 min-w-0">
        <div className="flex flex-col min-w-0">
          <span className="font-mono text-sm text-fg tracking-tight truncate">
            {entry.name}
          </span>
          <span className="text-xs text-muted truncate">
            {entry.description}
          </span>
        </div>
        <span className="font-mono text-[10px] text-subtle uppercase tracking-[0.2em] whitespace-nowrap">
          {CATEGORIES[entry.category].label}
        </span>
      </div>
    </Link>
  )
}
