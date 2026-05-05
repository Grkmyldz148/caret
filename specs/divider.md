# Divider

> A horizontal rule, optionally with a label.

`divider` writes a single line of horizontal rule characters to stdout, optionally with a label embedded inline.

## Usage

```ts
divider()
divider({ label: 'Section' })
divider({ label: 'Section', align: 'left' })
```

## Output

```
─────────────────────────────────────
─────────── Section ─────────────────
── Section ──────────────────────────
```

## Options

```ts
type DividerOptions = {
  label?: string
  align?: 'left' | 'center' | 'right'  // default: center
  width?: number                        // default: terminal columns
  theme?: PartialTheme
}
```

## Do & don't

**Do** — use to separate sections in long-form CLI output
**Don't** — use multiple dividers in a row (collapse them); don't use for "fancy borders" — use `banner` for that

## Out of scope

- Multi-line dividers
- Custom characters (theme controls the rule character)
- Color customization (always dim)
