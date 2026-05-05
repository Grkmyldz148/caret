'use client'

import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

/**
 * Generic ⌘K palette. Three variants share UI + keyboard logic;
 * each call site supplies its own dataset.
 *
 *   - Docs:       components/DocsSearch.tsx
 *   - Spec:       components/SpecSearch.tsx
 *   - Components: components/ComponentsSearch.tsx
 *
 * Trigger pill is rendered identically across the site so the
 * affordance is consistent regardless of section.
 */
export type SearchEntry = {
  /** Bold primary line. */
  title: string
  /** Dim breadcrumb shown after the title — usually section · context. */
  section: string
  /** Body sentence shown when the entry is the active result. */
  description: string
  /** Where the entry navigates on click / Enter. */
  href: string
}

const KEY = '⌘K'

function isMac(): boolean {
  if (typeof navigator === 'undefined') return false
  return /Mac|iPod|iPhone|iPad/.test(navigator.platform)
}

function score(entry: SearchEntry, q: string): number {
  if (q === '') return 1
  const Q = q.toLowerCase()
  const t = entry.title.toLowerCase()
  const s = entry.section.toLowerCase()
  const d = entry.description.toLowerCase()
  let n = 0
  if (t.startsWith(Q)) n += 100
  else if (t.includes(Q)) n += 60
  if (s.includes(Q)) n += 25
  if (d.includes(Q)) n += 10
  return n
}

export function SearchPalette({
  dataset,
  triggerLabel,
  placeholder,
  ariaLabel,
}: {
  dataset: readonly SearchEntry[]
  /** Visible label inside the trigger pill. */
  triggerLabel: string
  /** Input placeholder text. */
  placeholder: string
  /** Aria label for both trigger and dialog. */
  ariaLabel: string
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [mac, setMac] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const listRef = useRef<HTMLUListElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    setMac(isMac())
  }, [])

  // ⌘K / Ctrl+K toggle.
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      } else if (e.key === 'Escape' && open) {
        e.preventDefault()
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Lock body scroll while open + focus the input.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => inputRef.current?.focus(), 0)
    return () => {
      document.body.style.overflow = prev
      clearTimeout(t)
      triggerRef.current?.focus()
    }
  }, [open])

  // Reset active index whenever the query changes.
  useEffect(() => {
    setActive(0)
  }, [query])

  const results = useMemo(() => {
    const q = query.trim()
    return dataset
      .map((e) => ({ entry: e, n: score(e, q) }))
      .filter((x) => x.n > 0)
      .sort((a, b) => b.n - a.n)
      .slice(0, 12)
      .map((x) => x.entry)
  }, [query, dataset])

  // Scroll the active item into view when it changes.
  useEffect(() => {
    if (!open) return
    const el = listRef.current?.children[active] as HTMLElement | undefined
    el?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  const onInputKey = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActive((i) => Math.min(results.length - 1, i + 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActive((i) => Math.max(0, i - 1))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const r = results[active]
        if (r) {
          setOpen(false)
          window.location.href = r.href
        }
      }
    },
    [active, results],
  )

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={ariaLabel}
        className="hidden md:flex items-center gap-3 h-8 pl-3 pr-1.5 rounded-md border border-hairline-strong text-muted hover:text-fg hover:border-accent transition-colors text-xs min-w-[180px]"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20L17 17" />
        </svg>
        <span className="flex-1 text-left">{triggerLabel}</span>
        <kbd className="font-mono text-[10px] tracking-wider text-subtle border border-hairline rounded px-1.5 py-0.5">
          {mac ? KEY : 'Ctrl K'}
        </kbd>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4"
        >
          <div
            className="absolute inset-0 surface-translucent"
            onClick={() => setOpen(false)}
            aria-hidden
          />

          <div className="relative w-full max-w-xl bg-surface border border-hairline-strong rounded-xl overflow-hidden shadow-2xl">
            <div className="flex items-center gap-3 px-4 h-12 hairline-b">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted"
                aria-hidden
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20L17 17" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                placeholder={placeholder}
                className="flex-1 bg-transparent outline-none text-fg text-[15px] placeholder:text-subtle"
                autoComplete="off"
                spellCheck={false}
              />
              <kbd className="font-mono text-[10px] tracking-wider text-subtle border border-hairline rounded px-1.5 py-0.5">
                ESC
              </kbd>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {results.length === 0 ? (
                <div className="px-4 py-10 text-center text-muted text-sm">
                  No results for{' '}
                  <span className="font-mono text-fg">{query}</span>
                </div>
              ) : (
                <ul ref={listRef} role="listbox" className="py-1">
                  {results.map((r, i) => {
                    const isActive = i === active
                    return (
                      <li
                        key={r.href}
                        role="option"
                        aria-selected={isActive}
                        onMouseEnter={() => setActive(i)}
                        onClick={() => {
                          setOpen(false)
                          window.location.href = r.href
                        }}
                        className={
                          'mx-1 px-3 py-2 rounded-md cursor-pointer transition-colors ' +
                          (isActive
                            ? 'bg-canvas border border-hairline-strong'
                            : 'border border-transparent')
                        }
                      >
                        <div className="flex items-baseline gap-3">
                          <span
                            className={
                              'font-mono text-base leading-none mt-0.5 ' +
                              (isActive ? 'text-accent' : 'text-subtle')
                            }
                            aria-hidden
                          >
                            ^
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span
                                className={
                                  'text-sm font-medium ' +
                                  (isActive ? 'text-fg' : 'text-muted')
                                }
                              >
                                {r.title}
                              </span>
                              <span className="text-[11px] font-mono text-subtle uppercase tracking-[0.15em]">
                                {r.section}
                              </span>
                            </div>
                            {isActive && (
                              <div className="text-[13px] text-muted leading-snug mt-1 line-clamp-2">
                                {r.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            <div className="hairline-t flex items-center gap-4 px-4 h-9 text-[11px] font-mono text-subtle">
              <span className="flex items-center gap-1.5">
                <kbd className="border border-hairline rounded px-1 py-0.5">↑↓</kbd>
                <span>navigate</span>
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="border border-hairline rounded px-1 py-0.5">↵</kbd>
                <span>open</span>
              </span>
              <span className="flex items-center gap-1.5 ml-auto">
                <kbd className="border border-hairline rounded px-1 py-0.5">esc</kbd>
                <span>close</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
