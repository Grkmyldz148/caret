import { TerminalStage } from '@/components/terminal'
import { CATEGORIES, type CatalogEntry } from '@/lib/component-catalog'

/**
 * CatalogCard — one tile in the /components catalog.
 *
 * The whole card becomes a single hover surface. All rendering and
 * micro-interaction replay is delegated to <TerminalStage/>, which runs
 * the Caret component's own animations (not a custom reveal).
 */
export function CatalogCard({ entry }: { entry: CatalogEntry }) {
  return (
    <article
      id={entry.slug}
      className="catalog-card group relative flex flex-col bg-terminal-canvas min-h-[280px] overflow-hidden transition-colors hover:bg-terminal-surface"
    >
      <div className="flex-1 flex items-center px-5 py-8 overflow-hidden">
        <TerminalStage>{entry.preview}</TerminalStage>
      </div>
      <div className="px-5 py-4 hairline-t flex items-baseline justify-between gap-4 min-w-0">
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
    </article>
  )
}
