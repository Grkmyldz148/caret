import type { ReactNode } from 'react'

/**
 * Terminal — a character-grid surface.
 *
 * Caret's golden rule: never touch the background. The web landing simulates
 * a dark terminal as a *stage*, but the Caret components inside don't emit a
 * background either — they only emit foreground color and attributes.
 *
 * Use <Terminal> for bare inline mockups in the flow of the page.
 * Use <TerminalWindow> for the hero / showcase chrome.
 */
export function Terminal({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`term text-terminal-fg ${className}`}
      role="img"
      aria-label="Terminal output"
    >
      {children}
    </div>
  )
}

export function TerminalWindow({
  children,
  title,
  className = '',
}: {
  children: ReactNode
  title?: string
  className?: string
}) {
  return (
    <div
      className={`bg-terminal-canvas border border-terminal-hairline rounded-xl overflow-hidden ${className}`}
    >
      <div className="flex items-center gap-2 h-9 px-4 border-b border-terminal-hairline bg-terminal-surface">
        <span className="w-2.5 h-2.5 rounded-full bg-terminal-hairline-strong" aria-hidden />
        <span className="w-2.5 h-2.5 rounded-full bg-terminal-hairline-strong" aria-hidden />
        <span className="w-2.5 h-2.5 rounded-full bg-terminal-hairline-strong" aria-hidden />
        {title && (
          <span className="flex-1 text-center font-mono text-[11px] text-terminal-subtle">
            {title}
          </span>
        )}
      </div>
      <div className="p-5">
        <Terminal>{children}</Terminal>
      </div>
    </div>
  )
}

/**
 * A single row in a terminal output.
 * Uses CSS grid / flex sparingly — `white-space: pre` on the parent
 * preserves the real character-cell alignment.
 */
export function Row({
  children,
  className = '',
}: {
  children?: ReactNode
  className?: string
}) {
  return <div className={className}>{children ?? '\u00a0'}</div>
}

/** ANSI `dim` — always via color, never opacity */
export function Dim({ children }: { children: ReactNode }) {
  return <span className="dim">{children}</span>
}

/** ANSI `bold` */
export function Bold({ children }: { children: ReactNode }) {
  return <span className="font-medium text-fg">{children}</span>
}

/** Accent — Caret's signature blue, the one allowed truecolor emission */
export function Accent({
  children,
  bold = false,
}: {
  children: ReactNode
  bold?: boolean
}) {
  return (
    <span className={bold ? 'text-accent font-medium' : 'text-accent'}>
      {children}
    </span>
  )
}

export function Danger({
  children,
  bold = false,
}: {
  children: ReactNode
  bold?: boolean
}) {
  return (
    <span className={bold ? 'text-danger font-medium' : 'text-danger'}>
      {children}
    </span>
  )
}

export function Success({
  children,
  bold = false,
}: {
  children: ReactNode
  bold?: boolean
}) {
  return (
    <span className={bold ? 'text-success font-medium' : 'text-success'}>
      {children}
    </span>
  )
}

export function Warning({
  children,
  bold = false,
}: {
  children: ReactNode
  bold?: boolean
}) {
  return (
    <span className={bold ? 'text-warning font-medium' : 'text-warning'}>
      {children}
    </span>
  )
}

export function Info({
  children,
  bold = false,
}: {
  children: ReactNode
  bold?: boolean
}) {
  return (
    <span className={bold ? 'text-info font-medium' : 'text-info'}>
      {children}
    </span>
  )
}
