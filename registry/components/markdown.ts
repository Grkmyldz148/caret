/**
 * Caret markdown component
 *
 * Renders a subset of GitHub-flavored markdown to the terminal using
 * Caret's editorial voice. Static — parses the input text, prints to
 * stdout once, returns synchronously.
 *
 *   markdown('# Hello\n\nThis is **bold** and `inline code`.')
 *
 * This is a deliberately SIMPLE, custom parser. We don't pull in remark
 * or marked because:
 *   1. The output is a terminal, not HTML — the AST would be overkill.
 *   2. Caret owns the visual language; we don't want a third-party
 *      transformer injecting its own assumptions.
 *   3. Keeping the parser small means it stays aligned with the
 *      manifesto (no background colors, no chrome, tracking CAPS for
 *      headings, dim frames for code blocks, etc).
 *
 * Block elements supported:
 *   - Headings (# through ####)
 *   - Horizontal rules (--- or ***)
 *   - Blockquotes (> ...)
 *   - Fenced code blocks (``` with optional language label)
 *   - Unordered lists (- or *) with 2-space nesting
 *   - Ordered lists (1. 2. 3.)
 *   - Paragraphs (word-wrapped)
 *
 * Inline transformations applied to each text line:
 *   - **bold** / __bold__       → paintBold
 *   - *italic* / _italic_       → chalk.italic
 *   - `inline code`             → dim backticks + accent bold
 *   - [text](url)               → underlined accent (OSC 8 when TTY)
 *   - ~~strikethrough~~         → chalk.strikethrough
 *   - \X                        → literal X (escape)
 *
 * Inline patterns never match inside code spans — the code span is
 * extracted first and re-inserted after the rest of the line has been
 * transformed.
 */

import chalk from 'chalk'
import { getTheme } from '../theme/global.js'
import { mergeTheme } from '../theme/merge.js'
import type { PartialTheme, Theme } from '../theme/types.js'
import { capability } from '../lib/capability.js'
import { paintAccent, paintBold, paintDim, visibleLength } from '../lib/paint.js'
import { tracking } from '../lib/typography.js'

export type MarkdownOptions = {
  /** Max width for word wrapping. Default: min(terminal columns, 80). */
  width?: number
  theme?: PartialTheme
}

export function markdown(text: string, options: MarkdownOptions = {}): void {
  const theme = mergeTheme(getTheme(), options.theme)
  const cap = capability()
  const width = Math.max(20, Math.min(options.width ?? 80, cap.columns))

  const blocks = parseBlocks(text)
  const out: string[] = []

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]!
    const prev = blocks[i - 1]
    const rendered = renderBlock(block, { theme, width })
    if (rendered.length === 0) continue

    // Block spacing — one blank line between adjacent blocks, except
    // when both are list items of the same variant (tight lists).
    if (out.length > 0 && prev && !isTightPair(prev, block)) {
      out.push('')
    }

    for (const line of rendered) out.push(line)
  }

  process.stdout.write(out.join('\n') + '\n')
}

// ─────────────────────────────────────────────────────────────
// Block parsing
// ─────────────────────────────────────────────────────────────

type Block =
  | { type: 'heading'; level: 1 | 2 | 3 | 4; text: string }
  | { type: 'rule' }
  | { type: 'quote'; lines: string[] }
  | { type: 'code'; language?: string; code: string }
  | { type: 'ulist'; items: ListEntry[] }
  | { type: 'olist'; items: ListEntry[] }
  | { type: 'paragraph'; text: string }

type ListEntry = { indent: number; text: string }

function parseBlocks(input: string): Block[] {
  // Normalise line endings, strip a single leading/trailing blank line
  // so callers can use template literals naturally.
  const text = input.replace(/\r\n/g, '\n').replace(/^\n/, '').replace(/\n$/, '')
  const lines = text.split('\n')
  const blocks: Block[] = []

  let i = 0
  while (i < lines.length) {
    const line = lines[i]!

    // Blank line — block separator
    if (line.trim() === '') {
      i++
      continue
    }

    // Fenced code block
    const fenceMatch = line.match(/^```(.*)$/)
    if (fenceMatch) {
      const language = fenceMatch[1]!.trim() || undefined
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i]!.match(/^```\s*$/)) {
        codeLines.push(lines[i]!)
        i++
      }
      // Skip closing fence if present
      if (i < lines.length) i++
      blocks.push({ type: 'code', language, code: codeLines.join('\n') })
      continue
    }

    // Horizontal rule — --- or *** (or ___)
    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      blocks.push({ type: 'rule' })
      i++
      continue
    }

    // Heading — # through ####
    const headingMatch = line.match(/^(#{1,4})\s+(.*)$/)
    if (headingMatch) {
      const level = headingMatch[1]!.length as 1 | 2 | 3 | 4
      blocks.push({ type: 'heading', level, text: headingMatch[2]!.trim() })
      i++
      continue
    }

    // Blockquote — consecutive lines starting with ">"
    if (/^>\s?/.test(line)) {
      const quoteLines: string[] = []
      while (i < lines.length && /^>\s?/.test(lines[i]!)) {
        quoteLines.push(lines[i]!.replace(/^>\s?/, ''))
        i++
      }
      blocks.push({ type: 'quote', lines: quoteLines })
      continue
    }

    // Unordered list — -/* at any indent, 2-space nesting
    if (/^(\s*)[-*]\s+/.test(line)) {
      const items: ListEntry[] = []
      while (i < lines.length) {
        const m = lines[i]!.match(/^(\s*)[-*]\s+(.*)$/)
        if (!m) break
        const indent = Math.floor(m[1]!.length / 2)
        items.push({ indent, text: m[2]! })
        i++
      }
      blocks.push({ type: 'ulist', items })
      continue
    }

    // Ordered list — N. at any indent
    if (/^(\s*)\d+\.\s+/.test(line)) {
      const items: ListEntry[] = []
      while (i < lines.length) {
        const m = lines[i]!.match(/^(\s*)\d+\.\s+(.*)$/)
        if (!m) break
        const indent = Math.floor(m[1]!.length / 2)
        items.push({ indent, text: m[2]! })
        i++
      }
      blocks.push({ type: 'olist', items })
      continue
    }

    // Paragraph — consecutive non-blank lines not matching any block
    const paraLines: string[] = [line]
    i++
    while (i < lines.length) {
      const next = lines[i]!
      if (
        next.trim() === '' ||
        /^#{1,4}\s+/.test(next) ||
        /^```/.test(next) ||
        /^>\s?/.test(next) ||
        /^(\s*)[-*]\s+/.test(next) ||
        /^(\s*)\d+\.\s+/.test(next) ||
        /^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(next)
      ) {
        break
      }
      paraLines.push(next)
      i++
    }
    blocks.push({ type: 'paragraph', text: paraLines.join(' ') })
  }

  return blocks
}

function isTightPair(a: Block, b: Block): boolean {
  // Adjacent list items of the same kind stay tight; everything else
  // gets a blank-line breather.
  return a.type === b.type && (a.type === 'ulist' || a.type === 'olist')
}

// ─────────────────────────────────────────────────────────────
// Block rendering
// ─────────────────────────────────────────────────────────────

type RenderCtx = { theme: Theme; width: number }

function renderBlock(block: Block, ctx: RenderCtx): string[] {
  switch (block.type) {
    case 'heading':
      return renderHeading(block.level, block.text, ctx)
    case 'rule':
      return renderRule(ctx)
    case 'quote':
      return renderQuote(block.lines, ctx)
    case 'code':
      return renderCode(block.code, block.language, ctx)
    case 'ulist':
      return renderUList(block.items, ctx)
    case 'olist':
      return renderOList(block.items, ctx)
    case 'paragraph':
      return renderParagraph(block.text, ctx)
  }
}

function renderHeading(level: 1 | 2 | 3 | 4, text: string, ctx: RenderCtx): string[] {
  const accent = paintAccent(ctx.theme)
  const bold = paintBold()
  const dim = paintDim()
  const inline = renderInline(text, ctx)

  if (level === 1) {
    // Display-like: tracked CAPS, accent bold
    const tracked = tracking(stripAnsi(text))
    return [accent.bold(tracked)]
  }
  if (level === 2) {
    // Section heading — tracked CAPS, accent
    const tracked = tracking(stripAnsi(text))
    return [accent(tracked)]
  }
  if (level === 3) {
    // Subsection — bold (no tracking; hierarchy comes from weight)
    return [bold(inline)]
  }
  // H4 — dim italic for the quietest level
  return [dim.italic(inline)]
}

function renderRule(ctx: RenderCtx): string[] {
  const dim = paintDim()
  const ch = ctx.theme.symbols.ruler
  return [dim(ch.repeat(ctx.width))]
}

function renderQuote(lines: string[], ctx: RenderCtx): string[] {
  const accent = paintAccent(ctx.theme)
  const gutter = accent(ctx.theme.symbols.structure.gutter)
  // Wrap each logical line to width - 2 (for gutter + space)
  const out: string[] = []
  const wrapWidth = Math.max(10, ctx.width - 2)
  const joined = lines.join(' ')
  const wrapped = wrap(renderInline(joined, ctx), wrapWidth)
  for (const line of wrapped) {
    out.push(`${gutter} ${line}`)
  }
  return out
}

function renderCode(code: string, language: string | undefined, ctx: RenderCtx): string[] {
  const accent = paintAccent(ctx.theme)
  const dim = paintDim()
  const ruler = ctx.theme.symbols.ruler

  const lines = code.replace(/^\n/, '').replace(/\n$/, '').split('\n')
  const longest = lines.reduce((acc, l) => Math.max(acc, visibleLength(l)), 0)
  // Rule width — same heuristic as code-block component, capped to ctx.width.
  const leftPad = 1
  const contentWidth = longest + leftPad
  const ruleWidth = Math.max(Math.min(contentWidth, ctx.width), 20)

  const out: string[] = []
  if (language !== undefined) {
    const label = ` ${language} `
    const remaining = Math.max(0, ruleWidth - 3 - visibleLength(label))
    out.push(dim(ruler.repeat(2)) + accent.bold(label) + dim(ruler.repeat(remaining)))
  } else {
    out.push(dim(ruler.repeat(ruleWidth)))
  }

  for (const line of lines) {
    out.push(' '.repeat(leftPad) + line)
  }

  out.push(dim(ruler.repeat(ruleWidth)))
  return out
}

function renderUList(items: ListEntry[], ctx: RenderCtx): string[] {
  const accent = paintAccent(ctx.theme)
  const bullet = ctx.theme.symbols.bullet
  const out: string[] = []
  for (const item of items) {
    const pad = '  '.repeat(item.indent)
    // Manifesto: two spaces between marker and text
    const rendered = renderInline(item.text, ctx)
    out.push(`${pad}${accent(bullet)}  ${rendered}`)
  }
  return out
}

function renderOList(items: ListEntry[], ctx: RenderCtx): string[] {
  const accent = paintAccent(ctx.theme)
  const out: string[] = []
  // Number per-indent-level so nested lists restart at 1.
  const counters: number[] = []
  for (const item of items) {
    counters.length = item.indent + 1
    for (let k = 0; k < counters.length; k++) {
      if (counters[k] === undefined) counters[k] = 0
    }
    counters[item.indent] = (counters[item.indent] ?? 0) + 1
    const pad = '  '.repeat(item.indent)
    const marker = `${counters[item.indent]}.`
    const rendered = renderInline(item.text, ctx)
    out.push(`${pad}${accent(marker)}  ${rendered}`)
  }
  return out
}

function renderParagraph(text: string, ctx: RenderCtx): string[] {
  const rendered = renderInline(text, ctx)
  return wrap(rendered, ctx.width)
}

// ─────────────────────────────────────────────────────────────
// Inline parser
// ─────────────────────────────────────────────────────────────

/**
 * Apply inline transformations to a text line.
 *
 * Strategy: walk the string character-by-character, extracting code
 * spans first (so nothing else matches inside them). For the remaining
 * segments, run each inline regex in a safe order.
 */
function renderInline(text: string, ctx: RenderCtx): string {
  const cap = capability()
  const accent = paintAccent(ctx.theme)
  const bold = paintBold()
  const dim = paintDim()

  // Placeholder-based pipeline: we extract code spans first, replace
  // each with a sentinel, transform the rest, then restore.
  const codeSpans: string[] = []
  const PLACEHOLDER = '\x00CODE\x00'

  let working = ''
  let i = 0
  while (i < text.length) {
    const ch = text[i]!
    // Escape: \X → literal X (preserved as-is, protected from later regexes
    // via a zero-width sentinel. We'll resolve sentinels at the end.)
    if (ch === '\\' && i + 1 < text.length) {
      working += `\x00E${text.charCodeAt(i + 1)}\x00`
      i += 2
      continue
    }
    // Code span — backtick-delimited
    if (ch === '`') {
      const end = text.indexOf('`', i + 1)
      if (end !== -1) {
        const inner = text.slice(i + 1, end)
        const rendered = cap.hasColor
          ? `${dim('`')}${accent.bold(inner)}${dim('`')}`
          : `\`${inner}\``
        codeSpans.push(rendered)
        working += PLACEHOLDER
        i = end + 1
        continue
      }
    }
    working += ch
    i++
  }

  // Links — [text](url). Render as accent underlined text (OSC 8 is
  // overkill here; the link component is for standalone calls).
  working = working.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label: string, _url: string) => {
    if (!cap.hasColor) return label
    return accent.underline(label)
  })

  // Strikethrough — ~~text~~
  working = working.replace(/~~([^~]+)~~/g, (_m, inner: string) => {
    if (!cap.hasColor) return inner
    return chalk.strikethrough(inner)
  })

  // Bold — **text** or __text__ (must run before single-char emphasis)
  working = working.replace(/\*\*([^*]+)\*\*/g, (_m, inner: string) => bold(inner))
  working = working.replace(/__([^_]+)__/g, (_m, inner: string) => bold(inner))

  // Italic — *text* or _text_
  working = working.replace(/(^|[^*])\*([^*\s][^*]*?)\*(?!\*)/g, (_m, pre: string, inner: string) => {
    if (!cap.hasColor) return pre + inner
    return pre + chalk.italic(inner)
  })
  working = working.replace(/(^|[^_\w])_([^_\s][^_]*?)_(?!_)/g, (_m, pre: string, inner: string) => {
    if (!cap.hasColor) return pre + inner
    return pre + chalk.italic(inner)
  })

  // Restore escapes
  working = working.replace(/\x00E(\d+)\x00/g, (_m, code: string) =>
    String.fromCharCode(parseInt(code, 10)),
  )

  // Restore code spans
  let idx = 0
  working = working.replace(new RegExp(PLACEHOLDER, 'g'), () => codeSpans[idx++] ?? '')

  return working
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

/** Strip ANSI escapes — used when we need the "raw" text (e.g. headings). */
function stripAnsi(text: string): string {
  return text.replace(/\x1b\[[0-9;]*m/g, '')
}

/**
 * Word-wrap a (possibly ANSI-decorated) string to `width` visible chars.
 *
 * We split on literal spaces. ANSI escapes within a word travel with
 * that word, so decorated words remain intact.
 */
function wrap(text: string, width: number): string[] {
  const paragraphs = text.split('\n')
  const out: string[] = []
  for (const para of paragraphs) {
    if (para === '') {
      out.push('')
      continue
    }
    const words = para.split(' ')
    let current = ''
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word
      if (visibleLength(candidate) > width && current) {
        out.push(current)
        current = word
      } else {
        current = candidate
      }
    }
    if (current) out.push(current)
  }
  return out
}
