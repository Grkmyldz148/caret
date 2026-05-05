# List

> A vertical sequence of items, each marked by a single character.

`list` renders a list of strings or labeled items. It is a static, non-interactive component — call it once, it writes to stdout, returns. Use it for short enumerations: features, steps, options the user picked, things that happened.

---

## Anatomy

```
• First item
• Second item
• Third item
```

With descriptions:

```
→ Authentication — Sign in with email or OAuth
→ Database       — PostgreSQL on Neon
→ Email          — Transactional email via Resend
```

---

## Variants

| Variant | Marker |
|---|---|
| `bullet` (default) | `•` |
| `numbered` | `1.` `2.` `3.` |
| `arrow` | `→` |
| `dash` | `-` |

The marker is rendered in `accent` color. The label is in default foreground; descriptions are dim.

---

## Options

```ts
type ListOptions = {
  items: ReadonlyArray<string | { label: string; description?: string }>
  variant?: 'bullet' | 'numbered' | 'arrow' | 'dash'
  theme?: PartialTheme
}
```

---

## Do & don't

**Do**
- Use lists for 2–10 items the user should scan
- Use `description` only when the label alone is ambiguous
- Use `numbered` when order matters (steps, instructions)
- Use `arrow` when items represent transitions or actions

**Don't**
- Don't use a list for tabular data — use `table`
- Don't use a list for status of named phases — use `step`
- Don't customize the marker characters — Caret owns the bullet/arrow vocabulary

---

## Out of scope

- Nested lists — use `tree`
- Inline rich formatting — labels are plain strings
- Click-to-select — `list` is non-interactive; for selection use `prompt.select`
