# Split Pane

> Side-by-side scrollable layout with tab focus switching.

`splitPane` renders two panes separated by a gutter (`│`). Each pane scrolls independently. Tab switches focus between panes. Use for comparisons, source/output views, or dual-panel layouts.

## Anatomy

```
Source              │ Output
const x = 1        │ > Building…
const y = 2        │ > Done.
export {x, y}      │ ✓ Complete

tab switch pane · ↑↓/jk scroll · ctrl+u/d page · q quit
```

## Usage

```ts
await splitPane({
  left:  { title: 'Source', content: sourceCode },
  right: { title: 'Output', content: buildOutput },
  ratio: 0.5,
})
```

## Options

| Key      | Type                            | Default     | Description                  |
|----------|---------------------------------|-------------|------------------------------|
| `left`   | `{ title?, content }`           | —           | Left pane                    |
| `right`  | `{ title?, content }`           | —           | Right pane                   |
| `ratio`  | `number?`                       | `0.5`       | Left pane width ratio (0.2–0.8) |
| `height` | `number?`                       | `rows − 4`  | Viewport height              |

### PaneContent

```ts
type PaneContent = {
  title?: string
  content: string | string[]
}
```

## Keyboard

| Key       | Action                |
|-----------|-----------------------|
| `tab`     | Switch focus pane     |
| `↑` / `k` | Scroll active pane up |
| `↓` / `j` | Scroll active pane down |
| `Ctrl+U`  | Half page up         |
| `Ctrl+D`  | Half page down       |
| `q`       | Quit                  |
| `esc`     | Quit                  |

## Out of scope

- Resizable split ratio at runtime
- More than 2 panes
- Horizontal split (top/bottom)
