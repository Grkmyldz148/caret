/**
 * Caret help component
 *
 * CLI usage / help text formatter — the `--help` screen every CLI
 * tool needs. Editorial layout: an em-dashed name + description,
 * tracked CAPS section headers in accent bold, and command /
 * option tables aligned with the same dotted-leader convention
 * used by keyValue.
 *
 *   help({
 *     name: 'caret',
 *     description: 'A terminal design system for humans.',
 *     usage: 'caret <command> [options]',
 *     commands: [
 *       { name: 'init', description: 'Initialize a new project' },
 *       { name: 'add <component>', description: 'Add a component' },
 *     ],
 *     options: [
 *       { flags: '-h, --help', description: 'Show this help message' },
 *     ],
 *     examples: ['caret init my-app'],
 *   })
 *
 * Static — writes to stdout once. Sections are separated by a
 * single blank line, per specs/look.md § Spacing.
 */

import { getTheme } from '../theme/global.js'
import { mergeTheme } from '../theme/merge.js'
import type { PartialTheme } from '../theme/types.js'
import { capability } from '../lib/capability.js'
import { paintAccent, paintBold, paintDim, visibleLength } from '../lib/paint.js'
import { leaderAt, tracking } from '../lib/typography.js'

export type HelpCommand = {
  name: string
  description: string
}

export type HelpOption = {
  flags: string
  description: string
}

export type HelpSection = {
  title: string
  /** Raw strings — printed dim and indented. */
  items: string[]
}

export type HelpOptions = {
  name: string
  description?: string
  usage?: string
  commands?: ReadonlyArray<HelpCommand>
  options?: ReadonlyArray<HelpOption>
  examples?: ReadonlyArray<string>
  /** Custom additional sections appended after the built-ins. */
  sections?: ReadonlyArray<HelpSection>
  footer?: string
  /** Override total row width. Default: min(terminal, 80). */
  width?: number
  theme?: PartialTheme
}

export function help(options: HelpOptions): void {
  const theme = mergeTheme(getTheme(), options.theme)
  const accent = paintAccent(theme)
  const bold = paintBold()
  const dim = paintDim()
  const cap = capability()

  const totalWidth = Math.min(options.width ?? 80, cap.columns)
  const indent = '  '
  const blocks: string[][] = []

  // 1. Name + description — "caret — a terminal design system for humans."
  const nameLine =
    options.description !== undefined
      ? `${accent(bold(options.name))} ${dim('—')} ${options.description}`
      : accent(bold(options.name))
  blocks.push([nameLine])

  // 2. Usage
  if (options.usage !== undefined) {
    blocks.push([sectionHeader('Usage', theme), `${indent}${options.usage}`])
  }

  // 3. Commands
  if (options.commands && options.commands.length > 0) {
    const rows = options.commands.map((c) => ({
      label: c.name,
      description: c.description,
    }))
    blocks.push([
      sectionHeader('Commands', theme),
      ...renderTable(rows, totalWidth, indent, theme),
    ])
  }

  // 4. Options
  if (options.options && options.options.length > 0) {
    const rows = options.options.map((o) => ({
      label: o.flags,
      description: o.description,
    }))
    blocks.push([
      sectionHeader('Options', theme),
      ...renderTable(rows, totalWidth, indent, theme),
    ])
  }

  // 5. Examples — each prefixed with a dim "$"
  if (options.examples && options.examples.length > 0) {
    const lines = [sectionHeader('Examples', theme)]
    for (const ex of options.examples) {
      lines.push(`${indent}${dim('$')} ${ex}`)
    }
    blocks.push(lines)
  }

  // 6. Custom sections
  if (options.sections) {
    for (const section of options.sections) {
      const lines = [sectionHeader(section.title, theme)]
      for (const item of section.items) {
        lines.push(`${indent}${dim(item)}`)
      }
      blocks.push(lines)
    }
  }

  // 7. Footer (SEE ALSO / links) — dim, no header.
  if (options.footer !== undefined) {
    blocks.push([dim(options.footer)])
  }

  // Join blocks with a single blank line between sections.
  const out = blocks.map((b) => b.join('\n')).join('\n\n')
  process.stdout.write(out + '\n')
}

// ─────────────────────────────────────────────────────────────
// helpers
// ─────────────────────────────────────────────────────────────

function sectionHeader(
  title: string,
  theme: ReturnType<typeof mergeTheme>,
): string {
  const accent = paintAccent(theme)
  const bold = paintBold()
  return accent(bold(tracking(title)))
}

type TableRow = { label: string; description: string }

function renderTable(
  rows: ReadonlyArray<TableRow>,
  totalWidth: number,
  indent: string,
  theme: ReturnType<typeof mergeTheme>,
): string[] {
  const accent = paintAccent(theme)
  const dim = paintDim()

  // Column width: longest label + gap (the Caret number is 2).
  let maxLabel = 0
  for (const row of rows) {
    const w = visibleLength(row.label)
    if (w > maxLabel) maxLabel = w
  }
  const labelCol = maxLabel + theme.spacing.gap
  const rowWidth = Math.max(labelCol + 10, totalWidth - indent.length)

  const out: string[] = []
  for (const row of rows) {
    const line = leaderAt(accent(row.label), row.description, labelCol, rowWidth, {
      dot: theme.symbols.leader,
    })
    // Post-process: the leader dots and description are default FG;
    // dim the dots so only the label and description itself read
    // clearly — matches keyValue's editorial tone via dim dots.
    // leaderAt returns a single string; we re-dim the dot run inline.
    out.push(`${indent}${dimLeader(line, theme.symbols.leader, dim)}`)
  }
  return out
}

/**
 * Wrap any run of the leader dot character in the dim attribute.
 * The label and value stay at their original color; only the
 * connecting dots become dim — the editorial "contents page" look.
 */
function dimLeader(
  line: string,
  dot: string,
  dim: (s: string) => string,
): string {
  // Match: one or more (space + dot). Keep the surrounding spaces
  // inside the dim run so the whole leader visually recedes.
  const escaped = dot.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(`(?: ${escaped})+ `, 'g')
  return line.replace(pattern, (match) => dim(match))
}
