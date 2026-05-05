'use client'

import { useRef } from 'react'

const COMMAND = 'npx caret init my-cli'

export function Cta() {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  /**
   * Aynı kopyalama mantığı CodeBlock'taki gibi: clipboard'a yaz, sonra
   * `caret:toast` CustomEvent'i fırlat (ToastHost zaten body'de dinliyor).
   * Sesi caret.acs hallediyor — bu buton .code-copy / aria-label="Copy"
   * selector'larıyla `caret-commit` preset'ine bağlı, ek bir binding
   * gerekmiyor.
   */
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(COMMAND)
      window.dispatchEvent(
        new CustomEvent('caret:toast', { detail: 'Copied to clipboard' }),
      )
      if (timer.current) clearTimeout(timer.current)
    } catch {
      window.dispatchEvent(
        new CustomEvent('caret:toast', {
          detail: 'Copy failed — clipboard not available',
        }),
      )
    }
  }

  return (
    <section
      id="cta"
      className="py-32 flex flex-col items-center justify-center text-center gap-10"
    >
      <h2 className="text-4xl md:text-6xl font-light tracking-tightest text-fg max-w-3xl leading-[1.05]">
        Give your CLI a design language
        <span className="text-accent">.</span>
      </h2>

      <div className="flex flex-col items-center gap-6">
        <button
          type="button"
          onClick={onCopy}
          aria-label="Copy npx caret init my-cli command"
          className="code-copy group bg-surface border border-hairline flex items-center gap-4 pl-5 pr-2 py-2 rounded-full hover:border-accent transition-colors cursor-copy"
        >
          <span className="font-mono text-sm text-fg">
            <span className="text-accent mr-3">$</span>
            {COMMAND}
          </span>
          <span className="bg-canvas border border-hairline text-muted p-1.5 rounded-full group-hover:text-accent group-hover:border-accent transition-colors">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </span>
        </button>

        <a
          href="https://github.com/Grkmyldz148/caret#principles"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted text-sm border-b border-transparent hover:border-muted hover:text-fg transition-all pb-0.5"
        >
          Read the manifesto →
        </a>
      </div>
    </section>
  )
}
