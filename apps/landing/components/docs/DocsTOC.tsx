'use client'

import { useEffect, useState } from 'react'

type Heading = { id: string; level: 2 | 3; text: string }

/**
 * Right-rail "On this page" TOC.
 *
 * Reads h2 / h3 elements from the doc's main column on mount,
 * highlights the one closest to the top of the viewport, and
 * smooth-scrolls when clicked.
 */
export function DocsTOC() {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const container = document.querySelector('[data-doc-main]')
    if (!container) return

    const nodes = Array.from(
      container.querySelectorAll<HTMLElement>('h2[id], h3[id]'),
    )
    const list: Heading[] = nodes.map((el) => ({
      id: el.id,
      level: el.tagName === 'H2' ? 2 : 3,
      text: el.textContent ?? '',
    }))
    setHeadings(list)

    if (list.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // The active heading is the most recent one above the
        // viewport's top quarter. Track all that have crossed.
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          // Take the topmost intersecting heading.
          const top = visible.reduce((prev, curr) =>
            curr.boundingClientRect.top < prev.boundingClientRect.top
              ? curr
              : prev,
          )
          setActive(top.target.id)
        }
      },
      {
        rootMargin: '-80px 0px -70% 0px',
        threshold: 0,
      },
    )

    nodes.forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [])

  if (headings.length === 0) return null

  return (
    <nav
      className="text-sm flex flex-col gap-3 pt-10 pb-16"
      aria-label="On this page"
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
        On this page
      </div>
      <ul className="flex flex-col gap-1.5">
        {headings.map((h) => {
          const isActive = h.id === active
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className={
                  (isActive ? 'text-accent ' : 'text-muted hover:text-fg ') +
                  (h.level === 3 ? 'pl-4 ' : '') +
                  'block py-1 transition-colors leading-snug'
                }
              >
                {h.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
