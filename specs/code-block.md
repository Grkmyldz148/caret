# Code block

> A multi-line code block with a left gutter, optional language label, and line numbers.

`codeBlock` renders code with a bordered gutter. v0 has no syntax highlighting — code is displayed as plain monospace text. Future versions may integrate a highlighter (shiki, prism).

## Anatomy

```
┌─ ts ─────────────────────────
│ 1  function hello() {
│ 2    return 'world'
│ 3  }
└──────────────────────────────
```

## Usage

```ts
codeBlock(`function hello() {
  return 'world'
}`, { language: 'ts' })

codeBlock('rm -rf /', { language: 'bash', showLineNumbers: false })
```

## Options

```ts
type CodeBlockOptions = {
  language?: string         // shown in the top border
  showLineNumbers?: boolean // default: true
  width?: number            // default: longest line + padding
  theme?: PartialTheme
}
```

## Do & don't

**Do** — use for code samples in `--help` output, error explanations, examples
**Don't** — use for short single-line snippets (use inline `code()`); don't use for long files (paginate)

## Out of scope (v0)

- Syntax highlighting — coming in a later version with shiki/prism
- Diff inside code block — use `diff` separately
- Line range highlighting
- Copy-to-clipboard
- Collapsible long blocks
