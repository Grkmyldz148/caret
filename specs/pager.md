# pager

> Interactive scrollable viewport for long content.

## When to use

Use `pager` when output exceeds the terminal height — long help text,
large tables, generated reports, file previews. If the content fits
the viewport, pager prints directly without entering interactive mode.

## Anatomy

```
H E L P

  Usage: my-cli <command> [options]

  Commands:
    init       Scaffold a new project
    build      Build for production
    deploy     Deploy to cloud
    ...

↑↓/jk scroll  ctrl+u/d page  g/G top/bottom  q quit  42%
```

## API

```ts
await pager({
  content: helpText,
  title: 'Help',
})

await pager({
  content: fs.readFileSync('CHANGELOG.md', 'utf8'),
  title: 'Changelog',
  height: 20,
})
```

### Options

| Key       | Type       | Default           | Description                        |
|-----------|------------|-------------------|------------------------------------|
| `content` | `string`   | —                 | Full text to display               |
| `title`   | `string?`  | —                 | Tracked CAPS heading at top        |
| `height`  | `number?`  | terminal rows − 3 | Visible line count                 |

## Keyboard

| Key       | Action                    |
|-----------|---------------------------|
| ↑ / k     | Scroll up one line        |
| ↓ / j     | Scroll down one line      |
| Ctrl+U    | Scroll up half page       |
| Ctrl+D    | Scroll down half page     |
| g         | Jump to top               |
| G         | Jump to bottom            |
| q / Esc   | Exit pager                |

## Short-circuit

When the content fits the viewport (`lines.length ≤ height`), pager
prints the content directly to stdout and returns immediately — no
interactive mode, no Ink render.

## Progress indicator

A percentage indicator in the footer shows scroll position:
`Math.round(((offset + height) / totalLines) * 100) + '%'`

## Tokens

colors.accent, typography (tracking)
