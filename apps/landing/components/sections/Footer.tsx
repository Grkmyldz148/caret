import { CaretMark } from '@/components/CaretMark'

const COLUMNS = [
  {
    heading: 'System',
    links: ['Components', 'Tokens', 'Spec'],
  },
  {
    heading: 'Resources',
    links: ['Documentation', 'GitHub', 'Changelog', 'Roadmap'],
  },
  {
    heading: 'Community',
    links: ['Discord', 'X (Twitter)', 'Bluesky'],
  },
] as const

export function Footer() {
  return (
    <footer className="hairline-t pt-16 pb-8 px-6 lg:px-12 text-sm text-muted">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5 text-fg">
            <CaretMark className="text-accent" size={20} />
            <span className="font-medium tracking-tight">Caret</span>
          </div>
          <p className="text-xs leading-relaxed max-w-[220px]">
            The copy-paste design system for modern command-line tools.
          </p>
          <p className="mt-4 font-mono text-[10px] text-subtle uppercase tracking-[0.2em]">
            Color system powered by{' '}
            <a
              href="https://helmlab.space"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-accent transition-colors"
            >
              Helmlab
            </a>
          </p>
          <p className="font-mono text-[10px] text-subtle uppercase tracking-[0.2em]">
            Sound layer by{' '}
            <a
              href="https://www.audiocss.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-accent transition-colors"
            >
              ACS
            </a>
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.heading} className="flex flex-col gap-3">
            <h4 className="text-fg font-medium tracking-tight mb-2">
              {col.heading}
            </h4>
            {col.links.map((l) => (
              <a key={l} href="#" className="hover:text-fg transition-colors">
                {l}
              </a>
            ))}
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto hairline-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
        <p>Caret is in active design. Nothing is released yet.</p>
        <p className="flex items-center gap-4">
          <span>MIT License</span>
          <span className="text-hairline-strong">·</span>
          <span>© 2026</span>
        </p>
      </div>
    </footer>
  )
}
