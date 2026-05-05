'use client'

import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { CaretMark } from '@/components/CaretMark'
import { ThemeToggle } from '@/components/ThemeToggle'

const LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Docs', href: '/docs' },
  { label: 'Components', href: '/components' },
  { label: 'Spec', href: '/spec' },
  { label: 'GitHub', href: 'https://github.com/Grkmyldz148/caret' },
] as const

/**
 * Scroll-direction-aware sticky header with mobile drawer.
 *
 *   - At the top (< 80px scroll) → always visible.
 *   - Scrolling down past the threshold → slide up out of view.
 *   - Scrolling up by any amount → slide back in.
 *
 * On viewports below `md` (768 px), the link strip collapses behind a
 * hamburger button. The drawer drops directly under the nav bar so it
 * stays under the user's thumb on phones; clicking any item or the
 * scrim closes it.
 */
export function Nav({ search }: { search?: ReactNode }) {
  const [hidden, setHidden] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
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
        // Close the drawer when the nav slides away — otherwise it
        // looks orphaned.
        setMobileOpen(false)
      } else {
        // Scrolling up.
        setHidden(false)
      }
      lastY.current = y
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close drawer on Escape + lock body scroll while open.
  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [mobileOpen])

  return (
    <>
    <nav
      className={[
        'sticky top-0 z-50 surface-translucent backdrop-blur-sm hairline-b h-14',
        'flex items-center justify-between px-6 lg:px-12 text-sm',
        'transition-transform duration-200 ease-out',
        hidden ? '-translate-y-full' : 'translate-y-0',
      ].join(' ')}
    >
      <a
        href="/"
        className="flex items-center gap-2.5 md:w-1/3"
        aria-label="Caret"
      >
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

      <div className="flex items-center justify-end md:w-1/3 gap-3">
        {search}
        <ThemeToggle />

        {/* Hamburger — visible only on small screens. */}
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          className="md:hidden w-8 h-8 rounded-md border border-hairline-strong text-muted hover:text-fg hover:border-accent transition-colors flex items-center justify-center"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden
          >
            {mobileOpen ? (
              <>
                <path d="M6 6L18 18" />
                <path d="M18 6L6 18" />
              </>
            ) : (
              <>
                <path d="M4 7H20" />
                <path d="M4 12H20" />
                <path d="M4 17H20" />
              </>
            )}
          </svg>
        </button>
      </div>
    </nav>

    {/* Mobile drawer — rendered as a sibling of <nav>, NOT inside it.
        The nav has `transition-transform`, which makes any descendant
        with `position: fixed` get clipped to the nav's box instead of
        the viewport (CSS spec: a transformed ancestor becomes the
        containing block for fixed children). Keeping the drawer
        outside the nav restores true fixed-to-viewport positioning. */}
    {mobileOpen && (
      <div
        id="mobile-nav"
        className="md:hidden fixed left-0 right-0 top-14 bottom-0 z-40 bg-canvas overflow-y-auto"
      >
        <ul className="flex flex-col">
          {LINKS.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="block px-6 py-5 text-xl font-light text-fg hover:bg-surface hairline-b transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )}
    </>
  )
}
