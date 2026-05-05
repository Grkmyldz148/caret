import type { ReactNode } from 'react'

export { CodeBlock } from './CodeBlock'

/**
 * Typography-locked wrapper for docs prose. Mirrors the landing's
 * vocabulary: light heads with tight tracking, hairline rules,
 * accent on links, mono inline code with a thin gutter.
 */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div
      className={[
        'max-w-2xl text-fg',
        // Headings
        '[&_h1]:text-[clamp(2rem,3.5vw+1rem,3rem)] [&_h1]:font-light [&_h1]:tracking-tightest [&_h1]:leading-[1.05] [&_h1]:mb-4 [&_h1]:mt-2',
        '[&_h2]:text-2xl [&_h2]:font-medium [&_h2]:tracking-tight [&_h2]:mt-12 [&_h2]:mb-3 [&_h2]:scroll-mt-20',
        '[&_h3]:text-lg [&_h3]:font-medium [&_h3]:tracking-tight [&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:scroll-mt-20',
        // Paragraphs
        '[&_p]:text-[15px] [&_p]:leading-relaxed [&_p]:text-muted [&_p]:my-4',
        // Strong
        '[&_strong]:text-fg [&_strong]:font-medium',
        // Inline code — applied to <code> only when NOT inside a <pre>.
        // The inline-border quirk on multi-line <pre><code> draws
        // separate top+bottom borders on every wrapped line fragment;
        // CodeBlock's own pre><code> resets these via !-prefixed
        // utilities below.
        '[&_code]:font-mono [&_code]:text-[13px] [&_code]:text-fg [&_code]:bg-surface [&_code]:border [&_code]:border-hairline [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5',
        // Links
        '[&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-hairline-strong hover:[&_a]:decoration-accent',
        // Lists
        '[&_ul]:my-4 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:list-none',
        '[&_li]:text-[15px] [&_li]:text-muted [&_li]:leading-relaxed [&_li]:pl-5 [&_li]:relative',
        '[&_ul>li]:before:content-["▸"] [&_ul>li]:before:absolute [&_ul>li]:before:left-0 [&_ul>li]:before:text-accent [&_ul>li]:before:font-mono [&_ul>li]:before:text-[12px] [&_ul>li]:before:top-[2px]',
        '[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6',
        // Blockquote
        '[&_blockquote]:border-l [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:text-fg [&_blockquote]:italic [&_blockquote]:my-6',
        // Horizontal rule
        '[&_hr]:my-12 [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-hairline',
        // Note: <pre> styling is owned by CodeBlock, not the global
        // selector — putting bg/border/padding here would double-wrap
        // every <CodeBlock> in a nested card.
      ].join(' ')}
    >
      {children}
    </div>
  )
}

/**
 * Inline highlight box used for callouts. `kind` mirrors Caret's
 * semantic palette so future variants reuse the same vocabulary.
 */
export function Callout({
  kind = 'info',
  title,
  children,
}: {
  kind?: 'info' | 'warning' | 'success'
  title?: string
  children: ReactNode
}) {
  const palette = {
    info: 'border-info text-info',
    warning: 'border-warning text-warning',
    success: 'border-success text-success',
  }[kind]
  const symbol = { info: 'ℹ', warning: '⚠', success: '✓' }[kind]
  return (
    <div className={`my-6 border-l ${palette} pl-4 py-1`}>
      {title !== undefined && (
        <div className={`flex items-center gap-2 font-mono text-xs ${palette}`}>
          <span>{symbol}</span>
          <span className="uppercase tracking-[0.18em]">{title}</span>
        </div>
      )}
      <div className="text-[15px] text-fg leading-relaxed mt-1">{children}</div>
    </div>
  )
}

/**
 * Reference table. Two- or three-column rows.
 */
export function PropTable({
  rows,
  headers = ['Property', 'Type', 'Description'],
}: {
  rows: Array<Array<string | ReactNode>>
  headers?: string[]
}) {
  return (
    <div className="my-6 border border-hairline rounded-md overflow-hidden">
      <table className="w-full text-[14px] text-fg">
        <thead className="bg-surface hairline-b">
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="text-left px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={i < rows.length - 1 ? 'hairline-b' : undefined}
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={
                    j === 0
                      ? 'px-4 py-2.5 align-top font-mono text-[13px] text-fg'
                      : 'px-4 py-2.5 align-top text-muted'
                  }
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
