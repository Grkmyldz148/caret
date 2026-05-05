'use client'

import { useEffect, useRef, useState } from 'react'
import { CaretMark } from '@/components/CaretMark'
import { DocsSearch } from '@/components/DocsSearch'
import { ThemeToggle } from '@/components/ThemeToggle'

const LINKS = [
  { label: 'Docs', href: '/docs' },
  { label: 'Components', href: '/components' },
  { label: 'Spec', href: '/spec' },
  { label: 'GitHub', href: 'https://github.com/Grkmyldz148/caret' },
] as const

/**
 * Scroll-direction-aware sticky header.
 *
 *   - At the top (< 80px scroll) → always visible.
 *   - Scrolling down past the threshold → slide up out of view.
 *   - Scrolling up by any amount → slide back in.
 *
 * Scroll listener is attached once, runs on every scroll under
 * `passive: true` so it never blocks. State updates are minimal —
 * we only call setHidden when the value actually flips.
 */
export function Nav({ showSearch = false }: { showSearch?: boolean }) {
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    lastY.current = window.scrollY

    const onScroll = () => {
      const y = window.scrollY
      const delta = y - lastY.current

      // Tiny jitter (sub-4px wheel/trackpad noise) shouldn't toggle.
      if (Math.abs(delta) < 4) {
        lastY.current = y
        return
      }

      if (y < 80) {
        setHidden(false)
      } else if (delta > 0) {
        // Scrolling down past the threshold.
        setHidden(true)
      } else {
        // Scrolling up.
        setHidden(false)
      }
      lastY.current = y
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={[
        'sticky top-0 z-50 surface-translucent backdrop-blur-sm hairline-b h-14',
        'flex items-center justify-between px-6 lg:px-12 text-sm',
        'transition-transform duration-200 ease-out',
        hidden ? '-translate-y-full' : 'translate-y-0',
      ].join(' ')}
    >
      <a href="/" className="flex items-center gap-2.5 w-1/3" aria-label="Caret">
        <CaretMark className="text-accent" size={22} />
        <span className="font-medium tracking-tight">Caret</span>
      </a>

      <div className="hidden md:flex items-center justify-center gap-8 w-1/3 text-muted">
        {LINKS.map((l) => (
          <a
            key={l.label}
            href={l.href}
            className="hover:text-fg transition-colors"
          >
            {l.label}
          </a>
        ))}
      </div>

      <div className="flex items-center justify-end w-1/3 gap-3">
        {showSearch && <DocsSearch />}
        <ThemeToggle />
        <a
          href="#cta"
          className="font-mono text-xs text-fg border border-hairline-strong px-3 py-1.5 rounded-full flex items-center gap-2 hover:border-accent hover:text-accent transition-colors"
        >
          <span className="text-accent">$</span> npx caret init
        </a>
      </div>
    </nav>
  )
}
