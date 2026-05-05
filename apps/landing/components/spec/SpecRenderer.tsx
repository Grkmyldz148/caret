import type { SpecEntry } from '@/lib/spec-data'

/**
 * Markdown-flavored renderer for one Caret spec. Reuses the same
 * tablet/code/text block parser that the previous flat /spec page
 * had, but lays out a single component on a generous, readable page
 * instead of stacking 58 of them on top of each other.
 */

function CodeBlock({ content }: { content: string }) {
  return (
    <pre className="bg-surface border border-hairline rounded-lg px-4 py-3 text-xs font-mono text-muted overflow-x-auto leading-relaxed">
      {content}
    </pre>
  )
}

function MarkdownTable({ content }: { content: string }) {
  const lines = content.split('\n').filter((l) => l.trim() !== '')
  if (lines.length < 2) return <p className="text-sm text-muted">{content}</p>

  const headerCells = lines[0]!
    .split('|')
    .map((c) => c.trim())
    .filter(Boolean)

  const rows = lines.slice(2).map((line) =>
    line
      .split('|')
      .map((c) => c.trim())
      .filter(Boolean),
  )

  return (
    <div className="my-4 border border-hairline rounded-md overflow-hidden">
      <table className="text-[13px] font-mono w-full border-collapse">
        <thead className="bg-surface">
          <tr className="border-b border-hairline">
            {headerCells.map((cell, i) => (
              <th
                key={i}
                className="text-left px-4 py-2.5 text-muted text-[11px] uppercase tracking-[0.18em] font-medium"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className={ri < rows.length - 1 ? 'border-b border-hairline' : undefined}
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={
                    ci === 0
                      ? 'px-4 py-2 text-fg'
                      : 'px-4 py-2 text-muted'
                  }
                >
                  {renderInlineCode(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function renderInlineCode(text: string) {
  const parts = text.split(/(`[^`]+`)/)
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className="text-fg bg-surface border border-hairline px-1.5 py-0.5 rounded text-[12px] font-mono"
        >
          {part.slice(1, -1)}
        </code>
      )
    }
    return <span key={i}>{part}</span>
  })
}

function SectionContent({ content }: { content: string }) {
  type Block = { type: 'code' | 'table' | 'text'; content: string }
  const blocks: Block[] = []
  const lines = content.split('\n')
  let i = 0

  while (i < lines.length) {
    const line = lines[i]!

    if (line.startsWith('```')) {
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i]!.startsWith('```')) {
        codeLines.push(lines[i]!)
        i++
      }
      i++
      blocks.push({ type: 'code', content: codeLines.join('\n') })
      continue
    }

    if (line.startsWith('|')) {
      const tableLines: string[] = []
      while (i < lines.length && lines[i]!.startsWith('|')) {
        tableLines.push(lines[i]!)
        i++
      }
      blocks.push({ type: 'table', content: tableLines.join('\n') })
      continue
    }

    if (line.trim() !== '') {
      const textLines: string[] = []
      while (
        i < lines.length &&
        !lines[i]!.startsWith('```') &&
        !lines[i]!.startsWith('|') &&
        lines[i]!.trim() !== ''
      ) {
        textLines.push(lines[i]!)
        i++
      }
      blocks.push({ type: 'text', content: textLines.join('\n') })
      continue
    }

    i++
  }

  return (
    <div className="space-y-4">
      {blocks.map((block, idx) => {
        if (block.type === 'code') return <CodeBlock key={idx} content={block.content} />
        if (block.type === 'table') return <MarkdownTable key={idx} content={block.content} />
        return (
          <div key={idx} className="text-[15px] text-muted leading-relaxed">
            {block.content.split('\n').map((line, li) => {
              if (line.startsWith('**')) {
                const match = line.match(/^\*\*(.+?)\*\*(.*)/)
                if (match) {
                  return (
                    <p key={li} className="mt-3">
                      <strong className="text-fg font-medium">{match[1]}</strong>
                      <span>{' '}{renderInlineCode(match[2]!)}</span>
                    </p>
                  )
                }
              }
              if (line.startsWith('- ')) {
                return (
                  <p key={li} className="pl-5 relative">
                    <span className="absolute left-0 text-accent font-mono text-xs top-[3px]">
                      ▸
                    </span>
                    {renderInlineCode(line.slice(2))}
                  </p>
                )
              }
              return <p key={li}>{renderInlineCode(line)}</p>
            })}
          </div>
        )
      })}
    </div>
  )
}

export function SpecRenderer({ spec }: { spec: SpecEntry }) {
  const KIND_LABEL: Record<string, string> = {
    interactive: 'Interactive',
    display: 'Display',
    utility: 'Utility',
    other: 'Reference',
  }

  return (
    <article data-doc-main className="min-w-0 pt-10">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-3">
        {KIND_LABEL[spec.kind] ?? 'Spec'} · {spec.slug}
      </div>
      <h1 className="text-[clamp(2rem,3.5vw+1rem,3rem)] font-light tracking-tightest leading-[1.05] mb-3">
        {spec.title}
      </h1>
      {spec.description !== '' && (
        <p className="text-[17px] text-muted leading-relaxed max-w-2xl mb-12">
          {spec.description}
        </p>
      )}

      <div className="max-w-2xl flex flex-col gap-12">
        {spec.sections.map((section) => {
          const id = section.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
          return (
            <section key={section.heading}>
              <h2
                id={id}
                className="text-2xl font-medium tracking-tight mb-4 scroll-mt-20"
              >
                {section.heading}
              </h2>
              <SectionContent content={section.content} />
            </section>
          )
        })}
      </div>
    </article>
  )
}
