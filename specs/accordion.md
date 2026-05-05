# Accordion

> Interactive collapsible sections for grouped content.

`accordion` renders a vertical list of titled sections that expand/collapse on toggle. Navigate with ↑/↓, toggle with Space or Enter, quit with q or Esc.

## Anatomy

```
▸ General
  │ Name: my-app
  │ Version: 1.0.0

· Advanced
· About

↑↓ navigate · space/↵ toggle · q/esc quit
```

## Usage

```ts
await accordion({
  sections: [
    { title: 'General',  content: 'Name: my-app\nVersion: 1.0.0' },
    { title: 'Advanced', content: 'Debug: false\nVerbose: true' },
    { title: 'About',    content: 'Caret design system v0.1' },
  ],
})
```

## Options

| Key               | Type                              | Default | Description                     |
|-------------------|-----------------------------------|---------|---------------------------------|
| `sections`        | `{ title, content }[]`            | —       | Section list                    |
| `defaultExpanded` | `number[]?`                       | `[0]`   | Initially expanded indices      |
| `multiple`        | `boolean?`                        | `true`  | Allow multiple open sections    |

## Keyboard

| Key       | Action                |
|-----------|-----------------------|
| `↑` / `k` | Previous section     |
| `↓` / `j` | Next section         |
| `space`   | Toggle section        |
| `↵`       | Toggle section        |
| `q`       | Quit                  |
| `esc`     | Quit                  |

## Do & don't

**Do** — use for long content split into logical groups (config, help sections)
**Don't** — use for single collapsible block (just use conditional rendering)

## Out of scope

- Animated expand/collapse transitions
- Nested accordions
- Drag-to-reorder sections
