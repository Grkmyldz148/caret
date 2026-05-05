'use client'

import { useRef, useState } from 'react'
import { HighlightedCode } from './highlight'

/**
 * Pick a tokenizer language from `language` or by sniffing the
 * filename extension. Defaults to plain text — every other case
 * gracefully degrades to the no-highlight path.
 */
function inferLang(filename?: string, language?: string): string {
  if (language) return language.toLowerCase()
  if (!filename) return 'text'
  const m = /\.([a-z0-9]+)$/i.exec(filename)
  if (!m) return 'text'
  const ext = m[1]!.toLowerCase()
  if (ext === 'mjs' || ext === 'cjs') return 'js'
  return ext
}

/**
 * Code block for docs prose.
 *
 * Uses page-themed surface tokens (not the terminal-* family) — these
 * are reference snippets, not previews of a terminal. The optional
 * filename / language label sits in a hairline-bordered chrome bar.
 *
 * The copy-to-clipboard button hovers in the top-right; clicking it
 * dispatches a global `caret:toast` CustomEvent that the singleton
 * <ToastHost /> at the body level catches and renders.
 */
export function CodeBlock({
  children,
  language,
  filename,
}: {
  children: string
  language?: string
  filename?: string
}) {
  const label = filename ?? language
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(children)
      setCopied(true)
      window.dispatchEvent(
        new CustomEvent('caret:toast', { detail: 'Copied to clipboard' }),
      )
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 1500)
    } catch {
      window.dispatchEvent(
        new CustomEvent('caret:toast', {
          detail: 'Copy failed — clipboard not available',
        }),
      )
    }
  }

  /**
   * Two layouts depending on whether a filename / language label is
   * present:
   *
   *   - With label  → chrome bar at the top: label on the left, copy
   *     button on the right of the same row.
   *   - Without label → copy button floats top-right of the pre, fades
   *     in on hover.
   */
  const copyIcon = copied ? (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-success"
      aria-hidden
    >
      <path d="M5 12l5 5L20 7" />
    </svg>
  ) : (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2" />
    </svg>
  )

  return (
    <div className="my-6 bg-surface border border-hairline rounded-md overflow-hidden relative group">
      {label !== undefined ? (
        <div className="flex items-center justify-between pl-4 pr-2 h-9 hairline-b">
          <span className="text-[11px] font-mono text-muted uppercase tracking-[0.18em]">
            {label}
          </span>
          <button
            type="button"
            onClick={onCopy}
            aria-label="Copy code"
            title={copied ? 'Copied' : 'Copy'}
            className="h-7 w-7 flex items-center justify-center rounded text-muted hover:text-fg hover:bg-canvas transition-colors"
          >
            {copyIcon}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onCopy}
          aria-label="Copy code"
          title={copied ? 'Copied' : 'Copy'}
          className="absolute top-2 right-2 z-10 h-8 w-8 flex items-center justify-center rounded-md border border-hairline-strong text-muted hover:text-fg hover:border-accent bg-surface opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
        >
          {copyIcon}
        </button>
      )}

      <pre className="font-mono text-[13px] leading-[1.6] p-4 overflow-x-auto text-fg whitespace-pre">
        {/*
          Reset every chip-style utility Prose's [&_code] selector
          would otherwise apply to this <code>. Without ! the parent
          rule wins on specificity and each visual line gets its own
          top+bottom border (the inline-border-fragment quirk).
        */}
        <code className="!bg-transparent !border-0 !rounded-none !p-0 !text-[13px]">
          <HighlightedCode
            code={children}
            lang={inferLang(filename, language)}
          />
        </code>
      </pre>
    </div>
  )
}
