# Scrollable

> A scrollable viewport container with scroll indicator.

`scrollable` wraps long content in a fixed-height viewport with keyboard scrolling and a thin scrollbar on the right edge. If the content fits the viewport, it prints directly without entering interactive mode.

## Anatomy

```
Build output

Compiling TypeScript…          ▎
Bundling 14 modules…           ▎
Minifying assets…
Writing dist/index.js

↑↓/jk scroll  ctrl+u/d page  g/G ends  q quit  42L  68%
```

## Usage

```ts
await scrollable({
  content: longBuildOutput,
  height: 15,
  title: 'Build output',
})

// Also accepts string[]
await scrollable({
  content: logLines,
  lineNumbers: true,
})
```

## Options

| Key             | Type                  | Default         | Description                  |
|-----------------|-----------------------|-----------------|------------------------------|
| `content`       | `string \| string[]`  | —               | Content to display           |
| `height`        | `number?`             | `rows − 4`      | Visible height in lines      |
| `title`         | `string?`             | —               | Title above viewport         |
| `lineNumbers`   | `boolean?`            | `false`         | Show line numbers            |
| `showScrollbar` | `boolean?`            | `true`          | Show scroll indicator        |

## Keyboard

| Key       | Action                |
|-----------|-----------------------|
| `↑` / `k` | Scroll up one line   |
| `↓` / `j` | Scroll down one line |
| `Ctrl+U`  | Half page up         |
| `Ctrl+D`  | Half page down       |
| `g`       | Jump to top           |
| `G`       | Jump to bottom        |
| `q`       | Quit                  |
| `esc`     | Quit                  |

## Differences from pager

| Feature        | `pager`                | `scrollable`           |
|----------------|------------------------|------------------------|
| Scroll indicator | No                  | Yes (▎ on right edge)  |
| Line numbers   | No                     | Optional               |
| Title          | Tracked CAPS           | Plain bold             |
| Input format   | String only            | String or string[]     |

## Out of scope

- Horizontal scrolling
- Search within content
- Live/streaming content
