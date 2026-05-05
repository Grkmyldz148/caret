# Paragraph

> Wrapped multi-line text with optional indent.

`paragraph` writes long-form text to stdout, wrapping at the terminal width or a configurable max.

## Usage

```ts
paragraph('Lorem ipsum dolor sit amet, consectetur adipiscing elit…')
paragraph(text, { width: 80, indent: 2 })
```

## Options

```ts
type ParagraphOptions = {
  width?: number   // default: min(terminal columns, 80)
  indent?: number  // default: 0
  theme?: PartialTheme
}
```

## Behavior

- Wraps at word boundaries (no mid-word breaks)
- Preserves explicit `\n` in source (multiple paragraphs)
- ANSI-aware width computation (so colored text doesn't overflow)

## Do & don't

**Do** — use for descriptions, long-form explanations, prose in `--help` output
**Don't** — use for table-like or structured data

## Out of scope

- Markdown rendering — paragraphs are plain text
- Justified text — left-aligned only
- Hyphenation
