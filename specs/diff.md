# Diff

> Unified-diff style line rendering with colored prefixes.

`diff` renders an array of lines, each tagged as `added`, `removed`, `unchanged`, or `context`. Added lines are green with `+`, removed are red with `-`, unchanged are dim or default with a leading space.

## Anatomy

```
  host: api.example.com
- port: 80
+ port: 443
  timeout: 30s
```

## Options

```ts
type DiffOptions = {
  lines: ReadonlyArray<{
    kind: 'added' | 'removed' | 'unchanged' | 'context'
    text: string
  }>
  theme?: PartialTheme
}
```

## Do & don't

**Do** — use for config changes, file diffs, before/after states.
**Don't** — use as a replacement for a real diff library; Caret renders, doesn't compute the diff.

## Out of scope

- Diff computation (use a `diff` library to compute, then render)
- Inline highlighting within a line (line-level only)
- Multi-file batching (caller composes)
- Patch headers (`@@ ... @@`) — caller composes if needed
