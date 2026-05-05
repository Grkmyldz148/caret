/**
 * Caret tree component
 *
 * Renders a hierarchical tree of nodes using box-drawing characters.
 * Static — writes to stdout once and returns.
 *
 *   tree({
 *     root: {
 *       label: 'project',
 *       children: [
 *         { label: 'src', children: [
 *           { label: 'index.ts' },
 *           { label: 'lib.ts' },
 *         ] },
 *         { label: 'package.json' },
 *       ],
 *     },
 *   })
 *
 * Output:
 *   project
 *   ├── src
 *   │   ├── index.ts
 *   │   └── lib.ts
 *   └── package.json
 */

import { getTheme } from '../theme/global.js'
import { mergeTheme } from '../theme/merge.js'
import type { PartialTheme } from '../theme/types.js'
import { paintAccent, paintDim } from '../lib/paint.js'

export type TreeNode = {
  label: string
  children?: ReadonlyArray<TreeNode>
}

export type TreeOptions = {
  root: TreeNode | ReadonlyArray<TreeNode>
  theme?: PartialTheme
}

export function tree(options: TreeOptions): void {
  const theme = mergeTheme(getTheme(), options.theme)
  const dim = paintDim()

  const lines: string[] = []
  const roots = Array.isArray(options.root) ? options.root : [options.root as TreeNode]

  for (let i = 0; i < roots.length; i++) {
    const root = roots[i]!
    lines.push(root.label)
    if (root.children) {
      renderChildren(root.children, '', lines, theme, dim)
    }
  }

  process.stdout.write(lines.join('\n') + '\n')
}

function renderChildren(
  children: ReadonlyArray<TreeNode>,
  prefix: string,
  lines: string[],
  theme: ReturnType<typeof getTheme>,
  dim: ReturnType<typeof paintDim>,
): void {
  for (let i = 0; i < children.length; i++) {
    const child = children[i]!
    const isLast = i === children.length - 1
    const branch = isLast ? theme.symbols.tree.lastBranch : theme.symbols.tree.branch
    lines.push(prefix + dim(branch) + ' ' + child.label)
    if (child.children && child.children.length > 0) {
      const nextPrefix = prefix + dim(isLast ? theme.symbols.tree.space : theme.symbols.tree.vertical) + ' '
      renderChildren(child.children, nextPrefix, lines, theme, dim)
    }
  }
}
