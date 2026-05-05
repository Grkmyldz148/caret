import { CaretMark } from '@/components/CaretMark'

const COLUMNS = [
  {
    heading: 'System',
    links: [
      { label: 'Components', href: '/components' },
      { label: 'Spec', href: '/spec' },
      { label: 'Docs', href: '/docs' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/Grkmyldz148/caret',
        external: true,
      },
      {
        label: 'caret-cli on npm',
        href: 'https://www.npmjs.com/package/caret-cli',
        external: true,
      },
      {
        label: 'Changelog',
        href: 'https://github.com/Grkmyldz148/caret/blob/main/packages/caret/CHANGELOG.md',
        external: true,
      },
    ],
  },
  {
    heading: 'Skills',
    links: [
      {
        label: 'caret-skills',
        href: 'https://github.com/Grkmyldz148/caret-skills',
        external: true,
      },
    ],
  },
] as const

export function Footer() {
  return (
    <footer
      className="hairline-t pt-16 px-6 lg:px-12 text-sm text-muted"
      style={{
        paddingBottom: 'max(2rem, env(safe-area-inset-bottom, 2rem))',
      }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-12 md:mb-16">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5 text-fg">
            <CaretMark className="text-accent" size={20} />
            <span className="font-medium tracking-tight">Caret</span>
          </div>
          <p className="text-xs leading-relaxed max-w-[220px]">
            A design system for modern command-line tools. In active design.
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
              <a
                key={l.label}
                href={l.href}
                target={'external' in l && l.external ? '_blank' : undefined}
                rel={'external' in l && l.external ? 'noopener noreferrer' : undefined}
                className="hover:text-fg transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto hairline-t pt-6 md:pt-8 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-3 font-mono text-[11px] md:text-xs text-center md:text-left">
        <p>
          Made by{' '}
          <a
            href="https://gorkemyildiz.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg hover:text-accent transition-colors"
          >
            Görkem Yıldız
          </a>
        </p>
        <p className="flex items-center gap-4">
          <span>MIT License</span>
          <span className="text-hairline-strong">·</span>
          <span>© 2026</span>
        </p>
      </div>
    </footer>
  )
}
