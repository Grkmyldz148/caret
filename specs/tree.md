# Tree

> A hierarchical view rendered with box-drawing branches.

`tree` recursively renders nested nodes with `├──`, `└──`, `│  ` characters. Useful for showing project structures, dependency trees, nested config.

## Anatomy

```
project
├── src
│   ├── index.ts
│   └── lib.ts
└── package.json
```

## Options

```ts
type TreeOptions = {
  root: TreeNode | ReadonlyArray<TreeNode>
  theme?: PartialTheme
}

type TreeNode = {
  label: string
  children?: ReadonlyArray<TreeNode>
}
```

Branch characters are theme tokens (`symbols.tree.*`) and respect dumb terminal fallbacks.

## Do & don't

**Do** — use for ≤ ~50 nodes; render once and let scrollback hold it.
**Don't** — use for very large trees (paginate yourself); don't try to make tree interactive (a `tree.live` exists later for that).

## Out of scope

- Collapsible nodes — render-once only
- Per-node icons — labels are plain strings
- Edge labels (annotations between nodes) — use list or table for that
