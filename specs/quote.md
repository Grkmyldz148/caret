# Quote

> Blockquote-style indented text behind a vertical bar gutter.

`quote` writes text to stdout with a `│` gutter on the left, like a markdown blockquote.

## Anatomy

```
│ This is a quoted line.
│ Multi-line quoted text.
│ Each line gets its own gutter.
```

## Usage

```ts
quote('This is a tip.')
quote('Multi-line\nquoted\ntext')
quote('Important note', { color: 'warning' })
```

## Options

```ts
type QuoteOptions = {
  color?: 'dim' | 'accent' | 'success' | 'warning' | 'danger' | 'info'
  theme?: PartialTheme
}
```

## Do & don't

**Do** — use for tips, callouts, emphasis on a passage
**Don't** — use as a generic indent (use `paragraph` with `indent`); don't nest quotes

## Out of scope

- Citation / attribution lines
- Markdown-like rendering
- Bordered box variant (use `banner` for that)
