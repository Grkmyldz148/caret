'use client'

import { usePathname } from 'next/navigation'
import { DOCS_NAV } from '@/lib/docs-nav'

export function DocsSidebar() {
  const pathname = usePathname()

  return (
    <nav
      className="text-sm flex flex-col gap-8 pt-10 pb-16"
      aria-label="Docs navigation"
    >
      {DOCS_NAV.map((section) => (
        <div key={section.label} className="flex flex-col gap-2">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle pb-1">
            {section.label}
          </div>
          <ul className="flex flex-col">
            {section.items.map((item) => {
              const isActive = item.href === pathname

              if (item.soon || !item.href) {
                return (
                  <li key={item.label}>
                    <span
                      className="flex items-center gap-2 py-1.5 -ml-3 pl-3 text-subtle cursor-not-allowed"
                      aria-disabled
                    >
                      <span>{item.label}</span>
                      <span
                        aria-hidden
                        className="ml-auto inline-block w-1 h-1 rounded-full bg-subtle"
                        title="Coming soon"
                      />
                    </span>
                  </li>
                )
              }

              return (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className={
                      isActive
                        ? 'block py-1.5 -ml-3 pl-3 border-l border-accent text-accent'
                        : 'block py-1.5 -ml-3 pl-3 border-l border-transparent text-muted hover:text-fg hover:border-hairline-strong transition-colors'
                    }
                  >
                    {item.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
