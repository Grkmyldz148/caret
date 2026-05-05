# Banner

> A heading at the top of your CLI's output.

`banner` is a way to mark the start of a meaningful block of output. Use it sparingly — once at the top of your CLI's main output, or once at the start of a major operation.

---

## Visual language

Per specs/look.md § Borders & surfaces, full boxes (╭╮╯╰) are reserved
exclusively for modals / dialogs. Banner uses the editorial pattern:

- **Anchor** `^` in accent
- **Title** in tracked CAPS bold (the Caret display signature)
- Optional **subtitle** in dim
- **Thin horizontal rule** using the `ruler` glyph

```
^ C A R E T   C L I
  The design system for modern command-line tools
─────────────────────────────────────────
```

---

## Options

```ts
type BannerOptions = {
  title: string
  subtitle?: string
  /** Override rule width. Default: auto-fit content, capped at terminal width. */
  width?: number
  theme?: PartialTheme
}
```

---

## Do & don't

**Do**
- Keep titles short (under 40 chars — tracking doubles visible width)
- Use the subtitle for version, region, or environment

**Don't**
- Don't use a banner more than twice in a single command
- Don't put error messages in a banner — use `error`

---

## Out of scope

- Multi-line titles — title is single line
- Centered text — left-aligned only
- ASCII art logos — bring your own; banner is a primitive
- Animated reveal — banners are static
