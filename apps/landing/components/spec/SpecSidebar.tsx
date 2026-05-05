'use client'

import { usePathname } from 'next/navigation'

type Item = { slug: string; title: string }
type Group = { kind: string; label: string; items: Item[] }

export function SpecSidebar({ groups }: { groups: Group[] }) {
  const pathname = usePathname()

  return (
    <nav
      className="text-sm flex flex-col gap-8 pt-10 pb-16"
      aria-label="Spec navigation"
    >
      <a
        href="/spec"
        className={
          pathname === '/spec'
            ? 'block py-1.5 -ml-3 pl-3 border-l border-accent text-accent text-sm'
            : 'block py-1.5 -ml-3 pl-3 border-l border-transparent text-muted hover:text-fg hover:border-hairline-strong transition-colors text-sm'
        }
      >
        Index
      </a>

      {groups.map((g) => (
        <div key={g.kind} className="flex flex-col gap-2">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle pb-1">
            {g.label}
          </div>
          <ul className="flex flex-col">
            {g.items.map((item) => {
              const href = `/spec/${item.slug}`
              const active = pathname === href
              return (
                <li key={item.slug}>
                  <a
                    href={href}
                    className={
                      active
                        ? 'block py-1.5 -ml-3 pl-3 border-l border-accent text-accent'
                        : 'block py-1.5 -ml-3 pl-3 border-l border-transparent text-muted hover:text-fg hover:border-hairline-strong transition-colors'
                    }
                    title={item.title}
                  >
                    {item.slug}
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
